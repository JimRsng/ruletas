declare module "#auth-utils" {
  interface SecureSessionData {
    refreshToken: string;
  }

  interface TwitchUser {
    id: string;
    login: string;
    displayName: string;
    image: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends TwitchUser {}
}

export {};
