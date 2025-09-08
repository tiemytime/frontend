// Prayer-specific API service
import { apiClient, isMockMode, handleAPIError } from './api.js';
import { ENV } from './environment.js';

// Mock data imports
import { allMockPrayers } from '../data/mockWallPrayers.js';

/**
 * Prayer API endpoints
 */
const ENDPOINTS = {
  PRAYERS: '/api/prayers',
  PRAYER_BY_ID: (id) => `/api/prayers/${id}`,
  PRAYERS_SEARCH: '/api/prayers/search',
  PRAYERS_FILTER: '/api/prayers/filter',
  PRAYERS_COUNT: '/api/prayers/count',
};

/**
 * Prayer validation schemas
 */
export const PrayerSchema = {
  create: {
    title: { required: true, maxLength: 100 },
    message: { required: true, maxLength: 500 },
    category: { required: true },
    isAnonymous: { required: false, default: false },
    location: { required: false },
    tags: { required: false, default: [] },
    // New fields for event-based prayers
    eventId: { required: false },
    eventTitle: { required: false },
    userName: { required: true, minLength: 2, maxLength: 50 },
    userEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    userAge: { required: true, min: 13, max: 120 },
    userLocation: { required: true, minLength: 2, maxLength: 100 },
    isAIGenerated: { required: false, default: false },
  },
  update: {
    title: { required: false, maxLength: 100 },
    message: { required: false, maxLength: 500 },
    category: { required: false },
    isAnonymous: { required: false },
    location: { required: false },
    tags: { required: false },
  },
  submission: {
    userName: { required: true, minLength: 2, maxLength: 50 },
    userEmail: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    userAge: { required: true, min: 13, max: 120 },
    userLocation: { required: true, minLength: 2, maxLength: 100 },
    prayerTitle: { required: true, maxLength: 100 },
    prayerMessage: { required: true, maxLength: 500 },
    eventId: { required: false },
    isAnonymous: { required: false, default: false },
    isAIGenerated: { required: false, default: false },
  },
};

/**
 * Validate prayer data
 */
const validatePrayerData = (data, schema) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      errors.push(`${field} must be ${rules.maxLength} characters or less`);
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

/**
 * Mock data functions for development
 */
const mockAPI = {
  async getAllPrayers(params = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let prayers = [...allMockPrayers];
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      prayers = prayers.filter(prayer => 
        prayer.title.toLowerCase().includes(searchTerm) ||
        prayer.message.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (params.category && params.category !== 'All') {
      prayers = prayers.filter(prayer => prayer.category === params.category);
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || ENV.PAGINATION_SIZE;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPrayers = prayers.slice(startIndex, endIndex);
    
    return {
      data: paginatedPrayers,
      pagination: {
        page,
        limit,
        total: prayers.length,
        totalPages: Math.ceil(prayers.length / limit),
        hasNext: endIndex < prayers.length,
        hasPrev: page > 1,
      },
    };
  },

  async getPrayerById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const prayer = allMockPrayers.find(p => p.id === id);
    if (!prayer) {
      throw new Error('Prayer not found');
    }
    
    return { data: prayer };
  },

  async createPrayer(prayerData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    validatePrayerData(prayerData, PrayerSchema.create);
    
    const newPrayer = {
      id: Date.now().toString(),
      ...prayerData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
    };
    
    return { data: newPrayer };
  },

  async updatePrayer(id, prayerData) {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    validatePrayerData(prayerData, PrayerSchema.update);
    
    const prayer = allMockPrayers.find(p => p.id === id);
    if (!prayer) {
      throw new Error('Prayer not found');
    }
    
    const updatedPrayer = {
      ...prayer,
      ...prayerData,
      updatedAt: new Date().toISOString(),
    };
    
    return { data: updatedPrayer };
  },

  async deletePrayer(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const prayer = allMockPrayers.find(p => p.id === id);
    if (!prayer) {
      throw new Error('Prayer not found');
    }
    
    return { success: true };
  },

  async getPrayersCount() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return {
      data: {
        total: allMockPrayers.length,
        byCategory: allMockPrayers.reduce((acc, prayer) => {
          acc[prayer.category] = (acc[prayer.category] || 0) + 1;
          return acc;
        }, {}),
      },
    };
  },

  async submitEventPrayer(prayerSubmission) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    validatePrayerData(prayerSubmission, PrayerSchema.submission);
    
    const newPrayer = {
      id: Date.now().toString(),
      title: prayerSubmission.prayerTitle,
      message: prayerSubmission.prayerMessage,
      userName: prayerSubmission.isAnonymous ? 'Anonymous' : prayerSubmission.userName,
      userEmail: prayerSubmission.userEmail,
      userAge: prayerSubmission.userAge,
      userLocation: prayerSubmission.userLocation,
      eventId: prayerSubmission.eventId || null,
      isAnonymous: prayerSubmission.isAnonymous || false,
      isAIGenerated: prayerSubmission.isAIGenerated || false,
      category: 'Event Prayer',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return { 
      data: newPrayer,
      message: 'Prayer submitted successfully',
      redirectTo: 'prayer-submission-success'
    };
  },

  async getRandomPrayer() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const randomIndex = Math.floor(Math.random() * allMockPrayers.length);
    const randomPrayer = allMockPrayers[randomIndex];
    
    return { data: randomPrayer };
  },

  async getPrayersByEvent(eventId, params = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let eventPrayers = allMockPrayers.filter(prayer => prayer.eventId === eventId);
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || ENV.PAGINATION_SIZE;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedPrayers = eventPrayers.slice(startIndex, endIndex);
    
    return {
      data: paginatedPrayers,
      pagination: {
        page,
        limit,
        total: eventPrayers.length,
        totalPages: Math.ceil(eventPrayers.length / limit),
        hasNext: endIndex < eventPrayers.length,
        hasPrev: page > 1,
      },
    };
  },
};

