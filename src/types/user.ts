import { CompletedWorkout } from './CompletedWorkout';

export interface User {
  name: string;
  createdAt: string; // ISO string
  lastLogin: string; // ISO string
  completedWorkouts: CompletedWorkout[];
}
