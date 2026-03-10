import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { secure } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const twitchUser = await twitch.users.getUserById(params.id);

  if (!twitchUser) {
    throw createError({
      status: ErrorCode.NOT_FOUND,
      message: "User not found"
    });
  }

  return {
    id: twitchUser.id,
    image: twitchUser.profilePictureUrl
  };
});
