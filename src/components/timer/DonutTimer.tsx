import { useEffect, useState } from 'react';
import { Text } from '@radix-ui/themes';
import styles from './DonutTimer.module.css';

interface DonutTimerProps {
  duration: number;
  timeLeft: number | null;
  isPaused: boolean;
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'amber';
  showLabel?: boolean;
  labelText?: string;
}

export function DonutTimer({
  duration,
  timeLeft,
  isPaused,
  size = 'medium',
  color = 'default',
  showLabel = false,
  labelText
}: DonutTimerProps) {
  const [circumference, setCircumference] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Calculate radius and viewBox based on size
  const getRadius = () => {
    switch (size) {
      case 'small': return 35;
      case 'large': return 70;
      default: return 45;
    }
  };
  
  const radius = getRadius();
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
  
  // Get the right color classes
  const getColorClass = () => {
    if (isPaused) return styles.amber;
    return color === 'amber' ? styles.amber : styles.accent;
  };
  
  // Get the right size class
  const getSizeClass = () => {
    switch (size) {
      case 'small': return styles.small;
      case 'large': return styles.large;
      default: return styles.medium;
    }
  };
  
  return (
    <div className={`${styles.container} ${getSizeClass()}`}>
      <svg 
        viewBox={viewBox}
        className={styles.donut}
        aria-hidden="true"
        role="img"
      >
        <title>Timer progress</title>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={styles.background}
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={getColorClass()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      
      <div className={styles.content}>
        <Text as="p" size={size === 'small' ? '4' : size === 'large' ? '8' : '6'} weight="bold">
          {timeLeft !== null ? `${timeLeft}s` : '-'}
        </Text>
        
        {isPaused && (
          <Text as="p" size="2" className={styles.pausedText}>
            PAUSED
          </Text>
        )}
        
        {showLabel && labelText && (
          <Text as="p" size="1" className={styles.labelText}>
            {labelText}
          </Text>
        )}
      </div>
    </div>
  );
} 