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
        tier: "1000" | "2000" | "3000";
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
    color: string;
  }
}

export {};
