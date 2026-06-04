import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
export const useHydrationReminder = () => {
  const {
    user
  } = useAuth();
  const intervalRef = useRef(null);
  useEffect(() => {
    // Check if notifications are enabled in user settings
    const notificationsEnabled = user?.notifications;
    if (notificationsEnabled) {
      // Request permission from the browser if not already granted
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
      }
      if (Notification.permission === 'granted') {
        // Set an interval to show a notification every 1 hour (3600000 ms)
        // For testing, you could change this to something smaller like 10000 (10 seconds)
        intervalRef.current = setInterval(() => {
          new Notification('Time to Hydrate! 💧', {
            body: `Hey ${user?.name?.split(' ')[0] || 'there'}, don't forget to drink water and reach your ${user?.dailyGoal}ml goal today!`,
            icon: '/favicon.ico' // Assuming a favicon exists, or remove if not
          });
        }, 60 * 60 * 1000); // 1 hour
      }
    }

    // Cleanup interval on unmount or when settings change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [user]);
};