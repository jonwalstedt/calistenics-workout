import { useState } from 'react';
import { useUser } from '../../context';
import { Heading, Text, Button, Flex, Card } from '@radix-ui/themes';
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

  // Clear selected date
  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  // Get the start date for streak calculation (first completed workout)
  const startDate = workoutDates.length > 0 
    ? new Date(Math.min(...workoutDates.map(date => new Date(date).getTime()))) 
    : new Date();

  // Calculate streaks and stats
  const calculateStats = () => {
    if (workoutDates.length === 0) return { totalWorkouts: 0, currentStreak: 0, longestStreak: 0 };

    const totalWorkouts = Object.values(workoutsByDate).reduce(
      (total, workouts) => total + workouts.length, 0
    );

    // Sort dates in ascending order
    const sortedDates = [...workoutDates].sort();
    
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // Calculate longest streak
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const currentDate = new Date(sortedDates[i]);
        const prevDate = new Date(sortedDates[i - 1]);
        
        // Check if dates are consecutive
        const diffTime = currentDate.getTime() - prevDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);
        
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      
      longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    // Calculate current streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Check if workout completed today
    const todayFormatted = today.toISOString().split('T')[0];
    const yesterdayFormatted = yesterday.toISOString().split('T')[0];
    
    if (workoutDates.includes(todayFormatted)) {
      currentStreak = 1;
      
      // Count back from yesterday
      const checkDate = yesterday;
      let consecutiveDays = true;
      
      while (consecutiveDays) {
        const checkDateFormatted = checkDate.toISOString().split('T')[0];
        if (workoutDates.includes(checkDateFormatted)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          consecutiveDays = false;
        }
      }
    } else if (workoutDates.includes(yesterdayFormatted)) {
      // Start counting from yesterday
      currentStreak = 1;
      
      // Count back from two days ago
      const checkDate = new Date(yesterday);
      checkDate.setDate(checkDate.getDate() - 1);
      let consecutiveDays = true;
      
      while (consecutiveDays) {
        const checkDateFormatted = checkDate.toISOString().split('T')[0];
        if (workoutDates.includes(checkDateFormatted)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          consecutiveDays = false;
        }
      }
    } else {
      currentStreak = 0;
    }
    
    return {
      totalWorkouts,
      currentStreak,
      longestStreak
    };
  };

  const stats = calculateStats();

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

      {/* Always show the calendar */}
      <div className={styles.calendarSection}>
        <Calendar 
          workoutDates={workoutDates} 
          onDateClick={handleDateClick}
          title="Workout Calendar"
        />
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <Flex gap="3" wrap="wrap">
          <Card className={styles.statCard}>
            <Text size="1" color="gray">Total Workouts</Text>
            <Text size="5" weight="bold">{stats.totalWorkouts}</Text>
          </Card>
          <Card className={styles.statCard}>
            <Text size="1" color="gray">Current Streak</Text>
            <Text size="5" weight="bold">{stats.currentStreak} days</Text>
          </Card>
          <Card className={styles.statCard}>
            <Text size="1" color="gray">Longest Streak</Text>
            <Text size="5" weight="bold">{stats.longestStreak} days</Text>
          </Card>
          {workoutDates.length > 0 && (
            <Card className={styles.statCard}>
              <Text size="1" color="gray">First Workout</Text>
              <Text size="5" weight="bold">{startDate.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}</Text>
            </Card>
          )}
        </Flex>
      </div>

      {/* Show selected date info or no workouts message */}
      {selectedDate && workoutsByDate[selectedDate] ? (
        <div className={styles.selectedDate}>
          <Flex justify="between" align="center" mb="2">
            <Heading as="h2" size="3" className={styles.dateHeading}>
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Heading>
            <Button variant="soft" size="1" onClick={clearSelectedDate}>
              Clear
            </Button>
          </Flex>
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
      ) : selectedDate ? (
        <div className={styles.selectedDate}>
          <Flex justify="between" align="center" mb="2">
            <Heading as="h2" size="3" className={styles.dateHeading}>
              {new Date(selectedDate).toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Heading>
            <Button variant="soft" size="1" onClick={clearSelectedDate}>
              Clear
            </Button>
          </Flex>
          <Text as="p">No workouts completed on this date.</Text>
        </div>
      ) : workoutDates.length === 0 ? (
        <div className={styles.noWorkoutsMessage}>
          <Card className={styles.messageCard}>
            <Heading as="h2" size="3" mb="2">
              No Workouts Completed Yet
            </Heading>
            <Text as="p" mb="3">
              You haven't completed any workouts yet. 
              Start your fitness journey today by completing your first workout!
            </Text>
            <Button asChild size="3">
              <Link to="/">Start a Workout</Link>
            </Button>
          </Card>
        </div>
      ) : (
        <div className={styles.workoutHistory}>
          <Heading as="h2" size="3" mb="2">
            Recent Workouts
          </Heading>
          <ul className={styles.workoutList}>
            {Object.entries(workoutsByDate)
              .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Sort in reverse chronological order
              .slice(0, 3) // Show only most recent 3 days
              .map(([date, workouts]) => (
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
                            minute: '2-digit'
                          })}
                        </Text>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
