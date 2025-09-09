import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LeftPanel from '../components/prayersubmission/LeftPanel';
import RightPanel from '../components/prayersubmission/RightPanel';
import PrayerModal from '../components/Globe/PrayerModal';

const PrayerSubmission = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  
  // Extract prayer data from navigation state
  const { prayer, userDetails, event } = state || {};

  const handleGoToWall = () => {
    // Navigate to wall of prayers
    navigate('/wall-of-prayers');
  };

  const handleShare = () => {
    setShowPrayerModal(true);
  };

  const handleClosePrayerModal = () => {
    setShowPrayerModal(false);
  };

  // Handle redirect if no prayer data
  useEffect(() => {
    if (!prayer) {
      navigate('/globe');
    }
  }, [prayer, navigate]);

  // If no prayer data, return null while redirecting
  if (!prayer) {
    return null;
  }

  return (
    <>
      {/* Earth image positioned between starfield layers */}
      <img 
        src="/earth.png" 
        alt="Earth" 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-60"
        style={{ 
          pointerEvents: 'none',
          zIndex: -12
        }}
      />

      <img 
        src="/redlight.png" 
        alt="Red Light" 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-70"
        style={{ 
          pointerEvents: 'none',
          zIndex: -11
        }}
      />
      
      {/* Two-panel layout - responsive */}
      <div className="min-h-screen flex flex-col lg:flex-row pt-20 sm:pt-24">
        {/* Left Panel - Prayer Card */}
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8">
          <LeftPanel 
            prayer={prayer}
            userDetails={userDetails}
            onGoToWall={handleGoToWall}
          />
        </div>
        
        {/* Right Panel - Share Button */}
        <div className="w-full lg:w-1/2 px-4 sm:px-6 lg:px-8">
          <RightPanel onShare={handleShare} />
        </div>
      </div>

      {/* Header Navigation */}
      <div className="fixed top-0 left-0 right-0 z-20 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-8 gap-4 sm:gap-0">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4" />
          <div className="text-white font-marcellus text-sm sm:text-base">
            <div>One prayer</div>
            <div>One world</div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <button 
            onClick={handleGoToWall}
            className="text-white font-marcellus hover:text-yellow-400 transition-colors duration-300 text-sm sm:text-base order-2 sm:order-1"
          >
            Wall of Prayers
          </button>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto order-1 sm:order-2">
            <input 
              type="text" 
              placeholder="Search an event, write a keyword" 
              className="bg-transparent text-white placeholder-gray-300 outline-none w-full sm:w-48 md:w-64 text-sm"
            />
          </div>
        </div>
      </div>
      
      {/* Prayer Modal for sharing */}
      {showPrayerModal && (
        <PrayerModal 
          event={event}
          isOpen={showPrayerModal}
          onClose={handleClosePrayerModal}
        />
      )}
    </>
  );
};

export default PrayerSubmission;
