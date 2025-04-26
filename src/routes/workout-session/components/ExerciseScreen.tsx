import { Link } from 'react-router-dom';
import { Button, Flex, Text } from '@radix-ui/themes';
import type { Exercise } from '../../../hooks/useWorkoutSchedule';
import { DonutTimer } from '../../../components/timer';
import { ExerciseCard } from '../../../components/workout';
import styles from '../WorkoutSession.module.css';

interface ExerciseScreenProps {
  exercise: Exercise;
  isWarmup?: boolean;
  isTimerPaused: boolean;
  timeLeft: number | null;
  onTogglePause: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export function ExerciseScreen({
  exercise,
  isWarmup = false,
  isTimerPaused,
  timeLeft,
  onTogglePause,
  onSkip,
  onComplete,
}: ExerciseScreenProps) {
  return (
    <div className={styles.exerciseScreen}>
      {/* Special warmup header if this is a warmup exercise */}
      {isWarmup && (
        <div className={styles.warmupIndicator}>
          <Text as="p" size="2" color="blue">
            Warmup Phase
          </Text>
        </div>
      )}

      <ExerciseCard exercise={exercise} isActive />

      {/* Donut timer display for timed exercises */}
      {exercise.duration && (
        <DonutTimer
          duration={exercise.duration}
          timeLeft={timeLeft}
          isPaused={isTimerPaused}
          size="large"
          color="default"
        />
      )}

      {/* Control buttons */}
      <Flex gap="3" className={styles.controlsContainer}>
        {/* Pause/Resume button for timed exercises */}
        {exercise.duration && (
          <Button
            variant="soft"
            color={isTimerPaused ? 'amber' : 'green'}
            onClick={onTogglePause}
            className={styles.controlButton}
          >
            {isTimerPaused ? 'Resume' : 'Pause'}
          </Button>
        )}

        {/* Skip/Complete button */}
        {exercise.duration ? (
          <Button onClick={onSkip} className={styles.actionButton}>
            Skip
          </Button>
        ) : (
          <Button onClick={onComplete} className={styles.actionButton}>
            Completed {exercise.repetitions} reps
          </Button>
        )}
      </Flex>

      <Button
        asChild
        variant="ghost"
        color="gray"
        size="2"
        className={styles.abortButton}
      >
        <Link to="/">Abort Workout</Link>
      </Button>
    </div>
  );
} 