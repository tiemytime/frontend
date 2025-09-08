import React from 'react';

const SharePrayerButton = ({ onShare }) => {
  return (
    <button 
      onClick={onShare}
      className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer"
    >
      <div className="text-center">
        <div className="text-white font-marcellus text-sm sm:text-base md:text-lg leading-relaxed">
          Share<br />
          your<br />
          pray
        </div>
      </div>
    </button>
  );
};

export default SharePrayerButton;
