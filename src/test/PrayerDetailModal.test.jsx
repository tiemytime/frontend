import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PrayerDetailModal from '../components/wallofprayers/PrayerDetailModal';

describe('PrayerDetailModal', () => {
  const mockPrayer = {
    id: 1,
    noteTitle: 'Prayer for Peace',
    eventTitle: 'Global Peace Day',
    prayerText: 'May there be peace and harmony throughout the world. Let us unite in love and understanding.',
    theme: 'Peace',
    category: 'World Peace',
    username: 'John Doe',
    userLocation: 'New York, USA',
    eventLocation: 'United Nations, New York',
    timestamp: '2023-09-21T10:30:00Z'
  };

  const mockOnClose = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={false}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Prayer for Peace')).not.toBeInTheDocument();
  });

  it('renders nothing when prayer is null', () => {
    render(
      <PrayerDetailModal 
        prayer={null}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.queryByText('Prayer for Peace')).not.toBeInTheDocument();
  });

  it('renders modal content when open with prayer data', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check modal content
    expect(screen.getByText('Prayer for Peace')).toBeInTheDocument();
    expect(screen.getByText('Global Peace Day')).toBeInTheDocument();
    expect(screen.getByText('May there be peace and harmony throughout the world. Let us unite in love and understanding.')).toBeInTheDocument();
    expect(screen.getByText('Peace')).toBeInTheDocument();
    expect(screen.getByText('World Peace')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('New York, USA')).toBeInTheDocument();
    expect(screen.getByText('United Nations, New York')).toBeInTheDocument();
  });

  it('formats and displays date correctly', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Check that date is formatted properly
    expect(screen.getByText(/September 21, 2023/)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Close button is clicked', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Click on the backdrop (outer div)
    const backdrop = document.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    // Click on the modal content
    const modalContent = document.querySelector('.bg-black\\/30');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('has correct modal styling classes', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    const backdrop = document.querySelector('.fixed.inset-0');
    expect(backdrop).toHaveClass(
      'fixed',
      'inset-0',
      'z-50',
      'flex',
      'items-center',
      'justify-center',
      'p-4'
    );

    const modalContent = document.querySelector('.bg-black\\/30');
    expect(modalContent).toHaveClass(
      'bg-black/30',
      'backdrop-blur-md',
      'border',
      'border-white/20',
      'rounded-lg',
      'p-6'
    );
  });

  it('displays candle emoji', () => {
    render(
      <PrayerDetailModal 
        prayer={mockPrayer}
        isOpen={true}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('🕯️')).toBeInTheDocument();
  });
});
