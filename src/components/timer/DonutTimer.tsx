import { Text } from '@radix-ui/themes';
import styles from './DonutTimer.module.css';
import { Color, Size } from './interfaces';
import { useDonutTimer } from './hooks/useDonutTimer';

interface DonutTimerProps {
  duration: number;
  timeLeft: number | null;
  isPaused: boolean;
  size?: Size;
  color?: Color;
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
  labelText,
}: DonutTimerProps) {
  const { circumference, progress, viewBox, strokeWidth, center, radius } =
    useDonutTimer(duration, timeLeft, size);

  // Get the right color classes
  const getColorClass = () => {
    if (isPaused) return styles.amber;
    return color === 'amber' ? styles.amber : styles.accent;
  };

  // Get the right size class
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return styles.small;
      case 'large':
        return styles.large;
      default:
        return styles.medium;
    }
  };

  const pulseRingClassName = isPaused
    ? styles.pulseRingPaused
    : styles.pulseRing;

  return (
    <div className={`${styles.container} ${getSizeClass()}`}>
      <div
        className={`${styles.pulseContainer} ${isPaused ? styles.pulseContainerPaused : ''}`}
      >
        <div className={pulseRingClassName}></div>
        <div className={`${pulseRingClassName} ${styles.delayed}`}></div>
      </div>

      <svg
        viewBox={viewBox}
        className={styles.donut}
        aria-hidden="true"
        role="img"
      >
        <title>Timer progress</title>
        <circle
          cx={center}
          cy={center}
          r={radius}
          className={styles.background}
          strokeWidth={strokeWidth}
          fill="none"
        />
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
        <Text
          as="p"
          size={size === 'small' ? '4' : size === 'large' ? '8' : '6'}
          weight="bold"
        >
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
