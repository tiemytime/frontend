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
      className="fixed inset-0 z-50 flex items-center justify-start pl-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-black/20 backdrop-blur-md border border-white/20 rounded-lg p-6 w-90 max-h-[62vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="border-b border-white/20 pb-2 mb-4 relative">
          <h3 className="text-white font-marcellus text-lg">EVENT TITLE</h3>
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
        </div>
        
        {/* Event details */}
        <div className="space-y-4 text-gray-200 text-sm">
          <div>
            <p className="text-white mb-2">{event.eventTitle}</p>
            <p className="leading-relaxed">{event.description}</p>
          </div>
          
          <div>
            <span className="text-gray-300">Location</span>
            <p className="text-white">{event.location}</p>
          </div>
          
          <div>
            <span className="text-gray-300">Relevance</span>
            <p className="text-white">{event.relevance}</p>
          </div>
          
          <div>
            <span className="text-gray-300">Category</span>
            <p className="text-white">{event.category}</p>
          </div>
          
          <div>
            <span className="text-gray-300">Sources</span>
            <p className="text-white">{event.sources}</p>
          </div>
          
          {/* Links */}
          <div>
            <span className="text-gray-300">Links</span>
            <div className="space-y-1 mt-2">
              {event.links.map((link, index) => (
                <p key={index} className="text-blue-300 cursor-pointer hover:text-blue-200">
                  Link {index + 1}
                </p>
              ))}
            </div>
          </div>
        </div>
        
        {/* Join Prayer Button */}
        <button 
          onClick={() => onSharePrayer(event)}
          className="w-full mt-6 border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm py-3 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300"
        >
          Join the global prayer
        </button>
      </div>
    </div>
  );
};

export default NewsModal;
