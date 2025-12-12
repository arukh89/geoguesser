import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  stories: [
    '../src/**/*.stories.@(ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@chromatic-com/storybook'
  ],
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias as Record<string, string>),
      '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src'),
    };

    // Silence Vite warnings about Next.js "use client/server" directives by stripping them in Storybook build only
    const stripUseDirectives = {
      name: 'strip-use-directives',
      enforce: 'pre' as const,
      transform(code: string) {
        // remove standalone lines like '"use client";' or '\'use server\';'
        const replaced = code.replace(/(^|\n)\s*(["'])use (client|server)\2;?/g, '$1');
        return { code: replaced, map: null };
      },
    };

    // Ensure plugins array exists and push our transform
    // @ts-expect-error — Storybook supplies Vite config shape
    config.plugins = [...(config.plugins ?? []), stripUseDirectives];

    // Avoid sourcemap noise in Storybook production builds and raise chunk size limit to avoid false warnings
    // @ts-expect-error — Storybook merges build options
    config.build = {
      ...(config.build ?? {}),
      sourcemap: false,
      chunkSizeWarningLimit: 2048,
    };
    return config;
  },
};

export default config;
