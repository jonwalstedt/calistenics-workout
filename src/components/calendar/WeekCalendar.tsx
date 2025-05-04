import { Box, Text } from '@radix-ui/themes';
import { useUser } from '../../context';
import styles from './WeekCalendar.module.css';
import { getDayName, getDays, hasWorkoutOnDate, isToday } from './utils';

interface WeekCalendarProps {
  title?: string;
}

export function WeekCalendar({ title }: WeekCalendarProps) {
  const { user } = useUser();
  const days = getDays();

  return (
    <Box className={styles.container}>
      {title && (
        <Text size="2" weight="medium" className={styles.title}>
          {title}
        </Text>
      )}

      <div className={styles.daysContainer}>
        {days.map((day, index) => {
          const completed = hasWorkoutOnDate(day, user);
          const today = isToday(day);

          return (
            <Box
              key={index}
              className={`${styles.dayItem} ${completed ? styles.completed : ''} ${today ? styles.today : ''}`}
            >
              <Text size="1" className={styles.dayName}>
                {getDayName(day)}
              </Text>
              <Text
                size="3"
                weight={today ? 'bold' : 'regular'}
                className={styles.dayNumber}
              >
                {day.getDate()}
              </Text>
              {completed && (
                <div className={styles.completedIndicator} aria-hidden="true" />
              )}
            </Box>
          );
        })}
      </div>
    </Box>
  );
}
