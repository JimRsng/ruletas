declare module "#auth-utils" {
  interface SecureSessionData {
    refreshToken: string;
  }

  interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url: string;
    view_count: number;
    email?: string;
    created_at: string;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends TwitchUser {}
}

export {};
