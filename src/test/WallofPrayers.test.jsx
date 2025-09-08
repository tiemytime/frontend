import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouter, mockPrayers } from './testUtils';
import WallofPrayers from '../pages/WallofPrayers';

// Mock the data
vi.mock('../data/mockWallPrayers', () => ({
  allMockPrayers: mockPrayers,
  filterCategories: [
    { id: 'all', label: 'All', value: 'all' },
    { id: 'environment', label: 'Environment', value: 'Environment' }
  ]
}));

// Mock the background component to avoid canvas issues
vi.mock('../components/background/Starfeildbackground', () => ({
  default: () => <div data-testid="starfield-background">Starfield Background</div>
}));

describe('WallofPrayers Integration', () => {
  it('renders the main components correctly', async () => {
    renderWithRouter(<WallofPrayers />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByText('Loading')).not.toBeInTheDocument();
    });

    // Check main components
    expect(screen.getByText('Wall of Prayers')).toBeInTheDocument();
    expect(screen.getByText('Event title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search an event, write a keyword')).toBeInTheDocument();
  });

  it('displays prayer cards after loading', async () => {
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    });

    // Check if prayer cards are rendered
    expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    const user = userEvent.setup();
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search an event, write a keyword');
    
    // Type in search input
    await user.type(searchInput, 'Test Prayer 1');

    // Wait for debounced search
    await waitFor(() => {
      expect(searchInput.value).toBe('Test Prayer 1');
    });
  });

  it('handles filter changes', async () => {
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
    });

    // Click on Environment filter
    fireEvent.click(screen.getByText('Environment'));

    // Check if filter is applied (this would filter the prayers)
    expect(screen.getByText('Environment')).toHaveClass('text-yellow-400');
  });

  it('opens prayer detail modal when card is clicked', async () => {
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    });

    // Click on a prayer card
    fireEvent.click(screen.getByText('Test Prayer 1'));

    // Check if modal opens (modal should show the prayer title)
    await waitFor(() => {
      expect(screen.getAllByText('Test Prayer 1')).toHaveLength(2); // One in card, one in modal
    });
  });

  it('handles pagination correctly', async () => {
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    });

    // With mock data of 5 prayers and 18 per page, should show all on one page
    expect(screen.getByText('Test Prayer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Prayer 5')).toBeInTheDocument();
  });

  it('shows loading skeleton initially', () => {
    renderWithRouter(<WallofPrayers />);

    // Should show skeleton loading initially
    const skeletonElements = screen.getAllByTestId ? 
      screen.queryAllByTestId('skeleton') : 
      document.querySelectorAll('.animate-pulse');
    
    // At least one skeleton element should be present
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('displays correct total count in footer', async () => {
    renderWithRouter(<WallofPrayers />);

    await waitFor(() => {
      expect(screen.getByText(/Total notes/)).toBeInTheDocument();
    });

    // Check if total count is displayed
    expect(screen.getByText('238,904 Total notes')).toBeInTheDocument();
  });

  it('navigates back to globe when logo is clicked', async () => {
    const mockNavigate = vi.fn();
    
    // Mock useNavigate
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate
      };
    });

    renderWithRouter(<WallofPrayers />);

    const logo = screen.getByAltText('Logo');
    fireEvent.click(logo);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/globe');
    });
  });
});
