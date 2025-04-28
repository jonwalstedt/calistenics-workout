import type { Meta, StoryObj } from '@storybook/react';

import { DonutTimer } from './DonutTimer';

const meta = {
  component: DonutTimer,
} satisfies Meta<typeof DonutTimer>;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    duration: 10,
    timeLeft: 5,
    isPaused: false,
    labelText: 'Jump Squats',
  },
};

export const Paused: Story = {
  args: {
    duration: 10,
    timeLeft: 5,
    isPaused: true,
    labelText: 'Jump Squats',
  },
};

export default meta;
