import { Exercise, WARMUP } from '../../types';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  exercises: Exercise[];
  currentProgress: number;
}

export function ProgressBar({ exercises, currentProgress }: ProgressBarProps) {
  const getBackgroundColor = (exercise: Exercise, index: number) => {
    if (index === currentProgress) {
      return 'var(--red-8)'; // Ongoing exercise
    }
    if (index < currentProgress) {
      return 'var(--grass-8)'; // Completed
    }
    return exercise.type === WARMUP ? 'var(--amber-6)' : 'var(--gray-5)'; // Not started
  };

  return (
    <div className={styles.progressBarContainer}>
      {exercises.map((exercise, index) => (
        <div
          key={`${index}-${exercise.name}`}
          className={styles.progressBar}
          style={{
            backgroundColor: getBackgroundColor(exercise, index),
          }}
        />
      ))}
    </div>
  );
}
