import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: { label: 'Continue' },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { label: 'Cancel', variant: 'secondary' } };

export const Disabled: Story = { args: { label: 'Unavailable', disabled: true } };

export const Danger: Story = { args: { label: 'Delete branch', variant: 'danger' } };

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button label="Small" size="small" variant="secondary" />
      <Button label="Medium" size="medium" variant="secondary" />
      <Button label="Large" size="large" variant="secondary" />
    </div>
  ),
};
