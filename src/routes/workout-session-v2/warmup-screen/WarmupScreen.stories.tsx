import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { WarmupScreen } from './WarmupScreen';
import { WorkoutState } from '../interfaces';
import { TestComponent, workout } from '../mocks';

const meta = {
  component: WarmupScreen,
} satisfies Meta<typeof WarmupScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <TestComponent>
        {({
          workoutState,
          currentExerciseIndex,
          setWorkoutState,
          setCurrentExerciseIndex,
        }) => (
          <WarmupScreen
            {...args}
            workoutState={workoutState}
            setWorkoutState={setWorkoutState}
            currentExerciseIndex={currentExerciseIndex}
            setCurrentExerciseIndex={setCurrentExerciseIndex}
          />
        )}
      </TestComponent>
    );
  },
  args: {
    workout,
    workoutState: WorkoutState.WARMUP,
    currentExerciseIndex: 0,
    setWorkoutState: fn(),
    setCurrentExerciseIndex: fn(),
  },
};
