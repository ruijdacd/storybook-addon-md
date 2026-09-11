import type { StorybookConfig } from '@storybook/react-vite';
import type { MarkdownOptions } from 'storybook-addon-md';
import base, { markdownOptions } from '../.storybook/main';

const config: StorybookConfig = {
  ...base,
  docs: { defaultName: 'Reference' },
  features: { componentsManifest: true },
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
    {
      name: 'storybook-addon-md',
      options: { ...markdownOptions, manifests: true } satisfies MarkdownOptions,
    },
  ],
};

export default config;
