import { LoginForm } from '../components/login';
import styles from './Root.module.css';

export default function Root() {
  const handleSubmit = (name: string) => {
    console.log('Form submitted with name:', name);
  };

  return (
    <div className={styles.login}>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}
