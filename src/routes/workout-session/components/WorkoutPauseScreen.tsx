import { Link } from 'react-router-dom';
import { Button, Heading, Flex } from '@radix-ui/themes';
import type { Exercise } from '../../../hooks/useWorkoutSchedule';
import { DonutTimer } from '../../../components/timer';
import { ExerciseCard } from '../../../components/workout';
import styles from '../WorkoutSession.module.css';

interface WorkoutPauseScreenProps {
  timeLeft: number | null;
  restDuration: number;
  isTimerPaused: boolean;
  upcomingExercise: Exercise | null;
  nextExerciseInfo: { index: number; round: number } | null;
  warmupLength: number;
  onTogglePause: () => void;
  onSkipRest: () => void;
}

export function WorkoutPauseScreen({
  timeLeft,
  restDuration,
  isTimerPaused,
  upcomingExercise,
  nextExerciseInfo,
  warmupLength,
  onTogglePause,
  onSkipRest,
}: WorkoutPauseScreenProps) {
  return (
    <div className={styles.pauseScreen}>
      <Heading as="h2" size="5">
        Rest Time{' '}
        {isTimerPaused && <span className={styles.pausedBadge}>Paused</span>}
      </Heading>

      {upcomingExercise && (
        <div className={styles.nextExercisePreview}>
          <Heading as="h3" size="3" className={styles.previewHeading}>
            {nextExerciseInfo && nextExerciseInfo.round === -1
              ? nextExerciseInfo.index < warmupLength
                ? 'Next Warmup Exercise:'
                : 'First Main Exercise:'
              : 'Coming Up Next:'}
          </Heading>
          <ExerciseCard exercise={upcomingExercise} />
        </div>
      )}

      <DonutTimer
        duration={timeLeft !== null ? timeLeft : restDuration}
        timeLeft={timeLeft}
        isPaused={isTimerPaused}
        color="amber"
        size="large"
      />

      <Flex gap="3" className={styles.pauseControls}>
        <Button
          variant="soft"
          color={isTimerPaused ? 'amber' : 'green'}
          onClick={onTogglePause}
          className={styles.controlButton}
        >
          {isTimerPaused ? 'Resume' : 'Pause'}
        </Button>

        <Button onClick={onSkipRest} className={styles.actionButton}>
          Skip Rest
        </Button>
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
