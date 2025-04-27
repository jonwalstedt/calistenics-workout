import { Flex, Text, Button, Progress } from '@radix-ui/themes';
import { WorkoutState } from './interfaces';
import styles from './Header.module.css';

interface HeadersProps {
  workoutName: string;
  workoutState: WorkoutState;
  progress: {
    currentRoundExerciseIndex: number;
    totalExerciseIndex: number;
  };
  warmupProgress: number;
  totalProgress: number;
  totalRounds: number;
  currentRound: number;
  totalNumberOfExercises: number;
  totalWarmups: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function Header({
  workoutName,
  workoutState,
  progress,
  warmupProgress,
  totalProgress,
  totalWarmups,
  totalRounds,
  currentRound,
  totalNumberOfExercises,
  isMuted,
  onToggleMute,
}: HeadersProps) {
  const { totalExerciseIndex } = progress;
  const isWarmup = workoutState === WorkoutState.WARMUP;
  const progressPercentage = isWarmup ? warmupProgress : totalProgress;
  return (
    <div className={styles.progressHeader}>
      <h1>{workoutName}</h1>
      <Flex justify="between" align="center">
        {isWarmup ? (
          <Text as="p" size="2" color="blue">
            Warmup {totalExerciseIndex + 1}/{totalWarmups}
          </Text>
        ) : (
          <>
            <Text as="p" size="2">
              Round {currentRound}/{totalRounds}
            </Text>
            <Text as="p" size="2">
              Exercise {totalExerciseIndex + 1}/{totalNumberOfExercises}
            </Text>
          </>
        )}
        <Button variant="ghost" color="gray" size="1" onClick={onToggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </Flex>
      <Progress value={progressPercentage} className={styles.progressBar} />
    </div>
  );
}
