// User session and flow management API service
import { isMockMode } from './api.js';

/**
 * User session storage keys
 */
const SESSION_KEYS = {
  USER_DETAILS: 'userSessionDetails',
  CURRENT_EVENT: 'currentEvent',
  CURRENT_PRAYER: 'currentPrayer',
  USER_JOURNEY: 'userJourney',
};

/**
 * User journey states
 */
export const JOURNEY_STATES = {
  GLOBE_VIEWING: 'globe_viewing',
  EVENT_DETAILS: 'event_details',
  PRAYER_SHARING: 'prayer_sharing',
  PRAYER_SUBMITTED: 'prayer_submitted',
  WALL_OF_PRAYERS: 'wall_of_prayers',
  PRAYER_DETAIL_VIEW: 'prayer_detail_view',
};

/**
 * Mock user session for development
 */
const mockUserSession = {
  userDetails: null,
  currentEvent: null,
  currentPrayer: null,
  journeyState: JOURNEY_STATES.GLOBE_VIEWING,
  sessionId: null,
};

/**
 * User Session API Service
 */
export const userSessionAPI = {
  /**
   * Initialize user session
   */
  initializeSession() {
    const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    if (isMockMode()) {
      mockUserSession.sessionId = sessionId;
      mockUserSession.journeyState = JOURNEY_STATES.GLOBE_VIEWING;
      this.saveToStorage(SESSION_KEYS.USER_JOURNEY, mockUserSession);
    }
    
    return { sessionId, state: JOURNEY_STATES.GLOBE_VIEWING };
  },

  /**
   * Save user details from prayer sharing form
   */
  saveUserDetails(userDetails) {
    const validatedDetails = {
      userName: userDetails.userName,
      email: userDetails.email,
      age: parseInt(userDetails.age),
      location: userDetails.location,
      isAnonymous: userDetails.isAnonymous || false,
      timestamp: new Date().toISOString(),
    };

    if (isMockMode()) {
      mockUserSession.userDetails = validatedDetails;
    }
    
    this.saveToStorage(SESSION_KEYS.USER_DETAILS, validatedDetails);
    return validatedDetails;
  },

  /**
   * Get saved user details
   */
  getUserDetails() {
    if (isMockMode() && mockUserSession.userDetails) {
      return mockUserSession.userDetails;
    }
    
    return this.getFromStorage(SESSION_KEYS.USER_DETAILS);
  },

  /**
   * Save current event context
   */
  saveCurrentEvent(eventData) {
    const eventContext = {
      eventId: eventData.eventId || eventData.id,
      title: eventData.title,
      description: eventData.description,
      category: eventData.category,
      coordinates: eventData.coordinates,
      timestamp: new Date().toISOString(),
    };

    if (isMockMode()) {
      mockUserSession.currentEvent = eventContext;
    }
    
    this.saveToStorage(SESSION_KEYS.CURRENT_EVENT, eventContext);
    return eventContext;
  },

  /**
   * Get current event context
   */
  getCurrentEvent() {
    if (isMockMode() && mockUserSession.currentEvent) {
      return mockUserSession.currentEvent;
    }
    
    return this.getFromStorage(SESSION_KEYS.CURRENT_EVENT);
  },

  /**
   * Save current prayer context
   */
  saveCurrentPrayer(prayerData) {
    const prayerContext = {
      prayerId: prayerData.id,
      title: prayerData.title,
      message: prayerData.message,
      eventId: prayerData.eventId,
      isAIGenerated: prayerData.isAIGenerated || false,
      timestamp: new Date().toISOString(),
    };

    if (isMockMode()) {
      mockUserSession.currentPrayer = prayerContext;
    }
    
    this.saveToStorage(SESSION_KEYS.CURRENT_PRAYER, prayerContext);
    return prayerContext;
  },

  /**
   * Get current prayer context
   */
  getCurrentPrayer() {
    if (isMockMode() && mockUserSession.currentPrayer) {
      return mockUserSession.currentPrayer;
    }
    
    return this.getFromStorage(SESSION_KEYS.CURRENT_PRAYER);
  },

  /**
   * Update user journey state
   */
  updateJourneyState(newState) {
    if (!Object.values(JOURNEY_STATES).includes(newState)) {
      throw new Error(`Invalid journey state: ${newState}`);
    }

    const journeyData = {
      state: newState,
      previousState: this.getCurrentJourneyState(),
      timestamp: new Date().toISOString(),
      sessionId: this.getSessionId(),
    };

    if (isMockMode()) {
      mockUserSession.journeyState = newState;
    }
    
    this.saveToStorage(SESSION_KEYS.USER_JOURNEY, journeyData);
    return journeyData;
  },

  /**
   * Get current journey state
   */
  getCurrentJourneyState() {
    if (isMockMode()) {
      return mockUserSession.journeyState;
    }
    
    const journeyData = this.getFromStorage(SESSION_KEYS.USER_JOURNEY);
    return journeyData?.state || JOURNEY_STATES.GLOBE_VIEWING;
  },

  /**
   * Get session ID
   */
  getSessionId() {
    if (isMockMode()) {
      return mockUserSession.sessionId;
    }
    
    const journeyData = this.getFromStorage(SESSION_KEYS.USER_JOURNEY);
    return journeyData?.sessionId;
  },

  /**
   * Clear specific session data
   */
  clearSessionData(dataType) {
    const validTypes = Object.values(SESSION_KEYS);
    if (!validTypes.includes(dataType)) {
      throw new Error(`Invalid session data type: ${dataType}`);
    }

    if (isMockMode()) {
      switch (dataType) {
        case SESSION_KEYS.USER_DETAILS:
          mockUserSession.userDetails = null;
          break;
        case SESSION_KEYS.CURRENT_EVENT:
          mockUserSession.currentEvent = null;
          break;
        case SESSION_KEYS.CURRENT_PRAYER:
          mockUserSession.currentPrayer = null;
          break;
        case SESSION_KEYS.USER_JOURNEY:
          mockUserSession.journeyState = JOURNEY_STATES.GLOBE_VIEWING;
          break;
      }
    }
    
    localStorage.removeItem(dataType);
  },

  /**
   * Clear all session data
   */
  clearAllSessionData() {
    Object.values(SESSION_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });

    if (isMockMode()) {
      mockUserSession.userDetails = null;
      mockUserSession.currentEvent = null;
      mockUserSession.currentPrayer = null;
      mockUserSession.journeyState = JOURNEY_STATES.GLOBE_VIEWING;
    }
  },

  /**
   * Get complete session context
   */
  getSessionContext() {
    return {
      userDetails: this.getUserDetails(),
      currentEvent: this.getCurrentEvent(),
      currentPrayer: this.getCurrentPrayer(),
      journeyState: this.getCurrentJourneyState(),
      sessionId: this.getSessionId(),
    };
  },

  /**
   * Check if user has required details for prayer submission
   */
  hasRequiredUserDetails() {
    const userDetails = this.getUserDetails();
    return userDetails && 
           userDetails.userName && 
           userDetails.email && 
           userDetails.age && 
           userDetails.location;
  },

  /**
   * Prepare prayer submission data from session
   */
  preparePrayerSubmissionData(prayerText, eventId = null) {
    const userDetails = this.getUserDetails();
    const currentEvent = this.getCurrentEvent();
    
    if (!userDetails) {
      throw new Error('User details are required for prayer submission');
    }
    
    return {
      prayerTitle: `Prayer for ${currentEvent?.title || 'Peace'}`,
      prayerMessage: prayerText,
      userName: userDetails.isAnonymous ? 'Anonymous' : userDetails.userName,
      userEmail: userDetails.email,
      userAge: userDetails.age,
      userLocation: userDetails.location,
      eventId: eventId || currentEvent?.eventId,
      isAnonymous: userDetails.isAnonymous,
      isAIGenerated: false,
    };
  },

  /**
   * Save to localStorage with error handling
   */
  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.warn(`Failed to save to localStorage: ${error.message}`);
    }
  },

  /**
   * Get from localStorage with error handling
   */
  getFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.warn(`Failed to get from localStorage: ${error.message}`);
      return null;
    }
  },
};
