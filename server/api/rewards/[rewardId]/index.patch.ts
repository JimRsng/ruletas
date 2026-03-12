import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);

  const params = await getValidatedRouterParams(event, z.object({
    rewardId: z.string()
  }).parse);

  const body = await readValidatedBody(event, z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    cost: z.int().positive().max(MAX_INT32).optional(),
    input: z.boolean().optional(),
    active: z.boolean().optional(),
    paused: z.boolean().optional(),
    color: z.string().optional()
  }).parse);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const reward = await twitch.channelPoints.updateCustomReward(user.id, params.rewardId, {
    title: body.title,
    prompt: body.description,
    userInputRequired: body.input,
    isEnabled: body.active,
    isPaused: body.paused,
    cost: body.cost,
    backgroundColor: body.color
  }).catch((e) => {
    throw createTwitchError(e, {
      UPDATE_CUSTOM_REWARD_DUPLICATE_REWARD: [ErrorCode.CONFLICT, "Ya existe una recompensa con ese título en tu canal"],
      UPDATE_CUSTOM_REWARD_COST_INVALID: [ErrorCode.BAD_REQUEST, "El costo de la recompensa no es válido"]
    });
  });

  return {
    id: reward.id,
    title: reward.title,
    description: reward.prompt,
    cost: reward.cost,
    input: reward.userInputRequired,
    active: reward.isEnabled,
    paused: reward.isPaused,
    color: reward.backgroundColor
  };
});
