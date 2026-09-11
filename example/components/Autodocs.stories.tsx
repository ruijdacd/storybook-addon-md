import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Examples/Autodocs',
  component: Button,
  args: { label: 'Automatic example' },
} satisfies Meta<typeof Button>;

export default meta;
export const Primary: StoryObj<typeof meta> = {};
