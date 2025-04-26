import { Button } from '@radix-ui/themes';
import { Exercise } from '../../../types';
import { ExerciseCard } from '../../../components/workout';
import { DonutTimer } from '../../../components/timer';
import { WorkoutState, ExerciseState } from '../interfaces';
import { useExerciseState } from './useExerciseState';
import { Dispatch, SetStateAction } from 'react';
// import styles from './styles.module.css';

interface ExerciseProps {
  currentExercise: Exercise | null;
  restDuration: number | null;
  workoutState: WorkoutState;
  setWorkoutState: Dispatch<SetStateAction<WorkoutState>>;
  goToNextExercise: () => void;
}

export function ExerciseScreen({
  currentExercise,
  restDuration,
  workoutState,
  setWorkoutState,
  goToNextExercise,
}: ExerciseProps) {
  const { timeLeft, exerciseState, isTimerPaused, handleStartExercise } =
    useExerciseState({
      restDuration,
      workoutState,
      currentExercise,
      setWorkoutState,
      goToNextExercise,
    });

  const repetitions = currentExercise?.repetitions;
  let duration = currentExercise?.duration;
  if (workoutState === WorkoutState.REST && restDuration) {
    duration = restDuration;
  }

  let buttonText = 'Start exercise';
  if (exerciseState === ExerciseState.STARTED) {
    buttonText =
      repetitions && repetitions > 0 ? `Finish exercise` : 'Pause exercise';
  } else if (exerciseState === ExerciseState.PAUSED) {
    buttonText = 'Resume exercise';
  }

  if (!currentExercise) {
    return <div>Could not find exercise</div>;
  }

  return (
    <div>
      <ExerciseCard exercise={currentExercise} isActive />

      {duration && duration >= 0 && (
        <DonutTimer
          duration={duration}
          timeLeft={timeLeft}
          isPaused={isTimerPaused}
          size="large"
          color="default"
        />
      )}

      <Button onClick={handleStartExercise}>{buttonText}</Button>
    </div>
  );
}
