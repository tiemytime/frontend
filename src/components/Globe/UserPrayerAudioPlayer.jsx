import React, { useEffect, useState } from 'react';
import { aiPrayerAPI } from '../../services/aiPrayerAPI';
import useAudioPlayerStore from '../../stores/audioPlayerStore';

const UserPrayerAudioPlayer = ({ 
  prayerText, 
  eventData, 
  autoPlay = false, 
  className = '',
  onAudioGenerated = null 
}) => {
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isLoading,
    isPlaying,
    duration,
    volume,
    error,
    loadAudio,
    togglePlayPause,
    setVolume,
    seekTo,
    getFormattedTime,
    clearError,
    cleanup
  } = useAudioPlayerStore();

  // Generate audio when prayer text is available
  useEffect(() => {
    const generateAudio = async () => {
      if (!prayerText || !eventData || isInitialized) return;

      setIsGeneratingAudio(true);
      setAudioError(null);

      try {
        // Generate audio using AI Prayer API
        const audioResponse = await aiPrayerAPI.generateAudioPrayer({
          id: eventData.id || 'user-generated',
          prayerText: prayerText
        }, {
          voice: 'default',
          speed: 1.0,
          format: 'mp3'
        });

        if (audioResponse.success && audioResponse.data.audioUrl) {
          // Load audio into player
          await loadAudio(
            `user-prayer-${eventData.id || 'generated'}`, 
            audioResponse.data.audioUrl, 
            { autoPlay }
          );
          
          setIsInitialized(true);
          
          // Notify parent component
          if (onAudioGenerated) {
            onAudioGenerated(audioResponse.data);
          }
        } else {
          throw new Error('No audio URL received from server');
        }
      } catch (error) {
        console.error('Failed to generate prayer audio:', error);
        setAudioError(error.message || 'Failed to generate audio');
      } finally {
        setIsGeneratingAudio(false);
      }
    };

    generateAudio();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [prayerText, eventData, autoPlay, loadAudio, cleanup, isInitialized, onAudioGenerated]);

  // Format time helper
  const timeInfo = getFormattedTime();

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Handle seek
  const handleSeekChange = (e) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    seekTo(newTime);
  };

  // Handle error dismiss
  const handleErrorDismiss = () => {
    setAudioError(null);
    clearError();
  };

  // Show generating state
  if (isGeneratingAudio) {
    return (
      <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-white">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span className="text-sm">Converting prayer to audio...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (audioError || error) {
    return (
      <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between text-red-400">
          <span className="text-sm">{audioError || error}</span>
          <button
            onClick={handleErrorDismiss}
            className="text-xs hover:text-red-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-white">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span className="text-sm">Loading prayer audio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/40 backdrop-blur-sm rounded-lg p-4 ${className}`}>
      {/* Audio Controls Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          {/* Sound wave icon for generated prayer */}
          <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L5.05 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.05l3.333-2.776zM13 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1zm3.854-1.146a.5.5 0 010 .708L15.5 6.914a1.5 1.5 0 000 2.172l1.354 1.354a.5.5 0 01-.708.708L14.793 9.793a2.5 2.5 0 010-3.586l1.353-1.353a.5.5 0 01.708 0z" clipRule="evenodd" />
          </svg>
          <span className="text-white text-sm font-marcellus">Your Prayer Audio</span>
        </div>
        
        {/* Time Display */}
        <div className="text-gray-300 text-xs">
          {timeInfo.current} / {timeInfo.total}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max="100"
          value={timeInfo.progress}
          onChange={handleSeekChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
          style={{
            background: `linear-gradient(to right, #facc15 0%, #facc15 ${timeInfo.progress}%, #374151 ${timeInfo.progress}%, #374151 100%)`
          }}
        />
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-yellow-400/20 hover:bg-yellow-400/30 rounded-full transition-all duration-300 group"
        >
          {isPlaying ? (
            /* Pause Icon */
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            /* Play Icon */
            <svg className="w-4 h-4 text-yellow-400 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 ml-4">
          {/* Volume Icon */}
          <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.776L5.05 14H2a1 1 0 01-1-1V7a1 1 0 011-1h3.05l3.333-2.776zM13 6a1 1 0 011 1v6a1 1 0 11-2 0V7a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #facc15 0%, #facc15 ${volume * 100}%, #374151 ${volume * 100}%, #374151 100%)`
            }}
          />
          <span className="text-gray-300 text-xs w-8 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #facc15;
          cursor: pointer;
          border: 2px solid #000;
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #facc15;
          cursor: pointer;
          border: 2px solid #000;
        }
      `}</style>
    </div>
  );
};

export default UserPrayerAudioPlayer;
