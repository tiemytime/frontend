import { useState, useEffect } from 'react';
import useGlobalPrayerStore from '../../stores/globalPrayerStore';

const GlobalPrayerDisplay = ({ onSharePrayer }) => {
  const {
    currentGlobalPrayer,
    topRelevanceEvent,
    isLoading,
    error,
    fetchGlobalPrayer,
    startAutoRefresh,
    stopAutoRefresh,
    clearError
  } = useGlobalPrayerStore();

  const [displayText, setDisplayText] = useState(currentGlobalPrayer);

  // Initialize global prayer on mount
  useEffect(() => {
    // Start auto-refresh mechanism
    startAutoRefresh();

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [startAutoRefresh, stopAutoRefresh]);

  // Update display text when global prayer changes
  useEffect(() => {
    if (currentGlobalPrayer) {
      setDisplayText(currentGlobalPrayer);
    }
  }, [currentGlobalPrayer]);

  // Handle share prayer click
  const handleSharePrayer = () => {
    if (topRelevanceEvent && onSharePrayer) {
      onSharePrayer(topRelevanceEvent);
    }
  };

  // Loading state
  if (isLoading && !displayText) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div className="text-white/70 font-marcellus text-lg mb-2">
          The world is praying for...
        </div>
        <div className="text-yellow-400 font-marcellus text-xl animate-pulse">
          Loading global prayer...
        </div>
      </div>
    );
  }

  // Error state (show error but keep existing prayer)
  if (error && !displayText) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div className="text-white/70 font-marcellus text-lg mb-2">
          The world is praying for...
        </div>
        <div className="text-red-400 font-marcellus text-sm mb-2">
          Unable to load current prayer
        </div>
        <button
          onClick={() => {
            clearError();
            fetchGlobalPrayer();
          }}
          className="text-yellow-400 hover:text-yellow-300 text-xs underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <>
      {/* "The world is praying for..." on the left */}
      <div className="fixed top-1/2 left-50 transform -translate-y-1/2 z-20 text-left">
        <div className="text-white/90 font-marcellus text-xl tracking-wide flex items-center">
          The world is praying for
          <span className="ml-3 text-white/60">→</span>
        </div>
      </div>
      
      {/* Prayer text and share button centered over the globe */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        {/* Prayer Text */}
        <div className="text-yellow-400 font-marcellus text-xl leading-relaxed tracking-wide mb-4">
          {displayText}
          {isLoading && displayText && (
            <span className="ml-2 text-yellow-400/60 animate-pulse">↻</span>
          )}
        </div>
        
        {/* Share Prayer Button */}
        <button
          onClick={handleSharePrayer}
          disabled={!topRelevanceEvent}
          className="border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm px-4 py-2 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          Share your prayer
        </button>
        
        {/* Error indicator */}
        {error && displayText && (
          <div className="mt-2 text-red-400/70 text-xs">
            Prayer refresh failed
          </div>
        )}
      </div>
    </>
  );
};

export default GlobalPrayerDisplay;
