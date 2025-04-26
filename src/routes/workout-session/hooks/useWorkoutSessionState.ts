import { useState, useCallback, useEffect, useRef } from 'react';
import { useUser } from '../../../context';

import {
  useTimer,
  useAudio,
  useWorkoutLoader,
  useExerciseProgress,
  useWarmupProgress,
  useExerciseActions,
} from './';

import { WorkoutState } from '../interfaces';

// Helper types for action results
type ActionResult = { action: string; duration?: number | null };

export function useWorkoutSessionState() {
  const { addCompletedWorkout } = useUser();
  const [workoutState, setWorkoutState] = useState<WorkoutState>(
    WorkoutState.NOT_STARTED
  );

  // Load workout data
  const { workout } = useWorkoutLoader();

  // Audio controls
  const { isMuted, toggleMute } = useAudio();

  // Setup the main exercise progress tracking
  const {
    currentRound,
    totalExercises,
    totalRounds,
    currentExerciseIndex,
    totalProgress,
    currentExercise: mainExercise,
    nextExercise,
    upcomingExercise,
    startMainExercises,
    startNextExercise: progressStartNext,
    moveToNextExercise: moveToNextStep,
    prepareForNextExercise: progressPrepareNext,
  } = useExerciseProgress({
    workout,
    setWorkoutState,
    completeWorkout: () => workout && addCompletedWorkout(workout.day),
  });

  // Setup the warmup progress tracking
  const {
    currentWarmupIndex,
    totalWarmupExercises,
    warmupProgress,
    currentWarmupExercise,
    startWarmup,
    moveToNextWarmupExercise,
  } = useWarmupProgress({
    workout,
    setWorkoutState,
    onWarmupComplete: () => {
      // When warmup is complete, start the main exercises
      const duration = startMainExercises();
      console.log(
        `Warmup complete, starting main exercises with duration: ${duration}s`
      );
      return duration;
    },
  });

  // Determine the current exercise based on workout state
  const currentExercise =
    workoutState === WorkoutState.WARMUP ? currentWarmupExercise : mainExercise;

  // For backward compatibility with existing components
  const nextExerciseInfo = null;

  // Helper function to check if result is an action object
  const isActionResult = useCallback(
    (result: unknown): result is ActionResult => {
      return (
        result !== null &&
        typeof result === 'object' &&
        'action' in (result as Record<string, unknown>)
      );
    },
    []
  );

  // Determine if timer is active
  const isTimerActive = [
    WorkoutState.EXERCISE,
    WorkoutState.WARMUP,
    WorkoutState.PAUSE,
  ].includes(workoutState);

  // Create ref for timer completion function
  const timerCompleteRef = useRef(() => {});

  // Setup the timer
  const {
    timeLeft,
    isTimerPaused,
    togglePause: toggleTimerPause,
    resetTimer,
  } = useTimer({
    initialTime: null, // We'll set this based on the current exercise
    isActive: isTimerActive,
    onComplete: () => timerCompleteRef.current(),
    isPauseState: workoutState === WorkoutState.PAUSE,
  });

  // Define timer completion handler
  useEffect(() => {
    // Update the ref whenever dependencies change
    timerCompleteRef.current = () => {
      if (workoutState === WorkoutState.WARMUP) {
        // For warmup exercises, use the seamless transition without pause
        const duration = moveToNextWarmupExercise();
        if (typeof duration === 'number' || duration === null) {
          resetTimer(duration);
        }
      } else if (workoutState === WorkoutState.EXERCISE) {
        // For regular exercises, get the pause duration and reset timer
        const restDuration = moveToNextStep();
        if (typeof restDuration === 'number' && restDuration > 0) {
          console.log(`Setting pause timer to ${restDuration}s`);
          resetTimer(restDuration);
        }
      } else if (workoutState === WorkoutState.PAUSE) {
        progressPrepareNext();
      }
    };
  }, [
    workoutState,
    moveToNextWarmupExercise,
    moveToNextStep,
    progressPrepareNext,
    resetTimer,
  ]);

  // Handle exercise actions (skip, complete)
  const { handleSkip, handleComplete } = useExerciseActions({
    workoutState,
    hasRepetitions: !!currentExercise?.repetitions,
    onWarmupNext: () => {
      const duration = moveToNextWarmupExercise();
      if (typeof duration === 'number' || duration === null) {
        resetTimer(duration);
      }
    },
    onExerciseNext: () => {
      // For regular exercises, get the pause duration and reset timer
      const restDuration = moveToNextStep();
      if (typeof restDuration === 'number' && restDuration > 0) {
        console.log(
          `Setting pause timer to ${restDuration}s from skip/complete`
        );
        resetTimer(restDuration);
      }
    },
    setTimerPaused: (isPaused) => {
      if (isTimerPaused !== isPaused) toggleTimerPause();
    },
  });

  // Prepare next exercise - adapter that handles timer reset
  const prepareNextExercise = useCallback(() => {
    console.log('Preparing next exercise (from skip rest)');
    const result = progressPrepareNext();

    // If the result is a simple number or null, it's a duration
    if (typeof result === 'number') {
      console.log(`Setting timer to ${result}s from prepareNextExercise`);
      resetTimer(result);
      return;
    }

    // If the result is an action object
    if (isActionResult(result)) {
      if (result.action === 'prepare_next') {
        console.log('Ready screen will be shown (timed exercise)');
        // Ready screen is shown by the hook automatically by changing state
      } else if (result.action === 'complete_workout') {
        console.log('Workout completed');
        // Workout is already completed in the progress hook
      }
    }
  }, [progressPrepareNext, resetTimer, isActionResult]);

  // Start next exercise - adapter that handles timer reset
  const startNextExercise = useCallback(() => {
    console.log('Starting next exercise from ready screen');
    const duration = progressStartNext();
    if (typeof duration === 'number') {
      console.log(`Setting timer to ${duration}s for the exercise`);
      resetTimer(duration);
    } else if (duration === null) {
      console.log('No timer needed for this exercise (rep-based)');
      resetTimer(null);
    } else if (isActionResult(duration)) {
      console.log(
        `Action result from startNextExercise: ${JSON.stringify(duration)}`
      );
    }
  }, [progressStartNext, resetTimer, isActionResult]);

  // Start the workout - special case handling for initial start
  const handleStart = useCallback(() => {
    if (!workout) return;

    // Start with warmup exercises if available
    if (workout.warmup && workout.warmup.length > 0) {
      const duration = startWarmup();
      console.log(`Starting workout with warmup, duration: ${duration}s`);
      resetTimer(duration);
    } else {
      // No warmup exercises, start with regular exercises
      const duration = startMainExercises();
      console.log(
        `Starting workout with main exercises, duration: ${duration}s`
      );
      resetTimer(duration);
    }
  }, [workout, resetTimer, startWarmup, startMainExercises]);

  // Reset timer to current exercise duration if needed
  useEffect(() => {
    if (
      (workoutState === WorkoutState.EXERCISE ||
        workoutState === WorkoutState.WARMUP) &&
      currentExercise?.duration &&
      timeLeft === null
    ) {
      resetTimer(currentExercise.duration);
    }
  }, [workoutState, currentExercise, timeLeft, resetTimer]);

  return {
    // Workout information
    workout,
    workoutState,

    // Current exercise data
    currentExercise,
    nextExercise,
    upcomingExercise,

    // Progress information
    currentExerciseIndex,
    currentWarmupIndex,
    currentRound,
    totalProgress,
    totalExercises,
    totalRounds,
    totalWarmupExercises,
    warmupProgress,

    // Timer state
    timeLeft,
    isTimerPaused,
    isMuted,

    // Compatibility properties
    nextExerciseInfo,

    // Actions
    toggleTimerPause,
    toggleMute,
    handleStart,
    handleSkip,
    handleComplete,
    prepareNextExercise,
    startNextExercise,
  };
}
