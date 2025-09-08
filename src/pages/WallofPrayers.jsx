import React, { useEffect, useCallback } from 'react';
import WallHeader from '../components/wallofprayers/WallHeader';
import FilterTabs from '../components/wallofprayers/FilterTabs';
import PrayerGrid from '../components/wallofprayers/PrayerGrid';
import WallFooter from '../components/wallofprayers/WallFooter';
import PrayerDetailModal from '../components/wallofprayers/PrayerDetailModal';
import usePrayerWallStore from '../stores/prayerWallStore';
import { useModal } from '../hooks/useModal';
import { useRenderPerformance } from '../hooks/usePerformance';
import { ENV } from '../services/environment';

const WallofPrayers = () => {
  // Performance tracking
  useRenderPerformance('WallofPrayers');
  
  // Modal management
  const prayerModal = useModal('prayer-detail');
  
  const {
    // State from store
    searchQuery,
    activeFilter,
    currentPage,
    isLoading,
    filterCategories,
    filteredPrayers,
    
    // Actions from store
    setSearchQuery,
    setActiveFilter,
    setCurrentPage,
    
    // Computed values from store
    getPaginatedPrayers,
    getTotalPages,
    
    // Load data
    loadPrayers
  } = usePrayerWallStore();

  // Load prayers on component mount
  useEffect(() => {
    loadPrayers();
  }, [loadPrayers]);

  const handleCloseModal = useCallback(() => {
    prayerModal.close();
  }, [prayerModal]);

  const handleFilterChange = useCallback((filter) => {
    setActiveFilter(filter);
  }, [setActiveFilter]);

  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
  }, [setSearchQuery]);

  const handlePrayerSelect = useCallback((prayer) => {
    prayerModal.open(prayer);
  }, [prayerModal]);

  const paginatedPrayers = getPaginatedPrayers();
  const totalPages = getTotalPages();

  // Debug info (if enabled)
  if (ENV.DEBUG && window.PrayerApp) {
    window.PrayerApp.setDebugData({
      searchQuery,
      activeFilter,
      filteredCount: filteredPrayers.length,
      paginatedCount: paginatedPrayers.length,
      currentPage,
      totalPages
    });
  }

  return (
    <>
      {/* Earth image positioned between starfield layers */}
      <img 
        src="/earth.png" 
        alt="Earth" 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-60"
        style={{ 
          pointerEvents: 'none',
          zIndex: -12
        }}
      />

      {/* Header */}
      <WallHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />

      {/* Main Content */}
      <div className="min-h-screen pb-32">
        {/* Wall of Prayers Title - Scrollable */}
        <div className="text-center mb-8">
          <h1 className="text-white font-marcellus text-4xl">Wall of Prayers</h1>
        </div>
        
        {/* Event Title and Filter Tabs Combined */}
        <div className="px-8 lg:px-16 xl:px-24 mb-12">
          {/* Filter Tabs */}
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            filters={filterCategories}
          />
        </div>

        {/* Prayer Grid */}
        <PrayerGrid
          prayers={paginatedPrayers}
          onCardClick={handlePrayerSelect}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 px-8 lg:px-16 xl:px-24 mb-8">
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-white border border-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300"
            >
              Previous
            </button>
            
            <span className="text-white font-marcellus">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-white border border-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {/* No results message */}
        {!isLoading && filteredPrayers.length === 0 && (
          <div className="text-center py-12 px-8 lg:px-16 xl:px-24">
            <p className="text-gray-300 font-marcellus">
              No prayers found matching your criteria.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <WallFooter totalCount={filteredPrayers.length} />

      {/* Prayer Detail Modal */}
      <PrayerDetailModal
        prayer={prayerModal.data}
        isOpen={prayerModal.isOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default WallofPrayers
