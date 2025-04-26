import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ExerciseScreen } from './ExerciseScreen';
import { WorkoutState } from '../interfaces';
import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { workout } from '../mocks';
import { ThemeProvider } from '../../../context';

const TestComponent = ({
  children,
}: {
  children: (
    workoutState: WorkoutState,
    setWorkoutState: Dispatch<SetStateAction<WorkoutState>>
  ) => ReactNode;
}) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(
    WorkoutState.EXERCISE
  );
  return <div>{children(workoutState, setWorkoutState)}</div>;
};

const meta = {
  component: ExerciseScreen,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ExerciseScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    return (
      <TestComponent>
        {(workoutState, setWorkoutState) => (
          <ExerciseScreen
            {...args}
            workoutState={workoutState}
            setWorkoutState={setWorkoutState}
          />
        )}
      </TestComponent>
    );
  },
  args: {
    currentExercise: workout.exercises[0],
    restDuration: 5,
    workoutState: WorkoutState.EXERCISE,
    setWorkoutState: fn(),
    goToNextExercise: fn(),
  },
};
