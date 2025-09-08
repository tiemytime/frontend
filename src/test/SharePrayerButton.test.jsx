import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import SharePrayerButton from '../components/prayersubmission/SharePrayerButton';

describe('SharePrayerButton', () => {
  const mockOnShare = vi.fn();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders button with correct text', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    expect(screen.getByText('Share')).toBeInTheDocument();
    expect(screen.getByText('your')).toBeInTheDocument();
    expect(screen.getByText('pray')).toBeInTheDocument();
  });

  it('calls onShare when button is clicked', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnShare).toHaveBeenCalledTimes(1);
  });

  it('has correct styling classes', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'relative',
      'w-48',
      'h-48',
      'rounded-full',
      'border-2',
      'border-white/30',
      'bg-white/10',
      'backdrop-blur-sm',
      'flex',
      'items-center',
      'justify-center',
      'hover:bg-white/20',
      'transition-all',
      'duration-300',
      'cursor-pointer'
    );
  });

  it('text has correct styling', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    const textContainer = screen.getByText('Share').parentElement;
    expect(textContainer).toHaveClass(
      'text-white',
      'font-marcellus',
      'text-lg',
      'leading-relaxed'
    );
  });

  it('text is centered', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    const centerContainer = screen.getByText('Share').parentElement.parentElement;
    expect(centerContainer).toHaveClass('text-center');
  });

  it('button is accessible', () => {
    render(<SharePrayerButton onShare={mockOnShare} />);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('disabled');
  });
});
