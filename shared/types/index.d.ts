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
}

export {};
