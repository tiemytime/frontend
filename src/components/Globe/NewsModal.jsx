import React from 'react';

const NewsModal = ({ event, isOpen, onClose, onSharePrayer }) => {
  if (!isOpen || !event) return null;

  const handleBackdropClick = (e) => {
    // Close modal when clicking on the backdrop (outside the modal content)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 top-[150px] flex items-center justify-start w-[500px] h-[500px] p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-4 w-full max-w-sm max-h-[65vh] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          overflowY: 'hidden'
        }}
      >
        {/* Header */}
        <div className="border-b border-white/20 pb-2 mb-4 relative">
          <h3 className="text-white font-marcellus text-base sm:text-lg">EVENT TITLE</h3>
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        
        {/* Event details */}
        <div className="space-y-2 text-gray-200 text-xs">
          <div>
            <p className="text-white mb-1 text-sm">{event.eventTitle}</p>
            <p className="leading-relaxed text-xs">{event.description}</p>
          </div>
          
          <div>
            <span className="text-gray-300 text-xs">Location</span>
            <p className="text-white text-xs">{event.location}</p>
          </div>
          
          <div>
            <span className="text-gray-300 text-xs">Relevance</span>
            <p className="text-white text-xs">{event.relevance}</p>
          </div>
          
          <div>
            <span className="text-gray-300 text-xs">Category</span>
            <p className="text-white text-xs">{event.category}</p>
          </div>
          
          <div>
            <span className="text-gray-300 text-xs">Sources</span>
            <p className="text-white text-xs">{event.sources}</p>
          </div>
          
          {/* Links */}
          <div>
            <span className="text-gray-300 text-xs">Links</span>
            <div className="space-y-1 mt-1">
              {event.links.slice(0, 2).map((link, index) => (
                <p key={index} className="text-blue-300 cursor-pointer hover:text-blue-200 text-xs">
                  Link {index + 1}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Join Prayer Button */}
        <button 
          onClick={() => onSharePrayer(event)}
          className="w-full mt-4 border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm py-2 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300 text-sm"
        >
          Join the global prayer
        </button>
      </div>
    </div>
  );
};

export default NewsModal;
