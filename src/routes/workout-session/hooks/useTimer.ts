import { useState, useEffect, useCallback } from 'react';
import audioService from '../../../components/audio/AudioService';

interface UseTimerProps {
  initialTime: number | null;
  isActive: boolean;
  onComplete: () => void;
  isPauseState?: boolean;
}

export function useTimer({
  initialTime,
  isActive,
  onComplete,
  isPauseState = false,
}: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTime);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Set initial time when it changes
  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  // Toggle pause function
  const togglePause = useCallback(() => {
    setIsTimerPaused((prevState) => !prevState);
  }, []);

  // Reset timer with new time
  const resetTimer = useCallback((newTime: number | null) => {
    setTimeLeft(newTime);
  }, []);

  // Timer effect
  useEffect(() => {
    // Don't run timer if not active or time isn't set
    if (!isActive || timeLeft === null) {
      return;
    }

    // Handle case where timeLeft is already at 0
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    // Don't start the timer if it's paused
    if (isTimerPaused) {
      return;
    }

    // Play "about to start" sound when pause is about to end (3 seconds left)
    if (isPauseState && timeLeft === 3) {
      audioService.playAboutToStartSound();
    }

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(timer);

          // Play completion sound when exercise timer reaches 0
          if (!isPauseState) {
            audioService.playExerciseCompleteSound();
          }

          // Handle transition in the next render
          setTimeout(onComplete, 0);
          return 0;
        }

        return prevTime - 1;
      });
    }, 1000);

    // Clean up the interval on unmount or state change
    return () => {
      clearInterval(timer);
    };
  }, [isActive, timeLeft, isTimerPaused, onComplete, isPauseState]);

  return {
    timeLeft,
    isTimerPaused,
    togglePause,
    resetTimer,
  };
}
