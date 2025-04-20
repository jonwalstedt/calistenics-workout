import { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Button, Heading, Text, Flex, Box, Progress } from '@radix-ui/themes';
import { useWorkoutSchedule } from '../../hooks/useWorkoutSchedule';
import type { WorkoutDay, Exercise } from '../../hooks/useWorkoutSchedule';
import { useUser } from '../../context';
import { ExerciseCard } from '../../components/workout';
import { DonutTimer } from '../../components/timer';
import styles from './WorkoutSession.module.css';

enum WorkoutState {
  NOT_STARTED = 'not_started',
  EXERCISE = 'exercise',
  PAUSE = 'pause',
  READY = 'ready',
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
  const [nextExerciseInfo, setNextExerciseInfo] = useState<{
    index: number;
    round: number;
  } | null>(null);

  console.log('workoutId:', workoutId);
  console.log('isLoaded:', isLoaded);
  // Load the workout data
  useEffect(() => {
    if (isLoaded && workoutId) {
      const parsedId = Number.parseInt(workoutId, 10);
      if (!Number.isNaN(parsedId)) {
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

  // Get next exercise (for display in READY state)
  const getNextExercise = useCallback(() => {
    if (!workout || !nextExerciseInfo) return null;
    
    const { index, round } = nextExerciseInfo;
    if (round > workout.repeats) return null;
    
    return workout.exercises[index];
  }, [workout, nextExerciseInfo]);

  const nextExercise = getNextExercise();

  // During PAUSE state, add a function to get the next exercise for preview
  const getUpcomingExercise = useCallback((): Exercise | null => {
    if (!workout) return null;
    
    let nextIndex: number;
    let nextRound = currentRound;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      nextIndex = currentExerciseIndex + 1;
    } else {
      // Last exercise in round, move to next round
      nextIndex = 0;
      nextRound = currentRound + 1;

      // Check if we've completed all rounds
      if (nextRound > workout.repeats) {
        return null;
      }
    }
    
    return workout.exercises[nextIndex];
  }, [workout, currentExerciseIndex, currentRound]);

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

  // Function to prepare for the next exercise
  const prepareNextExercise = useCallback(() => {
    if (!workout) return;

    let nextIndex: number;
    let nextRound = currentRound;

    if (currentExerciseIndex < workout.exercises.length - 1) {
      nextIndex = currentExerciseIndex + 1;
    } else {
      // Last exercise in round, move to next round
      nextIndex = 0;
      nextRound = currentRound + 1;

      // Check if we've completed all rounds
      if (nextRound > workout.repeats) {
        setWorkoutState(WorkoutState.COMPLETED);
        addCompletedWorkout(workout.day);
        return;
      }
    }

    // Store next exercise information
    setNextExerciseInfo({ index: nextIndex, round: nextRound });
    
    // Transition to READY state
    setWorkoutState(WorkoutState.READY);
  }, [workout, currentExerciseIndex, currentRound, addCompletedWorkout]);

  // Function to start the next exercise
  const startNextExercise = useCallback(() => {
    if (!workout || !nextExerciseInfo) return;
    
    const { index, round } = nextExerciseInfo;
    
    // Update state for next exercise
    setCurrentExerciseIndex(index);
    setCurrentRound(round);
    setWorkoutState(WorkoutState.EXERCISE);
    setIsTimerPaused(false);

    // Set time for the next exercise
    const nextExercise = workout.exercises[index];
    if (nextExercise) {
      setTimeLeft(nextExercise.duration);
    }
    
    // Clear next exercise info
    setNextExerciseInfo(null);
  }, [workout, nextExerciseInfo]);

  // Function to handle transition to next exercise or round
  const moveToNextStep = useCallback(() => {
    if (!workout) return;

    // Ensure timer is not paused when transitioning
    setIsTimerPaused(false);

    if (workoutState === WorkoutState.EXERCISE) {
      // After completing an exercise, always go to pause state
      setWorkoutState(WorkoutState.PAUSE);
      setTimeLeft(workout.pause);
    }
  }, [workout, workoutState]);

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

      // Handle timer completion
      if (timeLeft === 0) {
        if (workoutState === WorkoutState.EXERCISE) {
          moveToNextStep();
        } else if (workoutState === WorkoutState.PAUSE) {
          prepareNextExercise();
        }
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
  }, [
    workoutState, 
    timeLeft, 
    currentExercise, 
    moveToNextStep, 
    isTimerPaused, 
    prepareNextExercise
  ]);

  // Update total progress when exercise or round changes
  useEffect(() => {
    setTotalProgress(calculateTotalProgress());
  }, [calculateTotalProgress]);

  // For debugging timer issues - remove in production
  useEffect(() => {
    console.log('Timer state:', {
      workoutState,
      timeLeft,
      currentExerciseIndex,
      isTimerPaused,
      nextExerciseInfo,
    });
  }, [workoutState, timeLeft, currentExerciseIndex, isTimerPaused, nextExerciseInfo]);

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
              {workout.exercises.map((exercise, i) => (
                <div key={`${exercise.name}-${i}`} className={styles.exerciseItem}>
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
        workoutState === WorkoutState.PAUSE ||
        workoutState === WorkoutState.READY) &&
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
                
                <DonutTimer
                  duration={workout.pause}
                  timeLeft={timeLeft}
                  isPaused={isTimerPaused}
                  color="amber"
                  size="large"
                />
                
                {getUpcomingExercise() && (
                  <div className={styles.nextExercisePreview}>
                    <Heading as="h3" size="3" className={styles.previewHeading}>
                      Coming Up Next:
                    </Heading>
                    <ExerciseCard 
                      exercise={getUpcomingExercise() || workout.exercises[0]} 
                    />
                  </div>
                )}
                
                <Flex gap="3" className={styles.pauseControls}>
                  <Button
                    variant="soft"
                    color={isTimerPaused ? 'amber' : 'green'}
                    onClick={toggleTimerPause}
                    className={styles.controlButton}
                  >
                    {isTimerPaused ? 'Resume' : 'Pause'}
                  </Button>

                  <Button
                    onClick={prepareNextExercise}
                    className={styles.actionButton}
                  >
                    Skip Rest
                  </Button>
                </Flex>
              </div>
            ) : workoutState === WorkoutState.READY && nextExercise ? (
              <div className={styles.readyScreen}>
                <Heading as="h2" size="5" className={styles.readyHeading}>
                  Get Ready For
                </Heading>
                
                <ExerciseCard
                  exercise={nextExercise}
                  isActive
                />
                
                <Button 
                  size="4"
                  onClick={startNextExercise}
                  className={styles.startNextButton}
                >
                  Start Exercise
                </Button>
              </div>
            ) : (
              <div className={styles.exerciseScreen}>
                <ExerciseCard
                  exercise={currentExercise}
                  isActive
                />

                {/* Donut timer display for timed exercises */}
                {currentExercise.duration && (
                  <DonutTimer
                    duration={currentExercise.duration}
                    timeLeft={timeLeft}
                    isPaused={isTimerPaused}
                    size="large"
                  />
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
