import { useUser } from '../context';
import { Heading, Text, Button } from '@radix-ui/themes';
import { Link, Navigate } from 'react-router-dom';

export default function WorkoutHistory() {
  const { user, isLoggedIn } = useUser();
  
  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  // Group workouts by date (YYYY-MM-DD)
  const workoutsByDate = user?.completedWorkouts.reduce((acc, workout) => {
    const date = new Date(workout.date).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(workout);
    return acc;
  }, {} as Record<string, typeof user.completedWorkouts>) || {};

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Heading as="h1" size="6">
          Workout History
        </Heading>
        <Button asChild variant="soft" size="2">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
      
      {Object.keys(workoutsByDate).length === 0 ? (
        <Text as="p">You haven't completed any workouts yet.</Text>
      ) : (
        <div>
          {Object.entries(workoutsByDate)
            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA)) // Sort in reverse chronological order
            .map(([date, workouts]) => (
              <div key={date}>
                <Heading as="h2" size="3">
                  {new Date(date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Heading>
                <ul>
                  {workouts.map((workout, index) => (
                    <li key={index}>
                      <Text as="p">
                        Workout #{workout.workoutId + 1} completed at{' '}
                        {new Date(workout.date).toLocaleTimeString()}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      )}
      
      {/* Future: Add calendar view here */}
    </div>
  );
}