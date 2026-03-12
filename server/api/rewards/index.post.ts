import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event): Promise<RuletasReward> => {
  const { user, secure } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    title: z.string().min(1).max(45),
    description: z.string().max(200).optional(),
    cost: z.int().positive().max(MAX_INT32),
    input: z.boolean(),
    color: z.string()
  }).parse);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const reward = await twitch.channelPoints.createCustomReward(user.id, {
    title: body.title,
    prompt: body.description,
    cost: body.cost,
    userInputRequired: body.input,
    isEnabled: false, // start disabled to not listen to redemptions right away
    backgroundColor: body.color
  }).catch((e) => {
    throw createTwitchError(e, {
      CREATE_CUSTOM_REWARD_DUPLICATE_REWARD: [ErrorCode.CONFLICT, "Ya existe una recompensa con ese título en tu canal"],
      CREATE_CUSTOM_REWARD_COST_INVALID: [ErrorCode.BAD_REQUEST, "El costo de la recompensa no es válido"]
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
