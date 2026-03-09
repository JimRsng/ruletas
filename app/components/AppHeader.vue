<script setup lang="ts">
const { clear } = useUserSession();

const rewardsStore = useRewardsStore();
const redemptionsStore = useRedemptionsStore();

const handleLogout = () => {
  clear();
  rewardsStore.clear();
  redemptionsStore.clear();
  navigateTo("/");
};
</script>

<template>
  <div class="mb-5 relative">
    <p class="text-xs uppercase tracking-widest">JimTracker</p>
    <h1 class="text-5xl leading-none">Ruletas</h1>
    <p>Crea ruletas a partir de recompensas de puntos de tu canal de Twitch</p>
    <UButton
      label="Salir"
      variant="outline"
      color="error"
      icon="lucide:log-out"
      class="absolute top-0 inset-e-0 rounded-full"
      @click="handleLogout"
    />
  </div>
</template>
