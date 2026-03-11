export default defineNuxtRouteMiddleware(async (to) => {
  const { user: broadcaster, loggedIn, clear } = useUserSession();

  const isApp = to.path.includes("/app");

  if (loggedIn.value && broadcaster.value?.broadcasterType === "") {
    const toast = useToast();
    toast.add({ description: "Debes ser un Twitch Partner o Afiliado para usar esta app", color: "error", duration: 5000 });
    await clear();
    return navigateTo("/", { replace: true });
  }

  if (loggedIn.value && !isApp) return navigateTo("/app", { replace: true });
  if (!loggedIn.value && isApp) return navigateTo("/", { replace: true });
});
