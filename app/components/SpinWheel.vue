<script setup lang="ts" generic="T">
import { Wheel } from "spin-wheel";
import { Howl } from "howler";

const props = withDefaults(defineProps<{
  entries: T[];
  spinDuration?: number;
  palette?: string[];
  idleSpin?: boolean;
  spinGuard?: () => boolean;
}>(), {
  spinDuration: 8000,
  palette: () => ["#fff"],
  idleSpin: true,
  spinGuard: () => true
});

const select = defineModel<T>({ required: false });
const isSpinning = defineModel<boolean>("spinning", { required: false });

const emit = defineEmits<{
  select: [value: NonNullable<T>];
}>();

const wheelContainerRef = useTemplateRef("wheelContainerRef");
const sectionRef = useTemplateRef("sectionRef");

const wheelSize = ref<number | undefined>(undefined);

let resizeObserver: ResizeObserver | null = null;
const resizeTimeout: ReturnType<typeof setTimeout> | null = null;

const sounds = {
  tick: new Howl({ src: ["/sounds/tick.ogg"] }),
  winner: new Howl({ src: ["/sounds/winner.ogg"] })
};

let wheel: Wheel | null = null;
let idleAnimFrame: number | null = null;
let lastTs: number | null = null;
const IDLE_DEG_PER_SEC = 5;

const startIdleSpin = () => {
  lastTs = null;
  const step = (ts: number) => {
    if (lastTs !== null && wheel) {
      wheel.rotation = (wheel.rotation + IDLE_DEG_PER_SEC * (ts - lastTs) / 1000) % 360;
    }
    lastTs = ts;
    idleAnimFrame = requestAnimationFrame(step);
  };
  idleAnimFrame = requestAnimationFrame(step);
};

const stopIdleSpin = () => {
  if (idleAnimFrame !== null) {
    cancelAnimationFrame(idleAnimFrame);
    idleAnimFrame = null;
  }
};

const items = computed(() => props.entries.map((label, index) => ({
  label: String(label),
  backgroundColor: props.palette[index % props.palette.length]!,
  labelColor: "#17110d"
})));

function easeOutCubic (t: number) {
  const t1 = t - 1;
  return t1 * t1 * t1 + 1;
}

const init = () => {
  const container = wheelContainerRef.value;
  if (!container) return;

  wheel = new Wheel(container, {
    debug: import.meta.dev,
    items: items.value,
    borderWidth: 5,
    borderColor: "#1f160f",
    radius: 1,
    itemLabelRadius: 0.57,
    itemLabelRotation: 0,
    itemLabelAlign: "center",
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: "Space Grotesk",
    itemLabelFontSizeMax: 24,
    itemBackgroundColors: items.value.map(item => item.backgroundColor),
    itemLabelColors: items.value.map(item => item.labelColor),
    lineColor: "#1f160f",
    rotationSpeedMax: 1,
    rotationResistance: -200,
    isInteractive: false
  });

  wheel.onRest = () => {
    isSpinning.value = false;
    const winnerIndex = wheel?.getCurrentIndex();
    if (winnerIndex !== undefined && winnerIndex !== null) {
      sounds.winner.play();
      const winner = props.entries[winnerIndex]!;
      emit("select", winner);
      select.value = winner;
    }
  };

  wheel.onCurrentIndexChange = () => {
    if (idleAnimFrame || !isSpinning.value) return;
    sounds.tick.play();
  };

  stopIdleSpin();
  if (props.idleSpin) startIdleSpin();
};

const spin = () => {
  if (!isSpinning.value && props.entries.length >= 2 && wheel && props.spinGuard()) {
    stopIdleSpin();
    isSpinning.value = true;

    const winnerIndex = getRandomValue(0, props.entries.length);

    wheel.spinToItem(winnerIndex, props.spinDuration, false, 1, 3, easeOutCubic);
  }
};

const reset = () => {
  if (!isSpinning.value && wheel) {
    wheel.rotation = 0;
    if (props.idleSpin) startIdleSpin();
  }
};

defineExpose({ reset });

onUnmounted(() => {
  if (props.idleSpin) stopIdleSpin();
  resizeObserver?.disconnect();
  if (resizeTimeout !== null) clearTimeout(resizeTimeout);
});

onMounted(() => {
  nextTick(() => {
    if (sectionRef.value) {
      const { offsetWidth, offsetHeight } = sectionRef.value;
      wheelSize.value = Math.min(offsetWidth, offsetHeight);
    }

    init();

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = Math.floor(Math.min(entry.contentRect.width, entry.contentRect.height));
        if (size === wheelSize.value) continue;
        wheelSize.value = size;
      }
    });

    if (sectionRef.value) resizeObserver.observe(sectionRef.value);
  });
});

watch(() => props.entries, () => {
  if (!wheel) return;
  wheel.items = items.value;
});

watch(() => [
  props.spinDuration,
  props.palette,
  props.idleSpin
], () => {
  if (!isSpinning.value && wheelContainerRef.value) {
    if (wheel) {
      wheel.remove();
    }
    wheel = null;
    init();
  }
}, { deep: true });
</script>

<template>
  <section ref="sectionRef" class="relative flex items-center justify-center size-full">
    <button
      v-if="wheelContainerRef"
      type="button"
      class="absolute inset-1/2 -translate-1/2 z-2 size-18 flex items-center justify-center cursor-pointer before:bg-default before:size-18 before:-rotate-45 before:absolute before:rounded-[50%_0_50%_50%] before:transition before:duration-160"
      :class="{ 'scale-on-hover hover:before:drop-shadow-md/50': !isSpinning }"
      :disabled="isSpinning || entries.length < 2"
      aria-label="Girar la ruleta"
      @click="spin"
    >
      <span class="z-3 font-bold text-sm tracking-widest uppercase">GIRAR</span>
    </button>
    <div
      ref="wheelContainerRef"
      class="wheel-canvas rounded-full bg-accented shadow relative"
      :class="{ 'animate-pulse': !wheelContainerRef }"
      :style="wheelSize ? { width: `${wheelSize}px`, height: `${wheelSize}px` } : undefined"
    />
  </section>
</template>
