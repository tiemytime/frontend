import React from 'react';

const WallFooter = ({ totalCount }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex justify-between items-center p-8 lg:px-16 xl:px-24 bg-gradient-to-t from-black/20 to-transparent">
      {/* Left side - Candle and Copyright */}
      <div className="flex items-center space-x-4">
        <img 
          src="/candle.png" 
          alt="Candle" 
          className="w-12 h-16 object-contain"
        />
        <div className="text-gray-300 text-sm font-marcellus">
          Aya Pray - Copyright 2025
        </div>
      </div>
      
      {/* Right side - Total Count */}
      <div className="text-white font-marcellus text-lg">
        {totalCount.toLocaleString()} Total notes
      </div>
    </div>
  );
};

export default WallFooter;
