<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string;
  popover?: boolean;
}>(), {
  popover: true
});

const { data: emotes } = await useLazyFetch("/api/chat/emotes", {
  key: "chat:emotes",
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const parsedParts = computed(() => {
  const tokens = props.text.split(" ");

  if (!emotes.value) return tokens.map(token => ({ token, url: null as string | null }));

  return tokens.map(token => ({
    token,
    url: emotes.value![token] ?? null
  }));
});
</script>

<template>
  <span class="max-h-6">
    <template v-for="(part, index) in parsedParts" :key="index">
      <template v-if="!part.url">{{ part.token }}</template>
      <img
        v-else
        class="inline-block align-middle max-h-8 -my-2"
        :src="part.url"
        :alt="part.token"
        :title="part.token"
        loading="lazy"
        decoding="async"
      >
      <template v-if="index < parsedParts.length - 1">{{ ' ' }}</template>
    </template>
  </span>
</template>
