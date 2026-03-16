# ruletas

Web app for creating picker wheels linked to Twitch channel point rewards.

![jimrsng](https://github.com/user-attachments/assets/9dfbd3f0-ba8b-4176-819c-ae68931534ce)

## Contents

- 🚀 [Features](#features)
- 🖼️ [Screenshots](#screenshots)
- ⭐ [Credits](#credits)
- ⚖️ [License](#license)
- 💻 [Development](#development)

## <a name="features">🚀 Features</a>

- Complete Twitch channel point rewards integration.
- Create, edit, and delete Twitch channel point rewards.
- Select or change the reward used for the wheel
- Rewards redemption entries list.
- View and manage entries.
- Per-reward wheel settings and filters.
- Real-time Twitch live chat with emotes and user badge display.
- Winner celebration display, winner chat integration, and timer.
- Wheel spin sound and volume control.

## <a name="screenshots">🖼️ Screenshots</a>

![screenshot-1](https://github.com/user-attachments/assets/da294a97-3182-4a5b-b521-2915cf1063b2)
![screenshot-2](https://github.com/user-attachments/assets/6049a06c-3a7b-4816-a93f-e90216df4535)
![screenshot-2](https://github.com/user-attachments/assets/74d6f16b-abee-497f-a7e4-0cdd0ab617c9)

## <a name="credits">⭐ Credits</a>

- [Nuxt](https://nuxt.com/), the [Vue](https://vuejs.org/) framework for bringing the best development experience.
- Serverless hosted on [Cloudflare Workers](https://workers.cloudflare.com/).
- [Nuxt UI](https://ui.nuxt.com) and [Tailwind CSS](https://tailwindcss.com/) for styling.
- [twurple](https://github.com/twurple/twurple), the Twitch API wrapper.
- [nuxt-auth-utils](https://github.com/Atinux/nuxt-auth-utils) for sessions and OAuth integrations.
- [streamer-emotes](https://github.com/ahmedrangel/streamer-emotes) for Twitch channel emotes providers.
- Audio library powered by [Howler.js](https://howlerjs.com/).
- [Pinia](https://pinia.vuejs.org/) for state management.

## <a name="license">⚖️ License</a>

Made with ❤️ by [Ahmed](https://github.com/ahmedrangel) and [Yizack](https://github.com/yizack).

Open Source app and published under [MIT License](LICENSE)

## <a name="development">💻 Development</a>

<details>
  <summary>Local development</summary>

```sh
# Install dependencies
pnpm install

# Build
pnpm build

# Development server
pnpm dev

# Run ESLint
pnpm lint

# Run typecheck
pnpm test:types
```

</details>
