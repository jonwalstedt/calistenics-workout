import { useState } from 'react';
import { WorkoutState } from '../interfaces';
import { EXERCISE, WorkoutDay } from '../../../types';
import { useDerivedStates } from './useDerivedStates';

interface UseWorkoutSessionStateProps {
  workout: WorkoutDay | null;
  onWorkoutComplete: () => void;
}

export const useWorkoutSessionState = ({
  workout,
  onWorkoutComplete,
}: UseWorkoutSessionStateProps) => {
  const [progress, setProgress] = useState({
    currentRoundExerciseIndex: 0,
    totalExerciseIndex: 0,
  });

  const [workoutState, setWorkoutState] = useState(WorkoutState.WARMUP);
  const [currentRound, setCurrentRound] = useState(1);

  const {
    currentExercise,
    upcomingExercise,
    currentRoundExercises,
    warmupExercises,
    exercisesWithoutWarmup,
    maxRounds,
    totalNumberOfExercises,
    restDuration,
    shouldRest,
    totalProgress,
    warmupProgress,
  } = useDerivedStates({
    workout,
    progress,
    currentRound,
  });

  const goToNextRound = () => {
    setCurrentRound((prev) => prev + 1);
    setWorkoutState(WorkoutState.EXERCISE);
  };

  const goToNextExercise = () => {
    if (
      shouldRest &&
      (workoutState === WorkoutState.EXERCISE ||
        workoutState === WorkoutState.WARMUP)
    ) {
      setWorkoutState(WorkoutState.REST);
      return;
    }

    setProgress((prev) => {
      const nextExerciseIndex = prev.currentRoundExerciseIndex + 1;

      if (nextExerciseIndex >= currentRoundExercises.length) {
        if (currentRound < maxRounds) {
          goToNextRound();
          return {
            currentRoundExerciseIndex: 0,
            totalExerciseIndex: prev.totalExerciseIndex + 1,
          };
        }

        // FINAL exercise completed
        onWorkoutComplete();
        setWorkoutState(WorkoutState.FINISHED);

        return {
          currentRoundExerciseIndex: prev.currentRoundExerciseIndex,
          totalExerciseIndex: prev.totalExerciseIndex + 1,
        };
      }

      const nextExercise = currentRoundExercises[nextExerciseIndex];

      setWorkoutState(
        nextExercise?.type === EXERCISE
          ? WorkoutState.EXERCISE
          : WorkoutState.WARMUP
      );

      return {
        currentRoundExerciseIndex: nextExerciseIndex,
        totalExerciseIndex: prev.totalExerciseIndex + 1,
      };
    });
  };

  return {
    currentExercise,
    currentRound,
    currentRoundExercises,
    exercisesWithoutWarmup,
    goToNextExercise,
    maxRounds,
    progress,
    restDuration,
    setWorkoutState,
    totalNumberOfExercises,
    totalProgress,
    upcomingExercise,
    warmupExercises,
    warmupProgress,
    workoutState,
  };
};
