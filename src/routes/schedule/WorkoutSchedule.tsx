import { useState } from 'react';
import { Button, Heading, Text, Card, Flex, Box, Separator } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { useWorkoutSchedule } from '../../hooks';
import { ExerciseCard } from '../../components/workout';
import styles from './WorkoutSchedule.module.css';

export function WorkoutSchedule() {
  const { workouts, isLoaded } = useWorkoutSchedule();
  const [activeSchedule, setActiveSchedule] = useState('default');
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({});

  const toggleExercise = (workoutDay: number, exerciseIndex: number) => {
    const key = `${workoutDay}-${exerciseIndex}`;
    setExpandedExercises(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isExerciseExpanded = (workoutDay: number, exerciseIndex: number) => {
    const key = `${workoutDay}-${exerciseIndex}`;
    return expandedExercises[key] || false;
  };

  if (!isLoaded) {
    return <Text as="p">Loading workout schedule...</Text>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Flex justify="between" align="center">
          <Heading as="h1" size="6">Workout Schedule</Heading>
          <Button variant="soft" size="2" asChild>
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: '4px' }}
                aria-hidden="true"
              >
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </Button>
        </Flex>
      </div>

      <div className={styles.scheduleSelector}>
        <Text as="p" size="2" weight="bold">Active Schedule:</Text>
        <Flex gap="2">
          <Button 
            variant={activeSchedule === 'default' ? 'solid' : 'soft'} 
            size="2"
            onClick={() => setActiveSchedule('default')}
          >
            Default
          </Button>
          {/* Future schedule options will be added here */}
        </Flex>
      </div>

      <div className={styles.scheduleList}>
        {workouts.map((workout) => (
          <Card key={workout.day} className={styles.dayCard}>
            <Heading as="h2" size="4">Day {workout.day}: {workout.name}</Heading>
            <Text as="p" size="2" className={styles.description}>
              {workout.description}
            </Text>

            <Flex gap="3" className={styles.workoutMeta}>
              <Box>
                <Text as="p" size="1" color="gray">Exercises</Text>
                <Text as="p" size="3" weight="bold">{workout.exercises.length}</Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">Rounds</Text>
                <Text as="p" size="3" weight="bold">{workout.repeats}</Text>
              </Box>
              <Box>
                <Text as="p" size="1" color="gray">Duration</Text>
                <Text as="p" size="3" weight="bold">{Math.floor(workout.duration / 60)} min</Text>
              </Box>
            </Flex>

            <Separator my="3" size="4" />

            <div className={styles.exercisesSection}>
              <Heading as="h3" size="3" mb="2">Exercises</Heading>
              
              <div className={styles.exercisesList}>
                {workout.exercises.map((exercise, idx) => (
                  <div 
                    key={`${workout.day}-exercise-${idx}-${exercise.name}`} 
                    className={styles.exerciseRow}
                  >
                    <div 
                      className={styles.exerciseHeader} 
                      onClick={() => toggleExercise(workout.day, idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleExercise(workout.day, idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      aria-expanded={isExerciseExpanded(workout.day, idx)}
                    >
                      <Flex justify="between" align="center" width="100%">
                        <Text size="2" weight="medium">
                          {exercise.name}
                          {exercise.duration && ` - ${exercise.duration} sec`}
                          {exercise.repetitions && ` - ${exercise.repetitions} reps`}
                        </Text>
                        <Button 
                          variant="ghost" 
                          size="1"
                          className={styles.toggleButton}
                        >
                          {isExerciseExpanded(workout.day, idx) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M18 15l-6-6-6 6"/>
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <path d="M6 9l6 6 6-6"/>
                            </svg>
                          )}
                        </Button>
                      </Flex>
                    </div>
                    
                    {isExerciseExpanded(workout.day, idx) && (
                      <div className={styles.exerciseDetails}>
                        <ExerciseCard exercise={exercise} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Flex className={styles.actionButtons} justify="end" mt="3">
              <Button variant="solid" size="2" asChild>
                <Link to={`/workout/${workout.day}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ marginRight: '4px' }}
                    aria-hidden="true"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                  Start Workout
                </Link>
              </Button>
            </Flex>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default WorkoutSchedule; 