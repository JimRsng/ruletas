<script setup lang="ts">
const props = withDefaults(defineProps<{
  text: string;
  popover?: boolean;
}>(), {
  popover: true
});

const { data: emotes } = await useLazyFetch("/api/channel-emotes", {
  key: "channel-emotes",
  getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
});

const parsedParts = computed(() => {
  const words = props.text.split(" ");

  if (!emotes.value) return words;

  const parts: (string | VNode)[] = [];

  for (const word of words) {
    const emoteUrl = emotes.value[word];
    parts.push(
      emoteUrl ? h("img", {
        class: "h-8 -my-2",
        src: emoteUrl,
        alt: word,
        loading: "lazy",
        decoding: "async"
      }) : word
    );
  }

  return parts;
});
</script>

<template>
  <span class="channel-emotes max-h-6 relative">
    <template v-for="(part, index) in parsedParts" :key="index">
      <template v-if="typeof part === 'string'">
        {{ part }}
      </template>
      <UPopover v-else-if="popover" mode="hover" :content="{ side: 'top' }" arrow>
        <UButton variant="link" class="p-0 align-middle inline-flex">
          <component :is="part" />
        </UButton>
        <template #content>
          {{ part.props!.alt }}
        </template>
      </UPopover>
      <component :is="part" v-else class="inline-block align-middle" :title="part.props!.alt" />
      <template v-if="index < parsedParts.length - 1">{{ ' ' }}</template>
    </template>
  </span>
</template>
