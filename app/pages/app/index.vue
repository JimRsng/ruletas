<script setup lang="ts">
const { user } = useUserSession();

const redemptionsStore = useRedemptionsStore();
const { redemptions, deduplicated } = storeToRefs(redemptionsStore);

const names = computed(() => deduplicated.value.map(e => e.user.name));

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
const winnerInfo = computed(() => {
  if (!winner.value) return null;
  return deduplicated.value.find(e => e.user.name === winner.value) || null;
});
</script>

<template>
  <main class="min-h-screen py-8 px-4">
    <section class="max-w-280 mx-auto space-y-2">
      <div class="mb-5">
        <p class="text-xs uppercase tracking-widest">JimTracker</p>
        <h1 class="text-5xl leading-none">Ruletas</h1>
        <p>Gira la rueda para elegir a un ganador al azar</p>
      </div>

      <RewardsList />

      <div class="grid gap-4 grid-cols-[minmax(280px,360px)_1fr] max-[920px]:grid-cols-1">
        <aside class="p-4 bg-elevated rounded-xl space-y-2">
          <div class="flex items-center gap-2 text-sm font-semibold">
            <UIcon name="simple-icons:twitch" size="1.3rem" />
            <span>Participantes (<span class="text-primary">{{ deduplicated.length }}</span>)</span>
          </div>

          <ul class="bg-default h-100 overflow-y-auto rounded-md border-2 border-accented">
            <li
              v-for="(redemption, i) of redemptions"
              :key="redemption.id"
              class="px-3 py-2"
              :class="{ 'bg-elevated': i % 2 !== 0 }"
            >
              <UUser :description="redemption.input">
                <template #name>
                  <NuxtLink :to="`https://www.twitch.tv/popout/${user?.login}/viewercard/${redemption.user.login}`" target="_blank" class="hover:underline">
                    {{ redemption.user.name }}
                  </NuxtLink>
                </template>
              </UUser>
            </li>
          </ul>
          <div class="flex gap-2">
            <UButton
              type="button"
              label="Devolver puntos"
              :disabled="isSpinning"
              class="rounded-full border-3 animate-on-hover"
              color="neutral"
              icon="custom:points"
              block
            />
          </div>
        </aside>

        <SpinWheel
          ref="wheelRef"
          v-model="winner"
          v-model:spinning="isSpinning"
          :entries="names"
          :palette="wheelPalette"
          :idle-spin="true"
          @select="isWinnerModalOpen = true"
        />

        <UModal
          v-model:open="isWinnerModalOpen"
          title="Ganador"
          description="Modal del ganador"
          :dismissible="false"
        >
          <template #content>
            <div class="text-center px-4 py-6 relative">
              <UButton icon="lucide:x" variant="outline" color="neutral" class="absolute inset-e-2 top-2 rounded-full" size="sm" @click="isWinnerModalOpen = false" />
              <p class="uppercase tracking-widest text-primary">Ganador</p>
              <div>
                <NuxtLink
                  :to="`https://www.twitch.tv/popout/${user?.login}/viewercard/${winnerInfo?.user.login}`"
                  target="_blank"
                  class="text-5xl hover:underline font-bold"
                >
                  {{ winner }}
                </NuxtLink>
              </div>
              <p v-if="winnerInfo?.input" class="text-sm text-muted">{{ winnerInfo.input }}</p>
              <UButton label="Cobrar puntos" icon="custom:points" color="primary" variant="outline" class="mt-2" />
            </div>
          </template>
        </UModal>
      </div>
    </section>
  </main>
</template>
