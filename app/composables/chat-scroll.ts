import type { MultiWatchSources, ShallowRef } from "vue";

export const useChatScroll = (container: ShallowRef<HTMLElement | null>, sources: MultiWatchSources) => {
  watch(sources, () => {
    requestAnimationFrame(() => {
      if (!container.value) return;
      container.value.scrollTop = container.value.scrollHeight;
    });
  }, { deep: true });
};
