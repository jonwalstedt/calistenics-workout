import { useState } from 'react';
import scheduleData from '../data/daily-exercises.json';
import { getImageSrc } from '../utils';

export interface Exercise {
  name: string;
  description: string;
  duration: number | null;
  image: string;
  repetitions: number | null;
  pauseDuration?: number; // Optional pause time after this exercise
  resolvedImageSrc?: string; // Added for the processed imported image
}

export interface WorkoutDay {
  day: number;
  name: string;
  description: string;
  duration: number;
  repeats: number;
  pauseDuration: number; // Default pause duration between exercises
  warmup: Exercise[]; // Add warmup exercises array
  exercises: Exercise[];
}

function processWorkouts(): WorkoutDay[] {
  // Load the workouts from the JSON file and process image paths
  return scheduleData.schedule.map((workout) => {
    // Process each exercise to convert image paths to imported images
    const processedExercises = workout.exercises.map((exercise) => ({
      ...exercise,
      // Store the original path but provide a resolvedImageSrc too
      resolvedImageSrc: getImageSrc(exercise.image),
    }));

    // Process warmup exercises
    const processedWarmup = workout.warmup.map((exercise) => ({
      ...exercise,
      resolvedImageSrc: getImageSrc(exercise.image),
    }));

    return {
      ...workout,
      warmup: processedWarmup,
      exercises: processedExercises,
    };
  });
}

export function useWorkoutSchedule() {
  const [workouts] = useState<WorkoutDay[]>(processWorkouts());
  // Get the workout for today based on the day of the week (1-7)
  const getTodayWorkout = (): WorkoutDay | null => {
    if (workouts.length === 0) return null;

    // Get the day of the week (1-7, where 1 is Monday)
    const today = new Date().getDay();
    // Convert Sunday (0) to 7 to match our schedule
    const dayIndex = today === 0 ? 6 : today - 1;

    return workouts[dayIndex] || null;
  };

  // Get a specific workout by day number (1-7)
  const getWorkoutByDay = (day: number): WorkoutDay | null => {
    return workouts.find((workout) => workout.day === day) || null;
  };

  return {
    workouts,
    getTodayWorkout,
    getWorkoutByDay,
    isLoaded: workouts.length > 0,
  };
}

export default useWorkoutSchedule;
