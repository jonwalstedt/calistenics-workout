import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { RestScreen } from './RestScreen';
import { workout } from '../mocks';

const [warmup1, ...rest] = workout.exercises;
const w1 = { ...warmup1, restDuration: 10 };

const restExample = { ...workout, exercises: [w1, ...rest] };

const meta = {
  component: RestScreen,
} satisfies Meta<typeof RestScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    autostartCountdown: true,
    upcomingExercise: restExample.exercises[1],
    restDuration: 5,
    goToNextExercise: fn(),
  },
};
