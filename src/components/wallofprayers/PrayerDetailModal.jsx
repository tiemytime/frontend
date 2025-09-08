import React, { useCallback } from 'react';

const PrayerDetailModal = React.memo(({ prayer, isOpen, onClose }) => {
  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  const handleStopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!isOpen || !prayer) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-black/30 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
        onClick={handleStopPropagation}
      >
        {/* Header */}
        <div className="border-b border-white/20 pb-4 mb-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
          <div className="text-4xl mb-2">🕯️</div>
          <h3 className="text-yellow-400 font-marcellus text-xl">{prayer.noteTitle}</h3>
          <p className="text-white text-sm mt-1">{prayer.eventTitle}</p>
        </div>
        
        {/* Prayer Content */}
        <div className="space-y-4 text-gray-200">
          <div>
            <h4 className="text-white font-marcellus mb-2">Prayer Message:</h4>
            <p className="leading-relaxed">{prayer.prayerText}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-300 text-sm">Theme:</span>
              <p className="text-white">{prayer.theme}</p>
            </div>
            <div>
              <span className="text-gray-300 text-sm">Category:</span>
              <p className="text-white">{prayer.category}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-gray-300 text-sm">Prayed by:</span>
              <p className="text-white">{prayer.username}</p>
            </div>
            <div>
              <span className="text-gray-300 text-sm">Location:</span>
              <p className="text-white">{prayer.userLocation}</p>
            </div>
          </div>
          
          <div>
            <span className="text-gray-300 text-sm">Event Location:</span>
            <p className="text-white">{prayer.eventLocation}</p>
          </div>
          
          <div>
            <span className="text-gray-300 text-sm">Date:</span>
            <p className="text-white">
              {new Date(prayer.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-white/20">
          <button 
            onClick={onClose}
            className="w-full border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm py-3 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

PrayerDetailModal.displayName = 'PrayerDetailModal';

export default PrayerDetailModal;
