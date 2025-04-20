import { useState } from 'react';
import { Button, Heading, Text, Card, Flex, Box } from '@radix-ui/themes';
import { LoginForm } from '../../components/login';
import { useUser } from '../../context';
import { useWorkoutSchedule } from '../../hooks';
import { ExerciseCard } from '../../components/workout';
import { ThemeToggle } from '../../components/theme';
import { WeekCalendar } from '../../components/calendar';
import { Link } from 'react-router-dom';
import styles from './Root.module.css';

export function Root() {
  const { login, user, logout, isLoggedIn } = useUser();
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
          <div className={styles.header}>
            <Heading as="h1" size="6">
              Welcome, {user?.name}!
            </Heading>
            <Flex gap="2" align="center">
              <ThemeToggle />
              <Button variant="soft" onClick={handleLogout} size="1">
                Logout
              </Button>
              <Button variant="soft" size="1" asChild>
                <Link to="/settings">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ marginRight: '4px' }}
                    aria-hidden="true"
                  >
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  Settings
                </Link>
              </Button>
            </Flex>
          </div>

          {/* Week Calendar */}
          <WeekCalendar title="Activity" />

          {/* Today's Workout */}
          {isLoaded && todayWorkout ? (
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
          ) : (
            <Text as="p">Loading today's workout...</Text>
          )}
        </div>
      )}
    </div>
  );
}
