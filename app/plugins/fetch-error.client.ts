export default defineNuxtPlugin({
  name: "fetch-error",
  parallel: true,
  async setup () {
    const toast = useToast();

    globalThis.$fetch = $fetch.create({
      onResponseError: ({ response }) => {
        const message = response.status === 500 ? "Ha ocurrido un error desconocido" : response._data.message;
        toast.add({ description: message, color: "error" });
      }
    });
  }
});
