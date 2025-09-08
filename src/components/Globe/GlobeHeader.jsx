import { useNavigate } from 'react-router-dom';

const GlobeHeader = () => {
  const navigate = useNavigate();

  const handleWallOfPrayers = () => {
    navigate('/wall-of-prayers');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[15] flex justify-between items-center p-6 pointer-events-none">
      {/* Logo */}
      <div className="flex flex-col items-center pointer-events-auto">
        <img src="/logo.png" alt="Logo" className="w-14 h-14 mb-2" />
        <div className="text-white font-marcellus text-sm leading-tight text-center">
          <div>One prayer</div>
          <div>One world</div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 pointer-events-auto">
        <button
          onClick={handleWallOfPrayers}
          className="text-white/80 hover:text-yellow-400 font-marcellus text-lg transition-colors duration-300"
        >
          Wall of Prayers
        </button>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search an event, write a keyword"
            className="bg-black/20 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 px-4 py-2 rounded-lg w-80 font-marcellus focus:outline-none focus:border-yellow-400/50 transition-colors duration-300"
          />
        </div>
      </div>
    </div>
  );
};

export default GlobeHeader;
