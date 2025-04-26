import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WarmupScreen } from './WarmupScreen';
import { workout } from '../mocks';

const meta = {
  component: WarmupScreen,
} satisfies Meta<typeof WarmupScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentExercise: workout.exercises[0],
    goToNextExercise: fn(),
  },
};
