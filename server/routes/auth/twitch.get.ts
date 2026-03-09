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
      user: {
        id: user.id,
        login: user.login,
        displayName: user.display_name,
        image: user.profile_image_url
      },
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
