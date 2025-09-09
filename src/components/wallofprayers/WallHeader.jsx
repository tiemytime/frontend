import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const WallHeader = React.memo(({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const handleLogoClick = useCallback(() => {
    navigate('/globe');
  }, [navigate]);

  const handleSearchChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="relative top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/40 to-transparent">
      {/* Top row with logo and search */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-8 gap-4 sm:gap-0">
        {/* Left side - Logo and Title */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img src="/logo.png" alt="Logo" className="w-12 h-12 sm:w-16 sm:h-16 mr-3 sm:mr-4" />
          <div className="text-white font-marcellus text-sm sm:text-base">
            <div>One prayer</div>
            <div>One world</div>
          </div>
        </div>
        
        {/* Right side - Search */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-3 py-2 sm:px-4 sm:py-2 w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search an event, write a keyword" 
            value={searchQuery}
            onChange={handleSearchChange}
            className="bg-transparent text-white placeholder-gray-300 outline-none w-full sm:w-48 md:w-64 text-sm"
          />
        </div>
      </div>
    </div>
  );
});

WallHeader.displayName = 'WallHeader';

export default WallHeader;
