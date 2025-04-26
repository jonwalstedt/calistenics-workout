import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCalistenicsUser } from './useCalistenicsUser';

describe('useCalistenicsUser', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with no user and logged out', () => {
    const { result } = renderHook(() => useCalistenicsUser());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('should login a new user correctly', () => {
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('John Doe');
    });

    expect(result.current.user?.name).toBe('John Doe');
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.completedWorkouts).toEqual([]);
  });

  it('should update last login if user already exists', async () => {
    vi.useFakeTimers(); // Start mocking timers
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('Jane Doe');
    });

    const firstLoginTime = result.current.user?.lastLogin;

    // Move time forward 1 second
    await act(async () => {
      vi.advanceTimersByTime(1000);
      result.current.login('Jane Doe');
    });

    const secondLoginTime = result.current.user?.lastLogin;

    expect(secondLoginTime).not.toEqual(firstLoginTime);

    vi.useRealTimers(); // Restore real timers
  });

  it('should logout the user correctly', () => {
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('Jane Doe');
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).not.toBeNull(); // user still exists, only logged out
  });

  it('should add a completed workout', () => {
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('Workout User');
    });

    act(() => {
      result.current.addCompletedWorkout(123);
    });

    expect(result.current.user?.completedWorkouts).toHaveLength(1);
    expect(result.current.user?.completedWorkouts[0].workoutId).toBe(123);
  });

  it("should check if today's workout is completed", () => {
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('Workout Checker');
    });

    act(() => {
      result.current.addCompletedWorkout(999);
    });

    expect(result.current.hasCompletedTodaysWorkout()).toBe(true);
  });

  it("should return false if today's workout is not completed", () => {
    const { result } = renderHook(() => useCalistenicsUser());

    act(() => {
      result.current.login('No Workout Today');
    });

    expect(result.current.hasCompletedTodaysWorkout()).toBe(false);
  });
});
