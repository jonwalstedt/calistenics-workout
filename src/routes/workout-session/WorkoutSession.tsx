import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Button, Heading, Text, Flex, Box, Progress } from '@radix-ui/themes';
import { useWorkoutSchedule, WorkoutDay } from '../../hooks/useWorkoutSchedule';
import { useUser } from '../../context';
import { ExerciseCard } from '../../components/workout';
import styles from './WorkoutSession.module.css';

enum WorkoutState {
  NOT_STARTED = 'not_started',
  EXERCISE = 'exercise',
  PAUSE = 'pause',
  COMPLETED = 'completed',
}

export function WorkoutSession() {
  const { workoutId } = useParams<{ workoutId: string }>();
  const { getWorkoutByDay, isLoaded } = useWorkoutSchedule();
  const { isLoggedIn, addCompletedWorkout } = useUser();

  const [workout, setWorkout] = useState<WorkoutDay | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [workoutState, setWorkoutState] = useState<WorkoutState>(
    WorkoutState.NOT_STARTED
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  console.log('workoutId:', workoutId);
  console.log('isLoaded:', isLoaded);
  // Load the workout data
  useEffect(() => {
    if (isLoaded && workoutId) {
      const parsedId = parseInt(workoutId, 10);
      if (!isNaN(parsedId)) {
        const loadedWorkout = getWorkoutByDay(parsedId);
        setWorkout(loadedWorkout);

        // Don't set timeLeft here, we'll set it when starting the workout
      }
    }
  }, [isLoaded, workoutId, getWorkoutByDay]);

  const currentExercise =
    workout && currentExerciseIndex < workout.exercises.length
      ? workout.exercises[currentExerciseIndex]
      : null;

  // Helper to calculate total progress percentage
  const calculateTotalProgress = useCallback(() => {
    if (!workout) return 0;

    const totalExercises = workout.exercises.length;
    const totalRounds = workout.repeats;
    const totalSteps = totalExercises * totalRounds;

    const completedSteps =
      (currentRound - 1) * totalExercises + currentExerciseIndex;
    return Math.floor((completedSteps / totalSteps) * 100);
  }, [workout, currentExerciseIndex, currentRound]);

  // Function to handle transition to next exercise or round
  const moveToNextStep = useCallback(() => {
    if (!workout) return;

    // Ensure timer is not paused when transitioning
    setIsTimerPaused(false);

    if (workoutState === WorkoutState.EXERCISE) {
      // After completing an exercise, always go to pause state
      if (currentExerciseIndex < workout.exercises.length - 1) {
        // More exercises in this round
        setWorkoutState(WorkoutState.PAUSE);
        setTimeLeft(workout.pause);
      } else if (currentRound < workout.repeats) {
        // Last exercise in round, but more rounds to go
        setWorkoutState(WorkoutState.PAUSE);
        setTimeLeft(workout.pause);
        setCurrentExerciseIndex(0);
        setCurrentRound((prevRound) => prevRound + 1);
      } else {
        // Workout completed
        setWorkoutState(WorkoutState.COMPLETED);
        addCompletedWorkout(workout.day);
      }
    } else if (workoutState === WorkoutState.PAUSE) {
      // After pause, determine the next exercise
      let nextExerciseIndex;
      let nextRound = currentRound;

      if (currentExerciseIndex < workout.exercises.length - 1) {
        nextExerciseIndex = currentExerciseIndex + 1;
      } else {
        // Last exercise in round, move to next round
        nextExerciseIndex = 0;
        nextRound = currentRound + 1;

        // Check if we've completed all rounds
        if (nextRound > workout.repeats) {
          setWorkoutState(WorkoutState.COMPLETED);
          addCompletedWorkout(workout.day);
          return;
        }
      }

      // Update state for next exercise
      setCurrentExerciseIndex(nextExerciseIndex);
      setCurrentRound(nextRound);
      setWorkoutState(WorkoutState.EXERCISE);

      // Set time for the next exercise
      const nextExercise = workout.exercises[nextExerciseIndex];
      if (nextExercise) {
        setTimeLeft(nextExercise.duration);
      }
    }
  }, [
    workout,
    workoutState,
    currentExerciseIndex,
    currentRound,
    addCompletedWorkout,
    setIsTimerPaused,
  ]);

  // Timer effect for exercises and pauses
  useEffect(() => {
    // Don't run timer if not in an active state
    if (
      workoutState !== WorkoutState.EXERCISE &&
      workoutState !== WorkoutState.PAUSE
    ) {
      return;
    }

    console.log('Timer effect running:', {
      workoutState,
      timeLeft,
      isTimerPaused,
    });

    // Handle case where timeLeft is not set or already at 0
    if (timeLeft === null || timeLeft <= 0) {
      // Special handling for timed exercises that haven't been initialized yet
      if (
        workoutState === WorkoutState.EXERCISE &&
        currentExercise?.duration &&
        timeLeft === null
      ) {
        setTimeLeft(currentExercise.duration);
        return;
      }

      // Otherwise, proceed to next step if timer is done
      if (timeLeft === 0) {
        moveToNextStep();
      }
      return;
    }

    // Don't start the timer if it's paused
    if (isTimerPaused) {
      return;
    }

    // Start the countdown timer (used for both exercise and pause)
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        console.log('Timer tick:', prevTime);

        if (prevTime === null || prevTime <= 1) {
          clearInterval(timer);

          // We'll handle transition in the next render
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    // Clean up the interval on unmount or state change
    return () => {
      console.log('Clearing timer interval');
      clearInterval(timer);
    };
  }, [workoutState, timeLeft, currentExercise, moveToNextStep, isTimerPaused]);

  // Update total progress when exercise or round changes
  useEffect(() => {
    setTotalProgress(calculateTotalProgress());
  }, [currentExerciseIndex, currentRound, calculateTotalProgress]);

  // For debugging timer issues - remove in production
  useEffect(() => {
    console.log('Timer state:', {
      workoutState,
      timeLeft,
      currentExerciseIndex,
      isTimerPaused,
    });
  }, [workoutState, timeLeft, currentExerciseIndex, isTimerPaused]);

  // Toggle pause function
  const toggleTimerPause = () => {
    setIsTimerPaused((prevState) => !prevState);
  };

  // Start the workout
  const handleStart = () => {
    if (!workout || !currentExercise) return;

    setWorkoutState(WorkoutState.EXERCISE);
    setIsTimerPaused(false); // Make sure timer isn't paused when starting

    // For timed exercises, set the countdown
    if (currentExercise.duration) {
      setTimeLeft(currentExercise.duration);
    } else {
      // For rep-based exercises, just show the reps with no timer
      setTimeLeft(null);
    }
  };

  // Skip timed exercise
  const handleSkip = () => {
    if (workoutState === WorkoutState.EXERCISE) {
      // Ensure we're not paused when skipping
      setIsTimerPaused(false);
      // Directly move to the next step without waiting for timer
      moveToNextStep();
    }
  };

  // Complete repetition-based exercise
  const handleComplete = () => {
    if (
      workoutState === WorkoutState.EXERCISE &&
      currentExercise?.repetitions
    ) {
      // Ensure we're not paused when completing an exercise
      setIsTimerPaused(false);
      // Use the same transition logic for all exercises
      moveToNextStep();
    }
  };

  // Redirect if not logged in or if workoutId is invalid
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

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

  return (
    <div className={styles.container}>
      {workoutState === WorkoutState.NOT_STARTED && (
        <div className={styles.startScreen}>
          <Heading as="h1" size="6">
            {workout.name}
          </Heading>
          <Text as="p" size="2">
            {workout.description}
          </Text>

          <Box className={styles.workoutInfo}>
            <Flex gap="4" justify="center">
              <Box>
                <Text as="p" size="1" color="gray">
                  Exercises
                </Text>
                <Text as="p" size="3" weight="bold">
                  {workout.exercises.length}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Rounds
                </Text>
                <Text as="p" size="3" weight="bold">
                  {workout.repeats}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Pause
                </Text>
                <Text as="p" size="3" weight="bold">
                  {workout.pause}s
                </Text>
              </Box>
            </Flex>
          </Box>

          <Box className={styles.exercisePreview}>
            <Heading as="h2" size="3">
              Exercises
            </Heading>
            <div className={styles.exerciseList}>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className={styles.exerciseItem}>
                  <Text as="p" size="2" weight="bold">
                    {exercise.name}
                  </Text>
                  <Text as="p" size="1">
                    {exercise.duration
                      ? `${exercise.duration}s`
                      : `${exercise.repetitions} reps`}
                  </Text>
                </div>
              ))}
            </div>
          </Box>

          <Flex gap="3" justify="center" mt="4">
            <Button asChild variant="soft">
              <Link to="/">Cancel</Link>
            </Button>
            <Button onClick={handleStart}>Start Workout</Button>
          </Flex>
        </div>
      )}

      {(workoutState === WorkoutState.EXERCISE ||
        workoutState === WorkoutState.PAUSE) &&
        currentExercise && (
          <div className={styles.workoutScreen}>
            <Box className={styles.progressHeader}>
              <Flex justify="between" align="center">
                <Text as="p" size="2">
                  Round {currentRound}/{workout.repeats}
                </Text>
                <Text as="p" size="2">
                  Exercise {currentExerciseIndex + 1}/{workout.exercises.length}
                </Text>
              </Flex>
              <Progress value={totalProgress} className={styles.progressBar} />
            </Box>

            {workoutState === WorkoutState.PAUSE ? (
              <div className={styles.pauseScreen}>
                <Heading as="h2" size="5">
                  Rest Time{' '}
                  {isTimerPaused && (
                    <span className={styles.pausedBadge}>Paused</span>
                  )}
                </Heading>
                <Text as="p" size="7" weight="bold">
                  {timeLeft}s
                </Text>
                <Text as="p" size="2">
                  Next:{' '}
                  {currentExerciseIndex < workout.exercises.length - 1
                    ? workout.exercises[currentExerciseIndex + 1].name
                    : currentRound < workout.repeats
                      ? workout.exercises[0].name +
                        ' (Round ' +
                        (currentRound + 1) +
                        ')'
                      : 'Completed!'}
                </Text>

                <Button
                  variant="soft"
                  color={isTimerPaused ? 'amber' : 'green'}
                  onClick={toggleTimerPause}
                  className={styles.controlButton}
                >
                  {isTimerPaused ? 'Resume' : 'Pause'}
                </Button>
              </div>
            ) : (
              <div className={styles.exerciseScreen}>
                <ExerciseCard
                  exercise={currentExercise}
                  isActive
                  timeLeft={timeLeft}
                />

                {/* Large timer display for timed exercises */}
                {currentExercise.duration && (
                  <Box
                    className={`${styles.timerDisplay} ${isTimerPaused ? styles.paused : ''}`}
                  >
                    <Text as="p" size="8" weight="bold">
                      {timeLeft !== null
                        ? `${timeLeft}s`
                        : `${currentExercise.duration}s`}
                    </Text>
                    {isTimerPaused && (
                      <Text as="p" size="2" className={styles.pausedText}>
                        PAUSED
                      </Text>
                    )}
                  </Box>
                )}

                {/* Control buttons */}
                <Flex gap="3" className={styles.controlsContainer}>
                  {/* Pause/Resume button for timed exercises */}
                  {currentExercise.duration && (
                    <Button
                      variant="soft"
                      color={isTimerPaused ? 'amber' : 'green'}
                      onClick={toggleTimerPause}
                      className={styles.controlButton}
                    >
                      {isTimerPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}

                  {/* Skip/Complete button */}
                  {currentExercise.duration ? (
                    <Button
                      onClick={handleSkip}
                      className={styles.actionButton}
                    >
                      Skip
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      className={styles.actionButton}
                    >
                      Completed {currentExercise.repetitions} reps
                    </Button>
                  )}
                </Flex>
              </div>
            )}
          </div>
        )}

      {workoutState === WorkoutState.COMPLETED && (
        <div className={styles.completedScreen}>
          <Heading as="h1" size="6">
            Workout Completed!
          </Heading>
          <Text as="p" size="3">
            Great job finishing {workout.name}
          </Text>

          <Box className={styles.completionStats}>
            <Flex gap="4" justify="center">
              <Box>
                <Text as="p" size="1" color="gray">
                  Exercises
                </Text>
                <Text as="p" size="3" weight="bold">
                  {workout.exercises.length * workout.repeats}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Rounds
                </Text>
                <Text as="p" size="3" weight="bold">
                  {workout.repeats}
                </Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">
                  Duration
                </Text>
                <Text as="p" size="3" weight="bold">
                  {Math.floor(workout.duration / 60)} min
                </Text>
              </Box>
            </Flex>
          </Box>

          <Flex gap="3" justify="center" mt="4">
            <Button asChild>
              <Link to="/">Return to Dashboard</Link>
            </Button>
            <Button asChild variant="soft">
              <Link to="/history">View History</Link>
            </Button>
          </Flex>
        </div>
      )}
    </div>
  );
}
