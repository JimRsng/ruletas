import { StorageSerializers, useStorage } from "@vueuse/core";
import { Howl } from "howler";

export const useWheelStore = defineStore("wheel", () => {
  const { deduplicated } = storeToRefs(useRedemptionsStore());

  // States
  const isSpinning = ref(false);
  const selected = ref<string | null>(null);
  const volume = ref(50);

  const winner = computed(() => {
    if (!selected.value) return null;
    return deduplicated.value.find(e => e.user.name === selected.value) || null;
  });

  // Settings
  const defaultSettings = {
    disallowDuplicates: true,
    subscribersOnly: false,
    weighted: false,
    subscriberTiers: [1, 2, 3].map(String),
    palette: wheelPalette
  };

  const settings = ref(defaultSettings);

  // Settings storage
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

  // Sounds
  const soundConfigs = {
    tick: () => new Howl({ src: ["/sounds/tick.ogg"] }),
    winner: () => new Howl({ src: ["/sounds/winner.ogg"] })
  };

  const soundsMap = {} as Record<keyof typeof soundConfigs, Howl>;

  const sounds = {
    play: (type: keyof typeof soundConfigs) => {
      soundsMap[type] ??= soundConfigs[type]();
      soundsMap[type].play();
    },
    volume: (value: number) => {
      Howler.volume(value / 100);
      storedVolume.value = value;
    }
  };

  const storedVolume = useStorage<number | null>("wheel:volume", null, undefined, { serializer: StorageSerializers.number });

  watch(volume, (value) => {
    sounds.volume(value);
  });

  onMounted(() => {
    if (storedVolume.value === null) return;
    volume.value = storedVolume.value;
  });

  return {
    settings,
    isSpinning,
    selected,
    winner,
    storage,
    sounds,
    volume
  };
});
