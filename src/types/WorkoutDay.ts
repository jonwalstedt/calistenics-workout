import { Exercise } from './Exercise';

export interface WorkoutDay {
  day: number;
  name: string;
  description: string;
  duration: number;
  repeats: number;
  restDuration: number; // Default rest duration between exercises
  exercises: Exercise[];
}
