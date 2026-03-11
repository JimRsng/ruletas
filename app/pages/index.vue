<script setup lang="ts">
definePageMeta({ middleware: "authenticated", layout: false });

const { loggedIn, openInPopup } = useUserSession();

watch(loggedIn, (value) => {
  if (!value) return;
  navigateTo("/app");
});

useHead({
  bodyAttrs: {
    class: "dark"
  }
});
</script>

<template>
  <div class="w-dvw h-dvh flex flex-col items-center justify-center relative overflow-hidden">
    <div
      class="fixed top-[50%] left-[50%] w-[150vmax] h-[150vmax] transform -translate-x-1/2 -translate-y-1/2 animate-spin [animation-duration:120s]"
      :style="{
        background: `conic-gradient(
          ${wheelPalette[0]}33 0deg 45deg,
          ${wheelPalette[1]}33 45deg 90deg,
          ${wheelPalette[2]}33 90deg 135deg,
          ${wheelPalette[3]}33 135deg 180deg,
          ${wheelPalette[4]}33 180deg 225deg,
          ${wheelPalette[5]}33 225deg 270deg,
          ${wheelPalette[6]}33 270deg 315deg,
          ${wheelPalette[7]}33 315deg 360deg
        );`,
      }"
    />
    <div class="relative flex flex-col items-center gap-2 text-center text-white bg-neutral-900 p-4 rounded-lg spin-wheel-indicator border">
      <p class="font-bold md:text-2xl">REWARDS WHEEL</p>
      <div class="relative">
        <UButton
          label="Entrar con Twitch"
          icon="simple-icons:twitch"
          variant="soft"
          color="neutral"
          :ui="{
            leadingIcon: 'md:w-8 md:h-8',
            base: 'dark:bg-violet-600 light:bg-violet-800 dark:hover:bg-violet-700 light:hover:bg-violet-900 font-bold md:text-2xl py-3 px-2 md:py-5 md:px-6',
          }"
          @click="openInPopup('/auth/twitch')"
        />
      </div>
    </div>
  </div>
</template>
