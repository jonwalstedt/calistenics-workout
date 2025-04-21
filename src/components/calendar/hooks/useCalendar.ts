import { useState } from 'react';

// Format date as 'YYYY-MM-DD'
const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

interface CalendarDay {
  date: string;
  day: number;
  hasWorkout: boolean;
  isCurrentMonth: boolean;
}

interface CalendarData {
  days: CalendarDay[];
  monthName: string;
  year: number;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
}

export function useCalendar(workoutDates: string[]): CalendarData {
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
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  // Check if a date has workout data
  const hasWorkout = (date: string): boolean => {
    return workoutDates.includes(date);
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({
        date: '',
        day: 0,
        hasWorkout: false,
        isCurrentMonth: false,
      });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = formatDate(year, month, day);
      days.push({
        date,
        day,
        hasWorkout: hasWorkout(date),
        isCurrentMonth: true,
      });
    }

    return days;
  };

  // Get month name
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  return {
    days: generateCalendarDays(),
    monthName,
    year,
    goToPreviousMonth,
    goToNextMonth,
  };
}
