import { useState } from 'react';
import { LoginForm } from '../components/login';
import { useUser } from '../context';
import { useWorkoutSchedule } from '../hooks';
import { Button, Heading, Text, Card, Flex, Box } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ExerciseCard } from '../components/workout';
import styles from './Root.module.css';

export default function Root() {
  const { login, user, logout, isLoggedIn, hasCompletedTodaysWorkout } =
    useUser();
  const { getTodayWorkout, isLoaded } = useWorkoutSchedule();
  const [loginError, setLoginError] = useState<string | null>(null);

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
          <div className={styles.header}>
            <Heading as="h1" size="6">
              Welcome back, {user?.name}!
            </Heading>
            <Button variant="soft" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className={styles.stats}>
            <Text as="p">
              Your account was created on:{' '}
              {new Date(user?.createdAt || '').toLocaleDateString()}
            </Text>
            <Text as="p">
              Last login: {new Date(user?.lastLogin || '').toLocaleString()}
            </Text>
            <Text as="p">
              Workouts completed: {user?.completedWorkouts.length || 0}{' '}
              {user?.completedWorkouts.length > 0 && (
                <Link to="/history" className={styles.historyLink}>
                  View history
                </Link>
              )}
            </Text>
          </div>

          <div className={styles.workoutOptions}>
            <Heading as="h2" size="4">
              Today's Workout
            </Heading>

            {isLoaded && todayWorkout ? (
              <div className={styles.todayWorkout}>
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

                    <Flex justify="center" mt="3">
                      {hasCompletedTodaysWorkout() ? (
                        <Button disabled>Completed Today</Button>
                      ) : (
                        <Button asChild>
                          <Link to={`/workout/${todayWorkout.day}`}>
                            Start Workout
                          </Link>
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                </Card>
              </div>
            ) : (
              <Text as="p">Loading today's workout...</Text>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
