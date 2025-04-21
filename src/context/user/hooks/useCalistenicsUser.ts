import { useCallback, useState } from 'react';
import { useLocalStorage } from '../../../hooks';
import { CompletedWorkout, User } from '../../../types';

export const useCalistenicsUser = () => {
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

  return {
    user,
    login,
    logout,
    addCompletedWorkout,
    isLoggedIn,
    hasCompletedTodaysWorkout,
  };
};
