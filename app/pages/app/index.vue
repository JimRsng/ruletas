<script setup lang="ts">
import { computed, ref } from "vue";

const defaultEntries = [
  "Pizza Night",
  "Sushi Run",
  "Burger Break",
  "Taco Time",
  "Pasta Party",
  "Salad Stop"
];

const entriesText = ref(defaultEntries.join("\n"));
const spinDurationMs = ref(5000);
const isSpinning = ref(false);
const winner = ref("");
const wheelRef = ref();
const isWinnerModalOpen = ref(false);

const palette = [
  "#f04e23",
  "#ffbd2f",
  "#4cc9f0",
  "#2a9d8f",
  "#8338ec",
  "#ef476f",
  "#06d6a0",
  "#fb5607"
];

const entries = computed(() => {
  const parsed = entriesText.value
    .split("\n")
    .map(item => item.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed.slice(0, 30) : defaultEntries;
});

function clearEntries () {
  if (isSpinning.value) {
    return;
  }
  entriesText.value = "";
  winner.value = "";
}

function resetWheel () {
  if (isSpinning.value) {
    return;
  }
  winner.value = "";
  wheelRef.value?.reset();
}

function handleWinner (value: string) {
  winner.value = value;
  isWinnerModalOpen.value = true;
}
</script>

<template>
  <main class="min-h-screen py-8 px-4">
    <section class="max-w-280 mx-auto">
      <div class="mb-5">
        <p class="text-xs uppercase tracking-widest">JimTracker</p>
        <h1 class="text-5xl leading-none">Ruletas</h1>
        <p>Gira la rueda para elegir a un ganador al azar</p>
      </div>

      <div class="grid gap-4 grid-cols-[minmax(280px,360px)_1fr] max-[920px]:grid-cols-1">
        <aside class="p-4 bg-elevated rounded-xl space-y-2">
          <label for="entries" class="inline-block text-sm font-semibold">Participantes</label>
          <textarea
            id="entries"
            v-model="entriesText"
            :disabled="isSpinning"
            rows="12"
            spellcheck="false"
            class="w-full border-2 rounded-xl px-3 py-2 resize-y focus:outline-none"
          />

          <div class="flex justify-between text-sm">
            <span><strong>{{ entries.length }}</strong> participantes</span>
          </div>

          <div class="flex gap-2">
            <UButton
              type="button"
              label="Limpiar"
              :disabled="isSpinning"
              class="rounded-full border-3 animate-on-hover"
              color="neutral"
              block
              @click="clearEntries"
            />
            <UButton
              type="button"
              label="Resetear"
              :disabled="isSpinning"
              class="rounded-full border-3 animate-on-hover"
              color="neutral"
              block
              @click="resetWheel"
            />
          </div>
        </aside>

        <WheelSpinner
          ref="wheelRef"
          :entries="entries"
          :spin-duration="spinDurationMs"
          :is-spinning="isSpinning"
          :palette="palette"
          @winner="handleWinner"
          @update:is-spinning="(value) => isSpinning = value"
        />

        <UModal v-model:open="isWinnerModalOpen">
          <template #content>
            <div :class="{ reveal: !!winner && !isSpinning }" class="text-center p-4">
              <p class="m-0 text-xs uppercase tracking-widest">Ganador</p>
              <strong class="text-5xl">{{ winner }}</strong>
            </div>
          </template>
        </UModal>
      </div>
    </section>
  </main>
</template>
