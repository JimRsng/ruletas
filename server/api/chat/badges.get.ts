export default defineEventHandler(async (event) => {
  const globalBadges = await getGlobalBadges(event);
  const channelBadges = await getChannelBadges(event);

  return {
    ...globalBadges,
    ...channelBadges
  };
});
