export interface CompletedWorkout {
  date: string; // ISO string
  workoutId: number;
}

export interface User {
  name: string;
  createdAt: string; // ISO string
  lastLogin: string; // ISO string
  completedWorkouts: CompletedWorkout[];
}