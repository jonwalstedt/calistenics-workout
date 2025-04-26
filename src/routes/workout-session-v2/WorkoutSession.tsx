import { Link } from 'react-router-dom';
import { Text, Button } from '@radix-ui/themes';
import { WorkoutState } from './interfaces';
import { WarmupScreen } from './warmup-screen';
import { ExerciseScreen } from './exercise-screen';
import { RestScreen } from './rest-screen';
import { WorkoutDay } from '../../types';
import { useWorkoutSessionState } from './hooks';

interface WorkoutSessionProps {
  workout: WorkoutDay | null;
  onWorkoutComplete?: () => void;
}

export function WorkoutSession({
  workout,
  onWorkoutComplete,
}: WorkoutSessionProps) {
  const {
    setWorkoutState,
    exercisesWithoutWarmup,
    warmupExercises,
    totalNumberOfExercises,
    progress,
    totalProgress,
    currentRound,
    workoutState,
    currentExercise,
    upcomingExercise,
    goToNextExercise,
  } = useWorkoutSessionState({
    workout,
    onWorkoutComplete,
  });

  // Loading state or workout not found
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

  console.log('workoutState:', workoutState);
  console.log('upcomingExercise:', upcomingExercise);
  console.log('currentExercise.restDuration:', currentExercise.restDuration);
  return (
    <div>
      <h1>WorkoutSession</h1>
      <div>
        <h1>Temp header</h1>
        <p>Total number of warmup exercises: {warmupExercises.length}</p>
        <p>
          Total number of exercises in this round:{' '}
          {exercisesWithoutWarmup.length}
        </p>
        <p>Total number of exercises: {totalNumberOfExercises}</p>
        <p>Percentage done: {totalProgress}</p>
        <p>Current round: {currentRound}</p>
        <p>Current exercise count: {progress.currentRoundExerciseIndex}</p>
        <p>Total exercise count: {progress.totalExerciseIndex}</p>
      </div>
      {workoutState === WorkoutState.REST && (
        <RestScreen
          goToNextExercise={goToNextExercise}
          restDuration={workout.restDuration ?? currentExercise.restDuration}
          upcomingExercise={upcomingExercise}
        />
      )}
      {workoutState === WorkoutState.WARMUP && (
        <WarmupScreen
          currentExercise={currentExercise}
          goToNextExercise={goToNextExercise}
        />
      )}
      {workoutState === WorkoutState.EXERCISE && (
        <ExerciseScreen
          currentExercise={currentExercise}
          restDuration={workout.restDuration ?? currentExercise.restDuration}
          workoutState={workoutState}
          setWorkoutState={setWorkoutState}
          goToNextExercise={goToNextExercise}
        />
      )}
      {workoutState === WorkoutState.FINISHED && <div>All done fixme!</div>}
    </div>
  );
}
