import icons from "./icons";
import { SITE } from "../shared/utils/site";

export default defineNuxtConfig({
  // future: { compatibilityVersion: 5 },

  modules: [
    "@nuxt/ui",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxtjs/color-mode",
    "@nuxtjs/sitemap",
    "@nuxthub/core",
    "nuxt-auth-utils",
    "@pinia/nuxt",
    "@nuxt/fonts",
    "nuxt-ui-colors-no-inline"
  ],

  $production: {
    nitro: {
      preset: "cloudflare-module"
    }
  },

  devtools: { enabled: true },

  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: SITE.name,
      htmlAttrs: {
        lang: "en"
      },
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "shortcut icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "512x512", href: "/web-app-manifest-512x512.png" },
        { rel: "icon", type: "image/png", sizes: "192x192", href: "/web-app-manifest-192x192.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "manifest", href: "/site.webmanifest" },
        { rel: "preconnect", href: "https://static-cdn.jtvnw.net" }
      ],
      meta: [
        { name: "robots", content: "index, follow" },
        { name: "apple-mobile-web-app-title", content: SITE.name },
        { name: "apple-mobile-web-app-capable", content: SITE.name },
        { name: "application-name", content: SITE.name },
        { property: "og:site_name", content: SITE.name }
      ]
    }
  },

  css: [
    "~/assets/css/ui.tailwind.css",
    "~/assets/scss/app.scss"
  ],

  site: {
    url: SITE.host
  },

  colorMode: {
    preference: "dark",
    fallback: "dark"
  },

  ui: {
    colorMode: true,
    fonts: true,
    theme: {
      colors: ["primary", "secondary", "success", "error"]
    },
    colors: {
      neutral: "zinc",
      primary: "emerald",
      secondary: "violet",
      error: "red"
    }
  },

  runtimeConfig: {
    session: {
      password: "",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    }
  },

  features: {
    inlineStyles: false
  },

  experimental: {
    typedPages: true
  },

  compatibilityDate: "2026-03-07",

  nitro: {
    prerender: {
      autoSubfolderIndex: false,
      crawlLinks: false,
      routes: ["/sitemap.xml"]
    },
    cloudflare: {
      pages: {
        routes: {
          exclude: ["/images/*"]
        }
      }
    },
    experimental: {
      tasks: true
    }
  },

  hub: {
    /*
    db: {
      dialect: "sqlite",
      casing: "snake_case"
    },
    cache: true
    */
  },

  eslint: {
    config: {
      autoInit: false,
      stylistic: true
    }
  },

  fonts: {
    families: [
      { name: "Space Grotesk", weights: [400, 500, 600], display: "swap" },
      { name: "Fraunces", weights: [600], display: "swap" }
    ]
  },

  icon: {
    mode: "svg",
    provider: "none",
    clientBundle: { icons },
    customCollections: [
      { prefix: "custom", dir: "./app/assets/icons" }
    ]
  },

  sitemap: {
    discoverImages: false,
    defaults: { priority: 0.8, lastmod: new Date().toISOString() },
    urls: [
      { loc: "/", priority: 1 }
    ],
    xslColumns: [
      { label: "URL", width: "65%" },
      { label: "Priority", select: "sitemap:priority", width: "12.5%" },
      { label: "Last Modified", select: "sitemap:lastmod", width: "35%" }
    ],
    zeroRuntime: true
  }
});
