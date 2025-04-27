import { WorkoutDay } from '../../../types';

interface UseDerivedStatesProps {
  workout: WorkoutDay | null;
  progress: {
    currentRoundExerciseIndex: number;
    totalExerciseIndex: number;
  };
  currentRound: number;
}

export const useDerivedStates = ({
  workout,
  progress,
  currentRound,
}: UseDerivedStatesProps) => {
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

  return {
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
  };
};
