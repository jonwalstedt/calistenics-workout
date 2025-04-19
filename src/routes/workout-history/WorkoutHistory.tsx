import { useState } from 'react';
import { useUser } from '../../context';
import { Heading, Text, Button, Tabs, Flex } from '@radix-ui/themes';
import { Link, Navigate } from 'react-router-dom';
import { Calendar } from '../../components/calendar';
import { ThemeToggle } from '../../components/theme';
import styles from './WorkoutHistory.module.css';

export function WorkoutHistory() {
  const { user, isLoggedIn } = useUser();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Group workouts by date (YYYY-MM-DD)
  const workoutsByDate =
    user?.completedWorkouts.reduce(
      (acc, workout) => {
        const date = new Date(workout.date).toISOString().split('T')[0];
        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(workout);
        return acc;
      },
      {} as Record<string, typeof user.completedWorkouts>
    ) || {};

  // Get unique dates for the calendar view
  const workoutDates = Object.keys(workoutsByDate);

  // Handle date selection from calendar
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // Filter workouts to show based on selected date
  const workoutsToShow = selectedDate 
    ? { [selectedDate]: workoutsByDate[selectedDate] } 
    : workoutsByDate;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading as="h1" size="6">
          Workout History
        </Heading>
        <Flex gap="2" align="center">
          <ThemeToggle />
          <Button asChild variant="soft" size="2">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </Flex>
      </div>

      {Object.keys(workoutsByDate).length === 0 ? (
        <Text as="p">You haven't completed any workouts yet.</Text>
      ) : (
        <Tabs.Root defaultValue="list" className={styles.tabsContainer}>
          <Tabs.List className={styles.tabsList}>
            <Tabs.Trigger value="list" className={styles.tabsTrigger}>List View</Tabs.Trigger>
            <Tabs.Trigger value="calendar" className={styles.tabsTrigger}>Calendar View</Tabs.Trigger>
          </Tabs.List>
          
          <Tabs.Content value="list" className={styles.tabsContent}>
            <div>
              {Object.entries(workoutsToShow)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Sort in reverse chronological order
                .map(([date, workouts]) => (
                  <div key={date} className={styles.dateGroup}>
                    <Heading as="h2" size="3" className={styles.dateHeading}>
                      {new Date(date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Heading>
                    <ul className={styles.workoutList}>
                      {workouts.map((workout) => (
                        <li 
                          key={`${date}-${workout.workoutId}-${workout.date}`}
                          className={styles.workoutItem}
                        >
                          <Text as="p">
                            Workout #{workout.workoutId + 1} completed at{' '}
                            {new Date(workout.date).toLocaleTimeString()}
                          </Text>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </Tabs.Content>
          
          <Tabs.Content value="calendar" className={styles.tabsContent}>
            <div>
              <Calendar 
                workoutDates={workoutDates} 
                onDateClick={handleDateClick}
              />
              
              {selectedDate && workoutsByDate[selectedDate] && (
                <div className={styles.selectedDate}>
                  <Heading as="h2" size="3" className={styles.dateHeading}>
                    {new Date(selectedDate).toLocaleDateString(undefined, {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Heading>
                  <ul className={styles.workoutList}>
                    {workoutsByDate[selectedDate].map((workout) => (
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
                </div>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      )}
    </div>
  );
}
