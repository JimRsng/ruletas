import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
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

  await twitch.channelPoints.createCustomReward(user.id, {
    title: body.title,
    prompt: body.description,
    cost: body.cost,
    userInputRequired: true,
    isEnabled: body.active,
    backgroundColor: body.color
  });
});
