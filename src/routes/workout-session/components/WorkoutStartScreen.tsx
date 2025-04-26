import { Link } from 'react-router-dom';
import { Button, Heading, Text, Flex, Box } from '@radix-ui/themes';
import type { WorkoutDay } from '../../../hooks/useWorkoutSchedule';
import styles from '../WorkoutSession.module.css';

interface WorkoutStartScreenProps {
  workout: WorkoutDay;
  isMuted: boolean;
  onStart: () => void;
  onToggleMute: () => void;
}

export function WorkoutStartScreen({
  workout,
  isMuted,
  onStart,
  onToggleMute,
}: WorkoutStartScreenProps) {
  return (
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
              {(() => {
                // Check if any exercises have custom pause times
                const hasCustomPauses = workout.exercises.some(
                  (ex) =>
                    ex.restDuration !== undefined &&
                    ex.restDuration !== workout.restDuration
                );

                if (hasCustomPauses) {
                  // Find min and max pause times
                  const pauseTimes = workout.exercises.map((ex) =>
                    ex.restDuration !== undefined
                      ? ex.restDuration
                      : workout.restDuration
                  );
                  const minPause = Math.min(...pauseTimes);
                  const maxPause = Math.max(...pauseTimes);

                  return minPause === maxPause
                    ? `${minPause}s`
                    : `${minPause}-${maxPause}s`;
                }

                return `${workout.restDuration}s`;
              })()}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Show Warmup exercises */}
      {workout.warmup && workout.warmup.length > 0 && (
        <Box className={styles.exercisePreview}>
          <Heading as="h2" size="3">
            Warmup ({workout.warmup.length})
          </Heading>
          <div className={styles.exerciseList}>
            {workout.warmup.map((exercise, i) => (
              <div
                key={`warmup-${exercise.name}-${i}`}
                className={styles.exerciseItem}
              >
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
      )}

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
              <Flex direction="column" align="end">
                <Text as="p" size="1">
                  {exercise.duration
                    ? `${exercise.duration}s`
                    : `${exercise.repetitions} reps`}
                </Text>
                {exercise.restDuration !== undefined &&
                  exercise.restDuration !== workout.restDuration && (
                    <Text as="p" size="1" color="amber">
                      Rest: {exercise.restDuration}s
                    </Text>
                  )}
              </Flex>
            </div>
          ))}
        </div>
      </Box>

      <Flex gap="3" justify="center" mt="4">
        <Button asChild variant="soft">
          <Link to="/">Cancel</Link>
        </Button>
        <Button onClick={onStart}>Start Workout</Button>
      </Flex>

      <Button
        variant="ghost"
        color="gray"
        size="2"
        onClick={onToggleMute}
        className={styles.muteButton}
      >
        {isMuted ? 'Unmute Sounds' : 'Mute Sounds'}
      </Button>
    </div>
  );
}
