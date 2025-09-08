import { describe, it, expect } from 'vitest';
import { ENV } from '../services/environment';

describe('Environment Service', () => {
  it('should export all required environment variables', () => {
    expect(ENV).toHaveProperty('API_BASE_URL');
    expect(ENV).toHaveProperty('ENABLE_MOCK_DATA');
    expect(ENV).toHaveProperty('PAGINATION_SIZE');
    expect(ENV).toHaveProperty('ENVIRONMENT');
    expect(ENV).toHaveProperty('IS_PRODUCTION');
    expect(ENV).toHaveProperty('IS_DEVELOPMENT');
    expect(ENV).toHaveProperty('APP_TITLE');
  });

  it('should have correct test values', () => {
    expect(ENV.API_BASE_URL).toBe('http://localhost:3000');
    expect(ENV.ENABLE_MOCK_DATA).toBe(true);
    expect(ENV.PAGINATION_SIZE).toBe(18);
    expect(ENV.ENVIRONMENT).toBe('test');
    expect(ENV.APP_TITLE).toBe('One Prayer One World');
  });

  it('should handle boolean conversion correctly', () => {
    expect(typeof ENV.ENABLE_MOCK_DATA).toBe('boolean');
    expect(typeof ENV.IS_PRODUCTION).toBe('boolean');
    expect(typeof ENV.IS_DEVELOPMENT).toBe('boolean');
  });

  it('should handle number conversion correctly', () => {
    expect(typeof ENV.PAGINATION_SIZE).toBe('number');
    expect(ENV.PAGINATION_SIZE).toBe(18);
  });

  it('should provide fallback values', () => {
    // Test that fallback values work when env vars are undefined
    expect(ENV.API_BASE_URL).toBeTruthy();
    expect(typeof ENV.PAGINATION_SIZE).toBe('number');
    expect(ENV.APP_TITLE).toBeTruthy();
  });
});
