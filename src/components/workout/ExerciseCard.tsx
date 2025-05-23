import { Card, Heading, Text, Flex, Box } from '@radix-ui/themes';
import styles from './ExerciseCard.module.css';
import { Exercise } from '../../types';

interface ExerciseCardProps {
  exercise: Exercise;
  isActive?: boolean;
  isPaused?: boolean;
}

export function ExerciseCard({
  exercise,
  isActive = false,
  isPaused = false,
}: ExerciseCardProps) {
  return (
    <Card className={`${styles.card} ${isActive ? styles.active : ''}`}>
      <Flex direction="column" gap="3">
        <Heading as="h3" size="4" className={styles.heading}>
          {exercise.name}
        </Heading>

        <Box className={styles.imageWrapper}>
          <img
            src={exercise.resolvedImageSrc || exercise.image}
            alt={exercise.name}
            className={styles.image}
          />
        </Box>

        <Text as="p" size="2" className={styles.description}>
          {exercise.description}
        </Text>

        <Flex
          justify="between"
          align="center"
          className={styles.exerciseDetail}
        >
          {exercise.duration ? (
            <Text as="p" size="5" weight="bold">
              {`${exercise.duration}s`}
            </Text>
          ) : (
            <Text as="p" size="5" weight="bold">
              {exercise.repetitions} reps
            </Text>
          )}

          {isPaused && (
            <Text as="p" size="2" color="gray">
              Paused
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

export default ExerciseCard;
