import { Navigate } from 'react-router-dom';
import { useUser } from '../../context';
import { useWorkoutLoader } from './hooks';
import { Link } from 'react-router-dom';
import { Text, Button } from '@radix-ui/themes';
import { WorkoutSession } from './WorkoutSession';

export function WorkoutSessionDataLoader() {
  const { isLoggedIn, addCompletedWorkout } = useUser();

  // Load workout data
  const { workout, isLoaded } = useWorkoutLoader();

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const handleWorkoutComplete = () => {
    if (workout) {
      addCompletedWorkout(workout!.day);
    }
  };

  if (!isLoaded) {
    return (
      <div>
        <Text as="p">Loading workout...</Text>
      </div>
    );
  }

  if (!workout) {
    return (
      <div>
        <Text as="p">Loading workout or workout not found...</Text>
        <Button asChild variant="soft">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return (
    <WorkoutSession
      workout={workout}
      onWorkoutComplete={handleWorkoutComplete}
    />
  );
}
