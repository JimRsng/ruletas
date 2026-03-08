import type { ErrorCode } from "#shared/utils/errors";

declare global {
  type ErrorCode = typeof ErrorCode;

  interface RuletasRedemption {
    id: string;
    user: {
      id: string;
      name: string;
      login: string;
    };
    input: string;
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
