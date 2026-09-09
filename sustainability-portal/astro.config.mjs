import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import relativeLinks from "astro-relative-links";

export default defineConfig({
  // Required for canonical URLs, Open Graph and the sitemap: without it every
  // one of those is relative, which JSON-LD rejects outright. Read from the
  // environment like corporate does, so a preview build can override it.
  site: process.env.SITE_URL || 'https://sustainability.zatsit.fr',

  compressHTML: true,

  // Keeps emitted hrefs relative so the site survives being served from a
  // Firebase preview channel. It rewrites markup attributes only, so the
  // absolute URLs BaseHead builds from `site` are unaffected.
  integrations: [relativeLinks()],

  // Tailwind v4 is a Vite plugin, as on corporate. The stylesheet that declares
  // the design tokens is imported by the layout, not by an integration.
  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      SITE_URL: envField.string({
        access: "public",
        context: "client",
        default: "https://sustainability.zatsit.fr",
      }),
      ZATSIT_WEBSITE_URL: envField.string({
        required: true,
        access: "public",
        context: "client",
        default: "https://zatsit.fr",
      }),
      BLOG_URL: envField.string({
        required: true,
        access: "public",
        context: "client",
        default: "https://blog.zatsit.fr",
      }),
      LINKEDIN_URL: envField.string({
        required: true,
        access: "public",
        context: "client",
        default: "https://www.linkedin.com/company/zatsit/",
      }),
      GITHUB_URL: envField.string({
        required: true,
        access: "public",
        context: "client",
        default: "https://github.com/zatsit-oss",
      }),
    },
  },
});
