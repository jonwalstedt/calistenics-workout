import { Heading, Text } from '@radix-ui/themes';
import { CompletedWorkout } from '../../types';
import styles from './RecentWorkoutHistory.module.css';

export function RecentWorkoutHistory({
  workoutsByDate,
}: {
  workoutsByDate: Record<string, CompletedWorkout[]>;
}) {
  const recentDates = Object.entries(workoutsByDate)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 3);

  return (
    <div className={styles.workoutHistory}>
      <Heading as="h2" size="3" mb="2">
        Recent Workouts
      </Heading>
      <ul className={styles.workoutList}>
        {recentDates.map(([date, workouts]) => (
          <li key={date} className={styles.dateGroup}>
            <Heading as="h3" size="2" className={styles.dateHeading}>
              {new Date(date).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
              })}
            </Heading>
            <ul className={styles.workoutSubList}>
              {workouts.map((workout) => (
                <li
                  key={`${date}-${workout.workoutId}-${workout.date}`}
                  className={styles.workoutItem}
                >
                  <Text as="p">
                    Workout #{workout.workoutId + 1} completed at{' '}
                    {new Date(workout.date).toLocaleTimeString(undefined, {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
