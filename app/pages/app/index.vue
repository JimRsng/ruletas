<script setup lang="ts">
definePageMeta({ middleware: "authenticated" });

const openWinner = ref(false);
</script>

<template>
  <UContainer class="mx-auto space-y-2" as="main">
    <AppHeader />

    <RewardsSelector />

    <div class="grid gap-2 grid-cols-1 lg:grid-cols-[375px_1fr]">
      <aside class="p-4 bg-elevated rounded-xl space-y-4">
        <RedemptionsPanel />
      </aside>

      <div class="p-4 overflow-hidden bg-elevated rounded-xl space-y-4">
        <ParticipantsPanel @winner="openWinner = true" />
      </div>

      <WinnerModal v-model:open="openWinner" />
    </div>
  </UContainer>
</template>
