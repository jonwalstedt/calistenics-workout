import { useCallback } from 'react';
import { WorkoutState } from '../interfaces';

interface UseExerciseActionsProps {
  workoutState: WorkoutState;
  hasRepetitions: boolean;
  onWarmupNext: () => void;
  onExerciseNext: () => void;
  setTimerPaused: (isPaused: boolean) => void;
}

export function useExerciseActions({
  workoutState,
  hasRepetitions,
  onWarmupNext,
  onExerciseNext,
  setTimerPaused,
}: UseExerciseActionsProps) {
  // Skip timed exercise
  const handleSkip = useCallback(() => {
    if (workoutState === WorkoutState.WARMUP) {
      // Ensure we're not paused when skipping
      setTimerPaused(false);
      // Move to next warmup exercise
      onWarmupNext();
    } else if (workoutState === WorkoutState.EXERCISE) {
      // Ensure we're not paused when skipping
      setTimerPaused(false);
      // Move to next exercise
      onExerciseNext();
    }
  }, [workoutState, onWarmupNext, onExerciseNext, setTimerPaused]);

  // Complete repetition-based exercise
  const handleComplete = useCallback(() => {
    if (!hasRepetitions) return;

    if (workoutState === WorkoutState.WARMUP) {
      // Ensure we're not paused when completing
      setTimerPaused(false);
      // Move to next warmup exercise
      onWarmupNext();
    } else if (workoutState === WorkoutState.EXERCISE) {
      // Ensure we're not paused when completing
      setTimerPaused(false);
      // Move to next exercise
      onExerciseNext();
    }
  }, [
    workoutState,
    hasRepetitions,
    onWarmupNext,
    onExerciseNext,
    setTimerPaused,
  ]);

  return {
    handleSkip,
    handleComplete,
  };
}
