import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event): Promise<RuletasReward> => {
  const { user, secure } = await requireUserSession(event);

  const body = await readValidatedBody(event, z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    active: z.boolean().default(false),
    cost: z.number().int().positive(),
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
    userInputRequired: true,
    isEnabled: body.active,
    backgroundColor: body.color
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
