<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { user: broadcaster, clear } = useUserSession();

const rewardsStore = useRewardsStore();
const redemptionsStore = useRedemptionsStore();

const handleLogout = async () => {
  await clear();
  rewardsStore.clear();
  redemptionsStore.clear();
  navigateTo("/");
};

const userMenu = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Salir",
      icon: "lucide:log-out",
      color: "error",
      onSelect: handleLogout
    }
  ]
]);
</script>

<template>
  <div class="mb-5 relative">
    <p class="text-xs uppercase tracking-widest text-primary font-bold">JimTracker</p>
    <h1 class="text-5xl">Ruletas</h1>
    <p class="text-muted">Crea ruletas a partir de recompensas de puntos de tu canal de Twitch</p>
    <div class="absolute top-0 inset-e-0 flex gap-1">
      <UColorModeButton />
      <UDropdownMenu v-if="broadcaster" :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :modal="false" arrow>
        <UButton
          :label="broadcaster.displayName"
          trailing-icon="lucide:chevron-down"
          variant="subtle"
          color="neutral"
          :ui="{
            base: 'text-md hover:bg-accented/50 data-active:bg-accented/75',
          }"
        >
          <template #leading>
            <UAvatar v-if="broadcaster.image" :src="broadcaster.image" :alt="broadcaster.login" size="2xs" />
            <UAvatar v-else :alt="broadcaster.displayName" size="2xs" class="bg-accented" />
          </template>
        </UButton>
      </UDropdownMenu>
    </div>
  </div>
</template>
