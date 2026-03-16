import type { H3Event } from "h3";
import { StaticAuthProvider, refreshUserToken } from "@twurple/auth";
import { ApiClient } from "@twurple/api";

const createBadgesRecord = (badges: {
  id: string;
  versions: {
    id: string;
    image: string;
    title: string;
  }[];
}[]) => {
  const badgesRecord: Record<string, { image: string, title: string }> = {};

  for (const [_, badge] of Object.entries(badges)) {
    for (const version of badge.versions) {
      badgesRecord[`${badge.id}/${version.id}`] = { image: version.image, title: version.title };
    }
  }

  return badgesRecord;
};

export const getGlobalBadges = defineCachedFunction(async (event: H3Event) => {
  const { secure } = await requireUserSession(event);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const globalBadges = await twitch.chat.getGlobalBadges();

  const badgesArray = globalBadges.map(badge => ({
    id: badge.id,
    versions: badge.versions.map(version => ({
      id: version.id,
      image: version.getImageUrl(1),
      title: version.title
    }))
  }));

  return createBadgesRecord(badgesArray);
}, {
  maxAge: 60 * 60 * 24, // 1 day
  group: "functions",
  name: "getGlobalBadges",
  swr: false,
  getKey: () => "all"
});

export const getChannelBadges = defineCachedFunction(async (event: H3Event) => {
  const { user, secure } = await requireUserSession(event);

  const config = useRuntimeConfig(event);

  const { accessToken, scope } = await refreshUserToken(config.oauth.twitch.clientId, config.oauth.twitch.clientSecret, secure!.refreshToken);

  const provider = new StaticAuthProvider(config.oauth.twitch.clientId, accessToken, scope);
  const twitch = new ApiClient({ authProvider: provider });

  const channelBadges = await twitch.chat.getChannelBadges(user.id);

  const badgesArray = channelBadges.map(badge => ({
    id: badge.id,
    versions: badge.versions.map(version => ({
      id: version.id,
      image: version.getImageUrl(1),
      title: version.title
    }))
  }));

  return createBadgesRecord(badgesArray);
}, {
  maxAge: 60 * 60 * 24, // 1 day
  group: "functions",
  name: "getChannelBadges",
  swr: false,
  getKey: async (event) => {
    const { user } = await requireUserSession(event);
    return user.id;
  }
});
