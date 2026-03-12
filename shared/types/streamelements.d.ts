declare global {
  interface StreamElementsUser {
    profile: {
      title: string;
      headerImage: string;
    };
    _id: string;
    isPartner: boolean;
    providerId: string;
    displayName: string;
    username: string;
    avatar: string;
    suspended: boolean;
    provider: string;
    broadcasterType: string;
    alias: string;
    inactive: boolean;
  }

  interface StreamElementsEmote<T extends string> {
    _id: string;
    name: string;
    type: T;
    width: number;
    height: number;
    gif: boolean;
    urls: Partial<Record<"1" | "2" | "3" | "4", string>>;
  }

  interface StreamElementsEmotes {
    bttvChannelEmotes: Record<string, StreamElementsEmote<"bttv">>;
    bttvGlobalEmotes: Record<string, StreamElementsEmote<"bttv">>;
    ffzChannelEmotes: Record<string, StreamElementsEmote<"ffz">>;
    ffzGlobalEmotes: Record<string, StreamElementsEmote<"ffz">>;
    sevenTVChannelEmotes: Record<string, StreamElementsEmote<"7tv">>;
    sevenTVGlobalEmotes: Record<string, StreamElementsEmote<"7tv">>;
    twitchGlobalEmotes: Record<string, StreamElementsEmote<"twitch">>;
    twitchSubEmotes: Record<string, StreamElementsEmote<"twitch">>;
  }
}

export {};
