import { Button, Flex, Heading } from '@radix-ui/themes';
import { ThemeToggle } from '../../components/theme';
import { Link } from 'react-router-dom';
import styles from './WorkoutHistoryHeader.module.css';

export function WorkoutHistoryHeader() {
  return (
    <div className={styles.header}>
      <Button variant="ghost" size="1" asChild>
        <Link to="/">
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
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
      </Button>
      <Heading as="h1" size="3">
        Workout History
      </Heading>
    </div>
  );
}
