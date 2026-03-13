<script setup lang="ts">
definePageMeta({ middleware: "authenticated" });

const openWinner = ref(false);
</script>

<template>
  <ClientOnly>
    <BackgroundStars color="secondary" radial-gradient />
  </ClientOnly>
  <UContainer class="space-y-2 mx-auto max-w-360" as="main">
    <ClientOnly>
      <BackgroundStars color="secondary" radial-gradient clientonly />
    </ClientOnly>
    <BackgroundSpin class="dark:opacity-20 light:opacity-80" />

    <AppHeader />

    <div class="bg-elevated rounded-xl shadow">
      <PanelRewards />
    </div>

    <div class="grid gap-2 grid-cols-1 lg:grid-cols-[375px_1fr] xl:grid-cols-[375px_1fr_375px]">
      <aside class="p-4 bg-elevated rounded-xl space-y-4 shadow">
        <PanelRedemptions />
      </aside>

      <div class="p-4 overflow-hidden bg-elevated rounded-xl space-y-4 flex flex-col min-h-125 shadow">
        <PanelParticipants @winner="openWinner = true" />
      </div>

      <div class="relative lg:col-span-2 xl:col-span-1 min-h-125 xl:min-h-0 bg-elevated rounded-xl shadow">
        <LiveChat class="absolute inset-0" />
      </div>
    </div>

    <WinnerModal v-model:open="openWinner" />
  </UContainer>
</template>
