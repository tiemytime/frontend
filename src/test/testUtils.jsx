import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';

// Custom render function that includes providers
export const renderWithRouter = (ui, options = {}) => {
  const Wrapper = ({ children }) => (
    <ErrorBoundary>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </ErrorBoundary>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

// Mock prayer data for testing
export const mockPrayer = {
  id: 'test-1',
  noteTitle: 'Test Prayer',
  eventTitle: 'Test Event',
  theme: 'Test Theme',
  username: 'Test User',
  category: 'Environment',
  timestamp: '2025-01-07T10:30:00Z',
  prayerText: 'This is a test prayer message for testing purposes.',
  userLocation: 'Test City, Test Country',
  eventLocation: 'Test Location'
};

// Mock prayers array for testing
export const mockPrayers = Array.from({ length: 5 }, (_, i) => ({
  ...mockPrayer,
  id: `test-${i + 1}`,
  noteTitle: `Test Prayer ${i + 1}`,
  eventTitle: `Test Event ${i + 1}`,
  username: `Test User ${i + 1}`
}));

// Mock filter categories for testing
export const mockFilterCategories = [
  { id: 'all', label: 'All', value: 'all' },
  { id: 'environment', label: 'Environment', value: 'Environment' },
  { id: 'religion', label: 'Religion', value: 'Religion' }
];
