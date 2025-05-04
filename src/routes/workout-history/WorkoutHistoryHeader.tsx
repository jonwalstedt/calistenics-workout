import { Button, Flex, Heading } from '@radix-ui/themes';
import { ThemeToggle } from '../../components/theme';
import { Link } from 'react-router-dom';
import styles from './WorkoutHistoryHeader.module.css';

export function WorkoutHistoryHeader() {
  return (
    <div className={styles.header}>
      <Heading as="h1" size="3">
        Workout History
      </Heading>
      <Flex gap="2" align="center">
        <ThemeToggle />
        <Button asChild variant="soft" size="1">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </Flex>
    </div>
  );
}
