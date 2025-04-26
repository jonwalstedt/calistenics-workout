import { Navigate, Link } from 'react-router-dom';
import { Text, Button } from '@radix-ui/themes';
import { useUser } from '../../context';
import { useWorkoutSessionState } from './hooks/useWorkoutSessionState';
import { WorkoutState } from './interfaces';
import {
  WorkoutStartScreen,
  WorkoutPauseScreen,
  WorkoutReadyScreen,
  ExerciseScreen,
  WorkoutCompletedScreen,
  WorkoutHeader,
} from './components';
import styles from './WorkoutSession.module.css';

export function WorkoutSession() {
  const { isLoggedIn } = useUser();
  const {
    workout,
    workoutState,
    currentExercise,
    nextExercise,
    upcomingExercise,
    currentExerciseIndex,
    currentWarmupIndex,
    currentRound,
    timeLeft,
    totalProgress,
    isTimerPaused,
    isMuted,
    nextExerciseInfo,
    toggleTimerPause,
    toggleMute,
    handleStart,
    handleSkip,
    handleComplete,
    prepareNextExercise,
    startNextExercise,
  } = useWorkoutSessionState();

  // Redirect if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  // Loading state or workout not found
  if (!workout) {
    return (
      <div className={styles.container}>
        <Text as="p">Loading workout or workout not found...</Text>
        <Button asChild variant="soft">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  console.log('workoutState:', workoutState);
  return (
    <div className={styles.container}>
      {/* Start screen */}
      {workoutState === WorkoutState.NOT_STARTED && (
        <WorkoutStartScreen
          workout={workout}
          isMuted={isMuted}
          onStart={handleStart}
          onToggleMute={toggleMute}
        />
      )}

      {/* Active workout screens (Exercise, Pause, Ready) */}
      {(workoutState === WorkoutState.EXERCISE ||
        workoutState === WorkoutState.PAUSE ||
        workoutState === WorkoutState.READY ||
        workoutState === WorkoutState.WARMUP) &&
        currentExercise && (
          <div className={styles.workoutScreen}>
            {/* Header with progress */}
            <WorkoutHeader
              workoutState={workoutState}
              currentRound={currentRound}
              totalRounds={workout.repeats}
              currentExerciseIndex={currentExerciseIndex}
              totalExercises={workout.exercises.length}
              currentWarmupIndex={currentWarmupIndex}
              totalWarmups={workout.warmup.length}
              totalProgress={totalProgress}
              timeLeft={timeLeft}
              restDuration={workout.restDuration}
              isMuted={isMuted}
              onToggleMute={toggleMute}
            />

            {/* Pause screen */}
            {workoutState === WorkoutState.PAUSE && (
              <WorkoutPauseScreen
                timeLeft={timeLeft}
                restDuration={workout.restDuration}
                isTimerPaused={isTimerPaused}
                upcomingExercise={upcomingExercise}
                nextExerciseInfo={nextExerciseInfo}
                warmupLength={workout.warmup.length}
                onTogglePause={toggleTimerPause}
                onSkipRest={prepareNextExercise}
              />
            )}

            {/* Ready screen */}
            {workoutState === WorkoutState.READY && nextExercise && (
              <WorkoutReadyScreen
                nextExercise={nextExercise}
                onStartNextExercise={startNextExercise}
              />
            )}

            {/* Warmup screen */}
            {workoutState === WorkoutState.WARMUP && (
              <ExerciseScreen
                exercise={currentExercise}
                isWarmup={true}
                isTimerPaused={isTimerPaused}
                timeLeft={timeLeft}
                onTogglePause={toggleTimerPause}
                onSkip={handleSkip}
                onComplete={handleComplete}
              />
            )}

            {/* Exercise screen */}
            {workoutState === WorkoutState.EXERCISE && (
              <ExerciseScreen
                exercise={currentExercise}
                isTimerPaused={isTimerPaused}
                timeLeft={timeLeft}
                onTogglePause={toggleTimerPause}
                onSkip={handleSkip}
                onComplete={handleComplete}
              />
            )}
          </div>
        )}

      {/* Completed screen */}
      {workoutState === WorkoutState.COMPLETED && (
        <WorkoutCompletedScreen workout={workout} />
      )}
    </div>
  );
}
