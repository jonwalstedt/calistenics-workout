import { Text, Card, Flex, Heading, Box } from '@radix-ui/themes';
import { WorkoutDay } from '../../types';
import { ExerciseCard } from '../../components/workout';
import styles from './TodaysWorkout.module.css';

interface TodaysWorkoutProps {
  todayWorkout: WorkoutDay;
}
export function TodaysWorkout({ todayWorkout }: TodaysWorkoutProps) {
  return (
    <div className={styles.todayWorkout}>
      <Heading as="h2" size="4" className={styles.sectionTitle}>
        Today's Workout
      </Heading>

      <Card className={styles.workoutCard}>
        <Flex direction="column" gap="3">
          <Heading as="h3" size="3">
            {todayWorkout.name}
          </Heading>
          <Text as="p" size="2">
            {todayWorkout.description}
          </Text>

          <Box className={styles.workoutStats}>
            <Flex gap="4" justify="center">
              <Box>
                <Text as="p" size="1" color="gray">
                  Exercises
                </Text>
                <Text as="p" size="3" weight="bold">
                  {todayWorkout.exercises.length}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Rounds
                </Text>
                <Text as="p" size="3" weight="bold">
                  {todayWorkout.repeats}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Duration
                </Text>
                <Text as="p" size="3" weight="bold">
                  {Math.floor(todayWorkout.duration / 60)} min
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Preview first exercise */}
          {todayWorkout.exercises.length > 0 && (
            <div className={styles.exercisePreview}>
              <Text as="p" size="2" className={styles.previewLabel}>
                First exercise:
              </Text>
              <ExerciseCard exercise={todayWorkout.exercises[0]} />
            </div>
          )}
        </Flex>
      </Card>
    </div>
  );
}
