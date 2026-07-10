// @ts-check
import { defineConfig, envField } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import buildCleanup from './src/lib/build-hook.ts';

// https://astro.build/config
export default defineConfig({
  site: 'https://zatsit.fr',

  compressHTML: true,

  prefetch: {
    defaultStrategy: 'viewport',
  },

  integrations: [buildCleanup()],

  vite: {
    plugins: [tailwindcss()]
  },

  env: {
    schema: {
      SITE_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://zatsit.fr',
      }),
      BLOG_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://blog.zatsit.fr',
      }),
      LINKEDIN_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://www.linkedin.com/company/zatsit/',
      }),
      GITHUB_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://github.com/zatsit-oss',
      }),
      SUSTAINABILITY_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://sustainability.zatsit.fr/',
      }),
      CONTACT_FORM_URL: envField.string({
        access: 'public',
        context: 'server',
        default: 'https://docs.google.com/forms/d/e/1FAIpQLSemLxDWYfx03obnU_HG3vvDGBfY8nmu6TjNKYgZJowO8JHjUg/viewform?embedded=true',
      }),
      ETI_RAPPORT_URL: envField.string({
        access: 'public',
        context: 'client',
        default: 'https://drive.google.com/file/d/1GH_k0mGmr8o_5WQfaDKkcQH-5Q48SQVY/view?usp=sharing',
      }),
      DISABLED_PAGES: envField.string({
        access: 'public',
        context: 'server',
        default: '',
      }),
    },
  },
});