import { create } from 'zustand';

const useBackgroundStore = create((set) => ({
  // Background state
  isVisible: true,
  animationSpeed: 1,
  particleCount: 200,
  
  // Actions
  setVisibility: (visible) => set({ isVisible: visible }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setParticleCount: (count) => set({ particleCount: count }),
  
  // Reset to defaults
  reset: () => set({
    isVisible: true,
    animationSpeed: 1,
    particleCount: 200
  })
}));

export default useBackgroundStore;
