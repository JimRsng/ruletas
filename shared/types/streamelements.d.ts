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
    bttv: {
      channel: Record<string, StreamElementsEmote<"bttv">>;
      global: Record<string, StreamElementsEmote<"bttv">>;
    };
    ffz: {
      channel: Record<string, StreamElementsEmote<"ffz">>;
      global: Record<string, StreamElementsEmote<"ffz">>;
    };
    sevenTV: {
      channel: Record<string, StreamElementsEmote<"7tv">>;
      global: Record<string, StreamElementsEmote<"7tv">>;
    };
    twitch: {
      global: Record<string, StreamElementsEmote<"twitch">>;
      sub: Record<string, StreamElementsEmote<"twitch">>;
    };
  }
}

export {};
