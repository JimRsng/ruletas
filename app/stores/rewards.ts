import { useStorage } from "@vueuse/core";

export const useRewardsStore = defineStore("rewards", () => {
  const toast = useToast();

  const rewards = ref<RuletasReward[]>([]);
  const selected = ref<RuletasReward | null>(null);

  const storedId = useStorage<string | null>("reward", null);

  const setup = (data: RuletasReward[]) => {
    rewards.value = data;

    onMounted(() => {
      selected.value = rewards.value.find(r => r.id === storedId.value) || null;
    });
  };

  const create = async (data: Omit<RuletasReward, "id" | "active" | "paused">) => {
    return $fetch("/api/rewards", {
      method: "POST",
      body: data
    }).then((newReward) => {
      rewards.value.push(newReward);
      toast.add({ description: "La recompensa ha sido creada", color: "success" });
    });
  };

  const edit = async (id: string, data: Partial<Omit<RuletasReward, "id">>) => {
    return $fetch(`/api/rewards/${id}`, {
      method: "PATCH",
      body: data
    }).then((updatedReward) => {
      const reward = rewards.value.find(r => r.id === updatedReward.id);
      if (reward) {
        Object.assign(reward, updatedReward);
      }
      toast.add({ description: "La recompensa ha sido actualizada", color: "success" });
    });
  };

  const remove = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta recompensa?")) {
      throw new Error("Acción cancelada");
    }

    return $fetch(`/api/rewards/${id}`, {
      method: "DELETE"
    }).then(() => {
      rewards.value = rewards.value.filter(r => r.id !== id);
      toast.add({ description: "La recompensa ha sido eliminada", color: "success" });
    });
  };

  const select = (id: string) => {
    selected.value = rewards.value.find(r => r.id === id) || null;
    if (!selected.value) return;
    storedId.value = selected.value.id;
  };

  const clearSelected = () => {
    selected.value = null;
    storedId.value = null;
  };

  const clear = () => {
    rewards.value = [];
    clearSelected();
  };

  return {
    rewards,
    selected,
    setup,
    create,
    edit,
    remove,
    select,
    clearSelected,
    clear
  };
});
