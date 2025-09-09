import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserPrayerAudioPlayer from './UserPrayerAudioPlayer';

const PrayerModal = ({ event, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [intention, setIntention] = useState('');
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    location: '',
    age: ''
  });
  const [generatedPrayer, setGeneratedPrayer] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioGenerated, setAudioGenerated] = useState(false);

  if (!isOpen || !event) return null;

  const handleInputChange = (field, value) => {
    setUserDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGeneratePrayer = async () => {
    setIsGenerating(true);
    setAudioGenerated(false); // Reset audio state
    
    // Mock prayer generation for now (replace with actual API call later)
    setTimeout(() => {
      const mockPrayer = `Dear Universe, we gather our hearts and minds in unity for those affected by "${event.eventTitle}" in ${event.location}. 
      
May peace, healing, and strength find their way to all who need it during this time. Let our collective intention of "${intention}" bring comfort and hope.

We send love and light across the globe, believing in the power of human connection and compassion.

In unity and hope.`;
      
      setGeneratedPrayer(mockPrayer);
      setIsGenerating(false);
    }, 2000);
  };

  const handleBackdropClick = (e) => {
    // Close modal when clicking on the backdrop (outside the modal content)
    if (e.target === e.currentTarget) {
      // Reset states when closing
      setGeneratedPrayer('');
      setAudioGenerated(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="backdrop-blur-md border border-white/20 rounded-lg p-8 w-130 max-h-[80vh] overflow-y-auto scrollbar-hide" 
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {/* Header with candle and close button */}
        <div className="text-center mb-6 relative">
          <button 
            onClick={() => {
              setGeneratedPrayer('');
              setAudioGenerated(false);
              onClose();
            }}
            className="absolute top-0 right-0 text-gray-300 hover:text-white text-xl"
          >
            ×
          </button>
          <div className="text-4xl mb-2">🕯️</div>
          <h3 className="text-blue-300 font-marcellus text-lg">{event.eventTitle}</h3>
        </div>
        
        {/* Event description */}
        <div className="mb-6 text-gray-200 text-sm leading-relaxed">
          {event.description}
        </div>
        
        {/* Intention textarea */}
        <div className="mb-6">
          <label className="text-white block mb-2 font-marcellus">Write your intention here</label>
          <textarea 
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full h-32 bg-white/10 backdrop-blur-sm border border-white/20 rounded p-3 text-white resize-y focus:outline-none focus:border-yellow-400 placeholder-gray-300 min-h-[8rem] max-h-[16rem]"
            placeholder="Share your prayer intention..."
            maxLength={500}
          />
          <div className="text-gray-300 text-xs mt-1">
            {intention.length}/500 characters
          </div>
        </div>
        
        {/* User details */}
        <div className="space-y-3 mb-6">
          <input 
            type="text"
            placeholder="Leave your name"
            value={userDetails.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded p-3 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
          />
          <input 
            type="email"
            placeholder="Your email"
            value={userDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded p-3 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
          />
          <input 
            type="text"
            placeholder="Location"
            value={userDetails.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded p-3 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
          />
          <input 
            type="number"
            placeholder="Age"
            value={userDetails.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded p-3 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400"
          />
        </div>
        
        {/* Light your candle button */}
        <button 
          onClick={handleGeneratePrayer}
          disabled={isGenerating || !intention.trim()}
          className="w-full border border-yellow-400 text-yellow-400 bg-yellow-400/10 backdrop-blur-sm py-3 rounded font-marcellus hover:bg-yellow-400/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Lighting your candle...' : 'Light your candle'}
        </button>
        
        {/* Generated prayer display */}
        {generatedPrayer && (
          <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded border border-yellow-400/30">
            <h4 className="text-yellow-400 mb-3 font-marcellus">Your Generated Prayer:</h4>
            <p className="text-white leading-relaxed whitespace-pre-line mb-4">{generatedPrayer}</p>
            
            {/* Audio Player for Generated Prayer */}
            <div className="mb-4">
              <UserPrayerAudioPlayer
                prayerText={generatedPrayer}
                eventData={event}
                autoPlay={false}
                className="mb-4"
                onAudioGenerated={(audioData) => {
                  console.log('Audio generated:', audioData);
                  setAudioGenerated(true);
                }}
              />
              {audioGenerated && (
                <p className="text-green-400 text-xs mb-2">
                  ✓ Audio prayer is ready to play
                </p>
              )}
            </div>
            
            <button 
              onClick={() => navigate('/prayer-submission', {
                state: {
                  prayer: generatedPrayer,
                  userDetails: userDetails,
                  event: event,
                  intention: intention
                }
              })}
              className="mt-4 w-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-400 text-yellow-400 py-2 rounded font-marcellus hover:bg-yellow-400/30 transition-all duration-300"
            >
              Share Prayer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrayerModal;
