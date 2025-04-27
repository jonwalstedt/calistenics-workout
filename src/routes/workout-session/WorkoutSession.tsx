import { WorkoutState } from './interfaces';
import { WarmupScreen } from './warmup-screen';
import { ExerciseScreen } from './exercise-screen';
import { RestScreen } from './rest-screen';
import { WorkoutDay } from '../../types';
import { useWorkoutSessionState } from './hooks';
import { Header } from './Header';

interface WorkoutSessionProps {
  workout: WorkoutDay;
  onWorkoutComplete: () => void;
}

export function WorkoutSession({
  workout,
  onWorkoutComplete,
}: WorkoutSessionProps) {
  const {
    setWorkoutState,
    warmupExercises,
    totalNumberOfExercises,
    progress,
    currentRound,
    workoutState,
    currentExercise,
    upcomingExercise,
    maxRounds,
    totalProgress,
    warmupProgress,
    goToNextExercise,
  } = useWorkoutSessionState({
    workout,
    onWorkoutComplete,
  });

  return (
    <div>
      <div>
        <Header
          workoutName={`${workout.name} - ${workout.day}`}
          workoutState={workoutState}
          progress={progress}
          warmupProgress={warmupProgress}
          totalProgress={totalProgress}
          totalRounds={maxRounds}
          totalWarmups={warmupExercises.length}
          currentRound={currentRound}
          totalNumberOfExercises={totalNumberOfExercises}
          isMuted={false} // Placeholder for mute state
          onToggleMute={() => {
            // Placeholder for mute toggle function
            console.log('Mute toggled');
          }}
        />
        {/*
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
      */}
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
