import { User } from '../types';

export const mockUser: User = {
  name: 'John Doe',
  createdAt: new Date('2023-01-01').toISOString(),
  lastLogin: new Date('2023-10-01').toISOString(),
  completedWorkouts: [
    {
      workoutId: 1,
      date: new Date('2023-10-01').toISOString(),
    },
    {
      workoutId: 2,
      date: new Date('2023-10-02').toISOString(),
    },
  ],
};
