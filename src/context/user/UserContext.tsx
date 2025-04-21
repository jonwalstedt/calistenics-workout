import { createContext } from 'react';
import { User } from '../../types';

interface UserContextType {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  addCompletedWorkout: (workoutId: number) => void;
  isLoggedIn: boolean;
  hasCompletedTodaysWorkout: () => boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);
