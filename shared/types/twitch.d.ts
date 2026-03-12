declare global {
  type TwitchSubscriptionTier = "1000" | "2000" | "3000";

  interface TwitchParsedMessage {
    raw: string;
    tags: Record<string, string>;
    prefix?: string;
    command: string;
    params: string[];
    text?: string;
    channel?: string;
    login?: string;
    displayName?: string;
    color?: string;
    isAction?: boolean;
  }
}

export {};
