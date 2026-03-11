import { StorageSerializers, useStorage } from "@vueuse/core";

export const useWheelStore = defineStore("wheel", () => {
  const isSpinning = ref(false);
  const selected = ref<string | null>(null);

  const { deduplicated } = storeToRefs(useRedemptionsStore());

  const winner = computed(() => {
    if (!selected.value) return null;
    return deduplicated.value.find(e => e.user.name === selected.value) || null;
  });

  const defaultSettings = {
    disallowDuplicates: true,
    subscribersOnly: false,
    weighted: false,
    subscriberTiers: [1, 2, 3].map(String),
    palette: wheelPalette
  };

  const settings = ref(defaultSettings);

  type WheelStorage = Record<string, Omit<typeof settings.value, "palette"> | null>;
  const storedSettings = useStorage<WheelStorage>("wheel:settings", null, undefined, { serializer: StorageSerializers.object });

  const storage = {
    save: (id: string) => {
      const plainSettings = toRaw(unref(settings));
      const { palette, ...settingsWithoutPalette } = plainSettings;
      storedSettings.value ||= {};
      storedSettings.value[id] = settingsWithoutPalette;
    },
    restore: (id: string) => {
      const settingsToRestore = storedSettings.value?.[id];
      settings.value = { ...settings.value, ...settingsToRestore };
    },
    remove: (id: string) => {
      if (!storedSettings.value?.[id]) return;
      const { [id]: _, ...rest } = storedSettings.value;
      storedSettings.value = Object.keys(rest).length > 0 ? rest : null;
    }
  };

  return {
    settings,
    isSpinning,
    selected,
    winner,
    storage
  };
});
