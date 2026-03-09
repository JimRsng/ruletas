import type { ModuleOptions as NuxtUIModuleOptions } from "@nuxt/ui";
import { addTemplate, defineNuxtModule } from "nuxt/kit";
import colors from "tailwindcss/colors";

type Color = "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | "error" | (string & {});
type CustomColorOptions = Partial<Record<Color, keyof typeof colors>>;

interface ModuleOptions extends NuxtUIModuleOptions {
  colors?: CustomColorOptions;
}

declare module "@nuxt/schema" {
  interface NuxtConfig {
    ui?: ModuleOptions;
  }
}

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function getColor (color: keyof typeof colors, shade: typeof shades[number]): string {
  if (color in colors && typeof colors[color] === "object" && shade in colors[color]) {
    return colors[color][shade] as string;
  }
  return "";
}

function generateShades (key: string, value: string, prefix?: string) {
  const prefixStr = prefix ? `${prefix}-` : "";
  return `${shades.map(shade => `--ui-color-${key}-${shade}: var(--${prefixStr}color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value as keyof typeof colors, shade)});`).join("\n  ")}`;
}
function generateColor (key: string, shade: number) {
  return `--ui-${key}: var(--ui-color-${key}-${shade});`;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "nuxt-ui-colors",
    configKey: "ui"
  },
  hooks: {
    "app:resolve" (app) {
      app.plugins = app.plugins.filter(p => !p.src.includes("@nuxt/ui/dist/runtime/plugins/colors"));
    }
  },
  async setup (options, nuxt) {
    const config = options.colors ?? {};
    const { ...colors } = config;
    const prefix = options.theme?.prefix;
    const content = `@layer theme {
  :root, :host {
  ${Object.entries(colors).map(([key, value]) => generateShades(key, value as string, prefix)).join("\n  ")}
  }
  :root, :host, .light {
  ${Object.keys(colors).map(key => generateColor(key, 500)).join("\n  ")}
  }
  .dark {
  ${Object.keys(colors).map(key => generateColor(key, 400)).join("\n  ")}
  }
}`;

    const colorsFile = addTemplate({
      filename: "nuxt-ui-colors.css",
      write: true,
      getContents: () => content
    });

    if (colorsFile.dst) {
      nuxt.options.css ||= [];
      nuxt.options.css.push(colorsFile.dst);
    }
  }
});
