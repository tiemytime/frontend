import React from 'react';
import SharePrayerButton from './SharePrayerButton';

const RightPanel = ({ onShare }) => {
  return (
    <div className="flex items-center justify-center h-screen pt-32 lg:pt-0">
      <SharePrayerButton onShare={onShare} />
    </div>
  );
};

export default RightPanel;
