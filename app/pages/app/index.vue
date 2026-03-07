<script setup lang="ts">
import { computed, ref } from "vue";

const defaultEntries = ref([
  "Pizza Night",
  "Sushi Run",
  "Burger Break",
  "Taco Time",
  "Pasta Party",
  "Salad Stop"
]);

const entriesText = ref(defaultEntries.value.join("\n"));
const isSpinning = ref(false);
const isWinnerModalOpen = ref(false);

const wheelRef = useTemplateRef("wheelRef");

const wheelPalette = [
  "#f04e23",
  "#ffbd2f",
  "#4cc9f0",
  "#2a9d8f",
  "#8338ec",
  "#ef476f",
  "#06d6a0",
  "#fb5607"
];

const winner = ref<string | null>(null);

const entries = computed(() => {
  const parsed = entriesText.value
    .split("\n")
    .map((item) => {
      const itemNumber = Number(item.trim());
      return isNaN(itemNumber) ? item.trim() : itemNumber;
    })
    .filter(Boolean) as typeof defaultEntries.value;

  return parsed.length > 0 ? parsed : defaultEntries.value;
});

const clearEntries = () => {
  if (isSpinning.value) return;
  defaultEntries.value = [];
  entriesText.value = "";
  winner.value = null;
};

const resetWheel = () => {
  if (isSpinning.value) return;
  winner.value = null;
  wheelRef.value?.reset();
};
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
          v-model="winner"
          v-model:spinning="isSpinning"
          :entries="entries"
          :is-spinning="isSpinning"
          :palette="wheelPalette"
          :idle-spin="true"
          @select="isWinnerModalOpen = true"
        />

        <UModal v-model:open="isWinnerModalOpen">
          <template #content>
            <div class="text-center p-4">
              <p class="m-0 text-xs uppercase tracking-widest">Ganador</p>
              <strong class="text-5xl">{{ winner }}</strong>
            </div>
          </template>
        </UModal>
      </div>
    </section>
  </main>
</template>
