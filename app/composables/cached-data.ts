export const useCachedData = <T>(key: string, getValue?: () => T): T => {
  const isFunction = typeof getValue === "function";
  const nuxtApp = useNuxtApp();
  if (!nuxtApp.payload.data[key]) {
    nuxtApp.payload.data[key] = isFunction ? getValue() : undefined;
  }
  else if (isFunction) {
    nuxtApp.payload.data[key] = getValue();
  }

  return nuxtApp.payload.data[key];
};
