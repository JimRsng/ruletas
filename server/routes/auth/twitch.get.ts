export default defineOAuthTwitchEventHandler({
  config: {
    scope: [
      "channel:read:redemptions",
      "channel:manage:redemptions",
      "channel:read:subscriptions"
    ]
  },
  async onSuccess (event, { user, tokens }) {
    await setUserSession(event, {
      user,
      secure: {
        refreshToken: tokens.refresh_token
      }
    });

    return send(event, `
      <script>
        localStorage.removeItem('temp-nuxt-auth-utils-popup');
        window.close();
      </script>
    `, "text/html");
  }
});
