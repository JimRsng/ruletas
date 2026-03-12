import type { WatchSource } from "vue";

export const useCountUp = (start: WatchSource<unknown>, stop: WatchSource<boolean>) => {
  const seconds = ref(0);

  let interval: ReturnType<typeof setInterval> | null = null;

  const stopTimer = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  onMounted(() => {
    watch(stop, (value) => {
      if (!value) return;
      stopTimer();
    });

    watch(start, (value) => {
      if (!value) return;
      stopTimer();
      seconds.value = 0;
      interval = setInterval(() => {
        seconds.value++;
      }, 1000);
    }, { immediate: true });
  });

  onUnmounted(stopTimer);

  return seconds;
};
