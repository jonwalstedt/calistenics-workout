import { Text, Flex, Button, Progress } from '@radix-ui/themes';
import styles from '../WorkoutSession.module.css';
import { WorkoutState } from '../interfaces';

interface WorkoutHeaderProps {
  workoutState: WorkoutState;
  currentRound: number;
  totalRounds: number;
  currentExerciseIndex: number;
  totalExercises: number;
  currentWarmupIndex: number;
  totalWarmups: number;
  totalProgress: number;
  timeLeft?: number | null;
  restDuration?: number;
  isMuted: boolean;
  onToggleMute: () => void;
}

export function WorkoutHeader({
  workoutState,
  currentRound,
  totalRounds,
  currentExerciseIndex,
  totalExercises,
  currentWarmupIndex,
  totalWarmups,
  totalProgress,
  timeLeft,
  restDuration,
  isMuted,
  onToggleMute,
}: WorkoutHeaderProps) {
  // Debug log progress values
  console.log(`WorkoutHeader - State: ${workoutState}`);
  console.log(`WorkoutHeader - Progress: ${totalProgress}%`);
  console.log(
    `WorkoutHeader - Warmup: ${currentWarmupIndex + 1}/${totalWarmups}`
  );
  console.log(
    `WorkoutHeader - Main: ${currentExerciseIndex + 1}/${totalExercises}, Round: ${currentRound}/${totalRounds}`
  );

  // Calculate warmup progress safely
  const warmupProgress =
    totalWarmups > 0
      ? Math.min(Math.floor((currentWarmupIndex / totalWarmups) * 100), 100)
      : 0;

  // For PAUSE state, calculate countdown progress to match DonutTimer behavior
  let progressValue = 0;

  if (workoutState === WorkoutState.WARMUP) {
    // For warmup state - show progress through warmup exercises
    progressValue = warmupProgress;
    console.log(`WorkoutHeader - Warmup progress: ${progressValue}%`);
  } else if (
    workoutState === WorkoutState.PAUSE &&
    typeof timeLeft === 'number' &&
    typeof restDuration === 'number' &&
    restDuration > 0
  ) {
    // For pause state - IMPORTANT: the DonutTimer uses timeLeft/duration to show remaining time
    // To match DonutTimer behavior, we need to use the same calculation
    progressValue = Math.floor((timeLeft / restDuration) * 100);
    console.log(
      `WorkoutHeader - Pause timeLeft: ${timeLeft}s, restDuration: ${restDuration}s`
    );
    console.log(`WorkoutHeader - Pause progress: ${progressValue}%`);
  } else {
    // For other states - show overall workout progress
    progressValue = Math.min(totalProgress, 100);
    console.log(`WorkoutHeader - Workout progress: ${progressValue}%`);
  }

  console.log(`WorkoutHeader - Final progress value: ${progressValue}%`);

  return (
    <div className={styles.progressHeader}>
      <Flex justify="between" align="center">
        {workoutState === WorkoutState.WARMUP ? (
          <Text as="p" size="2" color="blue">
            Warmup {currentWarmupIndex + 1}/{totalWarmups}
          </Text>
        ) : (
          <>
            <Text as="p" size="2">
              Round {currentRound}/{totalRounds}
            </Text>
            <Text as="p" size="2">
              Exercise {currentExerciseIndex + 1}/{totalExercises}
            </Text>
          </>
        )}
        <Button variant="ghost" color="gray" size="1" onClick={onToggleMute}>
          {isMuted ? 'Unmute' : 'Mute'}
        </Button>
      </Flex>
      {/* During pause state, the progress shows remaining time (decreasing from 100% to 0%) */}
      {workoutState === WorkoutState.PAUSE ? (
        <div className={styles.progressBarContainer}>
          <div
            className={styles.pauseProgressBar}
            style={{
              width: `${progressValue}%`,
              backgroundColor: 'var(--amber-9)',
              transition: 'width 1s linear',
            }}
          />
        </div>
      ) : (
        <Progress value={progressValue} className={styles.progressBar} />
      )}
    </div>
  );
}
