import React from 'react';
import PrayerCard from './PrayerCard';

const LeftPanel = ({ prayer, userDetails, onGoToWall }) => {
  return (
    <div className="flex items-center justify-center h-screen p-4 sm:p-8 pt-32 lg:pt-8">
      <PrayerCard 
        prayer={prayer}
        userDetails={userDetails}
        onGoToWall={onGoToWall}
      />
    </div>
  );
};

export default LeftPanel;
