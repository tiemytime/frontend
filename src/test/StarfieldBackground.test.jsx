import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import StarfieldBackground from '../components/background/Starfeildbackground';

// Mock canvas and animation frame
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: vi.fn(() => ({
    clearRect: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: '',
    globalAlpha: 1,
  })),
});

// Mock requestAnimationFrame and cancelAnimationFrame
globalThis.requestAnimationFrame = vi.fn((callback) => {
  setTimeout(callback, 16);
  return 123;
});

globalThis.cancelAnimationFrame = vi.fn();

// Mock window resize
Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

describe('StarfieldBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders background div elements', () => {
    render(<StarfieldBackground />);

    // Check that background divs are present
    const backgroundDivs = document.querySelectorAll('div[style*="position: fixed"]');
    expect(backgroundDivs.length).toBeGreaterThanOrEqual(2);
  });

  it('renders canvas element', () => {
    render(<StarfieldBackground />);

    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('canvas has correct styling', () => {
    render(<StarfieldBackground />);

    const canvas = document.querySelector('canvas');
    
    expect(canvas.style.position).toBe('fixed');
    expect(canvas.style.top).toBe('0px');
    expect(canvas.style.left).toBe('0px');
    expect(canvas.style.width).toBe('100%');
    expect(canvas.style.height).toBe('100%');
    expect(canvas.style.zIndex).toBe('-10');
    expect(canvas.style.pointerEvents).toBe('none');
  });

  it('background gradients have correct z-index ordering', () => {
    render(<StarfieldBackground />);

    const backgroundDivs = document.querySelectorAll('div[style*="position: fixed"]');
    
    // First background should have z-index -20
    expect(backgroundDivs[0].style.zIndex).toBe('-20');
    
    // Second background should have z-index -15
    expect(backgroundDivs[1].style.zIndex).toBe('-15');
  });

  it('sets up canvas dimensions on mount', () => {
    render(<StarfieldBackground />);

    const canvas = document.querySelector('canvas');
    expect(canvas.width).toBe(1024);
    expect(canvas.height).toBe(768);
  });

  it('calls requestAnimationFrame on mount', () => {
    render(<StarfieldBackground />);

    expect(globalThis.requestAnimationFrame).toHaveBeenCalled();
  });

  it('adds resize event listener', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    
    render(<StarfieldBackground />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('cleans up on unmount', () => {
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    
    const { unmount } = render(<StarfieldBackground />);
    unmount();

    expect(globalThis.cancelAnimationFrame).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('background has cosmic gradient styles', () => {
    render(<StarfieldBackground />);

    const backgroundDivs = document.querySelectorAll('div[style*="position: fixed"]');
    
    // Check that gradients contain cosmic colors
    expect(backgroundDivs[0].style.background).toContain('radial-gradient');
    expect(backgroundDivs[0].style.background).toContain('linear-gradient');
    expect(backgroundDivs[1].style.background).toContain('radial-gradient');
  });

  it('renders multiple layers for depth effect', () => {
    render(<StarfieldBackground />);

    // Should have background gradient layers + canvas
    const fixedElements = document.querySelectorAll('[style*="position: fixed"]');
    expect(fixedElements.length).toBe(3); // 2 background divs + 1 canvas
  });

  it('background is fixed and full screen', () => {
    render(<StarfieldBackground />);

    const backgroundDivs = document.querySelectorAll('div[style*="position: fixed"]');
    
    backgroundDivs.forEach(div => {
      expect(div.style.position).toBe('fixed');
      expect(div.style.top).toBe('0px');
      expect(div.style.left).toBe('0px');
      expect(div.style.width).toBe('100%');
      expect(div.style.height).toBe('100%');
    });
  });
});
