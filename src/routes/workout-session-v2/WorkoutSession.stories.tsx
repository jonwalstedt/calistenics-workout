import type { Meta, StoryObj } from '@storybook/react';
import { WorkoutSession } from './WorkoutSession';
import { workout } from './mocks';
import { fn } from '@storybook/test';

const meta = {
  component: WorkoutSession,
} satisfies Meta<typeof WorkoutSession>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    workout,
    onWorkoutComplete: fn(),
  },
};
