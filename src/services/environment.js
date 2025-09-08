// Environment configuration service
export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  PAGINATION_SIZE: Number(import.meta.env.VITE_PAGINATION_SIZE) || 18,
  ENVIRONMENT: import.meta.env.VITE_ENVIRONMENT || 'development',
  IS_PRODUCTION: import.meta.env.PROD,
  IS_DEVELOPMENT: import.meta.env.DEV,
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'One Prayer One World'
};
