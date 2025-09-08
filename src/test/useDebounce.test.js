import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/useDebounce';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    expect(result.current).toBe('initial');

    // Change the value
    rerender({ value: 'updated', delay: 500 });
    
    // Value should still be initial (not debounced yet)
    expect(result.current).toBe('initial');

    // Fast-forward time by 250ms (not enough)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('initial');

    // Fast-forward time by another 250ms (total 500ms)
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });

  it('should reset timer on rapid value changes', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 500 }
      }
    );

    // Change value multiple times rapidly
    rerender({ value: 'first', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    rerender({ value: 'second', delay: 500 });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    rerender({ value: 'final', delay: 500 });
    
    // Should still be initial after 400ms total
    expect(result.current).toBe('initial');
    
    // After full delay from last change
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('final');

    vi.useRealTimers();
  });

  it('should handle different delay values', async () => {
    vi.useFakeTimers();
    
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'initial', delay: 100 }
      }
    );

    rerender({ value: 'updated', delay: 100 });
    
    // Should update after 100ms
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('updated');

    vi.useRealTimers();
  });
});
