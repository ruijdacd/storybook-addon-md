import type { Meta, StoryObj } from '@storybook/react-vite';

import { Toggle } from './Toggle';

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  args: {
    label: 'Enable notifications',
    description: 'Get updates when someone mentions you or requests your review.',
  },
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    label: 'Security alerts',
    description: 'Required by your organization.',
    disabled: true,
    defaultChecked: true,
  },
};

export const Enabled: Story = {
  args: {
    label: 'Watch releases',
    description: 'Receive an update when a new version is published.',
    defaultChecked: true,
  },
};
