// Main API services export - Central entry point for all API services
export { apiClient, setAuthToken, clearAuthToken, isMockMode, APIError } from './api.js';
export { prayerAPI, PrayerSchema } from './prayerAPI.js';
export { authAPI, AuthSchema } from './authAPI.js';
export { newsAPI } from './newsAPI.js';
export { eventAPI, EventSchema } from './eventAPI.js';
export { aiPrayerAPI, AIPrayerSchema, PRAYER_OPTIONS } from './aiPrayerAPI.js';
export { audioAPI, AudioPlayer } from './audioAPI.js';
export { userSessionAPI, JOURNEY_STATES } from './userSessionAPI.js';
export { globeAPI } from './globeAPI.js';
export { 
  handleAPIError, 
  ErrorReporter, 
  RetryHandler, 
  ERROR_TYPES, 
  ERROR_MESSAGES,
  errorReporter 
} from './errorHandler.js';

// Import services for internal use
import { prayerAPI } from './prayerAPI.js';
import { authAPI } from './authAPI.js';
import { newsAPI } from './newsAPI.js';
import { eventAPI } from './eventAPI.js';
import { userSessionAPI } from './userSessionAPI.js';

/**
 * Initialize API services
 * Call this function when the app starts
 */
export const initializeAPI = () => {
  // Initialize authentication state
  authAPI.initializeAuth();
  
  // Initialize user session
  userSessionAPI.initializeSession();
  
  // You can add other initialization logic here
  console.log('API services initialized');
};

/**
 * Service status checker
 */
export const checkServiceHealth = async () => {
  const services = {
    prayer: false,
    news: false,
    events: false,
    auth: false,
  };

  try {
    // Check prayer service
    await prayerAPI.getPrayersCount();
    services.prayer = true;
  } catch (error) {
    console.warn('Prayer service unavailable:', error.message);
  }

  try {
    // Check news service
    await newsAPI.getLatestNews(1);
    services.news = true;
  } catch (error) {
    console.warn('News service unavailable:', error.message);
  }

  try {
    // Check events service
    await eventAPI.getEventMarkers();
    services.events = true;
  } catch (error) {
    console.warn('Events service unavailable:', error.message);
  }

  try {
    // Check auth service (if user is logged in)
    if (authAPI.isAuthenticated()) {
      await authAPI.getProfile();
    }
    services.auth = true;
  } catch (error) {
    console.warn('Auth service unavailable:', error.message);
  }

  return services;
};

/**
 * Utility function to refresh all data
 */
export const refreshAllData = async () => {
  const promises = [];

  // Refresh prayers
  promises.push(
    prayerAPI.getAllPrayers().catch(error => ({ error: error.message }))
  );

  // Refresh news
  promises.push(
    newsAPI.getLatestNews().catch(error => ({ error: error.message }))
  );

  const results = await Promise.all(promises);
  
  return {
    prayers: results[0],
    news: results[1],
  };
};
