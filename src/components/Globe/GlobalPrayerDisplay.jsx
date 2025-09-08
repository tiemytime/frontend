import { useState, useEffect } from 'react';

const GlobalPrayerDisplay = ({ mostRelevantEvent, shortPrayer, isLoading }) => {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    if (shortPrayer) {
      setDisplayText(shortPrayer);
    }
  }, [shortPrayer, mostRelevantEvent]);

  if (isLoading) {
    return (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div className="text-white/70 font-marcellus text-lg mb-2">
          The world is praying for...
        </div>
        <div className="text-yellow-400 font-marcellus text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  if (!displayText) {
    return null;
  }

  return (
    <>
      {/* "The world is praying for..." on the left */}
      <div className="fixed top-1/2 left-50 transform -translate-y-1/2 z-20 text-left">
        <div className="text-white/90 font-marcellus text-xl tracking-wide flex items-center">
          The world is praying for ...
          <span className="ml-3 text-white/60">→</span>
        </div>
      </div>
      
      {/* Prayer text centered over the globe */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-center">
        <div className="text-yellow-400 font-marcellus text-xl leading-relaxed tracking-wide">
          {displayText}
        </div>
      </div>
    </>
  );
};

export default GlobalPrayerDisplay;
