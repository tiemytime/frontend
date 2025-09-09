// Audio API service for prayer audio management
import { ENV } from './environment.js';

/**
 * Audio cache for performance optimization
 */
class AudioCache {
  constructor(maxSize = 10) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(url) {
    return this.cache.get(url);
  }

  set(url, audio) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      const firstAudio = this.cache.get(firstKey);
      if (firstAudio) {
        firstAudio.pause();
        firstAudio.src = '';
      }
      this.cache.delete(firstKey);
    }
    this.cache.set(url, audio);
  }

  clear() {
    this.cache.forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.cache.clear();
  }
}

/**
 * Audio player class for managing individual audio instances
 */
export class AudioPlayer {
  constructor(url, options = {}) {
    this.url = url;
    this.audio = new Audio(url);
    this.options = {
      autoPlay: false,
      loop: false,
      volume: 0.7,
      ...options
    };
    
    this.isLoading = false;
    this.isPlaying = false;
    this.duration = 0;
    this.currentTime = 0;
    
    this._setupAudio();
  }

  _setupAudio() {
    const { audio } = this;
    
    // Set initial properties
    audio.volume = this.options.volume;
    audio.loop = this.options.loop;
    
    // Event listeners
    audio.addEventListener('loadstart', () => {
      this.isLoading = true;
      this._notifyStateChange();
    });
    
    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration;
      this.isLoading = false;
      this._notifyStateChange();
    });
    
    audio.addEventListener('timeupdate', () => {
      this.currentTime = audio.currentTime;
      this._notifyStateChange();
    });
    
    audio.addEventListener('play', () => {
      this.isPlaying = true;
      this._notifyStateChange();
    });
    
    audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this._notifyStateChange();
    });
    
    audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.currentTime = 0;
      this._notifyStateChange();
      if (this.options.onEnded) {
        this.options.onEnded();
      }
    });
    
    audio.addEventListener('error', (e) => {
      this.isLoading = false;
      this.isPlaying = false;
      this._notifyStateChange();
      if (this.options.onError) {
        this.options.onError(e);
      }
    });
  }

  _notifyStateChange() {
    if (this.options.onStateChange) {
      this.options.onStateChange({
        isLoading: this.isLoading,
        isPlaying: this.isPlaying,
        currentTime: this.currentTime,
        duration: this.duration,
        volume: this.audio.volume
      });
    }
  }

  async play() {
    try {
      await this.audio.play();
      return true;
    } catch (error) {
      console.error('Audio play failed:', error);
      if (this.options.onError) {
        this.options.onError(error);
      }
      return false;
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setVolume(volume) {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    this._notifyStateChange();
  }

  setCurrentTime(time) {
    if (this.audio.duration) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, time));
    }
  }

  destroy() {
    this.audio.pause();
    this.audio.src = '';
    this.audio = null;
  }
}

/**
 * Global audio cache instance
 */
const audioCache = new AudioCache();

/**
 * Currently active audio players
 */
const activeAudioPlayers = new Set();

/**
 * Audio API service
 */
export const audioAPI = {
  /**
   * Create and cache audio player
   */
  createAudioPlayer(url, options = {}) {
    // Check if audio is already cached
    let audio = audioCache.get(url);
    
    if (!audio) {
      audio = new AudioPlayer(url, options);
      audioCache.set(url, audio);
    }
    
    // Add to active players
    activeAudioPlayers.add(audio);
    
    return audio;
  },

  /**
   * Stop all currently playing audio
   */
  stopAllAudio() {
    activeAudioPlayers.forEach(player => {
      player.stop();
    });
  },

  /**
   * Pause all currently playing audio
   */
  pauseAllAudio() {
    activeAudioPlayers.forEach(player => {
      if (player.isPlaying) {
        player.pause();
      }
    });
  },

  /**
   * Preload audio files for better performance
   */
  async preloadAudio(urls) {
    const preloadPromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const audio = new Audio(url);
        audio.addEventListener('canplaythrough', () => {
          audioCache.set(url, audio);
          resolve(url);
        });
        audio.addEventListener('error', reject);
        audio.load();
      });
    });

    try {
      const loaded = await Promise.allSettled(preloadPromises);
      return loaded.filter(result => result.status === 'fulfilled').length;
    } catch (error) {
      console.error('Audio preload failed:', error);
      return 0;
    }
  },

  /**
   * Remove audio player from active set
   */
  removePlayer(player) {
    activeAudioPlayers.delete(player);
    player.destroy();
  },

  /**
   * Clear all cached audio
   */
  clearCache() {
    audioCache.clear();
    activeAudioPlayers.clear();
  },

  /**
   * Check if audio format is supported
   */
  isFormatSupported(format) {
    const audio = new Audio();
    return audio.canPlayType(`audio/${format}`) !== '';
  },

  /**
   * Get optimal audio format based on browser support
   */
  getOptimalFormat() {
    const formats = ['mp3', 'ogg', 'wav'];
    for (const format of formats) {
      if (this.isFormatSupported(format)) {
        return format;
      }
    }
    return 'mp3'; // fallback
  }
};

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    audioAPI.clearCache();
  });
}

export default audioAPI;
