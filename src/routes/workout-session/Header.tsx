import { Flex, Heading, Text } from '@radix-ui/themes';
import styles from './Header.module.css';
import { Exercise } from '../../types';
import { ProgressBar } from '../../components/progress-bar';

interface HeadersProps {
  warmupExercises: Exercise[];
  exercisesWithoutWarmup: Exercise[];
  workoutName: string;
  progress: {
    currentRoundExerciseIndex: number;
    totalExerciseIndex: number;
  };
  totalRounds: number;
  currentRound: number;
  totalWarmups: number;
}

export function Header({
  warmupExercises,
  exercisesWithoutWarmup,
  workoutName,
  progress,
  totalWarmups,
  totalRounds,
  currentRound,
}: HeadersProps) {
  const { totalExerciseIndex, currentRoundExerciseIndex } = progress;
  const totalRoundsArray = Array.from({ length: totalRounds }, (_, i) => i);
  const exercisesOverSets = totalRoundsArray.flatMap(() => [
    ...exercisesWithoutWarmup,
  ]);
  const exercises = [...warmupExercises, ...exercisesOverSets];
  return (
    <div className={styles.progressHeader}>
      <Heading size="6">{workoutName}</Heading>
      <Flex justify="between" align="center">
        <Text as="p" size="2" color="blue">
          Warmup {Math.min(totalExerciseIndex + 1, totalWarmups)}/{totalWarmups}
        </Text>
        <>
          <Text as="p" size="2">
            Exercise {currentRoundExerciseIndex + 1}/
            {exercisesWithoutWarmup.length}
          </Text>
          <Text as="p" size="2">
            Round {currentRound}/{totalRounds}
          </Text>
        </>
      </Flex>
      <ProgressBar exercises={exercises} currentProgress={totalExerciseIndex} />
    </div>
  );
}
