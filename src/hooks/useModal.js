import { useEffect, useCallback } from 'react';
import useModalStore from '../stores/modalStore';

// Hook to manage individual modal state
export const useModal = (modalId) => {
  const {
    openModal,
    closeModal,
    isModalOpen,
    getModalData,
    updateModalData
  } = useModalStore();
  
  const open = useCallback((data, options) => {
    openModal(modalId, data, options);
  }, [modalId, openModal]);
  
  const close = useCallback(() => {
    closeModal(modalId);
  }, [modalId, closeModal]);
  
  const updateData = useCallback((data) => {
    updateModalData(modalId, data);
  }, [modalId, updateModalData]);
  
  return {
    isOpen: isModalOpen(modalId),
    data: getModalData(modalId),
    open,
    close,
    updateData
  };
};

// Hook to handle global modal interactions (ESC key, etc.)
export const useModalInteractions = () => {
  const { closeTopModal, hasOpenModals, getTopModal } = useModalStore();
  
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && hasOpenModals()) {
        const topModal = getTopModal();
        if (topModal?.options?.closeOnEscape !== false) {
          closeTopModal();
        }
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeTopModal, hasOpenModals, getTopModal]);
  
  return null;
};

// Hook to get modal stack information
export const useModalStack = () => {
  const {
    modalStack,
    getModalCount,
    hasOpenModals,
    closeAllModals
  } = useModalStore();
  
  return {
    modalStack,
    count: getModalCount(),
    hasModals: hasOpenModals(),
    closeAll: closeAllModals
  };
};
