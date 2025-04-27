import { useEffect, useState } from 'react';
import { useTimer } from '../../../hooks/useTimer';
import { ExerciseState } from '../interfaces';
import { Exercise } from '../../../types';

interface UseWarmupExerciseStateProps {
  currentExercise: Exercise | null;
  goToNextExercise: () => void;
}

export function useWarmupExerciseState({
  currentExercise,
  goToNextExercise,
}: UseWarmupExerciseStateProps) {
  const exerciseDuration = currentExercise?.duration || 0;
  const [exerciseState, setExerciseState] = useState<ExerciseState>(
    ExerciseState.IDLE
  );
  const { timeLeft, isTimerPaused, togglePause, resetTimer } = useTimer({
    initialTime: exerciseDuration,
    isActive: exerciseState === ExerciseState.STARTED,
    onComplete: () => {
      goToNextExercise();
    },
  });

  // Reset timer when currentExercise changes
  useEffect(() => {
    if (!currentExercise) {
      return;
    }
    resetTimer(currentExercise.duration);
  }, [currentExercise, resetTimer]);

  const handleStartExercise = () => {
    switch (exerciseState) {
      case ExerciseState.IDLE:
        setExerciseState(ExerciseState.STARTED);
        resetTimer(exerciseDuration);
        break;
      case ExerciseState.STARTED:
        setExerciseState(ExerciseState.PAUSED);
        togglePause();
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
    timeLeft,
    isTimerPaused,
    handleStartExercise,
  };
}
