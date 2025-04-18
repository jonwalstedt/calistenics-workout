import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';
import { User, CompletedWorkout } from '../types';
import { useLocalStorage } from '../hooks';

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

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useLocalStorage<User | null>(
    'calistenics-user',
    null
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!user);

  const login = useCallback(
    (name: string) => {
      const now = new Date().toISOString();

      if (user && user.name === name) {
        // User exists, update last login
        setUser({
          ...user,
          lastLogin: now,
        });
      } else {
        // Create new user
        setUser({
          name,
          createdAt: now,
          lastLogin: now,
          completedWorkouts: [],
        });
      }

      setIsLoggedIn(true);
    },
    [user, setUser]
  );

  const logout = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  const addCompletedWorkout = useCallback(
    (workoutId: number) => {
      if (!user) return;

      const newCompletedWorkout: CompletedWorkout = {
        date: new Date().toISOString(),
        workoutId,
      };

      setUser({
        ...user,
        completedWorkouts: [...user.completedWorkouts, newCompletedWorkout],
      });
    },
    [user, setUser]
  );

  const hasCompletedTodaysWorkout = useCallback(() => {
    if (!user) return false;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    return user.completedWorkouts.some((workout) => {
      const workoutDate = new Date(workout.date).toISOString().split('T')[0];
      return workoutDate === today;
    });
  }, [user]);

  const value = {
    user,
    login,
    logout,
    addCompletedWorkout,
    isLoggedIn,
    hasCompletedTodaysWorkout,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
