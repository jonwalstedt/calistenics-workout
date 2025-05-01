import { useState } from 'react';
import { useUser } from '../../context';
import { Navigate } from 'react-router-dom';
import { Calendar } from '../../components/calendar';
import styles from './WorkoutHistory.module.css';
import { useWorkoutHistory } from '../../hooks/useWorkoutHistory';
import { WorkoutStats } from '../../components/workout-stats';
import { WorkoutHistoryHeader } from './WorkoutHistoryHeader';
import { SelectedDateWorkouts } from './SelectedDateWorkouts';
import { RecentWorkoutHistory } from './RecentWorkoutHistory';
import { EmptyStateCard } from './EmptyStateCard';

export function WorkoutHistory() {
  const { user, isLoggedIn } = useUser();
  const {
    startDate,
    totalWorkouts,
    currentStreak,
    longestStreak,
    workoutDates,
    workoutsByDate,
  } = useWorkoutHistory({ user });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Handle date selection from calendar
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
  };

  // Clear selected date
  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  return (
    <div className={styles.container}>
      <WorkoutHistoryHeader />

      {/* Always show the calendar */}
      <div className={styles.calendarSection}>
        <Calendar
          workoutDates={workoutDates}
          onDateClick={handleDateClick}
          title="Workout Calendar"
        />
      </div>

      <WorkoutStats
        startDate={startDate}
        totalWorkouts={totalWorkouts}
        currentStreak={currentStreak}
        longestStreak={longestStreak}
        showStartDate={workoutDates.length > 0}
      />

      {selectedDate && workoutsByDate[selectedDate] ? (
        <SelectedDateWorkouts
          selectedDate={selectedDate}
          onClear={clearSelectedDate}
        />
      ) : workoutDates.length === 0 ? (
        <EmptyStateCard />
      ) : (
        <RecentWorkoutHistory workoutsByDate={workoutsByDate} />
      )}
    </div>
  );
}
