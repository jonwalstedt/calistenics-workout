import { useState, useEffect } from 'react';
import { Box, Text } from '@radix-ui/themes';
import styles from './OfflineNotification.module.css';

export function OfflineNotification() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    // Set initial state
    setIsOffline(!navigator.onLine);
    
    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  if (!isOffline) return null;
  
  return (
    <Box className={styles.offlineNotification}>
      <Text as="p" size="2" className={styles.offlineText}>
        <span className={styles.offlineIcon}>📶</span> You're offline. Some features may be limited.
      </Text>
    </Box>
  );
} 