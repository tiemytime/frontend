import '@testing-library/jest-dom';

// Mock environment variables for testing
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000',
    VITE_ENABLE_MOCK_DATA: 'true',
    VITE_PAGINATION_SIZE: '18',
    VITE_ENVIRONMENT: 'test',
    VITE_APP_TITLE: 'One Prayer One World',
    PROD: false,
    DEV: true
  },
  writable: true
});

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
