import { ReactNode } from 'react';
import { UserContext } from './UserContext';
import { useCalistenicsUser } from './hooks';

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const {
    user,
    login,
    logout,
    addCompletedWorkout,
    isLoggedIn,
    hasCompletedTodaysWorkout,
  } = useCalistenicsUser();

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        addCompletedWorkout,
        isLoggedIn,
        hasCompletedTodaysWorkout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
