export const useRewardsStore = defineStore("rewards", () => {
  const toast = useToast();

  const rewards = ref<RuletasReward[]>([]);
  const selected = ref<RuletasReward | null>(null);

  const setup = (data: RuletasReward[]) => {
    rewards.value = data;
  };

  const create = async (data: Omit<RuletasReward, "id" | "input">) => {
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
    if (!confirm("¿Estás seguro de que quieres eliminar esta recompensa?")) return;
    return $fetch(`/api/rewards/${id}`, {
      method: "DELETE"
    }).then(() => {
      rewards.value = rewards.value.filter(r => r.id !== id);
      toast.add({ description: "La recompensa ha sido eliminada", color: "success" });
    });
  };

  const select = (id: string) => {
    selected.value = rewards.value.find(r => r.id === id) || null;
  };

  const clearSelected = () => {
    selected.value = null;
  };

  const clear = () => {
    rewards.value = [];
    selected.value = null;
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
