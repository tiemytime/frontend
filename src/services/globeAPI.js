// Globe-specific API service - Orchestrates globe display data
import { eventAPI } from './eventAPI.js';
import { aiPrayerAPI } from './aiPrayerAPI.js';
import { handleAPIError } from './errorHandler.js';

/**
 * Globe API Service - Handles globe-specific data orchestration
 */
export const globeAPI = {
  /**
   * Get complete globe prayer summary (most relevant event + short prayer)
   */
  async getGlobePrayerSummary() {
    try {
      // Get the most relevant event
      const eventResponse = await eventAPI.getMostRelevantEvent();
      const mostRelevantEvent = eventResponse.data;

      if (!mostRelevantEvent) {
        throw new Error('No relevant events found');
      }

      // Generate short prayer for this event
      const prayerResponse = await aiPrayerAPI.generateShortPrayer(mostRelevantEvent);
      const shortPrayerData = prayerResponse.data;

      return {
        data: {
          event: mostRelevantEvent,
          shortPrayer: shortPrayerData.shortPrayer,
          displayText: shortPrayerData.shortPrayer,
          generatedAt: shortPrayerData.generatedAt,
        },
      };
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to get globe prayer summary');
      throw errorInfo;
    }
  },

  /**
   * Refresh globe prayer data
   */
  async refreshGlobePrayer() {
    return this.getGlobePrayerSummary();
  },
};
