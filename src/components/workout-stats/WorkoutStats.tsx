import { Text, Card, Flex } from '@radix-ui/themes';
import styles from './WorkoutStats.module.css';

interface WorkoutStatsProps {
  startDate: Date;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  showStartDate: boolean;
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className={styles.statCard}>
      <Text size="1" color="gray">
        {label}
      </Text>
      <Text size="5" weight="bold">
        {value}
      </Text>
    </Card>
  );
}
export function WorkoutStats({
  totalWorkouts,
  currentStreak,
  longestStreak,
  startDate,
  showStartDate = false,
}: WorkoutStatsProps) {
  return (
    <div className={styles.statsSection}>
      <Flex gap="3" wrap="wrap">
        <StatCard label="Total Workouts" value={totalWorkouts} />
        <StatCard label="Current Streak" value={`${currentStreak} days`} />
        <StatCard label="Longest Streak" value={`${longestStreak} days`} />
        {showStartDate && (
          <StatCard
            label="First Workout"
            value={startDate.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          />
        )}
      </Flex>
    </div>
  );
}
