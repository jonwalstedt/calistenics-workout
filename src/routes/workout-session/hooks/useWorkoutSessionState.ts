import { useState } from 'react';
import { WorkoutState } from '../interfaces';
import { EXERCISE, WorkoutDay } from '../../../types';

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

  const exercises = workout?.exercises ?? [];
  const warmupExercises = exercises.filter(
    (exercise) => exercise.type === 'warmup'
  );
  const exercisesWithoutWarmup = exercises.filter(
    (exercise) => exercise.type !== 'warmup'
  );
  const maxRounds = workout?.repeats ?? 1;

  const currentRoundExercises =
    currentRound === 1 ? exercises : exercisesWithoutWarmup;
  const currentExercise =
    currentRoundExercises[progress.currentRoundExerciseIndex] ?? null;

  let upcomingExercise =
    currentRoundExercises[progress.currentRoundExerciseIndex + 1] ?? null;
  if (
    currentRound < maxRounds &&
    progress.currentRoundExerciseIndex === currentRoundExercises.length - 1
  ) {
    upcomingExercise = exercisesWithoutWarmup[0] ?? null;
  }

  const baseRestDuration = workout?.restDuration ?? null;
  const restDuration = currentExercise?.restDuration ?? baseRestDuration;
  const shouldRest = restDuration != null && restDuration > 0;

  const totalNumberOfExercises =
    warmupExercises.length + exercisesWithoutWarmup.length * maxRounds;

  const totalProgress = Math.round(
    (progress.totalExerciseIndex / totalNumberOfExercises) * 100
  );

  const warmupProgress = Math.round(
    (progress.totalExerciseIndex / warmupExercises.length) * 100
  );

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
    workoutState,
    setWorkoutState,
    currentExercise,
    upcomingExercise,
    currentRoundExercises,
    goToNextExercise,
    warmupExercises,
    exercisesWithoutWarmup,
    currentRound,
    totalNumberOfExercises,
    maxRounds,
    progress,
    totalProgress,
    warmupProgress,
  };
};
