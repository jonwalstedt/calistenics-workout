import { Text, Button, Flex, Heading } from '@radix-ui/themes';
import { CompletedWorkout } from '../../types';
import styles from './SelectedDateWorkouts.module.css';

export function SelectedDateWorkouts({
  selectedDate,
  workouts,
  onClear,
}: {
  selectedDate: string;
  workouts?: CompletedWorkout[];
  onClear: () => void;
}) {
  const heading = new Date(selectedDate).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.selectedDate}>
      <Flex justify="between" align="center" mb="2">
        <Heading as="h2" size="3" className={styles.dateHeading}>
          {heading}
        </Heading>
        <Button variant="soft" size="1" onClick={onClear}>
          Clear
        </Button>
      </Flex>
      {workouts?.length ? (
        <ul className={styles.workoutList}>
          {workouts.map((workout) => (
            <li
              key={`${selectedDate}-${workout.workoutId}-${workout.date}`}
              className={styles.workoutItem}
            >
              <Text as="p">
                Workout #{workout.workoutId + 1} completed at{' '}
                {new Date(workout.date).toLocaleTimeString()}
              </Text>
            </li>
          ))}
        </ul>
      ) : (
        <Text as="p">No workouts completed on this date.</Text>
      )}
    </div>
  );
}
