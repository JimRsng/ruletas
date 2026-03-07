<script setup lang="ts">
import { Wheel } from "spin-wheel";

interface Props {
  entries: string[];
  spinDuration: number;
  isSpinning: boolean;
  palette: string[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "winner": [value: string];
  "update:isSpinning": [value: boolean];
}>();

const wheelContainerRef = ref<HTMLDivElement | null>(null);
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
  label,
  backgroundColor: props.palette[index % props.palette.length] || "#f04e23",
  labelColor: "#17110d"
})));

const init = () => {
  const container = wheelContainerRef.value;
  if (!container) return;

  wheel = new Wheel(container, {
    debug: import.meta.dev,
    items: items.value,
    borderWidth: 5,
    borderColor: "#1f160f",
    itemLabelRadius: 0.5,
    itemLabelRotation: 0,
    itemLabelAlign: "center",
    itemLabelBaselineOffset: -0.07,
    itemLabelFont: "Space Grotesk",
    itemLabelFontSizeMax: 32,
    itemBackgroundColors: items.value.map(item => item.backgroundColor),
    itemLabelColors: items.value.map(item => item.labelColor),
    lineColor: "#1f160f",
    rotationSpeedMax: 1,
    rotationResistance: -200,
    isInteractive: false
  });

  wheel.onRest = () => {
    emit("update:isSpinning", false);
    const winnerIndex = wheel?.getCurrentIndex();
    if (winnerIndex !== undefined && winnerIndex !== null) {
      emit("winner", props.entries[winnerIndex] || "");
    }
  };

  startIdleSpin();
};

const spin = () => {
  if (!props.isSpinning && props.entries.length >= 2 && wheel) {
    stopIdleSpin();
    emit("update:isSpinning", true);

    const winnerIndex = Math.floor(Math.random() * props.entries.length);

    wheel.spinToItem(winnerIndex, props.spinDuration, false, 5, 2);
  }
};

const reset = () => {
  if (!props.isSpinning && wheel) {
    wheel.rotation = 0;
  }
};

defineExpose({ reset });

onUnmounted(() => {
  stopIdleSpin();
});

onMounted(() => {
  nextTick(() => {
    init();
  });
});

watch(items, () => {
  if (!props.isSpinning && wheelContainerRef.value) {
    if (wheel) {
      wheel.remove();
    }
    wheel = null;
    init();
  }
}, { deep: true });
</script>

<template>
  <section class="relative grid place-items-center p-4 min-h-140 overflow-hidden max-[920px]:min-h-110 bg-elevated rounded-xl">
    <button
      type="button"
      class="absolute inset-1/2 -translate-1/2 z-2 size-18 flex items-center justify-center cursor-pointer scale-on-hover before:bg-default before:size-18 before:-rotate-45 before:absolute before:rounded-[50%_0_50%_50%]"
      :disabled="isSpinning || entries.length < 2"
      aria-label="Girar la ruleta"
      @click="spin"
    >
      <span class="relative z-3 font-bold text-sm tracking-widest uppercase">GIRAR</span>
    </button>
    <div ref="wheelContainerRef" class="wheel-canvas w-[min(72vw,560px)] h-[min(72vw,560px)] max-w-140 max-h-140 block relative" />
  </section>
</template>
