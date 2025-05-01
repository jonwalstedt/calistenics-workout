import { renderHook } from '@testing-library/react';
import { useWorkoutHistory } from './useWorkoutHistory'; // adjust path if needed
import { User, CompletedWorkout } from '../types';
import { describe, expect, it } from 'vitest';

const getDateNDaysAgo = (n: number) => {
  const date = new Date();
  date.setDate(date.getDate() - n);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
};

const createWorkout = (daysAgo: number): CompletedWorkout => ({
  workoutId: 1,
  date: getDateNDaysAgo(daysAgo),
});

const getUserWithWorkouts = (completedWorkouts: CompletedWorkout[]): User => ({
  name: 'Test User',
  lastLogin: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  completedWorkouts,
});

describe('useWorkoutHistory', () => {
  it('returns default values when user is null', () => {
    const { result } = renderHook(() => useWorkoutHistory({ user: null }));

    expect(result.current.workoutDates).toEqual([]);
    expect(result.current.totalWorkouts).toBe(0);
    expect(result.current.currentStreak).toBe(0);
    expect(result.current.longestStreak).toBe(0);
    expect(result.current.workoutsByDate).toEqual({});
  });

  it('groups workouts by date correctly', () => {
    const user = getUserWithWorkouts([
      createWorkout(1),
      createWorkout(1),
      createWorkout(2),
    ]);

    const { result } = renderHook(() => useWorkoutHistory({ user }));

    expect(Object.keys(result.current.workoutsByDate)).toHaveLength(2);
    expect(result.current.totalWorkouts).toBe(3);
  });

  it('calculates start date as the earliest workout date', () => {
    const user = getUserWithWorkouts([createWorkout(10), createWorkout(5)]);

    const { result } = renderHook(() => useWorkoutHistory({ user }));

    const expectedStart = new Date(getDateNDaysAgo(10));
    expect(result.current.startDate.toISOString().split('T')[0]).toBe(
      expectedStart.toISOString().split('T')[0]
    );
  });

  it('calculates correct longest and current streaks (consecutive days)', () => {
    const user = getUserWithWorkouts([
      createWorkout(2),
      createWorkout(1),
      createWorkout(0),
    ]);
    const { result } = renderHook(() => useWorkoutHistory({ user }));

    expect(result.current.longestStreak).toBe(3);
    expect(result.current.currentStreak).toBe(3);
  });

  it('handles streak break correctly', () => {
    const user = getUserWithWorkouts([
      createWorkout(5),
      createWorkout(3),
      createWorkout(0),
    ]);

    const { result } = renderHook(() => useWorkoutHistory({ user }));

    expect(result.current.longestStreak).toBe(1);
    expect(result.current.currentStreak).toBe(1);
  });

  it('does not count current streak if there is no workout today or yesterday', () => {
    const user = getUserWithWorkouts([
      createWorkout(5),
      createWorkout(4),
      createWorkout(3),
    ]);

    const { result } = renderHook(() => useWorkoutHistory({ user }));

    expect(result.current.currentStreak).toBe(0);
  });
});
