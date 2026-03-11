export const useWheelStore = defineStore("wheel", () => {
  const isSpinning = ref(false);
  const selected = ref<string | null>(null);

  const { deduplicated } = storeToRefs(useRedemptionsStore());

  const winner = computed(() => {
    if (!selected.value) return null;
    return deduplicated.value.find(e => e.user.name === selected.value) || null;
  });

  const settings = ref({
    disallowDuplicates: true,
    subscribersOnly: false,
    weighted: false,
    subscriberTiers: ["Tier 1", "Tier 2", "Tier 3"],
    palette: [
      "#f04e23",
      "#ffbd2f",
      "#4cc9f0",
      "#2a9d8f",
      "#8338ec",
      "#ef476f",
      "#06d6a0",
      "#fb5607"
    ]
  });

  return {
    settings,
    isSpinning,
    selected,
    winner
  };
});
