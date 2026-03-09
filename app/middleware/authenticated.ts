export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession();

  const isApp = to.path.includes("/app");

  if (loggedIn.value && !isApp) return navigateTo("/app", { replace: true });
  if (!loggedIn.value && isApp) return navigateTo("/", { replace: true });
});
