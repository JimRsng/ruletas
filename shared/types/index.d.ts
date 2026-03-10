import type { ErrorCode } from "#shared/utils/errors";

declare global {
  type ErrorCode = typeof ErrorCode;

  type TwitchSubscriptionTier = "1000" | "2000" | "3000";

  type TwitchParsedMessage = {
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
  };

  interface RuletasRedemption {
    id: string;
    user: {
      id: string;
      name: string;
      login: string;
      subscription: {
        tier: TwitchSubscriptionTier;
      } | null;
    };
    input: string;
  }

  interface RuletasRedemptionWithDuplicates extends Omit<RuletasRedemption, "input"> {
    inputs: string[];
  }

  interface RuletasReward {
    id: string;
    title: string;
    cost: number;
    description: string;
    input: boolean;
    active: boolean;
    paused: boolean;
    color: string;
  }
}

export {};
