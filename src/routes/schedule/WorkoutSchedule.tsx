import { useState } from 'react';
import { Button, Heading, Text, Flex } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { useWorkoutSchedule } from '../../hooks';
import styles from './WorkoutSchedule.module.css';
import { WorkoutScheduleCard } from '../../components/workout-schedule-card';

export function WorkoutSchedule() {
  const { workouts, isLoaded } = useWorkoutSchedule();
  const [activeSchedule, setActiveSchedule] = useState('default');

  if (!isLoaded) {
    return <Text as="p">Loading workout schedule...</Text>;
  }

  return (
    <div className={styles.container}>
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
          Workout Schedule
        </Heading>
      </div>

      <div className={styles.scheduleSelector}>
        <Text as="p" size="2" weight="bold">
          Active Schedule:
        </Text>
        <Flex gap="2">
          <Button
            variant={activeSchedule === 'default' ? 'solid' : 'soft'}
            size="1"
            onClick={() => setActiveSchedule('default')}
          >
            Default
          </Button>
          {/* Future schedule options will be added here */}
        </Flex>
      </div>

      <div className={styles.scheduleList}>
        {workouts.map((workout) => (
          <WorkoutScheduleCard workout={workout} key={workout.day} />
        ))}
      </div>
    </div>
  );
}

export default WorkoutSchedule;
