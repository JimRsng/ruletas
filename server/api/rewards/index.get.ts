import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

export default defineEventHandler(async (event) => {
  const { user, secure } = await requireUserSession(event);
  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const rewards = await twitch.channelPoints.getCustomRewards(user.id, true).catch((e) => {
    throw createTwitchError(e);
  });

  return rewards.map(reward => ({
    id: reward.id,
    title: reward.title,
    cost: reward.cost,
    description: reward.prompt,
    input: reward.userInputRequired,
    active: reward.isEnabled,
    paused: reward.isPaused,
    color: reward.backgroundColor
  }));
});
