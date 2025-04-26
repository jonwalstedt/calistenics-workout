import type { Exercise } from '../../hooks/useWorkoutSchedule';

export enum WorkoutState {
  NOT_STARTED = 'not_started',
  WARMUP = 'warmup',
  EXERCISE = 'exercise',
  PAUSE = 'pause',
  READY = 'ready',
  COMPLETED = 'completed',
}

export interface ExerciseWithMeta extends Exercise {
  isWarmup: boolean;
  index: number; // Original index in its array
} 