import { Box, Flex, Text } from '@radix-ui/themes';
import { useUser } from '../../context';
import styles from './WeekCalendar.module.css';

interface WeekCalendarProps {
  title?: string;
}

export function WeekCalendar({ title = 'Last 7 Days' }: WeekCalendarProps) {
  const { user } = useUser();
  
  // Generate the last 7 days
  const getDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    
    return days;
  };
  
  const days = getDays();
  
  // Format date as 'YYYY-MM-DD' for comparison
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };
  
  // Check if user completed a workout on this date
  const hasWorkoutOnDate = (date: Date): boolean => {
    if (!user) return false;
    
    const dateString = formatDate(date);
    return user.completedWorkouts.some(workout => 
      formatDate(new Date(workout.date)) === dateString
    );
  };
  
  // Get day name (short version)
  const getDayName = (date: Date): string => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  };
  
  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(date) === formatDate(today);
  };
  
  return (
    <Box className={styles.container}>
      {title && <Text size="2" weight="medium" className={styles.title}>{title}</Text>}
      
      <Flex justify="between" className={styles.daysContainer}>
        {days.map((day, index) => {
          const completed = hasWorkoutOnDate(day);
          const today = isToday(day);
          
          return (
            <Box 
              key={index} 
              className={`${styles.dayItem} ${completed ? styles.completed : ''} ${today ? styles.today : ''}`}
            >
              <Text size="1" className={styles.dayName}>{getDayName(day)}</Text>
              <Text size="3" weight={today ? 'bold' : 'regular'} className={styles.dayNumber}>
                {day.getDate()}
              </Text>
              {completed && (
                <div className={styles.completedIndicator} aria-hidden="true" />
              )}
            </Box>
          );
        })}
      </Flex>
    </Box>
  );
} 