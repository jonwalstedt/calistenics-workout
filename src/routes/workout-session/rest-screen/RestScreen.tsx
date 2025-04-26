import { Text } from '@radix-ui/themes';
import { Exercise } from '../../../types';
import { ExerciseCard } from '../../../components/workout';
import { DonutTimer } from '../../../components/timer';
import styles from './styles.module.css';
import { useTimer } from '../../../hooks';

interface RestScreenProps {
  autostartCountdown?: boolean;
  restDuration: number;
  upcomingExercise: Exercise | null;
  goToNextExercise: () => void;
}

export function RestScreen({
  autostartCountdown = true,
  restDuration,
  upcomingExercise,
  goToNextExercise,
}: RestScreenProps) {
  const { timeLeft, isTimerPaused } = useTimer({
    initialTime: restDuration,
    isActive: autostartCountdown,
    onComplete: () => {
      goToNextExercise();
    },
  });

  return (
    <div>
      <div className={styles.restIndicator}>
        <Text as="p" size="2" color="blue">
          Rest Phase
        </Text>
      </div>

      {upcomingExercise && (
        <>
          <h2>Upcoming exercise</h2>
          <ExerciseCard exercise={upcomingExercise} isActive />
        </>
      )}

      {restDuration && (
        <DonutTimer
          duration={restDuration ?? 0}
          timeLeft={timeLeft}
          isPaused={isTimerPaused}
          size="large"
          color="amber"
        />
      )}
    </div>
  );
}
