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
    subscriberTiers: [1, 2, 3].map(String),
    palette: wheelPalette
  });

  return {
    settings,
    isSpinning,
    selected,
    winner
  };
});
