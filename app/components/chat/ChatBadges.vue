<script setup lang="ts">
const props = defineProps<{
  badges: Map<string, string>;
}>();

const { data } = await useLazyFetch("/api/chat/badges", {
  key: "chat:badges",
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const resolvedBadges = computed(() => {
  if (!data.value) return [];
  const badges: { key: string, image: string, title: string }[] = [];
  for (const [badgeKey, version] of props.badges) {
    const badgeData = data.value[`${badgeKey}/${version}`];
    if (badgeData) {
      badges.push({
        key: badgeKey,
        image: badgeData.image,
        title: badgeData.title
      });
    }
  }
  return badges;
});
</script>

<template>
  <img
    v-for="badge in resolvedBadges"
    :key="badge.key"
    :src="badge.image"
    :alt="badge.title"
    :title="badge.title"
    class="size-4.5 inline-block align-sub mr-1"
    loading="lazy"
    decoding="async"
  >
</template>