/**
 * Prayer API Service
 */
export const prayerAPI = {
  /**
   * Get all prayers with optional filtering and pagination
   */
  async getAllPrayers(params = {}) {
    if (isMockMode()) {
      return mockAPI.getAllPrayers(params);
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRAYERS, params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch prayers');
      throw errorInfo;
    }
  },

  /**
   * Get a specific prayer by ID
   */
  async getPrayerById(id) {
    if (!id) {
      throw new Error('Prayer ID is required');
    }

    if (isMockMode()) {
      return mockAPI.getPrayerById(id);
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRAYER_BY_ID(id));
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch prayer');
      throw errorInfo;
    }
  },

  /**
   * Create a new prayer
   */
  async createPrayer(prayerData) {
    if (!prayerData) {
      throw new Error('Prayer data is required');
    }

    if (isMockMode()) {
      return mockAPI.createPrayer(prayerData);
    }

    try {
      validatePrayerData(prayerData, PrayerSchema.create);
      const response = await apiClient.post(ENDPOINTS.PRAYERS, prayerData);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to create prayer');
      throw errorInfo;
    }
  },

  /**
   * Update an existing prayer
   */
  async updatePrayer(id, prayerData) {
    if (!id) {
      throw new Error('Prayer ID is required');
    }
    if (!prayerData) {
      throw new Error('Prayer data is required');
    }

    if (isMockMode()) {
      return mockAPI.updatePrayer(id, prayerData);
    }

    try {
      validatePrayerData(prayerData, PrayerSchema.update);
      const response = await apiClient.put(ENDPOINTS.PRAYER_BY_ID(id), prayerData);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to update prayer');
      throw errorInfo;
    }
  },

  /**
   * Delete a prayer
   */
  async deletePrayer(id) {
    if (!id) {
      throw new Error('Prayer ID is required');
    }

    if (isMockMode()) {
      return mockAPI.deletePrayer(id);
    }

    try {
      const response = await apiClient.delete(ENDPOINTS.PRAYER_BY_ID(id));
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to delete prayer');
      throw errorInfo;
    }
  },

  /**
   * Search prayers
   */
  async searchPrayers(query, params = {}) {
    if (!query) {
      throw new Error('Search query is required');
    }

    if (isMockMode()) {
      return mockAPI.getAllPrayers({ ...params, search: query });
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRAYERS_SEARCH, {
        q: query,
        ...params,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to search prayers');
      throw errorInfo;
    }
  },

  /**
   * Filter prayers by category
   */
  async filterPrayers(filters, params = {}) {
    if (!filters) {
      throw new Error('Filters are required');
    }

    if (isMockMode()) {
      return mockAPI.getAllPrayers({ ...params, ...filters });
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRAYERS_FILTER, {
        ...filters,
        ...params,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to filter prayers');
      throw errorInfo;
    }
  },

  /**
   * Get prayers count and statistics
   */
  async getPrayersCount() {
    if (isMockMode()) {
      return mockAPI.getPrayersCount();
    }

    try {
      const response = await apiClient.get(ENDPOINTS.PRAYERS_COUNT);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch prayers count');
      throw errorInfo;
    }
  },

  /**
   * Submit prayer with user details (for event-based prayers)
   */
  async submitEventPrayer(prayerSubmission) {
    if (!prayerSubmission) {
      throw new Error('Prayer submission data is required');
    }

    if (isMockMode()) {
      return mockAPI.submitEventPrayer(prayerSubmission);
    }

    try {
      validatePrayerData(prayerSubmission, PrayerSchema.submission);
      const response = await apiClient.post(`${ENDPOINTS.PRAYERS}/submit`, prayerSubmission);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to submit prayer');
      throw errorInfo;
    }
  },

  /**
   * Get a random prayer for thank you page
   */
  async getRandomPrayer() {
    if (isMockMode()) {
      return mockAPI.getRandomPrayer();
    }

    try {
      const response = await apiClient.get(`${ENDPOINTS.PRAYERS}/random`);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch random prayer');
      throw errorInfo;
    }
  },

  /**
   * Get prayers for a specific event
   */
  async getPrayersByEvent(eventId, params = {}) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    if (isMockMode()) {
      return mockAPI.getPrayersByEvent(eventId, params);
    }

    try {
      const response = await apiClient.get(`${ENDPOINTS.PRAYERS}/event/${eventId}`, params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event prayers');
      throw errorInfo;
    }
  },
};
