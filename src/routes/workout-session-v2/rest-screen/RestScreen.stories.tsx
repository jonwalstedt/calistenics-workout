import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { RestScreen } from './RestScreen';
import { WorkoutState } from '../interfaces';
import { workout, TestComponent } from '../mocks';

const [warmup1, ...rest] = workout.exercises;
const w1 = { ...warmup1, restDuration: 10 };

const restExample = { ...workout, exercises: [w1, ...rest] };

const meta = {
  component: RestScreen,
} satisfies Meta<typeof RestScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <TestComponent initialWorkoutState={WorkoutState.REST}>
        {({
          workoutState,
          currentExerciseIndex,
          setWorkoutState,
          setCurrentExerciseIndex,
        }) => (
          <RestScreen
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
    workout: restExample,
    workoutState: WorkoutState.REST,
    currentExerciseIndex: 0,
    setWorkoutState: fn(),
    setCurrentExerciseIndex: fn(),
  },
};
