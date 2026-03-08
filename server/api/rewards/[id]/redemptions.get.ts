import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    id: z.string()
  }).parse);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const redemptionsPagination = twitch.channelPoints.getRedemptionsForBroadcasterPaginated(user.id, params.id, "UNFULFILLED", { newestFirst: true });
  const redemptions = await redemptionsPagination.getAll();

  return redemptions.map(redemption => ({
    id: redemption.id,
    user: {
      id: redemption.userId,
      name: redemption.userDisplayName,
      login: redemption.userName
    },
    input: redemption.userInput
  }));
});
