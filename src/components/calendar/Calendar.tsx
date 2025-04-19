import { useState } from 'react';
import { Box, Text, Button, Flex, Grid } from '@radix-ui/themes';
import styles from './Calendar.module.css';

interface CalendarProps {
  workoutDates: string[]; // Array of dates in 'YYYY-MM-DD' format
  onDateClick?: (date: string) => void;
}

export function Calendar({ workoutDates, onDateClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  
  // Get the last day of the month
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  
  // Get the day of week for the first day (0-6, where 0 is Sunday)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Calculate the number of days in the month
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  // Format date as 'YYYY-MM-DD'
  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };
  
  // Check if a date has workout data
  const hasWorkout = (date: string): boolean => {
    return workoutDates.includes(date);
  };
  
  // Generate calendar days
  const renderCalendarDays = () => {
    const days = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(<Box key={`empty-${i}`} className={styles.calendarDay} />);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, month, day);
      const hasWorkoutData = hasWorkout(date);
      
      days.push(
        <Box 
          key={day} 
          className={`${styles.calendarDay} ${hasWorkoutData ? styles.hasWorkout : ''}`}
          onClick={() => onDateClick?.(date)}
        >
          <Text size="2">{day}</Text>
        </Box>
      );
    }
    
    return days;
  };
  
  // Get month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  return (
    <Box className={styles.calendarContainer}>
      <Flex justify="between" align="center" mb="3">
        <Button variant="ghost" onClick={goToPreviousMonth}>&lt;</Button>
        <Text size="3" weight="bold">{monthName} {currentDate.getFullYear()}</Text>
        <Button variant="ghost" onClick={goToNextMonth}>&gt;</Button>
      </Flex>
      
      <Grid columns="7" gap="1">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <Box key={day} className={styles.weekdayHeader}>
            <Text size="1" weight="bold">{day}</Text>
          </Box>
        ))}
        
        {/* Calendar days */}
        {renderCalendarDays()}
      </Grid>
    </Box>
  );
} 