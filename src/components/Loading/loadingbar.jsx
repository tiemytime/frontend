import React from 'react';

export const LoadingBar = () => {
  return (
    <>
      {/* Custom CSS for loading bar animation */}
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
      
      {/* Loading Text and Bar - Bottom Center */}
      <div className="absolute bottom-8 sm:bottom-12 md:bottom-16 left-1/2 transform -translate-x-1/2 z-20">
        <div className="text-center">
          <p className="text-white text-sm sm:text-base md:text-lg font-marcellus tracking-wide mb-4 sm:mb-6 md:mb-8">
            Loading ...
          </p>
          
          {/* Thin Loading Bar */}
          <div className="w-48 sm:w-56 md:w-64 h-0.5 bg-gray-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 rounded-full animate-pulse">
              <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 animate-loading-bar"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};