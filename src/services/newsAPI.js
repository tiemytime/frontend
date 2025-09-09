// News API service for Globe component
import { apiClient, isMockMode, handleAPIError } from './api.js';
import { ENV } from './environment.js';

// Mock data imports
import { mockNewsData } from '../data/mockNews.js';

/**
 * News API endpoints
 */
const NEWS_ENDPOINTS = {
  NEWS: '/api/news',
  NEWS_BY_ID: (id) => `/api/news/${id}`,
  NEWS_SEARCH: '/api/news/search',
  NEWS_CATEGORIES: '/api/news/categories',
  NEWS_LATEST: '/api/news/latest',
};

/**
 * Mock news API for development
 */
const mockNewsAPI = {
  async getAllNews(params = {}) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    let news = [...mockNewsData];
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      news = news.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply category filter
    if (params.category && params.category !== 'All') {
      news = news.filter(item => item.category === params.category);
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedNews = news.slice(startIndex, endIndex);
    
    return {
      data: paginatedNews,
      pagination: {
        page,
        limit,
        total: news.length,
        totalPages: Math.ceil(news.length / limit),
        hasNext: endIndex < news.length,
        hasPrev: page > 1,
      },
    };
  },

  async getNewsById(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newsItem = mockNewsData.find(item => item.id === id);
    if (!newsItem) {
      throw new Error('News item not found');
    }
    
    return { data: newsItem };
  },

  async getLatestNews(limit = 5) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const sortedNews = [...mockNewsData]
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
      .slice(0, limit);
    
    return { data: sortedNews };
  },

  async getNewsCategories() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const categories = [...new Set(mockNewsData.map(item => item.category))];
    
    return { data: categories };
  },
};

/**
 * News API Service
 */
export const newsAPI = {
  /**
   * Get all news with optional filtering and pagination
   */
  async getAllNews(params = {}) {
    if (isMockMode()) {
      return mockNewsAPI.getAllNews(params);
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS, params);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch news');
      throw errorInfo;
    }
  },

  /**
   * Get a specific news item by ID
   */
  async getNewsById(id) {
    if (!id) {
      throw new Error('News ID is required');
    }

    if (isMockMode()) {
      return mockNewsAPI.getNewsById(id);
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS_BY_ID(id));
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch news item');
      throw errorInfo;
    }
  },

  /**
   * Search news
   */
  async searchNews(query, params = {}) {
    if (!query) {
      throw new Error('Search query is required');
    }

    if (isMockMode()) {
      return mockNewsAPI.getAllNews({ ...params, search: query });
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS_SEARCH, {
        q: query,
        ...params,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to search news');
      throw errorInfo;
    }
  },

  /**
   * Get latest news
   */
  async getLatestNews(limit = 5) {
    if (isMockMode()) {
      return mockNewsAPI.getLatestNews(limit);
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS_LATEST, {
        limit,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch latest news');
      throw errorInfo;
    }
  },

  /**
   * Get news categories
   */
  async getNewsCategories() {
    if (isMockMode()) {
      return mockNewsAPI.getNewsCategories();
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS_CATEGORIES);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch news categories');
      throw errorInfo;
    }
  },

  /**
   * Filter news by category
   */
  async filterNewsByCategory(category, params = {}) {
    if (!category) {
      throw new Error('Category is required');
    }

    if (isMockMode()) {
      return mockNewsAPI.getAllNews({ ...params, category });
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS, {
        category,
        ...params,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to filter news');
      throw errorInfo;
    }
  },

  /**
   * Get event with highest relevance score for global prayer display
   */
  async getTopRelevanceEvent() {
    if (isMockMode()) {
      // Return event with highest relevance from mock data
      const topEvent = mockNewsData.reduce((highest, current) => 
        (current.relevance === 'Critical' || current.relevance === 'High') && 
        (!highest || current.relevance === 'Critical') ? current : highest
      );
      
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: topEvent, success: true };
    }

    try {
      const response = await apiClient.get(NEWS_ENDPOINTS.NEWS_LATEST, {
        sortBy: 'relevance',
        limit: 1
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch top relevance event');
      throw errorInfo;
    }
  },

  /**
   * Get default prayer for a specific event
   */
  async getEventDefaultPrayer(eventId) {
    if (isMockMode()) {
      // Mock default prayer based on event
      const event = mockNewsData.find(e => e.id === eventId);
      if (!event) throw new Error('Event not found');
      
      const mockPrayer = {
        id: `prayer_${eventId}`,
        eventId,
        prayerText: `May peace and healing reach all those affected by ${event.eventTitle}. We send our collective love and support to ${event.location}.`,
        audioUrl: `/audio/prayer_${eventId}.mp3`, // Mock audio URL
        duration: 45, // seconds
        generatedAt: new Date().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 400));
      return { data: mockPrayer, success: true };
    }

    try {
      const response = await apiClient.get(`${NEWS_ENDPOINTS.NEWS_BY_ID(eventId)}/default-prayer`);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event default prayer');
      throw errorInfo;
    }
  },

  /**
   * Get audio prayer URL for event
   */
  async getEventAudioPrayer(eventId) {
    if (isMockMode()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      return { 
        data: { 
          audioUrl: `/audio/prayer_${eventId}.mp3`,
          duration: 45
        }, 
        success: true 
      };
    }

    try {
      const response = await apiClient.get(`${NEWS_ENDPOINTS.NEWS_BY_ID(eventId)}/audio-prayer`);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch event audio prayer');
      throw errorInfo;
    }
  },
};
