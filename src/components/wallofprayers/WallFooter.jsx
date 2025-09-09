import React from 'react';

const WallFooter = React.memo(({ totalCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex flex-col sm:flex-row justify-between items-center p-4 sm:p-8 lg:px-16 xl:px-24 bg-gradient-to-t from-black/20 to-transparent gap-2 sm:gap-0">
      {/* Left side - Candle and Copyright */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        <img 
          src="/candle.png" 
          alt="Candle" 
          className="w-8 h-12 sm:w-12 sm:h-16 object-contain"
        />
        <div className="text-gray-300 text-xs sm:text-sm font-marcellus">
          Aya Pray - Copyright 2025
        </div>
      </div>
      
      {/* Right side - Total Count */}
      <div className="text-white font-marcellus text-sm sm:text-lg">
        {totalCount.toLocaleString()} Total notes
      </div>
    </div>
  );
});

WallFooter.displayName = 'WallFooter';

export default WallFooter;
