import type { ErrorCode } from "#shared/utils/errors";

declare global {
  type ErrorCode = typeof ErrorCode;

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
