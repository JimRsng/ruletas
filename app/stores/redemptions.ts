export const useRedemptionsStore = defineStore("redemptions", () => {
  const redemptions = ref<RuletasRedemption[]>([]);
  const interval = ref<number | null>(null);

  const deduplicated = computed(() => {
    const map = new Map<string, RuletasRedemption>();
    for (const entry of redemptions.value) {
      const existing = map.get(entry.user.name);
      if (existing) {
        existing.input += `, ${entry.input}`;
      }
      else {
        map.set(entry.user.name, { ...entry });
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

  return {
    redemptions,
    deduplicated,
    fetch,
    createInterval,
    clearInterval
  };
});
