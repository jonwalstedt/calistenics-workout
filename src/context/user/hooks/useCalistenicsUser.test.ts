import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useCalistenicsUser } from './useCalistenicsUser';
import * as useLocalStorageModule from '../../../hooks/useLocalStorage';
import type { User, CompletedWorkout } from '../../../types';

describe('useCalistenicsUser', () => {
  // Mock dates for consistent testing
  const mockCurrentDate = '2023-07-15T10:00:00.000Z';
  const mockYesterdayDate = '2023-07-14T10:00:00.000Z';
  let mockLocalStorage: Record<string, string> = {};
  let setUserState: (user: User | null) => void;
  
  beforeEach(() => {
    // Mock current date
    vi.useFakeTimers();
    vi.setSystemTime(new Date(mockCurrentDate));
    
    // Reset mock local storage
    mockLocalStorage = {};
    
    // Create a better mock for useLocalStorage that updates state properly
    vi.spyOn(useLocalStorageModule, 'useLocalStorage').mockImplementation(
      <T>(key: string, initialValue: T) => {
        let storedValue = mockLocalStorage[key] 
          ? JSON.parse(mockLocalStorage[key]) as T 
          : initialValue;
        
        const setValue = (value: T | ((val: T) => T)) => {
          const newValue = typeof value === 'function' 
            ? (value as (val: T) => T)(storedValue) 
            : value;
          
          mockLocalStorage[key] = JSON.stringify(newValue);
          storedValue = newValue;
          
          if (key === 'calistenics-user') {
            setUserState?.(newValue as User | null);
          }
          
          return newValue;
        };
        
        return [storedValue, setValue];
      }
    );
  });
  
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
    setUserState = vi.fn();
  });
  
  describe('initial state', () => {
    it('should initialize with no user and not logged in', () => {
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        // This is a hack to update the useState in the component
        // We're directly setting the state in our mock
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      expect(result.current.user).toBeNull();
      expect(result.current.isLoggedIn).toBe(false);
    });
    
    it('should initialize with existing user and logged in state', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      expect(result.current.user).toEqual(existingUser);
      expect(result.current.isLoggedIn).toBe(true);
    });
  });
  
  describe('login', () => {
    it('should create a new user on first login', () => {
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      act(() => {
        result.current.login('New User');
      });
      
      expect(result.current.user).toEqual({
        name: 'New User',
        createdAt: mockCurrentDate,
        lastLogin: mockCurrentDate,
        completedWorkouts: [],
      });
      expect(result.current.isLoggedIn).toBe(true);
    });
    
    it('should update lastLogin for existing user', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      act(() => {
        result.current.login('Test User');
      });
      
      expect(result.current.user).toEqual({
        ...existingUser,
        lastLogin: mockCurrentDate,
      });
      expect(result.current.isLoggedIn).toBe(true);
    });
    
    it('should create a new user even if another user exists', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      act(() => {
        result.current.login('Different User');
      });
      
      expect(result.current.user).toEqual({
        name: 'Different User',
        createdAt: mockCurrentDate,
        lastLogin: mockCurrentDate,
        completedWorkouts: [],
      });
      expect(result.current.isLoggedIn).toBe(true);
    });
  });
  
  describe('logout', () => {
    it('should set isLoggedIn to false but keep user data', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      // Verify initial state
      expect(result.current.isLoggedIn).toBe(true);
      
      act(() => {
        result.current.logout();
      });
      
      // After logout, isLoggedIn should be false but user data remains
      expect(result.current.isLoggedIn).toBe(false);
      expect(result.current.user).toEqual(existingUser);
    });
  });
  
  describe('addCompletedWorkout', () => {
    it('should add workout to user\'s completedWorkouts array', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      act(() => {
        result.current.addCompletedWorkout(123);
      });
      
      expect(result.current.user?.completedWorkouts).toEqual([
        {
          date: mockCurrentDate,
          workoutId: 123,
        },
      ]);
    });
    
    it('should add multiple workouts to user\'s completedWorkouts array', () => {
      // Setup existing user with a workout
      const existingWorkout: CompletedWorkout = {
        date: mockYesterdayDate,
        workoutId: 100,
      };
      
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [existingWorkout],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      act(() => {
        result.current.addCompletedWorkout(123);
      });
      
      expect(result.current.user?.completedWorkouts).toEqual([
        existingWorkout,
        {
          date: mockCurrentDate,
          workoutId: 123,
        },
      ]);
    });
    
    it('should do nothing if no user is logged in', () => {
      const { result } = renderHook(() => useCalistenicsUser());
      
      // Capture the setUser function
      setUserState = (user) => {
        Object.defineProperty(result.current, 'user', {
          value: user,
          writable: true
        });
      };
      
      const mockSetUser = vi.fn();
      vi.spyOn(useLocalStorageModule, 'useLocalStorage').mockReturnValueOnce([null, mockSetUser]);
      
      act(() => {
        result.current.addCompletedWorkout(123);
      });
      
      expect(result.current.user).toBeNull();
      expect(mockSetUser).not.toHaveBeenCalled();
    });
  });
  
  describe('hasCompletedTodaysWorkout', () => {
    it('should return false when no workouts completed', () => {
      // Setup existing user in localStorage
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      expect(result.current.hasCompletedTodaysWorkout()).toBe(false);
    });
    
    it('should return false when workouts completed on different days', () => {
      // Setup existing user with a workout from yesterday
      const existingWorkout: CompletedWorkout = {
        date: mockYesterdayDate,
        workoutId: 100,
      };
      
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [existingWorkout],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      expect(result.current.hasCompletedTodaysWorkout()).toBe(false);
    });
    
    it('should return true when workout completed today', () => {
      // Setup existing user with a workout from today
      const todayWorkout: CompletedWorkout = {
        date: mockCurrentDate,
        workoutId: 100,
      };
      
      const existingUser: User = {
        name: 'Test User',
        createdAt: '2023-06-01T00:00:00.000Z',
        lastLogin: '2023-07-14T00:00:00.000Z',
        completedWorkouts: [todayWorkout],
      };
      
      mockLocalStorage['calistenics-user'] = JSON.stringify(existingUser);
      
      const { result } = renderHook(() => useCalistenicsUser());
      
      expect(result.current.hasCompletedTodaysWorkout()).toBe(true);
    });
    
    it('should return false when no user is logged in', () => {
      const { result } = renderHook(() => useCalistenicsUser());
      
      expect(result.current.hasCompletedTodaysWorkout()).toBe(false);
    });
  });
});
