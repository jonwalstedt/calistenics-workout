import { User } from '../../types';

// Format date as 'YYYY-MM-DD' for comparison
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Generate the last 7 days
export const getDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    days.push(date);
  }

  return days;
};

// Check if user completed a workout on this date
export const hasWorkoutOnDate = (date: Date, user: User | null): boolean => {
  if (!user) return false;

  const dateString = formatDate(date);
  return user.completedWorkouts.some(
    (workout) => formatDate(new Date(workout.date)) === dateString
  );
};

// Check if date is today
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return formatDate(date) === formatDate(today);
};

// Get day name (short version)
export const getDayName = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[date.getDay()];
};
