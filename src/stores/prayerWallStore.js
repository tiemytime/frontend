import { create } from 'zustand';
import { allMockPrayers, filterCategories } from '../data/mockWallPrayers';

const usePrayerWallStore = create((set, get) => ({
  // Prayer data
  prayers: allMockPrayers,
  filteredPrayers: allMockPrayers,
  
  // Filter and search state
  searchQuery: '',
  activeFilter: 'all',
  filterCategories: filterCategories,
  
  // Pagination state
  currentPage: 1,
  prayersPerPage: 12,
  paginatedPrayers: allMockPrayers.slice(0, 12),
  totalPages: Math.ceil(allMockPrayers.length / 12),
  
  // Modal state
  selectedPrayer: null,
  isModalOpen: false,
  
  // Loading state
  isLoading: false,
  error: null,
  
  updatePagination: () => {
    const { filteredPrayers, currentPage, prayersPerPage } = get();
    const startIndex = (currentPage - 1) * prayersPerPage;
    const endIndex = startIndex + prayersPerPage;
    const paginatedPrayers = filteredPrayers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPrayers.length / prayersPerPage);
    
    console.log('Updating pagination:', {
      totalPrayers: filteredPrayers.length,
      currentPage,
      prayersPerPage,
      startIndex,
      endIndex,
      resultCount: paginatedPrayers.length,
      totalPages
    });
    
    set({ paginatedPrayers, totalPages });
  },
  // Actions
  setSearchQuery: (query) => {
    set({ searchQuery: query, currentPage: 1 });
    get().applyFilters();
    get().updatePagination();
  },
  
  setActiveFilter: (filter) => {
    set({ activeFilter: filter, currentPage: 1 });
    get().applyFilters();
    get().updatePagination();
  },
  
  setCurrentPage: (page) => {
    console.log('Setting current page to:', page);
    set({ currentPage: page });
    get().updatePagination();
  },
  
  setPrayersPerPage: (perPage) => {
    set({ prayersPerPage: perPage, currentPage: 1 });
    get().updatePagination();
  },
  
  openModal: (prayer) => set({ selectedPrayer: prayer, isModalOpen: true }),
  
  closeModal: () => set({ selectedPrayer: null, isModalOpen: false }),
  
  applyFilters: () => {
    const { prayers, searchQuery, activeFilter } = get();
    
    let filtered = prayers;
    
    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(prayer => prayer.category === activeFilter);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prayer =>
        prayer.noteTitle.toLowerCase().includes(query) ||
        prayer.eventTitle.toLowerCase().includes(query) ||
        prayer.theme.toLowerCase().includes(query) ||
        prayer.username.toLowerCase().includes(query) ||
        prayer.prayerText.toLowerCase().includes(query) ||
        prayer.userLocation.toLowerCase().includes(query)
      );
    }
    
    set({ filteredPrayers: filtered });
    get().updatePagination();
  },  // Reset filters
  resetFilters: () => {
    set({
      searchQuery: '',
      activeFilter: 'all',
      currentPage: 1,
      filteredPrayers: allMockPrayers
    });
    get().updatePagination();
  },

  // Load prayers (for future API integration)
  loadPrayers: async () => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call - replace with actual API call later
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ prayers: allMockPrayers, isLoading: false });
      get().applyFilters();
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default usePrayerWallStore;
