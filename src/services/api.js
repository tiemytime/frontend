// Main API service configuration and base functionality
import { ENV } from './environment.js';

/**
 * API Configuration
 */
const API_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

/**
 * API Error Class
 */
export class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Base HTTP client with error handling
 */
class HTTPClient {
  constructor(config = {}) {
    this.baseURL = config.baseURL || API_CONFIG.baseURL;
    this.timeout = config.timeout || API_CONFIG.timeout;
    this.headers = { ...API_CONFIG.headers, ...config.headers };
  }

  /**
   * Build full URL
   */
  buildURL(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Handle fetch response
   */
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    const isJSON = contentType && contentType.includes('application/json');
    
    let data = null;
    if (isJSON) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new APIError(
        data.message || `HTTP Error: ${response.status}`,
        response.status,
        data
      );
    }

    return data;
  }

  /**
   * Make HTTP request with timeout
   */
  async request(endpoint, options = {}) {
    const url = this.buildURL(endpoint);
    const config = {
      ...options,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    // Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    config.signal = controller.signal;

    try {
      const response = await fetch(url, config);
      clearTimeout(timeoutId);
      return await this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new APIError('Request timeout', 408);
      }
      
      if (error instanceof APIError) {
        throw error;
      }
      
      throw new APIError(`Network error: ${error.message}`, 0);
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : null,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = null) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : null,
    });
  }
}

/**
 * Create API client instance
 */
export const apiClient = new HTTPClient();

/**
 * Add authentication token to requests
 */
export const setAuthToken = (token) => {
  if (token) {
    apiClient.headers.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.headers.Authorization;
  }
};

/**
 * Remove authentication token
 */
export const clearAuthToken = () => {
  delete apiClient.headers.Authorization;
};

/**
 * Check if using mock data
 */
export const isMockMode = () => ENV.ENABLE_MOCK_DATA;

/**
 * Generic error handler for API calls
 */
export const handleAPIError = (error, fallbackMessage = 'An error occurred') => {
  console.error('API Error:', error);
  
  if (error instanceof APIError) {
    return {
      message: error.message,
      status: error.status,
      data: error.data,
    };
  }
  
  return {
    message: fallbackMessage,
    status: 0,
    data: null,
  };
};
