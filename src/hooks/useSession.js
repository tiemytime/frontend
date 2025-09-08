import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSessionStore from '../stores/sessionStore';

// Hook to initialize and track user session
export const useSessionTracking = () => {
  const {
    initializeSession,
    updateLastActivity,
    trackPageView,
    updateTimeSpent,
    sessionId
  } = useSessionStore();
  
  const location = useLocation();
  
  // Initialize session on mount
  useEffect(() => {
    if (!sessionId) {
      initializeSession();
    }
  }, [sessionId, initializeSession]);
  
  // Track page views when location changes
  useEffect(() => {
    if (sessionId) {
      const pageName = location.pathname;
      trackPageView(pageName);
      updateLastActivity();
    }
  }, [location.pathname, sessionId, trackPageView, updateLastActivity]);
  
  // Update time spent periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateTimeSpent();
      updateLastActivity();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [updateTimeSpent, updateLastActivity]);
  
  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity();
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [updateLastActivity]);
  
  return null;
};

// Hook to track page analytics
export const usePageTracking = (pageName) => {
  const { trackPageView, updateLastActivity } = useSessionStore();
  
  useEffect(() => {
    trackPageView(pageName);
    updateLastActivity();
  }, [pageName, trackPageView, updateLastActivity]);
  
  return null;
};
