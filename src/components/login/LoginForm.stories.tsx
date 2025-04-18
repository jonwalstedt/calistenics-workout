import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { LoginForm } from './LoginForm';

const meta = {
  component: LoginForm,
} satisfies Meta<typeof LoginForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onSubmit: fn() },
};
