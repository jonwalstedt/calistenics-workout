import { Flex, Text } from '@radix-ui/themes';
import styles from './Header.module.css';
import { Exercise, WARMUP } from '../../types';

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
      <h1>{workoutName}</h1>
      <Flex justify="between" align="center">
        <Text as="p" size="2" color="blue">
          Warmup {totalExerciseIndex + 1}/{totalWarmups}
        </Text>
        <>
          <Text as="p" size="2">
            Exercise {currentRoundExerciseIndex}/{exercisesWithoutWarmup.length}
          </Text>
          <Text as="p" size="2">
            Round {currentRound}/{totalRounds}
          </Text>
        </>
      </Flex>
      <div className={styles.progressBarContainer}>
        {exercises.map((exercise, index) => {
          const isWarmup = exercise.type === WARMUP;
          return (
            <div
              key={`${index}-${exercise.name}`}
              className={styles.progressBar}
              style={{
                backgroundColor:
                  index <= totalExerciseIndex - 1
                    ? 'var(--grass-8)'
                    : isWarmup
                      ? 'var(--amber-6)'
                      : 'var(--gray-5)',
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
