export const useRedemptionsStore = defineStore("redemptions", () => {
  const toast = useToast();

  const redemptions = ref<RuletasRedemption[]>([]);

  const timeout = ref<number | null>(null);
  const abortController = ref<AbortController | null>(null);
  const pollInterval = import.meta.dev ? 10000 : 2000;
  const fetchTimeout = 5000;

  const deduplicated = computed<RuletasRedemptionWithDuplicates[]>(() => {
    const map = new Map<string, RuletasRedemptionWithDuplicates>();
    for (const entry of redemptions.value) {
      const existing = map.get(entry.user.name);
      if (existing) {
        existing.inputs.push(entry.input);
      }
      else {
        map.set(entry.user.name, { ...entry, inputs: [entry.input] });
      }
    }
    return Array.from(map.values());
  });

  const fetch = async (rewardId: string, signal?: AbortSignal) => {
    const combined = signal ? AbortSignal.any([signal, AbortSignal.timeout(fetchTimeout)]) : AbortSignal.timeout(fetchTimeout);
    return $fetch(`/api/rewards/${rewardId}/redemptions`, { signal: combined }).then((data) => {
      redemptions.value = data;
    });
  };

  const createInterval = async (rewardId: string) => {
    console.info("Listening to redemptions...");
    const loop = async () => {
      abortController.value = new AbortController();
      await fetch(rewardId, abortController.value.signal).catch(() => {});
      if (abortController.value) {
        timeout.value = window.setTimeout(loop, pollInterval);
      }
    };
    await loop();
  };

  const clearInterval = () => {
    if (timeout.value) {
      console.info("Stopping listening to redemptions...");
      window.clearTimeout(timeout.value);
      timeout.value = null;
      abortController.value?.abort("Interval cleared");
      abortController.value = null;
    }
  };

  const complete = async (rewardId: string, redemptionId: string) => {
    return $fetch(`/api/rewards/${rewardId}/redemptions/${redemptionId}`, {
      method: "PATCH"
    }).then(() => {
      redemptions.value = redemptions.value.filter(r => r.id !== redemptionId);
      toast.add({ description: "El canje ha sido marcado como completado", color: "success" });
    });
  };

  const completeAll = async (rewardId: string, userId?: string) => {
    if (!redemptions.value.length || !confirm("¿Estás seguro de que quieres marcar todos los canjes pendientes como completados?")) {
      throw new Error("Acción cancelada");
    }

    return $fetch(`/api/rewards/${rewardId}/redemptions`, {
      method: "PATCH",
      query: userId ? { userId } : undefined
    }).then(() => {
      redemptions.value = userId ? redemptions.value.filter(r => r.user.id !== userId) : [];
      toast.add({ description: "Todos los canjes pendientes han sido marcados como completados", color: "success" });
    });
  };

  const reject = async (rewardId: string, redemptionId: string) => {
    if (!confirm("¿Estás seguro de que quieres reembolsar este canje?")) {
      throw new Error("Acción cancelada");
    }

    return $fetch(`/api/rewards/${rewardId}/redemptions/${redemptionId}`, {
      method: "DELETE"
    }).then(() => {
      redemptions.value = redemptions.value.filter(r => r.id !== redemptionId);
      toast.add({ description: "El canje ha sido reembolsado", color: "success" });
    });
  };

  const rejectAll = async (rewardId: string, userId?: string) => {
    if (!redemptions.value.length || !confirm("¿Estás seguro de que quieres reembolsar todos los canjes pendientes?")) {
      throw new Error("Acción cancelada");
    }

    return $fetch(`/api/rewards/${rewardId}/redemptions`, {
      method: "DELETE",
      query: userId ? { userId } : undefined
    }).then(() => {
      redemptions.value = userId ? redemptions.value.filter(r => r.user.id !== userId) : [];
      toast.add({ description: "Todos los canjes pendientes han sido reembolsados", color: "success" });
    });
  };

  const clear = () => {
    clearInterval();
    redemptions.value = [];
  };

  return {
    redemptions,
    deduplicated,
    fetch,
    createInterval,
    clearInterval,
    complete,
    completeAll,
    reject,
    rejectAll,
    clear
  };
});
