import './tailwind.css';
import { SystemDocsContainer } from './SystemDocsContainer';
import type { Preview } from '@storybook/react-vite';

const preview: Preview = {
  parameters: {
    options: {
      storySort: { method: 'alphabetical', order: ['Guides', 'Components'], includeNames: false },
    },
    docs: { container: SystemDocsContainer },
  },
};

export default preview;
