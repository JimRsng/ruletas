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
  const subscriptions: { user_id: string, tier: TwitchSubscriptionTier }[] = [];

  if (redemptionUserIds.length > 0) {
    /**
     * Twitch API allows up to 100 user IDs per request for the Get Broadcaster Subscriptions endpoint
     * @see https://dev.twitch.tv/docs/api/reference#get-broadcaster-subscriptions
     */
    const chunkSize = 100;
    for (let i = 0; i < redemptionUserIds.length; i += chunkSize) {
      const userIdChunk = redemptionUserIds.slice(i, i + chunkSize);

      const response = await $fetch<{ data: { user_id: string, tier: TwitchSubscriptionTier }[] }>("https://api.twitch.tv/helix/subscriptions", {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Client-Id": config.oauth.twitch.clientId
        },
        query: {
          broadcaster_id: user.id,
          user_id: userIdChunk,
          first: 100
        }
      });

      subscriptions.push(...response.data);
    }
  }

  return redemptions.map((redemption) => {
    const subscription = subscriptions.find(s => s.user_id === redemption.userId);
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
