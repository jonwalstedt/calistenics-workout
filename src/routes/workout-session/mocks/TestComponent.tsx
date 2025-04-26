import { Dispatch, ReactNode, SetStateAction, useState } from 'react';
import { WorkoutState } from '../interfaces';

export const TestComponent = ({
  initialWorkoutState = WorkoutState.WARMUP,
  children,
}: {
  initialWorkoutState?: WorkoutState;
  children: (props: {
    workoutState: WorkoutState;
    currentExerciseIndex: number;
    setCurrentExerciseIndex: Dispatch<SetStateAction<number>>;
    setWorkoutState: Dispatch<SetStateAction<WorkoutState>>;
  }) => ReactNode;
}) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [workoutState, setWorkoutState] =
    useState<WorkoutState>(initialWorkoutState);
  return (
    <div>
      {children({
        workoutState,
        setWorkoutState,
        currentExerciseIndex,
        setCurrentExerciseIndex,
      })}
    </div>
  );
};
