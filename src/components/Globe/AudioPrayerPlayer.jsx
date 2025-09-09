import React, { useEffect, useState } from 'react';
import useAudioPlayerStore from '../../stores/audioPlayerStore';
import { newsAPI } from '../../services/newsAPI';

const AudioPrayerPlayer = ({ eventId, autoPlay = true, className = '' }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const {
    isLoading,
    isPlaying,
    duration,
    volume,
    error,
    hasAudioForEvent,
    loadAudio,
    togglePlayPause,
    setVolume,
    seekTo,
    getFormattedTime,
    clearError,
    cleanup
  } = useAudioPlayerStore();

  // Initialize audio for event
  useEffect(() => {
    const initializeAudio = async () => {
      if (!eventId || hasAudioForEvent(eventId)) {
        setIsInitialized(true);
        return;
      }

      try {
        // Fetch audio URL for the event
        const audioResponse = await newsAPI.getEventAudioPrayer(eventId);
        
        if (audioResponse.success && audioResponse.data.audioUrl) {
          await loadAudio(eventId, audioResponse.data.audioUrl, { autoPlay });
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Failed to initialize audio:', error);
        setIsInitialized(true);
      }
    };

    initializeAudio();

    // Cleanup on unmount
    return () => {
      cleanup();
    };
  }, [eventId, autoPlay, hasAudioForEvent, loadAudio, cleanup]);

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

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center space-x-2 text-white">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
          <span className="text-sm">Loading prayer audio...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-red-400/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between text-red-400">
          <span className="text-sm">{error}</span>
          <button
            onClick={clearError}
            className="text-xs hover:text-red-300 transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
      {/* Audio Controls Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="text-yellow-400">🎵</div>
          <span className="text-white text-sm font-marcellus">Prayer Audio</span>
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
          className="flex items-center justify-center w-10 h-10 bg-yellow-400/20 hover:bg-yellow-400/30 border border-yellow-400 rounded-full transition-all duration-300"
        >
          {isPlaying ? (
            <div className="flex space-x-1">
              <div className="w-1 h-4 bg-yellow-400"></div>
              <div className="w-1 h-4 bg-yellow-400"></div>
            </div>
          ) : (
            <div className="w-0 h-0 border-l-4 border-l-yellow-400 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
          )}
        </button>

        {/* Volume Control */}
        <div className="flex items-center space-x-2 flex-1 ml-4">
          <div className="text-gray-300 text-xs">🔊</div>
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

export default AudioPrayerPlayer;
