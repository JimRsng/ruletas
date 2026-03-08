import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    rewardId: z.string()
  }).parse);

  const body = await readValidatedBody(event, z.object({
    active: z.boolean(),
    cost: z.number().int().positive()
  }).parse);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const reward = await twitch.channelPoints.updateCustomReward(user.id, params.rewardId, {
    isEnabled: body.active,
    cost: body.cost
  });

  return {
    id: reward.id,
    title: reward.title,
    description: reward.prompt,
    cost: reward.cost,
    input: reward.userInputRequired,
    active: reward.isEnabled,
    color: reward.backgroundColor
  };
});
