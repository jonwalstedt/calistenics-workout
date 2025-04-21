import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCalendar } from './useCalendar';

describe('useCalendar', () => {
  const mockWorkoutDates = ['2023-05-10', '2023-05-15', '2023-05-20'];

  // Set a fixed date for tests
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2023, 4, 15)); // May 15, 2023
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the correct initial state', () => {
    const { result } = renderHook(() => useCalendar(mockWorkoutDates));

    expect(result.current.monthName).toBe('May');
    expect(result.current.year).toBe(2023);
    expect(result.current.days.length).toBeGreaterThan(0);
  });

  it('should navigate to previous month', () => {
    const { result } = renderHook(() => useCalendar(mockWorkoutDates));

    act(() => {
      result.current.goToPreviousMonth();
    });

    expect(result.current.monthName).toBe('April');
    expect(result.current.year).toBe(2023);
  });

  it('should navigate to next month', () => {
    const { result } = renderHook(() => useCalendar(mockWorkoutDates));

    act(() => {
      result.current.goToNextMonth();
    });

    expect(result.current.monthName).toBe('June');
    expect(result.current.year).toBe(2023);
  });

  it('should correctly identify days with workouts', () => {
    const { result } = renderHook(() => useCalendar(mockWorkoutDates));

    // Find days with workouts
    const daysWithWorkouts = result.current.days.filter(
      (day) => day.hasWorkout
    );

    // We should have 3 days with workouts in our mock data
    expect(daysWithWorkouts.length).toBe(3);

    // Check that the workout days match our mock data
    expect(daysWithWorkouts.some((day) => day.date === '2023-05-10')).toBe(
      true
    );
    expect(daysWithWorkouts.some((day) => day.date === '2023-05-15')).toBe(
      true
    );
    expect(daysWithWorkouts.some((day) => day.date === '2023-05-20')).toBe(
      true
    );
  });
});
