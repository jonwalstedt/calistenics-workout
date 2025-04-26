import { Link } from 'react-router-dom';
import { Button, Heading, Text, Flex, Box } from '@radix-ui/themes';
import type { WorkoutDay } from '../../../hooks/useWorkoutSchedule';
import styles from '../WorkoutSession.module.css';

interface WorkoutCompletedScreenProps {
  workout: WorkoutDay;
}

export function WorkoutCompletedScreen({
  workout,
}: WorkoutCompletedScreenProps) {
  return (
    <div className={styles.completedScreen}>
      <Heading as="h1" size="6">
        Workout Completed!
      </Heading>
      <Text as="p" size="3">
        Great job finishing {workout.name}
      </Text>

      <Box className={styles.completionStats}>
        <Flex gap="4" justify="center">
          <Box>
            <Text as="p" size="1" color="gray">
              Exercises
            </Text>
            <Text as="p" size="3" weight="bold">
              {workout.exercises.length * workout.repeats}
            </Text>
          </Box>
          <Box>
            <Text as="p" size="1" color="gray">
              Rounds
            </Text>
            <Text as="p" size="3" weight="bold">
              {workout.repeats}
            </Text>
          </Box>
          <Box>
            <Text as="p" size="1" color="gray">
              Duration
            </Text>
            <Text as="p" size="3" weight="bold">
              {Math.floor(workout.duration / 60)} min
            </Text>
          </Box>
        </Flex>
      </Box>

      <Flex gap="3" justify="center" mt="4">
        <Button asChild>
          <Link to="/">Return to Dashboard</Link>
        </Button>
        <Button asChild variant="soft">
          <Link to="/history">View History</Link>
        </Button>
      </Flex>
    </div>
  );
} 