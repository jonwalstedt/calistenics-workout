import { Navigate, useParams } from 'react-router-dom';
import { useUser } from '../../context';
import { useWorkoutLoader } from './hooks';
import { WorkoutSession } from './WorkoutSession';

export function WorkoutSessionDataLoader() {
  const { workoutId } = useParams<{ workoutId: string }>();
  console.log('workoutId:', workoutId);
  const { isLoggedIn, addCompletedWorkout } = useUser();

  // Load workout data
  const { workout } = useWorkoutLoader();

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleWorkoutComplete = () => {
    if (workout) {
      addCompletedWorkout(workout!.day);
    }
  };

  return (
    <WorkoutSession
      workout={workout}
      onWorkoutComplete={handleWorkoutComplete}
    />
  );
}
