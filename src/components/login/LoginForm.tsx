import { Button, TextField } from '@radix-ui/themes';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onSubmit: (name: string) => void;
}

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    onSubmit(name);
  };

  return (
    <form method="post" onSubmit={handleSubmit} className={styles.form}>
      <TextField.Root size="2" placeholder="First name" name="name" />
      <Button type="submit">Get started</Button>
    </form>
  );
};
