import { useState } from 'react';
import { Heading, Text } from '@radix-ui/themes';
import { LoginForm } from '../../components/login';
import { useUser } from '../../context';
import { useWorkoutSchedule } from '../../hooks';
import { ThemeToggle } from '../../components/theme';
import { WeekCalendar } from '../../components/calendar';
import styles from './Root.module.css';
import { WorkoutStats } from '../../components/workout-stats';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { Header } from './Header';
import { TodaysWorkout } from './TodaysWorkout';

export function Root() {
  const { login, user, logout, isLoggedIn } = useUser();
  const { getTodayWorkout, isLoaded } = useWorkoutSchedule();
  const [loginError, setLoginError] = useState<string | null>(null);
  const {
    startDate,
    totalWorkouts,
    currentStreak,
    longestStreak,
    workoutDates,
  } = useWorkoutHistory({ user });

  // Get today's workout
  const todayWorkout = getTodayWorkout();

  const handleSubmit = (name: string) => {
    if (!name.trim()) {
      setLoginError('Please enter your name');
      return;
    }

    setLoginError(null);
    login(name);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={styles.container}>
      {!isLoggedIn ? (
        <div className={styles.login}>
          <div className={styles.themeToggleContainer}>
            <ThemeToggle />
          </div>
          <Heading as="h1" size="7" className={styles.title}>
            Calisthenics Workout
          </Heading>
          <Text as="p" className={styles.subtitle}>
            Enter your name to get started with your workout routine
          </Text>
          <LoginForm onSubmit={handleSubmit} />
          {loginError && (
            <Text as="p" color="red" size="2">
              {loginError}
            </Text>
          )}
        </div>
      ) : (
        <div className={styles.dashboard}>
          <Header user={user} onLogout={handleLogout} />

          <WeekCalendar />

          <WorkoutStats
            startDate={startDate}
            totalWorkouts={totalWorkouts}
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          {/* Today's Workout */}
          {isLoaded && todayWorkout ? (
            <TodaysWorkout todayWorkout={todayWorkout} />
          ) : (
            <Text as="p">Loading today's workout...</Text>
          )}
        </div>
      )}
    </div>
  );
}
