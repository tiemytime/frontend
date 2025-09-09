import React from 'react';
import useGlobalPrayerStore from '../../stores/globalPrayerStore';

const SharePrayerButton = ({ onSharePrayer, isLoading, hidden = false }) => {
  const { topRelevanceEvent } = useGlobalPrayerStore();

  const handleSharePrayer = () => {
    if (topRelevanceEvent && onSharePrayer) {
      onSharePrayer(topRelevanceEvent);
    }
  };

  // Don't render if hidden
  if (hidden) {
    return null;
  }

  return (
    <div className="fixed top-1/2 right-50 transform -translate-y-1/2 z-20">
      <button
        onClick={handleSharePrayer}
        disabled={isLoading || !topRelevanceEvent}
        className="bg-yellow-400/10 backdrop-blur-sm border border-yellow-400 text-yellow-400 px-6 py-3 rounded font-marcellus text-base hover:bg-yellow-200/10 transition-all duration-300 transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : (
          'Share your prayer'
        )}
      </button>
    </div>
  );
};

export default SharePrayerButton;
