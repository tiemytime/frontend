import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PrayerCard from '../components/wallofprayers/PrayerCard';
import { mockPrayer } from './testUtils';

describe('PrayerCard', () => {
  it('renders prayer card with correct content', () => {
    const mockOnClick = vi.fn();
    
    render(
      <PrayerCard 
        prayer={mockPrayer} 
        onClick={mockOnClick} 
      />
    );

    // Check if all content is rendered
    expect(screen.getByText('Test Prayer')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
    expect(screen.getByText('Test Theme')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('calls onClick when card is clicked', () => {
    const mockOnClick = vi.fn();
    
    render(
      <PrayerCard 
        prayer={mockPrayer} 
        onClick={mockOnClick} 
      />
    );

    // Click the card
    fireEvent.click(screen.getByText('Test Prayer'));
    
    // Check if onClick was called with the prayer
    expect(mockOnClick).toHaveBeenCalledWith(mockPrayer);
  });

  it('applies hover styles correctly', () => {
    const mockOnClick = vi.fn();
    
    render(
      <PrayerCard 
        prayer={mockPrayer} 
        onClick={mockOnClick} 
      />
    );

    const cardElement = screen.getByText('Test Prayer').closest('div');
    
    // Check if card has cursor-pointer class
    expect(cardElement).toHaveClass('cursor-pointer');
  });

  it('handles long text content properly', () => {
    const longContentPrayer = {
      ...mockPrayer,
      noteTitle: 'This is a very long prayer title that should be handled properly by the component',
      eventTitle: 'This is a very long event title that might wrap to multiple lines',
      theme: 'Very Long Theme Name',
      username: 'User With Very Long Name'
    };

    const mockOnClick = vi.fn();
    
    render(
      <PrayerCard 
        prayer={longContentPrayer} 
        onClick={mockOnClick} 
      />
    );

    // Check if long content is still rendered
    expect(screen.getByText(/This is a very long prayer title/)).toBeInTheDocument();
    expect(screen.getByText(/This is a very long event title/)).toBeInTheDocument();
  });
});
