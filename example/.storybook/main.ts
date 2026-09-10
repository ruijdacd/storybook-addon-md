import tailwindcss from '@tailwindcss/vite';
import type { StorybookConfig } from '@storybook/react-vite';
import type { MarkdownOptions } from 'storybook-addon-md';

export const markdownOptions = {
  patterns: ['docs/**/*.md', 'components/**/*.md', '!docs/drafts/**'],
  generatedDir: 'example-markdown-generated',
  stylesheet: '.storybook/markdown.css',
} satisfies MarkdownOptions;

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../components/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    {
      name: 'storybook-addon-md',
      options: markdownOptions,
    },
  ],
  typescript: { reactDocgen: 'react-docgen-typescript' },

  viteFinal: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tailwindcss()],
  }),
};

export default config;
