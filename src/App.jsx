import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Loading from './pages/Loading'
import Globe from './pages/Globe'
import PrayerSubmission from './pages/PrayerSubmission'
import WallofPrayers from './pages/WallofPrayers'
import ErrorBoundary from './components/common/ErrorBoundary'

const App = () => {
  return (
    <div>
      <ErrorBoundary>
        <Router>
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/globe" element={<Globe />} />
            <Route path="/prayer-submission" element={<PrayerSubmission />} />
            <Route path="/wall-of-prayers" element={<WallofPrayers />} />
          </Routes>
        </Router>
      </ErrorBoundary>
    </div>
  )
}

export default App
