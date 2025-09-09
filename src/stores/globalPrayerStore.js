// Global prayer store for managing globe display prayer
import { create } from 'zustand';
import { newsAPI } from '../services/newsAPI.js';
import { aiPrayerAPI } from '../services/aiPrayerAPI.js';

const useGlobalPrayerStore = create((set, get) => ({
  // State
  currentGlobalPrayer: 'Gaza victims and families', // Default fallback
  topRelevanceEvent: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
  refreshInterval: 6 * 60 * 60 * 1000, // 6 hours in milliseconds

  // Actions
  fetchGlobalPrayer: async () => {
    const { lastUpdated, refreshInterval } = get();
    
    // Check if we need to refresh (6 hours interval)
    if (lastUpdated && Date.now() - lastUpdated < refreshInterval) {
      return; // Still fresh, no need to fetch
    }

    set({ isLoading: true, error: null });

    try {
      // Step 1: Get top relevance event
      const eventResponse = await newsAPI.getTopRelevanceEvent();
      
      if (!eventResponse.success || !eventResponse.data) {
        throw new Error('No top relevance event found');
      }

      const topEvent = eventResponse.data;

      // Step 2: Generate short prayer for the event
      const prayerResponse = await aiPrayerAPI.generateGlobalPrayer(topEvent, 50);
      
      if (!prayerResponse.success || !prayerResponse.data) {
        throw new Error('Failed to generate global prayer');
      }

      const globalPrayer = prayerResponse.data;

      set({
        currentGlobalPrayer: globalPrayer.shortPrayer,
        topRelevanceEvent: topEvent,
        isLoading: false,
        error: null,
        lastUpdated: Date.now()
      });

    } catch (error) {
      console.error('Failed to fetch global prayer:', error);
      set({
        isLoading: false,
        error: error.message,
        // Keep existing prayer on error
      });
    }
  },

  // Force refresh global prayer
  refreshGlobalPrayer: async () => {
    set({ lastUpdated: null }); // Reset timestamp to force refresh
    await get().fetchGlobalPrayer();
  },

  // Manual update for testing
  setGlobalPrayer: (prayer) => {
    set({ currentGlobalPrayer: prayer });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Initialize auto-refresh
  startAutoRefresh: () => {
    const { refreshInterval, fetchGlobalPrayer } = get();
    
    // Initial fetch
    fetchGlobalPrayer();
    
    // Set up interval for auto-refresh
    const intervalId = setInterval(fetchGlobalPrayer, refreshInterval);
    
    // Store interval ID for cleanup
    set({ autoRefreshId: intervalId });
    
    return intervalId;
  },

  // Stop auto-refresh
  stopAutoRefresh: () => {
    const { autoRefreshId } = get();
    if (autoRefreshId) {
      clearInterval(autoRefreshId);
      set({ autoRefreshId: null });
    }
  }
}));

export default useGlobalPrayerStore;
