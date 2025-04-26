import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkoutSchedule } from '../../../hooks/useWorkoutSchedule';
import { WorkoutDay } from '../../../types';

export function useWorkoutLoader() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { getWorkoutByDay, isLoaded } = useWorkoutSchedule();
  const [workout, setWorkout] = useState<WorkoutDay | null>(null);

  // Load the workout data
  useEffect(() => {
    if (isLoaded && workoutId) {
      const parsedId = Number.parseInt(workoutId, 10);
      if (!Number.isNaN(parsedId)) {
        const loadedWorkout = getWorkoutByDay(parsedId);
        setWorkout(loadedWorkout);
      }
    }
  }, [isLoaded, workoutId, getWorkoutByDay]);

  const exercises = workout?.exercises || [];
  const exercisesWithouthWarmup = exercises.filter(
    (exercise) => exercise.type !== 'warmup'
  );

  return { workout, isLoaded, exercises, exercisesWithouthWarmup };
}
