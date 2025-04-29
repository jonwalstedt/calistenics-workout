import { Exercise, WARMUP } from '../../types';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  exercises: Exercise[];
  currentProgress: number;
}

export function ProgressBar({ exercises, currentProgress }: ProgressBarProps) {
  return (
    <div className={styles.progressBarContainer}>
      {exercises.map((exercise, index) => {
        const isWarmup = exercise.type === WARMUP;
        return (
          <div
            key={`${index}-${exercise.name}`}
            className={styles.progressBar}
            style={{
              backgroundColor:
                index <= Math.max(currentProgress - 1, 0)
                  ? 'var(--grass-8)'
                  : isWarmup
                    ? 'var(--amber-6)'
                    : 'var(--gray-5)',
            }}
          ></div>
        );
      })}
    </div>
  );
}
