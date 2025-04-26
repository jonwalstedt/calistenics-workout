import { useState, useCallback, useMemo } from 'react';
import type { WorkoutDay, Exercise } from '../../../hooks/useWorkoutSchedule';
import { WorkoutState } from '../interfaces';

// Define ExerciseWithMeta here since it's not exported from interfaces
interface ExerciseWithMeta extends Exercise {
  isWarmup: boolean;
  index: number; // Original index in its array
}

interface UseExerciseProgressProps {
  workout: WorkoutDay | null;
  setWorkoutState: (state: WorkoutState) => void;
  completeWorkout: () => void;
}

export function useExerciseProgress({
  workout,
  setWorkoutState,
  completeWorkout,
}: UseExerciseProgressProps) {
  // Track current exercise in the unified array
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [nextExerciseInfo, setNextExerciseInfo] = useState<{
    index: number;
    round: number;
  } | null>(null);

  // Create an array of main exercises with metadata
  const mainExercises = useMemo(() => {
    if (!workout) return [];

    return workout.exercises.map((exercise, index) => ({
      ...exercise,
      isWarmup: false,
      index,
    }));
  }, [workout]);

  // Get the total number of exercises per round
  const exercisesPerRound = useMemo(() => {
    return workout?.exercises.length || 0;
  }, [workout]);

  // Calculate total progress percentage
  const getTotalProgress = useCallback(() => {
    if (!workout || exercisesPerRound === 0) {
      console.log('Progress calculation: No workout or no exercises per round');
      return 0;
    }

    const totalExercisesToComplete = exercisesPerRound * workout.repeats;

    // Calculate completed exercises
    const completedExercises =
      (currentRound - 1) * exercisesPerRound + currentExerciseIndex;

    // Calculate percentage (correctly dividing completed by total)
    const progressPercentage = Math.floor(
      (completedExercises / totalExercisesToComplete) * 100
    );

    // Ensure we never return more than 100%
    const cappedPercentage = Math.min(progressPercentage, 100);

    return cappedPercentage;
  }, [workout, currentExerciseIndex, currentRound, exercisesPerRound]);

  // Get the current exercise
  const getCurrentExercise = useCallback((): ExerciseWithMeta | null => {
    if (
      mainExercises.length === 0 ||
      currentExerciseIndex >= mainExercises.length
    ) {
      return null;
    }
    return mainExercises[currentExerciseIndex];
  }, [mainExercises, currentExerciseIndex]);

  // Get next exercise (for display in READY state)
  const getNextExercise = useCallback(() => {
    if (!workout || !nextExerciseInfo) return null;

    const { index, round } = nextExerciseInfo;

    // Check if we're past the last round
    if (round > workout.repeats) return null;

    return mainExercises[index];
  }, [workout, nextExerciseInfo, mainExercises]);

  // Get upcoming exercise during PAUSE state
  const getUpcomingExercise = useCallback((): ExerciseWithMeta | null => {
    if (!workout || mainExercises.length === 0) return null;

    // Find the next exercise index
    let nextIndex = currentExerciseIndex + 1;
    let nextRound = currentRound;

    // Check if we've completed all exercises in this round
    if (nextIndex >= exercisesPerRound) {
      // End of a round, move to next round
      nextIndex = 0; // Back to first exercise
      nextRound = currentRound + 1;

      // Check if we've completed all rounds
      if (nextRound > workout.repeats) {
        return null;
      }
    }

    return mainExercises[nextIndex];
  }, [
    workout,
    mainExercises,
    currentExerciseIndex,
    currentRound,
    exercisesPerRound,
  ]);

  // Start main exercises after warmup is complete
  const startMainExercises = useCallback(() => {
    if (!workout || mainExercises.length === 0) return null;

    // Start with the first exercise in the first round
    setWorkoutState(WorkoutState.EXERCISE);
    setCurrentExerciseIndex(0);
    setCurrentRound(1);

    // Return duration for timer setup
    return mainExercises[0]?.duration || null;
  }, [workout, mainExercises, setWorkoutState]);

  // Advance to the next exercise after pause or when skipping pause
  const advanceToNextExercise = useCallback(() => {
    if (!workout || !nextExerciseInfo) {
      console.log('Cannot advance - no workout or nextExerciseInfo');
      return null;
    }

    const { index, round } = nextExerciseInfo;

    // Special case - we've finished all exercises and rounds
    if (index === -1) {
      setWorkoutState(WorkoutState.COMPLETED);
      completeWorkout();
      return { action: 'complete_workout' };
    }

    // Move to the next exercise
    setCurrentExerciseIndex(index);
    setCurrentRound(round);

    // Set workout state to EXERCISE
    setWorkoutState(WorkoutState.EXERCISE);

    // Reset next exercise info
    setNextExerciseInfo(null);

    // Get exercise and its duration
    const exercise = mainExercises[index];
    const duration = exercise?.duration || null;

    // Return the duration for the next exercise
    return duration;
  }, [
    workout,
    nextExerciseInfo,
    mainExercises,
    setWorkoutState,
    completeWorkout,
  ]);

  // Move to the next exercise
  const moveToNextExercise = useCallback(() => {
    if (!workout || mainExercises.length === 0) return null;

    const current = mainExercises[currentExerciseIndex];

    // Handle pause after exercise if needed
    if (current.restDuration !== 0) {
      // Explicitly check for 0 to skip pause
      // Go to pause state
      setWorkoutState(WorkoutState.PAUSE);

      // Calculate the next exercise index
      let nextIndex = currentExerciseIndex + 1;
      let nextRound = currentRound;

      // Check if we're at the end of exercises in this round
      if (nextIndex >= exercisesPerRound) {
        nextIndex = 0; // Loop back to first exercise
        nextRound += 1; // Increment round
      }

      // Check if we've completed all rounds
      if (nextRound > workout.repeats) {
        // We've completed all rounds, move to completed state after the pause
        setNextExerciseInfo({
          index: -1, // Special value to indicate completion
          round: nextRound,
        });
      } else {
        // Set up info for the next exercise
        setNextExerciseInfo({ index: nextIndex, round: nextRound });
      }

      // Return the pause duration (use exercise-specific or workout default)
      const restDuration =
        current.restDuration !== undefined
          ? current.restDuration
          : workout.restDuration;

      return restDuration;
    }

    // No pause required, proceed to next exercise immediately
    return advanceToNextExercise();
  }, [
    workout,
    mainExercises,
    currentExerciseIndex,
    advanceToNextExercise,
    setWorkoutState,
    currentRound,
    exercisesPerRound,
  ]);

  // After pause, prepare for the next exercise
  const prepareForNextExercise = useCallback(() => {
    if (!workout || !nextExerciseInfo) {
      console.log(
        'Cannot prepare next exercise - no workout or nextExerciseInfo'
      );
      return null;
    }

    // Special case for workout completion
    if (nextExerciseInfo.index === -1) {
      return advanceToNextExercise(); // This will trigger workout completion
    }

    const nextExercise = mainExercises[nextExerciseInfo.index];

    // Check if we need to show the "get ready" screen
    if (nextExercise?.duration) {
      // For timed exercises, show the ready screen
      setWorkoutState(WorkoutState.READY);
      return { action: 'prepare_next' };
    }

    // For rep-based exercises, just proceed directly
    return advanceToNextExercise();
  }, [
    workout,
    nextExerciseInfo,
    mainExercises,
    setWorkoutState,
    advanceToNextExercise,
  ]);

  // Start the next exercise from the ready screen
  const startNextExercise = useCallback(() => {
    return advanceToNextExercise();
  }, [advanceToNextExercise]);

  return {
    currentRound,
    totalExercises: exercisesPerRound,
    totalRounds: workout?.repeats || 0,
    currentExerciseIndex,
    totalProgress: getTotalProgress(),
    currentExercise: getCurrentExercise(),
    nextExercise: getNextExercise(),
    upcomingExercise: getUpcomingExercise(),
    startMainExercises,
    startNextExercise,
    moveToNextExercise,
    prepareForNextExercise,
  };
}
