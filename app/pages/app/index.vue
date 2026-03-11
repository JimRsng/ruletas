<script setup lang="ts">
definePageMeta({ middleware: "authenticated" });

const openWinner = ref(false);
</script>

<template>
  <UContainer class="space-y-2 mx-auto max-w-360" as="main">
    <AppHeader />

    <RewardsSelector />

    <div class="grid gap-2 grid-cols-1 lg:grid-cols-[375px_1fr] xl:grid-cols-[375px_1fr_375px]">
      <aside class="p-4 bg-elevated rounded-xl space-y-4">
        <RedemptionsPanel />
      </aside>

      <div class="p-4 overflow-hidden bg-elevated rounded-xl space-y-4 flex flex-col min-h-125">
        <ParticipantsPanel @winner="openWinner = true" />
      </div>

      <WinnerModal v-model:open="openWinner" />

      <LiveChat class="lg:col-span-2 xl:col-span-1" />
    </div>
  </UContainer>
</template>
