import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterTabs from '../components/wallofprayers/FilterTabs';
import { mockFilterCategories } from './testUtils';

describe('FilterTabs', () => {
  it('renders all filter options', () => {
    const mockOnFilterChange = vi.fn();
    
    render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilterCategories}
      />
    );

    // Check if all filter labels are rendered
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Environment')).toBeInTheDocument();
    expect(screen.getByText('Religion')).toBeInTheDocument();
  });

  it('highlights active filter correctly', () => {
    const mockOnFilterChange = vi.fn();
    
    render(
      <FilterTabs
        activeFilter="Environment"
        onFilterChange={mockOnFilterChange}
        filters={mockFilterCategories}
      />
    );

    const environmentButton = screen.getByText('Environment');
    const allButton = screen.getByText('All');

    // Active filter should have yellow text
    expect(environmentButton).toHaveClass('text-yellow-400');
    
    // Inactive filters should have gray text
    expect(allButton).toHaveClass('text-gray-300');
  });

  it('calls onFilterChange when filter is clicked', () => {
    const mockOnFilterChange = vi.fn();
    
    render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilterCategories}
      />
    );

    // Click on Environment filter
    fireEvent.click(screen.getByText('Environment'));
    
    expect(mockOnFilterChange).toHaveBeenCalledWith('Environment');
  });

  it('renders additional filter options', () => {
    const mockOnFilterChange = vi.fn();
    
    render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={mockFilterCategories}
      />
    );

    // Check if additional filter options are rendered
    expect(screen.getByText('Event title')).toBeInTheDocument();
    expect(screen.getByText('Last event')).toBeInTheDocument();
    expect(screen.getByText('Most trend')).toBeInTheDocument();
  });

  it('handles empty filters array gracefully', () => {
    const mockOnFilterChange = vi.fn();
    
    render(
      <FilterTabs
        activeFilter="all"
        onFilterChange={mockOnFilterChange}
        filters={[]}
      />
    );

    // Should still render Filter label
    expect(screen.getByText('Filter:')).toBeInTheDocument();
  });
});
