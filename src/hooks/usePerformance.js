import { useEffect, useRef } from 'react';
import usePerformanceStore from '../stores/performanceStore';

// Hook to track component render performance
export const useRenderPerformance = (componentName) => {
  const renderStartTime = useRef(null);
  const recordRender = usePerformanceStore(state => state.recordRender);
  
  useEffect(() => {
    renderStartTime.current = performance.now();
  });
  
  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      recordRender(componentName, renderTime);
    }
  });
  
  return null;
};

// Hook to track memory usage
export const useMemoryTracking = (interval = 5000) => {
  const recordMemoryUsage = usePerformanceStore(state => state.recordMemoryUsage);
  
  useEffect(() => {
    const memoryInterval = setInterval(() => {
      recordMemoryUsage();
    }, interval);
    
    // Record initial memory usage
    recordMemoryUsage();
    
    return () => clearInterval(memoryInterval);
  }, [recordMemoryUsage, interval]);
  
  return null;
};

// Hook to track API call performance
export const useApiTracking = () => {
  const recordApiCall = usePerformanceStore(state => state.recordApiCall);
  
  const trackApiCall = async (apiFunction, endpoint) => {
    const startTime = performance.now();
    let success = true;
    
    try {
      const result = await apiFunction();
      return result;
    } catch (error) {
      success = false;
      throw error;
    } finally {
      const duration = performance.now() - startTime;
      recordApiCall(endpoint, duration, success);
    }
  };
  
  return { trackApiCall };
};

// Hook to get performance metrics
export const usePerformanceMetrics = () => {
  const getPerformanceReport = usePerformanceStore(state => state.getPerformanceReport);
  const clearMetrics = usePerformanceStore(state => state.clearMetrics);
  
  return {
    getReport: getPerformanceReport,
    clearMetrics
  };
};
