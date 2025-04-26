export const EXERCISE = 'exercise';
export const WARMUP = 'warmup';

export type ExerciseType = typeof EXERCISE | typeof WARMUP;

export interface Exercise {
  name: string;
  description: string;
  duration: number | null;
  image: string;
  repetitions: number | null;
  restDuration?: number | null; // Optional override of the workout rest time after this exercise
  resolvedImageSrc?: string; // Added for the processed imported image
  type: ExerciseType;
}
