// Event-based API service for Globe markers and news events
import { apiClient, isMockMode, handleAPIError } from './api.js';
import { ENV } from './environment.js';

// Mock data imports
import { mockNews } from '../data/mockNews.js';

/**
 * Event API endpoints
 */
const EVENT_ENDPOINTS = {
  EVENTS: '/api/events',
  EVENT_BY_ID: (id) => `/api/events/${id}`,
  EVENT_MARKERS: '/api/events/markers',
  EVENT_PRAYERS: (eventId) => `/api/events/${eventId}/prayers`,
  EVENT_CATEGORIES: '/api/events/categories',
};

/**
 * Event validation schemas
 */
export const EventSchema = {
  getMarkers: {
    category: { required: false },
    active: { required: false, default: true },
  },
};

/**
 * Mock event API for development
 */
const mockEventAPI = {
  async getAllEvents(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let events = mockNews.map(newsItem => ({
      ...newsItem,
      eventId: newsItem.id,
      coordinates: {
        lat: parseFloat(newsItem.location?.split(',')[0] || '0'),
        lng: parseFloat(newsItem.location?.split(',')[1] || '0'),
      },
      markerType: 'news',
      isActive: true,
      prayerCount: Math.floor(Math.random() * 50) + 1,
    }));
    
    // Apply category filter
    if (params.category && params.category !== 'All') {
      events = events.filter(event => event.category === params.category);
    }
    
    // Apply active filter
    if (params.active !== undefined) {
      events = events.filter(event => event.isActive === params.active);
    }
    
    return {
      data: events,
      total: events.length,
    };
  },

  async getEventById(eventId) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const event = mockNews.find(item => item.id === eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    return {
      data: {
        ...event,
        eventId: event.id,
        coordinates: {
          lat: parseFloat(event.location?.split(',')[0] || '0'),
          lng: parseFloat(event.location?.split(',')[1] || '0'),
        },
        markerType: 'news',
        isActive: true,
        prayerCount: Math.floor(Math.random() * 50) + 1,
        relatedPrayers: [],
      },
    };
  },

  async getEventMarkers(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const events = await this.getAllEvents(params);
    
    const markers = events.data.map(event => ({
      id: event.eventId,
      title: event.title,
      coordinates: event.coordinates,
      category: event.category,
      markerType: event.markerType,
      prayerCount: event.prayerCount,
      description: event.description,
      publishedAt: event.publishedAt,
    }));
    
    return {
      data: markers,
      total: markers.length,
    };
  },

  async getMostRelevantEvent() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Get all events and find the most relevant one
    const events = await this.getAllEvents();
    
    // Define relevance priority order
    const relevancePriority = {
      'Critical': 4,
      'High': 3,
      'Medium': 2,
      'Low': 1,
    };
    
    // Find event with highest relevance, then by most recent
    const mostRelevant = events.data.reduce((prev, current) => {
      const prevPriority = relevancePriority[prev.relevance] || 0;
      const currentPriority = relevancePriority[current.relevance] || 0;
      
      if (currentPriority > prevPriority) {
        return current;
      } else if (currentPriority === prevPriority) {
        // If same relevance, pick more recent
        return new Date(current.publishedAt) > new Date(prev.publishedAt) ? current : prev;
      }
      return prev;
    });
    
    return {
      data: mostRelevant,
    };
  },

  async getEventPrayers(eventId, params = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock prayers for this event
    const mockPrayers = [
      {
        id: `prayer-${eventId}-1`,
        eventId,
        title: 'Prayer for healing',
        message: 'May those affected find strength and healing...',
        userName: 'John D.',
        userLocation: 'New York, USA',
        isAnonymous: false,
        createdAt: new Date().toISOString(),
      },
      {
        id: `prayer-${eventId}-2`,
        eventId,
        title: 'Hope and peace',
        message: 'Sending prayers for peace and hope...',
        userName: 'Anonymous',
        userLocation: 'California, USA',
        isAnonymous: true,
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Apply pagination if specified
    const page = params.page || 1;
    const limit = params.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedPrayers = mockPrayers.slice(startIndex, endIndex);
    
    return {
      data: paginatedPrayers,
      total: mockPrayers.length,
    };
  },
};

/**
 * Event API Service
 */
export const eventAPI = {
  /**
   * Get all events with optional filtering
   */
  async getAllEvents(params = {}) {
    if (isMockMode()) {
      return mockEventAPI.getAllEvents(params);
    }

    try {
      const response = await apiClient.get(EVENT_ENDPOINTS.EVENTS, params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch events');
      throw errorInfo;
    }
  },

  /**
   * Get a specific event by ID with details
   */
  async getEventById(eventId) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    if (isMockMode()) {
      return mockEventAPI.getEventById(eventId);
    }

    try {
      const response = await apiClient.get(EVENT_ENDPOINTS.EVENT_BY_ID(eventId));
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event details');
      throw errorInfo;
    }
  },

  /**
   * Get event markers for Globe component
   */
  async getEventMarkers(params = {}) {
    if (isMockMode()) {
      return mockEventAPI.getEventMarkers(params);
    }

    try {
      const response = await apiClient.get(EVENT_ENDPOINTS.EVENT_MARKERS, params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event markers');
      throw errorInfo;
    }
  },

  /**
   * Get prayers for a specific event
   */
  async getEventPrayers(eventId, params = {}) {
    if (!eventId) {
      throw new Error('Event ID is required');
    }

    if (isMockMode()) {
      return mockEventAPI.getEventPrayers(eventId, params);
    }

    try {
      const response = await apiClient.get(EVENT_ENDPOINTS.EVENT_PRAYERS(eventId), params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event prayers');
      throw errorInfo;
    }
  },

  /**
   * Get event categories for filtering
   */
  async getEventCategories() {
    if (isMockMode()) {
      const events = await mockEventAPI.getAllEvents();
      const categories = [...new Set(events.data.map(event => event.category))];
      return { data: categories };
    }

    try {
      const response = await apiClient.get(EVENT_ENDPOINTS.EVENT_CATEGORIES);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event categories');
      throw errorInfo;
    }
  },

  /**
   * Get the most relevant event for globe display
   */
  async getMostRelevantEvent() {
    if (isMockMode()) {
      return mockEventAPI.getMostRelevantEvent();
    }

    try {
      const response = await apiClient.get('/api/events/most-relevant');
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch most relevant event');
      throw errorInfo;
    }
  },
};
