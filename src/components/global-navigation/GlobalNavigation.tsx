import { Button, Flex } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { useWorkoutSchedule } from '../../hooks';
import { useUser } from '../../context';
import styles from './GlobalNavigation.module.css';

export function GlobalNavigation() {
  const location = useLocation();
  const { isLoggedIn, hasCompletedTodaysWorkout } = useUser();
  const { getTodayWorkout, isLoaded } = useWorkoutSchedule();

  // Get today's workout
  const todayWorkout = isLoaded ? getTodayWorkout() : null;

  // Determine if we're in a workout session (to hide the navigation)
  const isWorkoutSession = location.pathname.includes('/workout/');

  if (!isLoggedIn || isWorkoutSession) {
    return null; // Don't show navigation if not logged in or during workout
  }

  return (
    <div className={styles.navContainer}>
      <Flex className={styles.navContent} justify="between" align="center">
        <Button variant="ghost" size="3" className={styles.navButton} asChild>
          <Link to="/history">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                <path d="M15 23a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 0h2v2h-2zm8-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm-18 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 2v-2h2v2zm8-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm2 2h-2v2h2zm4 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 2v-2h2v2z" />
                <path d="M16 6a1 1 0 0 0-1 1v3h-4a4 4 0 0 0-4 4v24a4 4 0 0 0 4 4h26a4 4 0 0 0 4-4V14a4 4 0 0 0-4-4h-2v3a1 1 0 1 1-2 0V7a1 1 0 1 0-2 0v3H19v3a1 1 0 1 1-2 0V7a1 1 0 0 0-1-1M9 38V21h30v17a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2" />
              </g>
            </svg>
          </Link>
        </Button>

        {!todayWorkout || hasCompletedTodaysWorkout() ? (
          <Button
            size="4"
            className={styles.mainButton}
            variant="ghost"
            disabled={!todayWorkout || hasCompletedTodaysWorkout()}
            asChild={!(!todayWorkout || hasCompletedTodaysWorkout())}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={styles.icon}
              aria-hidden="true"
            >
              <title>Checkmark icon</title>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </Button>
        ) : (
          <Link
            to={`/workout/${todayWorkout.day}`}
            className={styles.playButton}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              className={styles.playButtonIcon}
            >
              <path
                fill="currentColor"
                d="m9.5 16.5l7-4.5l-7-4.5zM12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22"
              />
            </svg>
          </Link>
        )}

        <Button variant="ghost" size="3" className={styles.navButton} asChild>
          <Link to="/schedule">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 48 48"
            >
              <g fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M12 21a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm6 0a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm2 0h2v2h-2zm8-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm0 2v2h2v-2zm-18 8a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2zm4 0v2h-2v-2zm6-2a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2zm2 2h-2v2h2z"
                  clip-rule="evenodd"
                />
                <path d="M36 32.5a1 1 0 1 0-2 0v2.914l1.293 1.293a1 1 0 0 0 1.414-1.414L36 34.586z" />
                <path
                  fill-rule="evenodd"
                  d="M12 7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h10V7a1 1 0 1 1 2 0v5a1 1 0 1 0 2 0V9h3a3 3 0 0 1 3 3v16.07A7.001 7.001 0 0 1 35 42a6.99 6.99 0 0 1-5.745-3H9a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3h3zm16 28a7 7 0 0 1 6-6.93V18H8v18a1 1 0 0 0 1 1h19.29a7 7 0 0 1-.29-2m12 0a5 5 0 1 1-10 0a5 5 0 0 1 10 0"
                  clip-rule="evenodd"
                />
              </g>
            </svg>
          </Link>
        </Button>
      </Flex>
    </div>
  );
}
