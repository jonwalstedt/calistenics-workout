import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTimer } from '../../../hooks/useTimer';
import { WorkoutState, ExerciseState } from '../interfaces';
import { Exercise } from '../../../types';

// TODO SHARE INTERFACES across screens
interface UseExerciseStateProps {
  currentExercise: Exercise | null;
  workoutState: WorkoutState;
  setWorkoutState: Dispatch<SetStateAction<WorkoutState>>;
  restDuration: number | null;
  goToNextExercise: () => void;
}

export function useExerciseState({
  currentExercise,
  workoutState,
  restDuration,
  setWorkoutState,
  goToNextExercise,
}: UseExerciseStateProps) {
  const exerciseDuration = currentExercise?.duration || 0;
  const [exerciseState, setExerciseState] = useState<ExerciseState>(
    ExerciseState.IDLE
  );

  const repetitions = currentExercise?.repetitions;

  const shouldRest = Boolean(restDuration && restDuration > 0);

  const { timeLeft, isTimerPaused, togglePause, resetTimer } = useTimer({
    initialTime: exerciseDuration,
    isActive: exerciseState === ExerciseState.STARTED,
    onComplete: () => {
      goToNextExercise();
    },
  });

  useEffect(() => {
    if (!currentExercise) {
      return;
    }
    resetTimer(currentExercise.duration);
  }, [currentExercise, resetTimer]);

  const handleStartExercise = () => {
    switch (exerciseState) {
      case ExerciseState.IDLE: {
        if (repetitions && repetitions > 0) {
          setExerciseState(ExerciseState.STARTED);
        } else {
          setExerciseState(ExerciseState.STARTED);
          resetTimer(exerciseDuration);
        }
        break;
      }
      case ExerciseState.STARTED:
        if (repetitions && repetitions > 0) {
          if (shouldRest && workoutState === WorkoutState.EXERCISE) {
            setWorkoutState(WorkoutState.REST);
            return;
          }
          goToNextExercise();
        } else {
          setExerciseState(ExerciseState.PAUSED);
          togglePause();
        }
        break;
      case ExerciseState.PAUSED:
        setExerciseState(ExerciseState.STARTED);
        togglePause();
        break;
      default:
        break;
    }
  };

  return {
    exerciseState,
    currentExercise,
    timeLeft,
    isTimerPaused,
    togglePause,
    resetTimer,
    handleStartExercise,
    restDuration,
  };
}
