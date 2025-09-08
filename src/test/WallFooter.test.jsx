import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import WallFooter from '../components/wallofprayers/WallFooter';

describe('WallFooter', () => {
  it('renders footer elements correctly', () => {
    const totalCount = 1234;
    
    render(<WallFooter totalCount={totalCount} />);

    // Check candle image
    const candleImage = screen.getByAltText('Candle');
    expect(candleImage).toBeInTheDocument();
    expect(candleImage).toHaveAttribute('src', '/candle.png');

    // Check copyright text
    expect(screen.getByText('Aya Pray - Copyright 2025')).toBeInTheDocument();

    // Check total count display
    expect(screen.getByText('1,234 Total notes')).toBeInTheDocument();
  });

  it('formats large numbers correctly with commas', () => {
    const totalCount = 1000000;
    
    render(<WallFooter totalCount={totalCount} />);

    expect(screen.getByText('1,000,000 Total notes')).toBeInTheDocument();
  });

  it('handles zero count correctly', () => {
    const totalCount = 0;
    
    render(<WallFooter totalCount={totalCount} />);

    expect(screen.getByText('0 Total notes')).toBeInTheDocument();
  });

  it('handles single digit count correctly', () => {
    const totalCount = 5;
    
    render(<WallFooter totalCount={totalCount} />);

    expect(screen.getByText('5 Total notes')).toBeInTheDocument();
  });

  it('has correct styling classes for fixed footer', () => {
    render(<WallFooter totalCount={100} />);

    const footer = document.querySelector('.fixed.bottom-0');
    expect(footer).toHaveClass(
      'fixed',
      'bottom-0',
      'left-0',
      'right-0',
      'z-20',
      'flex',
      'justify-between',
      'items-center',
      'p-8'
    );
  });

  it('candle image has correct styling', () => {
    render(<WallFooter totalCount={100} />);

    const candleImage = screen.getByAltText('Candle');
    expect(candleImage).toHaveClass(
      'w-12',
      'h-16',
      'object-contain'
    );
  });

  it('copyright text has correct styling', () => {
    render(<WallFooter totalCount={100} />);

    const copyrightText = screen.getByText('Aya Pray - Copyright 2025');
    expect(copyrightText).toHaveClass(
      'text-gray-300',
      'text-sm',
      'font-marcellus'
    );
  });

  it('total count has correct styling', () => {
    render(<WallFooter totalCount={100} />);

    const totalText = screen.getByText('100 Total notes');
    expect(totalText).toHaveClass(
      'text-white',
      'font-marcellus',
      'text-lg'
    );
  });

  it('left side container has correct layout', () => {
    render(<WallFooter totalCount={100} />);

    const leftContainer = screen.getByAltText('Candle').closest('.flex.items-center.space-x-4');
    expect(leftContainer).toHaveClass(
      'flex',
      'items-center',
      'space-x-4'
    );
  });
});
