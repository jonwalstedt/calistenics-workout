import { useCallback } from 'react';
import scheduleData from '../data/daily-exercises.json';
import { getImageSrc } from '../utils';
import useSWR from 'swr';
import { Exercise, WorkoutDay } from '../types';

const WORKOUT_SCHEDULE_KEY = 'workout-schedule';

async function fetcher(): Promise<WorkoutDay[]> {
  // const response = await fetch(url);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch workout schedule');
  // }
  // const data = await response.json();
  return scheduleData.schedule.map((workout) => {
    // Process each exercise to convert image paths to imported images
    const processedExercises = workout.exercises.map(
      (exercise) =>
        ({
          ...exercise,
          resolvedImageSrc: getImageSrc(exercise.image),
        }) as Exercise
    );

    return {
      ...workout,
      exercises: processedExercises,
    };
  });
}

export function useWorkoutSchedule() {
  const {
    data: workouts = [],
    error,
    isLoading,
  } = useSWR<WorkoutDay[]>(WORKOUT_SCHEDULE_KEY, fetcher);

  // Get the workout for today based on the day of the week (1-7)
  const getTodayWorkout = useCallback((): WorkoutDay | null => {
    if (workouts.length === 0) return null;

    // Get the day of the week (1-7, where 1 is Monday)
    const today = new Date().getDay();
    // Convert Sunday (0) to 7 to match our schedule
    const dayIndex = today === 0 ? 6 : today - 1;

    return workouts[dayIndex] || null;
  }, [workouts]);

  // Get a specific workout by day number (1-7)
  const getWorkoutByDay = useCallback(
    (day: number): WorkoutDay | null => {
      return workouts.find((workout) => workout.day === day) || null;
    },
    [workouts]
  );

  return {
    error,
    isLoading,
    workouts,
    getTodayWorkout,
    getWorkoutByDay,
    isLoaded: workouts.length > 0,
  };
}

export default useWorkoutSchedule;
