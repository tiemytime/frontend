import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loading from './pages/Loading'
import Globe from './pages/Globe'
import PrayerSubmission from './pages/PrayerSubmission'
import WallofPrayers from './pages/WallofPrayers'
import ErrorBoundary from './components/common/ErrorBoundary'
import PersistentStarfield from './components/background/PersistentStarfield'
import { useSessionTracking } from './hooks/useSession'
import { useModalInteractions } from './hooks/useModal'
import { useMemoryTracking } from './hooks/usePerformance'

const AppContent = () => {
  // Initialize tracking hooks
  useSessionTracking();
  useModalInteractions();
  useMemoryTracking();
  
  return (
    <Routes>
      <Route path="/" element={<Loading />} />
      <Route path="/globe" element={<Globe />} />
      <Route path="/prayer-submission" element={<PrayerSubmission />} />
      <Route path="/wall-of-prayers" element={<WallofPrayers />} />
    </Routes>
  );
};

const App = () => {
  return (
    <div>
      <PersistentStarfield />
      <ErrorBoundary>
        <Router>
          <AppContent />
        </Router>
      </ErrorBoundary>
    </div>
  )
}

export default App
