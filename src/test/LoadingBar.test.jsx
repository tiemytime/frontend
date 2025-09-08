import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingBar } from '../components/Loading/loadingbar';

describe('LoadingBar', () => {
  it('renders loading text correctly', () => {
    render(<LoadingBar />);

    const loadingText = screen.getByText('Loading ...');
    expect(loadingText).toBeInTheDocument();
  });

  it('has correct styling for loading text', () => {
    render(<LoadingBar />);

    const loadingText = screen.getByText('Loading ...');
    expect(loadingText).toHaveClass(
      'text-white',
      'text-sm',
      'sm:text-base',
      'md:text-lg',
      'font-marcellus',
      'tracking-wide',
      'mb-4',
      'sm:mb-6',
      'md:mb-8'
    );
  });

  it('renders loading bar container with correct styling', () => {
    render(<LoadingBar />);

    const container = document.querySelector('.w-48.sm\\:w-56.md\\:w-64');
    expect(container).toHaveClass(
      'w-48',
      'sm:w-56',
      'md:w-64',
      'h-0.5',
      'bg-gray-800',
      'rounded-full',
      'overflow-hidden',
      'mx-auto'
    );
  });

  it('has positioned container correctly', () => {
    render(<LoadingBar />);

    const mainContainer = document.querySelector('.absolute.bottom-8');
    expect(mainContainer).toHaveClass(
      'absolute',
      'bottom-8',
      'sm:bottom-12',
      'md:bottom-16',
      'left-1/2',
      'transform',
      '-translate-x-1/2',
      'z-20'
    );
  });

  it('renders animated loading bar elements', () => {
    render(<LoadingBar />);

    // Check for pulse animation
    const pulseElement = document.querySelector('.animate-pulse');
    expect(pulseElement).toBeInTheDocument();
    expect(pulseElement).toHaveClass('h-full', 'bg-gradient-to-r', 'from-yellow-400', 'to-red-500', 'rounded-full', 'animate-pulse');

    // Check for custom loading bar animation
    const loadingBarElement = document.querySelector('.animate-loading-bar');
    expect(loadingBarElement).toBeInTheDocument();
    expect(loadingBarElement).toHaveClass('h-full', 'bg-gradient-to-r', 'from-yellow-400', 'to-red-500', 'animate-loading-bar');
  });

  it('includes custom CSS animation styles', () => {
    render(<LoadingBar />);

    const styleElement = document.querySelector('style');
    expect(styleElement).toBeInTheDocument();
    
    const cssText = styleElement.textContent;
    expect(cssText).toContain('@keyframes loading-bar');
    expect(cssText).toContain('transform: translateX(-100%)');
    expect(cssText).toContain('transform: translateX(100%)');
    expect(cssText).toContain('animation: loading-bar 2s ease-in-out infinite');
  });

  it('has correct text centering', () => {
    render(<LoadingBar />);

    const textContainer = document.querySelector('.text-center');
    expect(textContainer).toBeInTheDocument();
    expect(textContainer).toHaveClass('text-center');
  });

  it('uses correct responsive breakpoints', () => {
    render(<LoadingBar />);

    // Check responsive classes exist
    const responsiveContainer = document.querySelector('.bottom-8.sm\\:bottom-12.md\\:bottom-16');
    expect(responsiveContainer).toBeInTheDocument();

    const responsiveText = screen.getByText('Loading ...');
    expect(responsiveText).toHaveClass('text-sm', 'sm:text-base', 'md:text-lg');

    const responsiveBar = document.querySelector('.w-48.sm\\:w-56.md\\:w-64');
    expect(responsiveBar).toBeInTheDocument();

    const responsiveMargin = screen.getByText('Loading ...').parentElement;
    expect(responsiveMargin).toHaveClass('mb-4', 'sm:mb-6', 'md:mb-8');
  });
});
