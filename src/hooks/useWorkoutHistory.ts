import { CompletedWorkout, User } from '../types';
import { useMemo } from 'react';

interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
}

const groupWorkoutsByDate = (
  workouts: CompletedWorkout[]
): Record<string, CompletedWorkout[]> =>
  workouts.reduce(
    (acc, workout) => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(workout);
      return acc;
    },
    {} as Record<string, CompletedWorkout[]>
  );

const getSortedDates = (dates: string[]): string[] =>
  [...dates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

const calculateStreakStats = (
  dates: string[]
): Omit<WorkoutStats, 'totalWorkouts'> => {
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const sortedDates = getSortedDates(dates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  for (let i = 0; i < sortedDates.length; i++) {
    const curr = new Date(sortedDates[i]);
    const prev = i > 0 ? new Date(sortedDates[i - 1]) : null;

    if (i === 0 || (prev && curr.getTime() - prev.getTime() === 86400000)) {
      tempStreak++;
    } else {
      tempStreak = 1;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  const hasToday = dates.includes(todayStr);
  const hasYesterday = dates.includes(yesterdayStr);
  const checkDate = hasToday
    ? new Date(today)
    : hasYesterday
      ? new Date(yesterday)
      : null;

  if (checkDate) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);

    while (dates.includes(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  return { currentStreak, longestStreak };
};

interface UseWorkoutHistoryProps {
  user: User | null;
}

export const useWorkoutHistory = ({ user }: UseWorkoutHistoryProps) => {
  const workoutsByDate = useMemo(
    () =>
      user?.completedWorkouts
        ? groupWorkoutsByDate(user.completedWorkouts)
        : {},
    [user?.completedWorkouts]
  );

  const workoutDates = useMemo(
    () => Object.keys(workoutsByDate),
    [workoutsByDate]
  );

  const startDate = useMemo(
    () =>
      workoutDates.length > 0
        ? new Date(
            Math.min(...workoutDates.map((date) => new Date(date).getTime()))
          )
        : new Date(),
    [workoutDates]
  );

  const totalWorkouts = useMemo(
    () =>
      Object.values(workoutsByDate).reduce(
        (acc, workouts) => acc + workouts.length,
        0
      ),
    [workoutsByDate]
  );

  const { currentStreak, longestStreak } = useMemo(
    () => calculateStreakStats(workoutDates),
    [workoutDates]
  );

  return {
    startDate,
    workoutDates,
    workoutsByDate,
    totalWorkouts,
    currentStreak,
    longestStreak,
  };
};
