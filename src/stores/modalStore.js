import { create } from 'zustand';

const useModalStore = create((set, get) => ({
  // Modal state
  modals: {},
  modalStack: [],
  
  // Actions
  openModal: (modalId, data = null, options = {}) => {
    const { modals, modalStack } = get();
    const modal = {
      id: modalId,
      data,
      isOpen: true,
      openedAt: Date.now(),
      options: {
        closeOnBackdrop: true,
        closeOnEscape: true,
        preventBodyScroll: true,
        ...options
      }
    };
    
    set({
      modals: {
        ...modals,
        [modalId]: modal
      },
      modalStack: [...modalStack, modalId]
    });
    
    // Prevent body scroll if option is enabled
    if (modal.options.preventBodyScroll) {
      document.body.style.overflow = 'hidden';
    }
  },
  
  closeModal: (modalId) => {
    const { modals, modalStack } = get();
    const modal = modals[modalId];
    
    if (!modal) return;
    
    const updatedModals = { ...modals };
    delete updatedModals[modalId];
    
    const updatedStack = modalStack.filter(id => id !== modalId);
    
    set({
      modals: updatedModals,
      modalStack: updatedStack
    });
    
    // Restore body scroll if no modals are open
    if (updatedStack.length === 0) {
      document.body.style.overflow = '';
    }
  },
  
  closeAllModals: () => {
    set({
      modals: {},
      modalStack: []
    });
    
    // Restore body scroll
    document.body.style.overflow = '';
  },
  
  closeTopModal: () => {
    const { modalStack } = get();
    if (modalStack.length > 0) {
      const topModalId = modalStack[modalStack.length - 1];
      get().closeModal(topModalId);
    }
  },
  
  updateModalData: (modalId, data) => {
    const { modals } = get();
    const modal = modals[modalId];
    
    if (modal) {
      set({
        modals: {
          ...modals,
          [modalId]: {
            ...modal,
            data: typeof data === 'function' ? data(modal.data) : data
          }
        }
      });
    }
  },
  
  // Getters
  isModalOpen: (modalId) => {
    const { modals } = get();
    return Boolean(modals[modalId]?.isOpen);
  },
  
  getModalData: (modalId) => {
    const { modals } = get();
    return modals[modalId]?.data || null;
  },
  
  getTopModal: () => {
    const { modalStack, modals } = get();
    if (modalStack.length === 0) return null;
    
    const topModalId = modalStack[modalStack.length - 1];
    return modals[topModalId] || null;
  },
  
  hasOpenModals: () => {
    const { modalStack } = get();
    return modalStack.length > 0;
  },
  
  getModalCount: () => {
    const { modalStack } = get();
    return modalStack.length;
  }
}));

export default useModalStore;
