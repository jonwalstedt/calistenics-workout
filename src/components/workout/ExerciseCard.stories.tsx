import type { Meta, StoryObj } from '@storybook/react';
import jumSquats from '../../assets/jump-squats.png';

import { ExerciseCard } from './ExerciseCard';
import { Exercise, EXERCISE } from '../../types';

const exercise: Exercise = {
  name: 'Jump Squats',
  description: 'A powerful squat jump to increase heart rate.',
  duration: 30,
  image: jumSquats,
  repetitions: null,
  type: EXERCISE,
};

const meta = {
  component: ExerciseCard,
} satisfies Meta<typeof ExerciseCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    exercise,
  },
};
