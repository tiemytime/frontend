import React from 'react';

const PrayerCard = ({ prayer, userDetails, onGoToWall }) => {
  return (
    <div className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-4 sm:p-6 w-full max-w-sm sm:max-w-md mx-auto">
      {/* Candle Icon */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="text-3xl sm:text-4xl mb-2">🕯️</div>
      </div>
      
      {/* Prayer Text */}
      <div className="mb-4 sm:mb-6">
        <p className="text-white leading-relaxed text-xs sm:text-sm">
          "{prayer}"
        </p>
      </div>
      
      {/* User Info */}
      <div className="mb-4 sm:mb-6 text-gray-200 text-xs sm:text-sm">
        <p>{userDetails?.name || 'Username'} thank you for spreading your light</p>
        <p>Your little candle can lit up the room full of darkness.</p>
      </div>
      
      {/* Go to Wall of Prayers Button */}
      <button 
        onClick={onGoToWall}
        className="w-full border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm py-2 sm:py-3 rounded font-marcellus text-sm hover:bg-yellow-400/20 transition-all duration-300"
      >
        Go to Wall of Prayers
      </button>
    </div>
  );
};

export default PrayerCard;
