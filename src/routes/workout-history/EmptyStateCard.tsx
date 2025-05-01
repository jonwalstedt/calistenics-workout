import { Text, Button, Card, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import styles from './EmptyStateCard.module.css';

export function EmptyStateCard() {
  return (
    <div className={styles.noWorkoutsMessage}>
      <Card className={styles.messageCard}>
        <Heading as="h2" size="3" mb="2">
          No Workouts Completed Yet
        </Heading>
        <Text as="p" mb="3">
          You haven't completed any workouts yet. Start your fitness journey
          today by completing your first workout!
        </Text>
        <Button asChild size="3">
          <Link to="/">Start a Workout</Link>
        </Button>
      </Card>
    </div>
  );
}
