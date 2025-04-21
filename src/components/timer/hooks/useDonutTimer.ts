import { useEffect, useState } from 'react';
import { Size } from '../interfaces';

// Calculate radius and viewBox based on size
const getRadius = (size: Size) => {
  switch (size) {
    case 'small':
      return 35;
    case 'large':
      return 70;
    default:
      return 45;
  }
};

export const useDonutTimer = (
  duration: number,
  timeLeft: number | null,
  size: Size
) => {
  const [circumference, setCircumference] = useState(0);
  const [progress, setProgress] = useState(0);
  const radius = getRadius(size);
  const diameter = radius * 2;
  const viewBox = `0 0 ${diameter + 10} ${diameter + 10}`;
  const strokeWidth = size === 'small' ? 6 : 8;
  const center = diameter / 2 + 5; // Adding 5 for padding

  // Calculate circumference (2πr)
  useEffect(() => {
    setCircumference(2 * Math.PI * radius);
  }, [radius]);

  // Calculate progress
  useEffect(() => {
    if (timeLeft === null || duration === 0) {
      setProgress(0);
      return;
    }

    // Calculate progress as a percentage of the circumference
    const progressValue = (timeLeft / duration) * circumference;
    setProgress(progressValue);
  }, [timeLeft, duration, circumference]);

  return { circumference, progress, viewBox, strokeWidth, center, radius };
};
