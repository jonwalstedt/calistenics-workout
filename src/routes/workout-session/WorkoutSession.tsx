import { WorkoutState } from './interfaces';
import { WarmupScreen } from './warmup-screen';
import { ExerciseScreen } from './exercise-screen';
import { RestScreen } from './rest-screen';
import { WorkoutDay } from '../../types';
import { useWorkoutSessionState } from './hooks';
import { Header } from './Header';
import styles from './WorkoutSession.module.css';

interface WorkoutSessionProps {
  workout: WorkoutDay;
  onWorkoutComplete: () => void;
}

export function WorkoutSession({
  workout,
  onWorkoutComplete,
}: WorkoutSessionProps) {
  const {
    warmupExercises,
    exercisesWithoutWarmup,
    progress,
    currentRound,
    workoutState,
    currentExercise,
    upcomingExercise,
    maxRounds,
    goToNextExercise,
    setWorkoutState,
  } = useWorkoutSessionState({
    workout,
    onWorkoutComplete,
  });

  return (
    <div className={styles.workoutSession}>
      <div>
        <Header
          warmupExercises={warmupExercises}
          exercisesWithoutWarmup={exercisesWithoutWarmup}
          workoutName={`${workout.name} - ${workout.day}`}
          progress={progress}
          totalRounds={maxRounds}
          totalWarmups={warmupExercises.length}
          currentRound={currentRound}
        />
      </div>
      {workoutState === WorkoutState.REST && (
        <RestScreen
          goToNextExercise={goToNextExercise}
          restDuration={currentExercise.restDuration ?? workout.restDuration}
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
          restDuration={currentExercise.restDuration ?? workout.restDuration}
          workoutState={workoutState}
          setWorkoutState={setWorkoutState}
          goToNextExercise={goToNextExercise}
        />
      )}
      {workoutState === WorkoutState.FINISHED && <div>All done fixme!</div>}
    </div>
  );
}
