import React, { useState, useEffect, useMemo } from 'react';
import StarfieldBackground from '../components/background/Starfeildbackground';
import WallHeader from '../components/wallofprayers/WallHeader';
import FilterTabs from '../components/wallofprayers/FilterTabs';
import PrayerGrid from '../components/wallofprayers/PrayerGrid';
import WallFooter from '../components/wallofprayers/WallFooter';
import PrayerDetailModal from '../components/wallofprayers/PrayerDetailModal';
import { allMockPrayers, filterCategories } from '../data/mockWallPrayers';
import { useDebounce } from '../hooks/useDebounce';
import { ENV } from '../services/environment';

const WallofPrayers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPrayer, setSelectedPrayer] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  const prayersPerPage = 12; // 3 rows of 4 items each

  // Simulate loading on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and search prayers
  const filteredPrayers = useMemo(() => {
    let filtered = allMockPrayers;

    // Apply category filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(prayer => prayer.category === activeFilter);
    }

    // Apply search query (debounced)
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(prayer => 
        prayer.noteTitle.toLowerCase().includes(query) ||
        prayer.eventTitle.toLowerCase().includes(query) ||
        prayer.theme.toLowerCase().includes(query) ||
        prayer.username.toLowerCase().includes(query) ||
        prayer.prayerText.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, debouncedSearchQuery]);

  // Paginate prayers
  const paginatedPrayers = useMemo(() => {
    const startIndex = (currentPage - 1) * prayersPerPage;
    return filteredPrayers.slice(startIndex, startIndex + prayersPerPage);
  }, [filteredPrayers, currentPage, prayersPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, debouncedSearchQuery]);

  const handleCardClick = (prayer) => {
    setSelectedPrayer(prayer);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedPrayer(null);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const totalPages = Math.ceil(filteredPrayers.length / prayersPerPage);

  return (
    <>
      <StarfieldBackground />
      
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
          onCardClick={handleCardClick}
          isLoading={isLoading}
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 px-8 lg:px-16 xl:px-24 mb-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-white border border-white/20 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300"
            >
              Previous
            </button>
            
            <span className="text-white font-marcellus">
              {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
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
        prayer={selectedPrayer}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
      />
    </>
  );
}

export default WallofPrayers
