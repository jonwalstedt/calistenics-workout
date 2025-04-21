import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getDays, hasWorkoutOnDate, isToday, getDayName } from './utils';
import type { User } from '../../types';

describe('Calendar Utils', () => {
  // Mock date for consistent testing
  beforeEach(() => {
    vi.useFakeTimers();
    // Set fixed date to Tuesday, May 16, 2023
    vi.setSystemTime(new Date(2023, 4, 16));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getDays', () => {
    it('should return an array of 7 dates', () => {
      const days = getDays();
      expect(days).toHaveLength(7);
      expect(days.every(date => date instanceof Date)).toBe(true);
    });

    it('should return dates in descending order (past 7 days)', () => {
      const days = getDays();
      
      // First item should be 6 days ago, last item should be today
      const sixDaysAgo = new Date(2023, 4, 10); // May 10, 2023
      const today = new Date(2023, 4, 16); // May, 16, 2023

      expect(days[0].getDate()).toBe(sixDaysAgo.getDate());
      expect(days[0].getMonth()).toBe(sixDaysAgo.getMonth());
      expect(days[0].getFullYear()).toBe(sixDaysAgo.getFullYear());

      expect(days[6].getDate()).toBe(today.getDate());
      expect(days[6].getMonth()).toBe(today.getMonth());
      expect(days[6].getFullYear()).toBe(today.getFullYear());
    });
  });

  describe('hasWorkoutOnDate', () => {
    it('should return false when user is null', () => {
      const date = new Date();
      expect(hasWorkoutOnDate(date, null)).toBe(false);
    });

    it('should return false when user has no completed workouts on the date', () => {
      const date = new Date(2023, 4, 16); // May 16, 2023
      const user: User = {
        name: 'Test User',
        createdAt: new Date(2023, 1, 1).toISOString(),
        lastLogin: new Date(2023, 4, 16).toISOString(),
        completedWorkouts: [
          { 
            date: new Date(2023, 4, 15).toISOString(), // May 15, 2023
            workoutId: 1 
          }
        ]
      };

      expect(hasWorkoutOnDate(date, user)).toBe(false);
    });

    it('should return true when user has completed a workout on the date', () => {
      const date = new Date(2023, 4, 16); // May 16, 2023
      const user: User = {
        name: 'Test User',
        createdAt: new Date(2023, 1, 1).toISOString(),
        lastLogin: new Date(2023, 4, 16).toISOString(),
        completedWorkouts: [
          { 
            date: new Date(2023, 4, 16).toISOString(), // May 16, 2023
            workoutId: 1 
          }
        ]
      };

      expect(hasWorkoutOnDate(date, user)).toBe(true);
    });

    it('should return true for multiple completed workouts on the same date', () => {
      const date = new Date(2023, 4, 16); // May 16, 2023
      const user: User = {
        name: 'Test User',
        createdAt: new Date(2023, 1, 1).toISOString(),
        lastLogin: new Date(2023, 4, 16).toISOString(),
        completedWorkouts: [
          { 
            date: new Date(2023, 4, 16).toISOString(), // May 16, 2023
            workoutId: 1 
          },
          { 
            date: new Date(2023, 4, 16).toISOString(), // May 16, 2023 (same day)
            workoutId: 2 
          }
        ]
      };

      expect(hasWorkoutOnDate(date, user)).toBe(true);
    });
  });

  describe('isToday', () => {
    it('should return true for today\'s date', () => {
      // Since we mocked Date to be 2023-05-16, this should be true
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday\'s date', () => {
      const yesterday = new Date(2023, 4, 15); // May 15, 2023
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow\'s date', () => {
      const tomorrow = new Date(2023, 4, 17); // May 17, 2023
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('getDayName', () => {
    it('should return the correct three-letter day abbreviation', () => {
      // Test for all days of the week
      const days = [
        { date: new Date(2023, 4, 14), expected: 'Sun' }, // May 14, 2023 (Sunday)
        { date: new Date(2023, 4, 15), expected: 'Mon' }, // May 15, 2023 (Monday)
        { date: new Date(2023, 4, 16), expected: 'Tue' }, // May 16, 2023 (Tuesday)
        { date: new Date(2023, 4, 17), expected: 'Wed' }, // May 17, 2023 (Wednesday)
        { date: new Date(2023, 4, 18), expected: 'Thu' }, // May 18, 2023 (Thursday)
        { date: new Date(2023, 4, 19), expected: 'Fri' }, // May 19, 2023 (Friday)
        { date: new Date(2023, 4, 20), expected: 'Sat' }  // May 20, 2023 (Saturday)
      ];

      for (const { date, expected } of days) {
        expect(getDayName(date)).toBe(expected);
      }
    });
  });
});
