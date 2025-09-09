// Audio player store for managing prayer audio playback
import { create } from 'zustand';
import { audioAPI, AudioPlayer } from '../services/audioAPI.js';

const useAudioPlayerStore = create((set, get) => ({
  // State
  currentPlayer: null,
  currentEventId: null,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  error: null,
  audioUrl: null,

  // Actions
  loadAudio: async (eventId, audioUrl, options = {}) => {
    const { currentPlayer, stopAudio } = get();
    
    // Stop current audio if playing
    if (currentPlayer) {
      stopAudio();
    }

    set({ 
      isLoading: true, 
      error: null, 
      currentEventId: eventId,
      audioUrl 
    });

    try {
      // Create new audio player with state change callback
      const player = audioAPI.createAudioPlayer(audioUrl, {
        autoPlay: options.autoPlay || false,
        volume: get().volume,
        onStateChange: (state) => {
          set({
            isPlaying: state.isPlaying,
            isLoading: state.isLoading,
            currentTime: state.currentTime,
            duration: state.duration,
            volume: state.volume
          });
        },
        onError: (error) => {
          console.error('Audio playback error:', error);
          set({
            error: 'Failed to load audio',
            isLoading: false,
            isPlaying: false
          });
        },
        onEnded: () => {
          set({
            isPlaying: false,
            currentTime: 0
          });
        }
      });

      set({
        currentPlayer: player,
        isLoading: false,
        error: null
      });

      // Auto-play if requested
      if (options.autoPlay) {
        await get().playAudio();
      }

      return player;

    } catch (error) {
      console.error('Failed to load audio:', error);
      set({
        error: 'Failed to load audio',
        isLoading: false,
        currentPlayer: null
      });
      throw error;
    }
  },

  playAudio: async () => {
    const { currentPlayer } = get();
    
    if (!currentPlayer) {
      console.warn('No audio player available');
      return false;
    }

    try {
      // Stop any other audio first
      audioAPI.pauseAllAudio();
      
      const success = await currentPlayer.play();
      
      if (success) {
        set({ isPlaying: true, error: null });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to play audio:', error);
      set({ error: 'Failed to play audio' });
      return false;
    }
  },

  pauseAudio: () => {
    const { currentPlayer } = get();
    
    if (currentPlayer) {
      currentPlayer.pause();
      set({ isPlaying: false });
    }
  },

  stopAudio: () => {
    const { currentPlayer } = get();
    
    if (currentPlayer) {
      currentPlayer.stop();
      set({ 
        isPlaying: false, 
        currentTime: 0 
      });
    }
  },

  setVolume: (volume) => {
    const { currentPlayer } = get();
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    if (currentPlayer) {
      currentPlayer.setVolume(clampedVolume);
    }
    
    set({ volume: clampedVolume });
  },

  seekTo: (time) => {
    const { currentPlayer } = get();
    
    if (currentPlayer) {
      currentPlayer.setCurrentTime(time);
    }
  },

  togglePlayPause: async () => {
    const { isPlaying, playAudio, pauseAudio } = get();
    
    if (isPlaying) {
      pauseAudio();
    } else {
      await playAudio();
    }
  },

  // Clean up current player
  cleanup: () => {
    const { currentPlayer } = get();
    
    if (currentPlayer) {
      audioAPI.removePlayer(currentPlayer);
    }
    
    set({
      currentPlayer: null,
      currentEventId: null,
      isPlaying: false,
      isLoading: false,
      currentTime: 0,
      duration: 0,
      error: null,
      audioUrl: null
    });
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Get formatted time strings
  getFormattedTime: () => {
    const { currentTime, duration } = get();
    
    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };
    
    return {
      current: formatTime(currentTime),
      total: formatTime(duration),
      progress: duration > 0 ? (currentTime / duration) * 100 : 0
    };
  },

  // Check if audio is available for event
  hasAudioForEvent: (eventId) => {
    const { currentEventId, audioUrl } = get();
    return currentEventId === eventId && audioUrl;
  }
}));

export default useAudioPlayerStore;
