import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useDonutTimer } from './useDonutTimer';
import type { Size } from '../interfaces';

describe('useDonutTimer', () => {
  // Test initialization with different sizes
  describe('initialization with different sizes', () => {
    it('should return correct values for small size', () => {
      const { result } = renderHook(() => useDonutTimer(60, 30, 'small'));

      expect(result.current.radius).toBe(35);
      expect(result.current.strokeWidth).toBe(4);
      expect(result.current.viewBox).toBe('0 0 80 80');
      expect(result.current.center).toBe(40);
    });

    it('should return correct values for medium size (default)', () => {
      const { result } = renderHook(() => useDonutTimer(60, 30, 'medium'));

      expect(result.current.radius).toBe(45);
      expect(result.current.strokeWidth).toBe(6);
      expect(result.current.viewBox).toBe('0 0 100 100');
      expect(result.current.center).toBe(50);
    });

    it('should return correct values for large size', () => {
      const { result } = renderHook(() => useDonutTimer(60, 30, 'large'));

      expect(result.current.radius).toBe(70);
      expect(result.current.strokeWidth).toBe(6);
      expect(result.current.viewBox).toBe('0 0 150 150');
      expect(result.current.center).toBe(75);
    });
  });

  // Test circumference calculation
  describe('circumference calculation', () => {
    it('should calculate the correct circumference for each size', () => {
      const sizes: Size[] = ['small', 'medium', 'large'];
      const expectedRadii = [35, 45, 70];

      sizes.forEach((size, index) => {
        const { result } = renderHook(() => useDonutTimer(60, 30, size));

        // Circumference = 2 * PI * radius
        const expectedCircumference = 2 * Math.PI * expectedRadii[index];
        expect(result.current.circumference).toBeCloseTo(expectedCircumference);
      });
    });
  });

  // Test progress calculation
  describe('progress calculation', () => {
    it('should calculate progress correctly based on timeLeft and duration', () => {
      const duration = 100;
      const timeLeft = 75;

      const { result } = renderHook(() =>
        useDonutTimer(duration, timeLeft, 'medium')
      );

      // Progress = (timeLeft / duration) * circumference
      const expectedProgress =
        (timeLeft / duration) * result.current.circumference;
      expect(result.current.progress).toBeCloseTo(expectedProgress);
    });

    it('should update progress when timeLeft changes', () => {
      const duration = 100;
      const initialTimeLeft = 50;

      const { result, rerender } = renderHook(
        ({ timeLeft }) => useDonutTimer(duration, timeLeft, 'medium'),
        { initialProps: { timeLeft: initialTimeLeft } }
      );

      const initialCircumference = result.current.circumference;
      const initialProgress = result.current.progress;

      // Update timeLeft
      const newTimeLeft = 25;
      rerender({ timeLeft: newTimeLeft });

      // New progress should be proportional to the new timeLeft
      const expectedNewProgress =
        (newTimeLeft / duration) * initialCircumference;
      expect(result.current.progress).toBeCloseTo(expectedNewProgress);
      expect(result.current.progress).toBeLessThan(initialProgress);
    });
  });

  // Test edge cases
  describe('edge cases', () => {
    it('should set progress to 0 when timeLeft is null', () => {
      const { result } = renderHook(() => useDonutTimer(60, null, 'medium'));

      expect(result.current.progress).toBe(0);
    });

    it('should set progress to 0 when duration is 0', () => {
      const { result } = renderHook(() => useDonutTimer(0, 30, 'medium'));

      expect(result.current.progress).toBe(0);
    });

    it('should handle full progress when timeLeft equals duration', () => {
      const duration = 60;

      const { result } = renderHook(() =>
        useDonutTimer(duration, duration, 'medium')
      );

      // Progress should equal circumference when timeLeft = duration
      expect(result.current.progress).toBeCloseTo(result.current.circumference);
    });

    it('should handle zero progress when timeLeft is 0', () => {
      const { result } = renderHook(() => useDonutTimer(60, 0, 'medium'));

      expect(result.current.progress).toBeCloseTo(0);
    });
  });

  // Test changing timer properties
  describe('changing timer properties', () => {
    it('should recalculate values when size changes', () => {
      const { result, rerender } = renderHook(
        ({ size }) => useDonutTimer(60, 30, size),
        { initialProps: { size: 'small' as Size } }
      );

      const initialRadius = result.current.radius;
      const initialCircumference = result.current.circumference;

      // Change size
      rerender({ size: 'large' as Size });

      expect(result.current.radius).not.toBe(initialRadius);
      expect(result.current.circumference).not.toBe(initialCircumference);
      expect(result.current.radius).toBe(70);
      expect(result.current.circumference).toBeCloseTo(2 * Math.PI * 70);
    });

    it('should recalculate progress when duration changes', () => {
      const { result, rerender } = renderHook(
        ({ duration }) => useDonutTimer(duration, 30, 'medium'),
        { initialProps: { duration: 60 } }
      );

      const initialProgress = result.current.progress;

      // Change duration
      rerender({ duration: 120 });

      expect(result.current.progress).not.toBeCloseTo(initialProgress);
      const expectedNewProgress = (30 / 120) * result.current.circumference;
      expect(result.current.progress).toBeCloseTo(expectedNewProgress);
    });
  });
});
