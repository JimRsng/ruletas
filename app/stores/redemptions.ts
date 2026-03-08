export const useRedemptionsStore = defineStore("redemptions", () => {
  const toast = useToast();

  const redemptions = ref<RuletasRedemption[]>([]);
  const interval = ref<number | null>(null);

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

  const fetch = async (rewardId: string) => {
    $fetch(`/api/rewards/${rewardId}/redemptions`).then((data) => {
      redemptions.value = data;
    });
  };

  const createInterval = async (rewardId: string) => {
    console.info("Listening to redemptions...");
    await fetch(rewardId);
    interval.value = window.setInterval(async () => await fetch(rewardId), import.meta.dev ? 10000 : 2000);
  };

  const clearInterval = () => {
    if (interval.value) {
      console.info("Stopping listening to redemptions...");
      window.clearInterval(interval.value);
      interval.value = null;
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

  const completeAndRejectDuplicates = async (rewardId: string, redemptionId: string) => {
    const redemption = redemptions.value.find(r => r.id === redemptionId);
    if (!redemption) return;

    $fetch(`/api/rewards/${rewardId}/redemptions/${redemptionId}`, {
      method: "PATCH"
    }).then(() => {
      const duplicates = redemptions.value.filter(r => r.user.name === redemption.user.name && r.id !== redemptionId).map(r => r.id);
      if (duplicates.length > 0) {
        $fetch(`/api/rewards/${rewardId}/redemptions`, {
          method: "DELETE",
          query: { id: duplicates }
        }).then(() => {
          redemptions.value = redemptions.value.filter(r => !duplicates.includes(r.id) && r.id !== redemptionId);
          toast.add({ description: `El canje ha sido marcado como completado y se han reembolsado ${duplicates.length} canjes duplicados`, color: "success" });
        });
      }
      else {
        redemptions.value = redemptions.value.filter(r => r.id !== redemptionId);
        toast.add({ description: "El canje ha sido marcado como completado", color: "success" });
      }
    });
  };

  const reject = async (rewardId: string, redemptionId: string) => {
    if (!confirm("¿Estás seguro de que quieres reembolsar este canje?")) return;
    return $fetch(`/api/rewards/${rewardId}/redemptions/${redemptionId}`, {
      method: "DELETE"
    }).then(() => {
      redemptions.value = redemptions.value.filter(r => r.id !== redemptionId);
      toast.add({ description: "El canje ha sido reembolsado", color: "success" });
    });
  };

  const rejectAll = async (rewardId: string) => {
    if (!redemptions.value.length
      || !confirm("¿Estás seguro de que quieres reembolsar todos los canjes pendientes?")
    ) return;
    return $fetch(`/api/rewards/${rewardId}/redemptions`, {
      method: "DELETE"
    }).then(() => {
      redemptions.value = [];
      toast.add({ description: "Todos los canjes pendientes han sido reembolsados", color: "success" });
    });
  };

  return {
    redemptions,
    deduplicated,
    fetch,
    createInterval,
    clearInterval,
    complete,
    completeAndRejectDuplicates,
    reject,
    rejectAll
  };
});
