import { useNavigate } from 'react-router-dom';

const GlobeHeader = () => {
  const navigate = useNavigate();

  const handleWallOfPrayers = () => {
    navigate('/wall-of-prayers');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[15] flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 pointer-events-none gap-4 sm:gap-0">
      {/* Logo */}
      <div className="flex flex-col items-center pointer-events-auto">
        <img src="/logo.png" alt="Logo" className="w-12 h-12 sm:w-15 sm:h-15 mb-1 sm:mb-2" />
        <div className="text-white font-marcellus text-sm sm:text-lg leading-[1.4] text-center">
          <div>One prayer</div>
          <div>One world</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pointer-events-auto w-full sm:w-auto">
        <button
          onClick={handleWallOfPrayers}
          className="text-white/80 hover:text-yellow-400 font-marcellus text-sm sm:text-lg transition-colors duration-300 order-2 sm:order-1"
        >
          Wall of Prayers
        </button>
        
        <div className="relative order-1 sm:order-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search an event, write a keyword"
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 px-3 py-2 sm:px-4 sm:py-2 rounded-lg w-full sm:w-80 font-marcellus text-sm focus:outline-none focus:border-yellow-400/50 transition-colors duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobeHeader;
