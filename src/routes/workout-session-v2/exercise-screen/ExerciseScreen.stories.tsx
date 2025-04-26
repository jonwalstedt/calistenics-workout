import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ExerciseScreen } from './ExerciseScreen';
import { WorkoutState } from '../interfaces';
import { ReactNode, useState } from 'react';
import { workout } from '../mocks';

const TestComponent = ({
  children,
}: {
  children: (workoutState: any, setWorkoutState: any) => ReactNode;
}) => {
  const [workoutState, setWorkoutState] = useState<WorkoutState>(
    WorkoutState.EXERCISE
  );
  return <div>{children(workoutState, setWorkoutState)}</div>;
};

const meta = {
  component: ExerciseScreen,
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
    workout,
    workoutState: WorkoutState.EXERCISE,
    setWorkoutState: fn(),
  },
};
