import { Button, Heading, Text, Box, Flex } from '@radix-ui/themes';
import { Link, Navigate } from 'react-router-dom';
import { ThemeToggle } from '../../components/theme';
import { useUser } from '../../context';
import styles from './Settings.module.css';

export function Settings() {
  const { isLoggedIn, user, logout } = useUser();
  
  // Redirect to login page if not logged in
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Heading as="h1" size="6">
          Settings
        </Heading>
        <Button asChild variant="soft" size="2">
          <Link to="/">Back to Dashboard</Link>
        </Button>
      </div>
      
      <Box className={styles.section}>
        <Heading as="h2" size="4" className={styles.sectionTitle}>
          Appearance
        </Heading>
        <Flex align="center" justify="between" className={styles.settingItem}>
          <Text>Theme</Text>
          <ThemeToggle />
        </Flex>
      </Box>
      
      <Box className={styles.section}>
        <Heading as="h2" size="4" className={styles.sectionTitle}>
          Account
        </Heading>
        <div className={styles.accountInfo}>
          <Text as="p">
            <strong>Name:</strong> {user?.name}
          </Text>
          <Text as="p">
            <strong>Workouts completed:</strong> {user?.completedWorkouts.length || 0}
          </Text>
          <Text as="p">
            <strong>Account created:</strong> {new Date(user?.createdAt || '').toLocaleDateString()}
          </Text>
          <Text as="p">
            <strong>Last login:</strong> {new Date(user?.lastLogin || '').toLocaleString()}
          </Text>
        </div>
        
        <Button 
          color="red" 
          variant="soft" 
          className={styles.logoutButton}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
      
      <Box className={styles.section}>
        <Heading as="h2" size="4" className={styles.sectionTitle}>
          About
        </Heading>
        <Text as="p" className={styles.aboutText}>
          Calisthenics Workout App v1.0.0
        </Text>
        <Text as="p" className={styles.aboutText}>
          A mobile-first PWA for tracking your calisthenics workouts.
        </Text>
      </Box>
    </div>
  );
} 