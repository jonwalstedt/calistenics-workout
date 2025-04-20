import { Button, Flex } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { useWorkoutSchedule } from '../../hooks';
import { useUser } from '../../context';
import styles from './GlobalNav.module.css';

export function GlobalNav() {
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
        <Button 
          variant="ghost" 
          size="3" 
          className={styles.navButton}
          asChild
        >
          <Link to="/history">
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
              <title>Calendar icon</title>
              <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>History</span>
          </Link>
        </Button>
        
        <Button 
          size="4"
          className={styles.mainButton}
          disabled={!todayWorkout || hasCompletedTodaysWorkout()}
          asChild={!(!todayWorkout || hasCompletedTodaysWorkout())}
        >
          {!todayWorkout || hasCompletedTodaysWorkout() ? (
            <>
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
              {hasCompletedTodaysWorkout() ? 'Completed' : 'Loading...'}
            </>
          ) : (
            <Link to={`/workout/${todayWorkout.day}`}>
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
                <title>Play icon</title>
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start
            </Link>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="3" 
          className={styles.navButton}
          asChild
        >
          <Link to="/settings">
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
              <title>Settings icon</title>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>Settings</span>
          </Link>
        </Button>
      </Flex>
    </div>
  );
} 