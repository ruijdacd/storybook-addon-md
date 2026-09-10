import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import type { MarkdownOptions } from 'storybook-addon-md';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../components/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    {
      name: 'storybook-addon-md',
      options: {
        patterns: ['docs/**/*.md', 'components/**/*.md', '!docs/drafts/**'],
        generatedDir: 'example-markdown-generated',
        stylesheet: '.storybook/markdown.css',
      } satisfies MarkdownOptions,
    },
  ],
  typescript: { reactDocgen: 'react-docgen-typescript' },

  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tailwindcss()],
  }),
};

export default config;
