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
    const redemptionsPagination = twitch.channelPoints.getRedemptionsForBroadcasterPaginated(user.id, params.rewardId, "UNFULFILLED", { newestFirst: true });
    const redemptions = await redemptionsPagination.getAll();

    const redemptionIds = redemptions.map(r => r.id);

    // TODO: separate by chunks of 50 if more than 50 redemptions
    await twitch.channelPoints.updateRedemptionStatusByIds(user.id, params.rewardId, redemptionIds, "CANCELED");
  }
});
