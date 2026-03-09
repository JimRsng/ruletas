import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const params = await getValidatedRouterParams(event, z.object({
    rewardId: z.string()
  }).parse);

  const query = await getValidatedQuery(event, z.object({
    id: z.union([z.string(), z.array(z.string())]).optional().transform((val) => {
      if (val === undefined) return undefined;
      return Array.isArray(val) ? val : [val];
    })
  }).parse);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  if (query.id) {
    await twitch.channelPoints.updateRedemptionStatusByIds(user.id, params.rewardId, query.id, "CANCELED");
  }
  else {
    const redemptionsPagination = twitch.channelPoints.getRedemptionsForBroadcasterPaginated(user.id, params.rewardId, "UNFULFILLED", { newestFirst: false });
    const redemptions = await redemptionsPagination.getAll();

    const redemptionIds = redemptions.map(r => r.id);

    /**
     * Twitch API allows up to 50 redemption IDs per request
     * @see https://dev.twitch.tv/docs/api/reference#update-redemption-status
     */
    const chunkSize = 50;
    const promises = [];

    for (let i = 0; i < redemptionIds.length; i += chunkSize) {
      const redemptionIdsChunk = redemptionIds.slice(i, i + chunkSize);

      promises.push(
        twitch.channelPoints.updateRedemptionStatusByIds(user.id, params.rewardId, redemptionIdsChunk, "CANCELED")
      );
    }

    await Promise.all(promises);
  }
});
