import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    rewardId: z.string(),
    redemptionId: z.string()
  }).parse);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const redemptions = await twitch.channelPoints.updateRedemptionStatusByIds(user.id, params.rewardId, [params.redemptionId], "CANCELED");
  const redemption = redemptions[0]!;

  return {
    id: redemption.id,
    user: {
      id: redemption.userId,
      name: redemption.userDisplayName,
      login: redemption.userName
    },
    input: redemption.userInput,
    status: redemption.isFulfilled ? "FULFILLED" : redemption.isCanceled ? "CANCELED" : "UNFULFILLED"
  };
});
