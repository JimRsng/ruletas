export default defineCachedEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const emoteLookup: Record<string, string> = {};

  const streamElementsUser = await $fetch<StreamElementsUser>(`/kappa/v2/channels/${user.login}`, {
    baseURL: "https://api.streamelements.com"
  }).catch(() => null);

  if (!streamElementsUser) return emoteLookup;

  const emotes = await $fetch<StreamElementsEmotes>(`/kappa/v2/channels/${streamElementsUser._id}/emotes`, {
    baseURL: "https://api.streamelements.com"
  }).catch(() => null);

  if (!emotes) return emoteLookup;

  for (const [_, provider] of Object.entries(emotes) as [string, StreamElementsEmotes[keyof StreamElementsEmotes]][]) {
    if (!provider) continue;
    for (const emote of Object.values(provider) as StreamElementsEmotes[keyof StreamElementsEmotes][number][]) {
      emoteLookup[emote.name] = emote.urls["1"]!;
    }
  }

  return emoteLookup;
}, {
  maxAge: 1 * 24 * 60 * 60, // 1 day
  swr: false,
  group: "api",
  name: "channel-emotes",
  getKey: async (event) => {
    const { user } = await requireUserSession(event);
    return user.id;
  }
});
