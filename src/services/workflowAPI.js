// Application workflow API - Orchestrates the complete user journey
import { eventAPI } from './eventAPI.js';
import { aiPrayerAPI } from './aiPrayerAPI.js';
import { prayerAPI } from './prayerAPI.js';
import { userSessionAPI, JOURNEY_STATES } from './userSessionAPI.js';
import { handleAPIError } from './errorHandler.js';

/**
 * Application Workflow API Service
 * Handles the complete user journey through the application
 */
export const workflowAPI = {
  /**
   * Step 1: Initialize Globe view and get event markers
   */
  async initializeGlobeView() {
    try {
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.GLOBE_VIEWING);
      
      // Get event markers for globe
      const markersResponse = await eventAPI.getEventMarkers({
        active: true,
      });
      
      return {
        markers: markersResponse.data,
        journeyState: JOURNEY_STATES.GLOBE_VIEWING,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to initialize globe view');
      throw errorInfo;
    }
  },

  /**
   * Step 2: Handle marker click - Get event details
   */
  async handleMarkerClick(eventId) {
    try {
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.EVENT_DETAILS);
      
      // Get event details
      const eventResponse = await eventAPI.getEventById(eventId);
      const eventData = eventResponse.data;
      
      // Save current event context
      userSessionAPI.saveCurrentEvent(eventData);
      
      // Get AI prayer suggestions for this event category
      const suggestionsResponse = await aiPrayerAPI.getPrayerSuggestions(eventData.category);
      
      return {
        event: eventData,
        prayerSuggestions: suggestionsResponse.data,
        journeyState: JOURNEY_STATES.EVENT_DETAILS,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to get event details');
      throw errorInfo;
    }
  },

  /**
   * Step 3: Generate AI prayer for the event
   */
  async generatePrayerForEvent(prayerOptions = {}) {
    try {
      const currentEvent = userSessionAPI.getCurrentEvent();
      if (!currentEvent) {
        throw new Error('No event context found. Please select an event first.');
      }

      // Generate AI prayer
      const prayerResponse = await aiPrayerAPI.generatePrayer(
        {
          eventId: currentEvent.eventId,
          eventTitle: currentEvent.title,
          eventDescription: currentEvent.description,
          eventCategory: currentEvent.category,
        },
        prayerOptions
      );
      
      const generatedPrayer = prayerResponse.data;
      
      // Save current prayer context
      userSessionAPI.saveCurrentPrayer(generatedPrayer);
      
      return {
        generatedPrayer,
        event: currentEvent,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to generate AI prayer');
      throw errorInfo;
    }
  },

  /**
   * Step 4: Handle prayer sharing form submission
   */
  async submitPrayerWithUserDetails(userDetails, customPrayerText = null) {
    try {
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.PRAYER_SHARING);
      
      // Validate and save user details
      aiPrayerAPI.validateUserDetails(userDetails);
      userSessionAPI.saveUserDetails(userDetails);
      
      const currentEvent = userSessionAPI.getCurrentEvent();
      const currentPrayer = userSessionAPI.getCurrentPrayer();
      
      // Use custom prayer text or AI-generated prayer
      const prayerText = customPrayerText || currentPrayer?.generatedPrayer;
      if (!prayerText) {
        throw new Error('No prayer text provided');
      }
      
      // Prepare submission data
      const submissionData = {
        prayerTitle: `Prayer for ${currentEvent?.title || 'Peace'}`,
        prayerMessage: prayerText,
        userName: userDetails.isAnonymous ? 'Anonymous' : userDetails.userName,
        userEmail: userDetails.email,
        userAge: parseInt(userDetails.age),
        userLocation: userDetails.location,
        eventId: currentEvent?.eventId,
        isAnonymous: userDetails.isAnonymous || false,
        isAIGenerated: !!currentPrayer?.isAIGenerated,
      };
      
      // Submit prayer
      const submissionResponse = await prayerAPI.submitEventPrayer(submissionData);
      
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.PRAYER_SUBMITTED);
      
      return {
        submission: submissionResponse.data,
        redirectTo: submissionResponse.redirectTo,
        journeyState: JOURNEY_STATES.PRAYER_SUBMITTED,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to submit prayer');
      throw errorInfo;
    }
  },

  /**
   * Step 5: Get data for prayer submission success page
   */
  async getPrayerSubmissionPageData() {
    try {
      // Get a random prayer to display
      const randomPrayerResponse = await prayerAPI.getRandomPrayer();
      
      // Get user session context
      const sessionContext = userSessionAPI.getSessionContext();
      
      return {
        randomPrayer: randomPrayerResponse.data,
        userDetails: sessionContext.userDetails,
        submittedEvent: sessionContext.currentEvent,
        journeyState: JOURNEY_STATES.PRAYER_SUBMITTED,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to get submission page data');
      throw errorInfo;
    }
  },

  /**
   * Step 6: Navigate to Wall of Prayers
   */
  async navigateToWallOfPrayers(params = {}) {
    try {
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.WALL_OF_PRAYERS);
      
      // Get all prayers with filters
      const prayersResponse = await prayerAPI.getAllPrayers({
        page: params.page || 1,
        limit: params.limit || 18,
        category: params.category || 'All',
        search: params.search || '',
      });
      
      // Get prayers count
      const countResponse = await prayerAPI.getPrayersCount();
      
      return {
        prayers: prayersResponse.data,
        pagination: prayersResponse.pagination,
        totalCount: countResponse.data.total,
        countByCategory: countResponse.data.byCategory,
        journeyState: JOURNEY_STATES.WALL_OF_PRAYERS,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to load wall of prayers');
      throw errorInfo;
    }
  },

  /**
   * Step 7: Handle prayer card click in wall of prayers
   */
  async handlePrayerCardClick(prayerId) {
    try {
      // Update journey state
      userSessionAPI.updateJourneyState(JOURNEY_STATES.PRAYER_DETAIL_VIEW);
      
      // Get prayer details
      const prayerResponse = await prayerAPI.getPrayerById(prayerId);
      const prayerData = prayerResponse.data;
      
      // If prayer is associated with an event, get event details
      let eventData = null;
      if (prayerData.eventId) {
        try {
          const eventResponse = await eventAPI.getEventById(prayerData.eventId);
          eventData = eventResponse.data;
          userSessionAPI.saveCurrentEvent(eventData);
        } catch (eventError) {
          console.warn('Could not fetch event details:', eventError.message);
        }
      }
      
      // Save current prayer context
      userSessionAPI.saveCurrentPrayer(prayerData);
      
      return {
        prayer: prayerData,
        event: eventData,
        canSharePrayer: true,
        journeyState: JOURNEY_STATES.PRAYER_DETAIL_VIEW,
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to get prayer details');
      throw errorInfo;
    }
  },

  /**
   * Get current user journey context
   */
  getCurrentContext() {
    const context = userSessionAPI.getSessionContext();
    return {
      ...context,
      hasRequiredDetails: userSessionAPI.hasRequiredUserDetails(),
    };
  },

  /**
   * Reset user journey (e.g., for new session)
   */
  resetJourney() {
    userSessionAPI.clearAllSessionData();
    userSessionAPI.initializeSession();
    return {
      journeyState: JOURNEY_STATES.GLOBE_VIEWING,
      message: 'Journey reset successfully',
    };
  },

  /**
   * Quick navigation helpers
   */
  async quickNavigateToGlobe() {
    return this.initializeGlobeView();
  },

  async quickNavigateToWall() {
    return this.navigateToWallOfPrayers();
  },

  /**
   * Get prayer sharing form data based on current context
   */
  getPrayerSharingFormData() {
    const currentEvent = userSessionAPI.getCurrentEvent();
    const currentPrayer = userSessionAPI.getCurrentPrayer();
    const userDetails = userSessionAPI.getUserDetails();
    
    return {
      event: currentEvent,
      generatedPrayer: currentPrayer,
      savedUserDetails: userDetails,
      prayerOptions: aiPrayerAPI.getPrayerOptions(),
    };
  },
};
