import { Button, Heading } from '@radix-ui/themes';
import type { Exercise } from '../../../hooks/useWorkoutSchedule';
import { ExerciseCard } from '../../../components/workout';
import styles from '../WorkoutSession.module.css';

interface WorkoutReadyScreenProps {
  nextExercise: Exercise | null;
  onStartNextExercise: () => void;
}

export function WorkoutReadyScreen({
  nextExercise,
  onStartNextExercise,
}: WorkoutReadyScreenProps) {
  if (!nextExercise) return null;

  return (
    <div className={styles.readyScreen}>
      <Heading as="h2" size="5" className={styles.readyHeading}>
        Get Ready For
      </Heading>

      <ExerciseCard exercise={nextExercise} isActive />

      <Button
        size="4"
        onClick={onStartNextExercise}
        className={styles.startNextButton}
      >
        Start Exercise
      </Button>
    </div>
  );
} 