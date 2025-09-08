// Centralized error handling for API services
import { ENV } from './environment.js';

/**
 * Error types
 */
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  NETWORK_OFFLINE: 'No internet connection. Please check your network.',
  NETWORK_TIMEOUT: 'Request timeout. Please try again.',
  NETWORK_ERROR: 'Network error occurred. Please try again.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please log in.',
  FORBIDDEN: 'Access forbidden. You do not have permission.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_FAILED: 'Invalid data provided. Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Enhanced error class for API errors
 */
export class APIError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN_ERROR, status = 0, data = null) {
    super(message);
    this.name = 'APIError';
    this.type = type;
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Check if error is retryable
   */
  isRetryable() {
    return [408, 429, 500, 502, 503, 504].includes(this.status);
  }

  /**
   * Get user-friendly message
   */
  getUserMessage() {
    switch (this.type) {
      case ERROR_TYPES.NETWORK_ERROR:
        return ERROR_MESSAGES.NETWORK_ERROR;
      case ERROR_TYPES.AUTHENTICATION_ERROR:
        return ERROR_MESSAGES.UNAUTHORIZED;
      case ERROR_TYPES.AUTHORIZATION_ERROR:
        return ERROR_MESSAGES.FORBIDDEN;
      case ERROR_TYPES.NOT_FOUND_ERROR:
        return ERROR_MESSAGES.NOT_FOUND;
      case ERROR_TYPES.VALIDATION_ERROR:
        return ERROR_MESSAGES.VALIDATION_FAILED;
      case ERROR_TYPES.TIMEOUT_ERROR:
        return ERROR_MESSAGES.NETWORK_TIMEOUT;
      default:
        return this.message || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Convert to plain object for logging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      status: this.status,
      data: this.data,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Error handlers by HTTP status code
 */
const statusCodeHandlers = {
  400: (message, data) => new APIError(
    message || ERROR_MESSAGES.VALIDATION_FAILED,
    ERROR_TYPES.VALIDATION_ERROR,
    400,
    data
  ),
  401: (message, data) => new APIError(
    message || ERROR_MESSAGES.UNAUTHORIZED,
    ERROR_TYPES.AUTHENTICATION_ERROR,
    401,
    data
  ),
  403: (message, data) => new APIError(
    message || ERROR_MESSAGES.FORBIDDEN,
    ERROR_TYPES.AUTHORIZATION_ERROR,
    403,
    data
  ),
  404: (message, data) => new APIError(
    message || ERROR_MESSAGES.NOT_FOUND,
    ERROR_TYPES.NOT_FOUND_ERROR,
    404,
    data
  ),
  408: (message, data) => new APIError(
    message || ERROR_MESSAGES.NETWORK_TIMEOUT,
    ERROR_TYPES.TIMEOUT_ERROR,
    408,
    data
  ),
  422: (message, data) => new APIError(
    message || ERROR_MESSAGES.VALIDATION_FAILED,
    ERROR_TYPES.VALIDATION_ERROR,
    422,
    data
  ),
  429: (message, data) => new APIError(
    message || 'Too many requests. Please try again later.',
    ERROR_TYPES.API_ERROR,
    429,
    data
  ),
  500: (message, data) => new APIError(
    message || ERROR_MESSAGES.SERVER_ERROR,
    ERROR_TYPES.API_ERROR,
    500,
    data
  ),
  502: (message, data) => new APIError(
    message || 'Service temporarily unavailable.',
    ERROR_TYPES.API_ERROR,
    502,
    data
  ),
  503: (message, data) => new APIError(
    message || 'Service temporarily unavailable.',
    ERROR_TYPES.API_ERROR,
    503,
    data
  ),
  504: (message, data) => new APIError(
    message || ERROR_MESSAGES.NETWORK_TIMEOUT,
    ERROR_TYPES.TIMEOUT_ERROR,
    504,
    data
  ),
};

/**
 * Enhanced error handler
 */
export const handleAPIError = (error, fallbackMessage = ERROR_MESSAGES.UNKNOWN_ERROR) => {
  // Log error in development
  if (ENV.IS_DEVELOPMENT) {
    console.error('API Error:', error);
  }

  // Handle network errors
  if (!navigator.onLine) {
    return new APIError(
      ERROR_MESSAGES.NETWORK_OFFLINE,
      ERROR_TYPES.NETWORK_ERROR,
      0
    );
  }

  // Handle timeout errors
  if (error.name === 'AbortError') {
    return new APIError(
      ERROR_MESSAGES.NETWORK_TIMEOUT,
      ERROR_TYPES.TIMEOUT_ERROR,
      408
    );
  }

  // Handle fetch network errors
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return new APIError(
      ERROR_MESSAGES.NETWORK_ERROR,
      ERROR_TYPES.NETWORK_ERROR,
      0
    );
  }

  // Handle APIError instances
  if (error instanceof APIError) {
    return error;
  }

  // Handle HTTP status code errors
  if (error.status && statusCodeHandlers[error.status]) {
    return statusCodeHandlers[error.status](error.message, error.data);
  }

  // Handle validation errors
  if (error.message && error.message.includes('Validation failed')) {
    return new APIError(
      error.message,
      ERROR_TYPES.VALIDATION_ERROR,
      400
    );
  }

  // Default error handler
  return new APIError(
    error.message || fallbackMessage,
    ERROR_TYPES.UNKNOWN_ERROR,
    error.status || 0,
    error.data
  );
};

/**
 * Retry mechanism for API calls
 */
export class RetryHandler {
  constructor(maxRetries = 3, baseDelay = 1000) {
    this.maxRetries = maxRetries;
    this.baseDelay = baseDelay;
  }

  /**
   * Execute function with retry logic
   */
  async execute(fn, ...args) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        // Don't retry if error is not retryable
        if (error instanceof APIError && !error.isRetryable()) {
          throw error;
        }
        
        // Don't retry on last attempt
        if (attempt === this.maxRetries) {
          break;
        }
        
        // Calculate delay with exponential backoff
        const delay = this.baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError;
  }
}

/**
 * Global error reporter
 */
export class ErrorReporter {
  static instance = null;
  
  constructor() {
    if (ErrorReporter.instance) {
      return ErrorReporter.instance;
    }
    
    this.errorHandlers = [];
    ErrorReporter.instance = this;
  }

  /**
   * Add error handler
   */
  addHandler(handler) {
    this.errorHandlers.push(handler);
  }

  /**
   * Remove error handler
   */
  removeHandler(handler) {
    const index = this.errorHandlers.indexOf(handler);
    if (index > -1) {
      this.errorHandlers.splice(index, 1);
    }
  }

  /**
   * Report error to all handlers
   */
  report(error, context = {}) {
    const errorInfo = {
      error: error instanceof APIError ? error.toJSON() : error,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.errorHandlers.forEach(handler => {
      try {
        handler(errorInfo);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    });

    // Log to console in development
    if (ENV.IS_DEVELOPMENT) {
      console.error('Error reported:', errorInfo);
    }
  }
}

/**
 * Create global error reporter instance
 */
export const errorReporter = new ErrorReporter();

/**
 * Default error handler for UI notifications
 */
export const defaultErrorHandler = (errorInfo) => {
  // This can be connected to a toast notification system
  // For now, just log to console
  console.warn('API Error:', errorInfo.error.message);
};

// Add default error handler
errorReporter.addHandler(defaultErrorHandler);
