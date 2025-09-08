import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useSessionStore = create(
  persist(
    (set, get) => ({
      // User session state
      sessionId: null,
      userId: null,
      isAuthenticated: false,
      lastActivity: null,
      
      // User preferences
      preferences: {
        theme: 'dark',
        language: 'en',
        notificationsEnabled: true,
        autoSaveEnabled: true
      },
      
      // Session tracking
      pageViews: [],
      timeSpent: 0,
      sessionStartTime: null,
      
      // Actions
      initializeSession: () => {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const now = Date.now();
        
        set({
          sessionId,
          sessionStartTime: now,
          lastActivity: now,
          pageViews: []
        });
      },
      
      updateLastActivity: () => {
        set({ lastActivity: Date.now() });
      },
      
      trackPageView: (pageName) => {
        const { pageViews } = get();
        const pageView = {
          page: pageName,
          timestamp: Date.now(),
          sessionId: get().sessionId
        };
        
        set({
          pageViews: [...pageViews, pageView]
        });
      },
      
      updateTimeSpent: () => {
        const { sessionStartTime } = get();
        if (sessionStartTime) {
          const timeSpent = Date.now() - sessionStartTime;
          set({ timeSpent });
        }
      },
      
      setUserPreference: (key, value) => {
        const { preferences } = get();
        set({
          preferences: {
            ...preferences,
            [key]: value
          }
        });
      },
      
      setAuthentication: (isAuthenticated, userId = null) => {
        set({ isAuthenticated, userId });
      },
      
      clearSession: () => {
        set({
          sessionId: null,
          userId: null,
          isAuthenticated: false,
          lastActivity: null,
          pageViews: [],
          timeSpent: 0,
          sessionStartTime: null
        });
      },
      
      // Getters
      getSessionDuration: () => {
        const { sessionStartTime } = get();
        if (!sessionStartTime) return 0;
        return Date.now() - sessionStartTime;
      },
      
      getPageViewsForSession: () => {
        const { pageViews, sessionId } = get();
        return pageViews.filter(view => view.sessionId === sessionId);
      }
    }),
    {
      name: 'prayer-app-session',
      partialize: (state) => ({
        preferences: state.preferences,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

export default useSessionStore;
