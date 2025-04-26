import { useState, useCallback, useMemo } from 'react';
import type { WorkoutDay, Exercise } from '../../../hooks/useWorkoutSchedule';
import { WorkoutState } from '../interfaces';

// Define ExerciseWithMeta here since it's not exported from interfaces
interface ExerciseWithMeta extends Exercise {
  isWarmup: boolean;
  index: number; // Original index in its array
}

interface UseWarmupProgressProps {
  workout: WorkoutDay | null;
  setWorkoutState: (state: WorkoutState) => void;
  onWarmupComplete: () => number | null; // Callback to start main exercises
}

export function useWarmupProgress({
  workout,
  setWorkoutState,
  onWarmupComplete,
}: UseWarmupProgressProps) {
  // Track current warmup exercise index
  const [currentWarmupIndex, setCurrentWarmupIndex] = useState(0);

  console.log('currentWarmupIndex:', currentWarmupIndex);

  // Create array of warmup exercises with metadata
  const warmupExercises = useMemo(() => {
    if (!workout) return [];

    // Create combined array with metadata
    return workout.warmup.map((exercise, index) => ({
      ...exercise,
      isWarmup: true,
      index,
    }));
  }, [workout]);

  // Get the total number of warmup exercises
  const totalWarmupExercises = useMemo(() => {
    return workout?.warmup.length || 0;
  }, [workout]);

  // Calculate warmup progress percentage
  const getWarmupProgress = useCallback(() => {
    if (!workout || totalWarmupExercises === 0) {
      return 0;
    }

    const progressPercentage = Math.floor(
      (currentWarmupIndex / totalWarmupExercises) * 100
    );
    console.log(
      `Warmup progress: ${currentWarmupIndex + 1}/${totalWarmupExercises} = ${progressPercentage}%`
    );

    // Ensure we never return more than 100%
    return Math.min(progressPercentage, 100);
  }, [workout, currentWarmupIndex, totalWarmupExercises]);

  // Get the current warmup exercise
  const getCurrentWarmupExercise = useCallback((): ExerciseWithMeta | null => {
    if (
      warmupExercises.length === 0 ||
      currentWarmupIndex >= warmupExercises.length
    ) {
      return null;
    }
    return warmupExercises[currentWarmupIndex];
  }, [warmupExercises, currentWarmupIndex]);

  // Move to the next warmup exercise
  const moveToNextWarmupExercise = useCallback(() => {
    if (!workout || warmupExercises.length === 0) return null;

    // Calculate the next exercise index
    const nextIndex = currentWarmupIndex + 1;

    // If we've reached the end of warmups, start main exercises
    if (nextIndex >= totalWarmupExercises) {
      console.log('Warmup complete, starting main exercises');
      return onWarmupComplete();
    }

    // Otherwise move to the next warmup exercise
    setCurrentWarmupIndex(nextIndex);
    console.log(
      `Moving to next warmup exercise: ${nextIndex + 1}/${totalWarmupExercises}`
    );

    // Return the duration for the timer
    return warmupExercises[nextIndex]?.duration || null;
  }, [
    workout,
    warmupExercises,
    currentWarmupIndex,
    totalWarmupExercises,
    onWarmupComplete,
  ]);

  // Start the warmup
  const startWarmup = useCallback(() => {
    if (!workout || warmupExercises.length === 0) {
      // If no warmup exercises, skip to main
      console.log('No warmup exercises, skipping to main');
      return onWarmupComplete();
    }

    // Set state to WARMUP and start with first warmup exercise
    setWorkoutState(WorkoutState.WARMUP);
    setCurrentWarmupIndex(0);
    console.log('Starting warmup: 1/' + totalWarmupExercises);

    // Return duration for timer setup
    return warmupExercises[0]?.duration || null;
  }, [
    workout,
    warmupExercises,
    totalWarmupExercises,
    setWorkoutState,
    onWarmupComplete,
  ]);

  return {
    currentWarmupIndex,
    totalWarmupExercises,
    warmupProgress: getWarmupProgress(),
    currentWarmupExercise: getCurrentWarmupExercise(),
    startWarmup,
    moveToNextWarmupExercise,
  };
}
