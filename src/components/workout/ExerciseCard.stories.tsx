import type { Meta, StoryObj } from '@storybook/react';
import jumSquats from '../../assets/jump-squats.png';

import { ExerciseCard } from './ExerciseCard';

const exercise = {
  name: 'Jump Squats',
  description: 'A powerful squat jump to increase heart rate.',
  duration: 30,
  image: jumSquats,
  repetitions: null,
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
