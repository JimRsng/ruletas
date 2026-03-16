<script setup lang="ts">
definePageMeta({ middleware: "authenticated" });

const openWinner = ref(false);
const renderBg = ref(false);

onMounted(() => {
  renderBg.value = true;
});
</script>

<template>
  <Transition name="fade">
    <BackgroundStars v-if="renderBg" color="secondary" radial-gradient />
  </Transition>
  <UContainer class="space-y-2 mx-auto max-w-360" as="main">
    <Transition name="fade">
      <BackgroundStars v-if="renderBg" color="secondary" radial-gradient clientonly />
    </Transition>
    <BackgroundSpin class="dark:opacity-20 light:opacity-80" />

    <AppHeader />

    <PanelRewards />

    <div class="grid gap-2 grid-cols-1 lg:grid-cols-[375px_1fr] xl:grid-cols-[375px_1fr_375px]">
      <aside class="p-4 bg-elevated rounded-xl space-y-4 shadow">
        <PanelRedemptions />
      </aside>

      <div class="relative p-4 overflow-hidden bg-elevated rounded-xl space-y-4 flex flex-col min-h-125 shadow">
        <PanelParticipants @winner="openWinner = true" />
      </div>

      <div class="relative lg:col-span-2 xl:col-span-1 min-h-125 xl:min-h-0 bg-elevated rounded-xl shadow">
        <PanelLiveChat class="p-4 absolute inset-0" />
      </div>
    </div>

    <WinnerModal v-model:open="openWinner" />
  </UContainer>
</template>
