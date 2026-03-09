import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    rewardId: z.string()
  }).parse);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const redemptions = await twitch.channelPoints.getRedemptionsForBroadcasterPaginated(user.id, params.rewardId, "UNFULFILLED", { newestFirst: false }).getAll();

  const redemptionUserIds = [...new Set(redemptions.map(r => r.userId))];
  // TODO: iterate if there are more than 100 users
  const subscriptions = await twitch.subscriptions.getSubscriptionsForUsers(user.id, redemptionUserIds);

  return redemptions.map((redemption) => {
    const subscription = subscriptions.find(s => s.userId === redemption.userId);
    return {
      id: redemption.id,
      user: {
        id: redemption.userId,
        name: redemption.userDisplayName,
        login: redemption.userName,
        subscription: subscription ? {
          tier: subscription.tier
        } : null
      },
      input: redemption.userInput,
      status: redemption.isFulfilled ? "FULFILLED" : redemption.isCanceled ? "CANCELED" : "UNFULFILLED"
    };
  });
});
