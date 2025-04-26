import { useCallback, useEffect, useState } from 'react';

const TICK_INTERVAL = 1000; // 1 second

interface UseTimerProps {
  initialTime: number | null;
  isActive: boolean;
  onComplete: (args: {
    togglePause: () => void;
    resetTimer: (duration: number | null) => void;
  }) => void;
}

export function useTimer({ initialTime, isActive, onComplete }: UseTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(initialTime);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const togglePause = useCallback(() => {
    setIsTimerPaused((prev) => !prev);
  }, []);

  const resetTimer = useCallback((newTime: number | null) => {
    setTimeLeft(newTime);
  }, []);

  useEffect(() => {
    setTimeLeft(initialTime);
  }, [initialTime]);

  useEffect(() => {
    if (!isActive || isTimerPaused || timeLeft === null || timeLeft <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null || prevTime <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete({ togglePause, resetTimer });
          }, 0);
          return 0;
        }
        return prevTime - 1;
      });
    }, TICK_INTERVAL);

    return () => clearInterval(timer);
  }, [isActive, isTimerPaused, timeLeft, togglePause, resetTimer, onComplete]);

  return {
    timeLeft,
    isTimerPaused,
    togglePause,
    resetTimer,
  };
}
