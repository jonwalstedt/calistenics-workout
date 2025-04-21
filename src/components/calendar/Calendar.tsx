import { Box, Text, Button, Flex, Grid, Heading } from '@radix-ui/themes';
import { useCalendar } from './hooks/useCalendar';
import styles from './Calendar.module.css';

interface CalendarProps {
  workoutDates: string[]; // Array of dates in 'YYYY-MM-DD' format
  onDateClick?: (date: string) => void;
  title?: string; // Optional title for the calendar
}

export function Calendar({ workoutDates, onDateClick, title }: CalendarProps) {
  const { days, monthName, year, goToPreviousMonth, goToNextMonth } =
    useCalendar(workoutDates);

  return (
    <Box className={styles.calendarContainer}>
      {title && (
        <Heading as="h2" size="4" mb="2">
          {title}
        </Heading>
      )}

      <Flex justify="between" align="center" mb="3">
        <Button variant="ghost" onClick={goToPreviousMonth}>
          &lt;
        </Button>
        <Text size="3" weight="bold">
          {monthName} {year}
        </Text>
        <Button variant="ghost" onClick={goToNextMonth}>
          &gt;
        </Button>
      </Flex>

      <Grid columns="7" gap="1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} className={styles.weekdayHeader}>
            <Text size="1" weight="bold">
              {day}
            </Text>
          </Box>
        ))}

        {days.map((calendarDay, index) => (
          <Box
            key={
              calendarDay.isCurrentMonth ? calendarDay.day : `empty-${index}`
            }
            className={`${styles.calendarDay} ${calendarDay.hasWorkout ? styles.hasWorkout : ''}`}
            onClick={() =>
              calendarDay.isCurrentMonth && onDateClick?.(calendarDay.date)
            }
          >
            {calendarDay.isCurrentMonth && (
              <Text size="2">{calendarDay.day}</Text>
            )}
          </Box>
        ))}
      </Grid>
    </Box>
  );
}
