const ShareLightButton = ({ onClick, isLoading }) => {
  return (
    <div className="fixed top-1/2 right-16 transform -translate-y-1/2 z-20">
      <button
        onClick={onClick}
        disabled={isLoading}
        className="bg-yellow-400/10 backdrop-blur-sm border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg font-marcellus text-lg hover:bg-yellow-400/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : (
          'Share your light - Pray now'
        )}
      </button>
    </div>
  );
};

export default ShareLightButton;
