import { defineConfig, envField } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import relativeLinks from "astro-relative-links";

export default defineConfig({
  compressHTML: true,

  integrations: [relativeLinks()],

  // Tailwind v4 is a Vite plugin, as on corporate. The stylesheet that declares
  // the design tokens is imported by the layout, not by an integration.
  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
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
