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

const isSpinning = defineModel<boolean>("spinning", { required: false });
const select = defineModel<T>({ required: false });

const emit = defineEmits<{
  select: [value: T];
}>();

const wheelContainerRef = useTemplateRef("wheelContainerRef");

const sound = new Howl({ src: ["/sounds/tick.ogg"] });

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
      const winner = props.entries[winnerIndex]!;
      emit("select", winner);
      select.value = winner;
    }
  };

  wheel.onCurrentIndexChange = () => {
    if (idleAnimFrame && !isSpinning.value) return;
    sound.play();
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
});

onMounted(() => {
  nextTick(() => {
    init();
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
  <section
    class="relative grid place-items-center"
    :class="{ 'animate-pulse': !wheelContainerRef }"
  >
    <button
      v-if="wheelContainerRef"
      type="button"
      class="absolute inset-1/2 -translate-1/2 z-2 size-18 flex items-center justify-center cursor-pointer scale-on-hover before:bg-default before:size-18 before:-rotate-45 before:absolute before:rounded-[50%_0_50%_50%] before:drop-shadow"
      :disabled="isSpinning || entries.length < 2"
      aria-label="Girar la ruleta"
      @click="spin"
    >
      <span class="relative z-3 font-bold text-sm tracking-widest uppercase">GIRAR</span>
    </button>
    <div
      ref="wheelContainerRef"
      class="wheel-canvas size-80 sm:size-120 md:size-120 lg:size-140 max-w-140 max-h-140 rounded-full bg-accented shadow"
    />
  </section>
</template>
