import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import PrayerGrid from '../components/wallofprayers/PrayerGrid';

// Mock PrayerCard component
vi.mock('../components/wallofprayers/PrayerCard', () => ({
  default: ({ prayer, onClick }) => (
    <div 
      data-testid={`prayer-card-${prayer.id}`}
      onClick={() => onClick(prayer)}
    >
      {prayer.noteTitle}
    </div>
  )
}));

describe('PrayerGrid', () => {
  const mockPrayers = [
    {
      id: 1,
      noteTitle: 'Prayer for Peace',
      prayerText: 'May there be peace in the world',
      username: 'John Doe',
      category: 'World Peace'
    },
    {
      id: 2,
      noteTitle: 'Prayer for Health',
      prayerText: 'Praying for good health',
      username: 'Jane Smith',
      category: 'Health'
    }
  ];

  const mockOnCardClick = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders prayer cards when not loading', () => {
    render(
      <PrayerGrid 
        prayers={mockPrayers}
        onCardClick={mockOnCardClick}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('prayer-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('prayer-card-2')).toBeInTheDocument();
    expect(screen.getByText('Prayer for Peace')).toBeInTheDocument();
    expect(screen.getByText('Prayer for Health')).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(
      <PrayerGrid 
        prayers={mockPrayers}
        onCardClick={mockOnCardClick}
        isLoading={true}
      />
    );

    // Should not render prayer cards when loading
    expect(screen.queryByTestId('prayer-card-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('prayer-card-2')).not.toBeInTheDocument();

    // Should render 18 loading skeleton items
    const skeletonItems = document.querySelectorAll('.animate-pulse');
    expect(skeletonItems).toHaveLength(18);
  });

  it('renders empty grid when prayers array is empty', () => {
    render(
      <PrayerGrid 
        prayers={[]}
        onCardClick={mockOnCardClick}
        isLoading={false}
      />
    );

    // Grid should exist but be empty
    const grid = document.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid.children).toHaveLength(0);
  });

  it('calls onCardClick when a prayer card is clicked', () => {
    render(
      <PrayerGrid 
        prayers={mockPrayers}
        onCardClick={mockOnCardClick}
        isLoading={false}
      />
    );

    const firstCard = screen.getByTestId('prayer-card-1');
    firstCard.click();

    expect(mockOnCardClick).toHaveBeenCalledWith(mockPrayers[0]);
  });

  it('has correct responsive grid classes', () => {
    render(
      <PrayerGrid 
        prayers={mockPrayers}
        onCardClick={mockOnCardClick}
        isLoading={false}
      />
    );

    const grid = document.querySelector('.grid');
    expect(grid).toHaveClass(
      'grid',
      'grid-cols-1',
      'md:grid-cols-2',
      'lg:grid-cols-3',
      'xl:grid-cols-6',
      'gap-4',
      'px-8',
      'mb-8'
    );
  });

  it('loading skeleton has correct styling', () => {
    render(
      <PrayerGrid 
        prayers={mockPrayers}
        onCardClick={mockOnCardClick}
        isLoading={true}
      />
    );

    const skeletonItems = document.querySelectorAll('.animate-pulse');
    expect(skeletonItems[0]).toHaveClass(
      'bg-white/5',
      'backdrop-blur-sm',
      'border',
      'border-white/10',
      'rounded-lg',
      'p-4',
      'h-32',
      'animate-pulse'
    );
  });
});
