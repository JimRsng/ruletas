<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

const { user, clear } = useUserSession();

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
    <p class="text-xs uppercase tracking-widest text-primary">JimTracker</p>
    <h1 class="text-5xl">Ruletas</h1>
    <p class="text-muted">Crea ruletas a partir de recompensas de puntos de tu canal de Twitch</p>
    <UDropdownMenu v-if="user" :items="userMenu" :content="{ align: 'end', side: 'bottom', sideOffset: 8 }" :modal="false" arrow>
      <UButton
        :label="user.displayName"
        trailing-icon="lucide:chevron-down"
        variant="subtle"
        color="neutral"
        class="absolute top-0 inset-e-0 rounded-full"
        :ui="{
          base: 'text-md hover:bg-accented/50 data-active:bg-accented/75',
        }"
      >
        <template #leading>
          <UAvatar v-if="user.image" :src="user.image" :alt="user.login" size="2xs" />
          <UAvatar v-else :alt="user.displayName" size="2xs" class="bg-accented" />
        </template>
      </UButton>
    </UDropdownMenu>
  </div>
</template>
