import React from 'react';
import { useNavigate } from 'react-router-dom';

const WallHeader = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/globe');
  };

  return (
    <div className="relative top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 via-black/40 to-transparent">
      {/* Top row with logo and search */}
      <div className="flex justify-between items-center p-4 sm:p-8">
        {/* Left side - Logo and Title */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img src="/logo.png" alt="Logo" className="w-16 h-16 mr-4" />
          <div className="text-white font-marcellus">
            <div>One prayer</div>
            <div>One world</div>
          </div>
        </div>
        
        {/* Right side - Search */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded px-4 py-2">
          <input 
            type="text" 
            placeholder="Search an event, write a keyword" 
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent text-white placeholder-gray-300 outline-none w-32 sm:w-48 md:w-64"
          />
        </div>
      </div>
    </div>
  );
};

export default WallHeader;
