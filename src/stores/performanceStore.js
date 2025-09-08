import { create } from 'zustand';

const usePerformanceStore = create((set, get) => ({
  // Performance metrics
  metrics: {
    renderCount: 0,
    lastRenderTime: null,
    averageRenderTime: 0,
    slowRenders: [],
    componentRenderCounts: {},
    memoryUsage: [],
    apiCalls: [],
    errorCount: 0,
    warningCount: 0
  },
  
  // Performance thresholds
  thresholds: {
    slowRenderTime: 16, // ms - 60fps threshold
    memoryWarningLimit: 100 * 1024 * 1024, // 100MB
    maxSlowRenders: 10
  },
  
  // Actions
  recordRender: (componentName, renderTime) => {
    const { metrics } = get();
    const newRenderCount = metrics.renderCount + 1;
    const newAverageRenderTime = 
      (metrics.averageRenderTime * metrics.renderCount + renderTime) / newRenderCount;
    
    const updatedComponentCounts = {
      ...metrics.componentRenderCounts,
      [componentName]: (metrics.componentRenderCounts[componentName] || 0) + 1
    };
    
    let updatedSlowRenders = [...metrics.slowRenders];
    if (renderTime > get().thresholds.slowRenderTime) {
      updatedSlowRenders.push({
        component: componentName,
        renderTime,
        timestamp: Date.now()
      });
      
      // Keep only recent slow renders
      if (updatedSlowRenders.length > get().thresholds.maxSlowRenders) {
        updatedSlowRenders = updatedSlowRenders.slice(-get().thresholds.maxSlowRenders);
      }
    }
    
    set({
      metrics: {
        ...metrics,
        renderCount: newRenderCount,
        lastRenderTime: renderTime,
        averageRenderTime: newAverageRenderTime,
        componentRenderCounts: updatedComponentCounts,
        slowRenders: updatedSlowRenders
      }
    });
  },
  
  recordMemoryUsage: () => {
    if (performance.memory) {
      const { metrics } = get();
      const memoryInfo = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };
      
      const updatedMemoryUsage = [...metrics.memoryUsage, memoryInfo];
      
      // Keep only last 50 memory readings
      if (updatedMemoryUsage.length > 50) {
        updatedMemoryUsage.splice(0, updatedMemoryUsage.length - 50);
      }
      
      set({
        metrics: {
          ...metrics,
          memoryUsage: updatedMemoryUsage
        }
      });
    }
  },
  
  recordApiCall: (endpoint, duration, success = true) => {
    const { metrics } = get();
    const apiCall = {
      endpoint,
      duration,
      success,
      timestamp: Date.now()
    };
    
    const updatedApiCalls = [...metrics.apiCalls, apiCall];
    
    // Keep only last 100 API calls
    if (updatedApiCalls.length > 100) {
      updatedApiCalls.splice(0, updatedApiCalls.length - 100);
    }
    
    set({
      metrics: {
        ...metrics,
        apiCalls: updatedApiCalls
      }
    });
  },
  
  recordError: () => {
    const { metrics } = get();
    set({
      metrics: {
        ...metrics,
        errorCount: metrics.errorCount + 1
      }
    });
  },
  
  recordWarning: () => {
    const { metrics } = get();
    set({
      metrics: {
        ...metrics,
        warningCount: metrics.warningCount + 1
      }
    });
  },
  
  // Performance analysis
  getPerformanceReport: () => {
    const { metrics, thresholds } = get();
    
    return {
      summary: {
        totalRenders: metrics.renderCount,
        averageRenderTime: metrics.averageRenderTime,
        slowRenderCount: metrics.slowRenders.length,
        errorCount: metrics.errorCount,
        warningCount: metrics.warningCount
      },
      renderPerformance: {
        isPerformant: metrics.averageRenderTime < thresholds.slowRenderTime,
        slowRenders: metrics.slowRenders,
        componentBreakdown: metrics.componentRenderCounts
      },
      memoryUsage: {
        current: metrics.memoryUsage[metrics.memoryUsage.length - 1] || null,
        trend: metrics.memoryUsage.slice(-10),
        isWithinLimits: metrics.memoryUsage.length > 0 ? 
          metrics.memoryUsage[metrics.memoryUsage.length - 1].used < thresholds.memoryWarningLimit : true
      },
      apiPerformance: {
        recentCalls: metrics.apiCalls.slice(-10),
        averageResponseTime: metrics.apiCalls.length > 0 ? 
          metrics.apiCalls.reduce((sum, call) => sum + call.duration, 0) / metrics.apiCalls.length : 0,
        successRate: metrics.apiCalls.length > 0 ? 
          metrics.apiCalls.filter(call => call.success).length / metrics.apiCalls.length : 1
      }
    };
  },
  
  clearMetrics: () => {
    set({
      metrics: {
        renderCount: 0,
        lastRenderTime: null,
        averageRenderTime: 0,
        slowRenders: [],
        componentRenderCounts: {},
        memoryUsage: [],
        apiCalls: [],
        errorCount: 0,
        warningCount: 0
      }
    });
  },
  
  updateThresholds: (newThresholds) => {
    const { thresholds } = get();
    set({
      thresholds: {
        ...thresholds,
        ...newThresholds
      }
    });
  }
}));

export default usePerformanceStore;
