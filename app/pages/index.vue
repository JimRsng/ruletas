<script setup lang="ts">
const { loggedIn, openInPopup } = useUserSession();

watch(loggedIn, (value) => {
  if (!value) return;
  navigateTo("/app");
});
</script>

<template>
  <UButton
    label="Iniciar sesión con Twitch"
    icon="simple-icons:twitch"
    variant="soft"
    color="neutral"
    :ui="{
      leadingIcon: 'text-white',
      base: 'text-white text-md dark:bg-violet-600 light:bg-violet-800 dark:hover:bg-violet-700 light:hover:bg-violet-900',
    }"
    @click="openInPopup('/auth/twitch')"
  />
</template>
