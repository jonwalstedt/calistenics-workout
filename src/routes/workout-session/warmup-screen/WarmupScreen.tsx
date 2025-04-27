import { Text, Button } from '@radix-ui/themes';
import { Exercise } from '../../../types';
import { ExerciseCard } from '../../../components/workout';
import { DonutTimer } from '../../../components/timer';
import { ExerciseState } from '../interfaces';
import { useWarmupExerciseState } from './useWarmupExerciseState';
import styles from './WarmupScreen.module.css';

interface WarmupProps {
  currentExercise: Exercise | null;
  goToNextExercise: () => void;
}

export function WarmupScreen({
  currentExercise,
  goToNextExercise,
}: WarmupProps) {
  const { timeLeft, exerciseState, isTimerPaused, handleStartExercise } =
    useWarmupExerciseState({
      currentExercise,
      goToNextExercise,
    });

  const duration = currentExercise?.duration || 0;

  if (!currentExercise) {
    return <div>Could not find exercise</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.warmupIndicator}>
        <Text as="p" size="2" color="blue">
          Warmup Phase
        </Text>
      </div>

      <ExerciseCard exercise={currentExercise} isActive />

      {duration && (
        <DonutTimer
          duration={duration}
          timeLeft={timeLeft}
          isPaused={isTimerPaused}
          size="large"
          color="default"
        />
      )}

      <Button onClick={handleStartExercise}>
        {exerciseState === ExerciseState.IDLE ||
        exerciseState === ExerciseState.PAUSED
          ? 'Start warmup'
          : 'Pause warmup'}
      </Button>
    </div>
  );
}
