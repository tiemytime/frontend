import React from 'react';
import { useRenderPerformance } from '../../hooks/usePerformance';

const FilterTabs = React.memo(({ activeFilter, onFilterChange, filters }) => {
  // Track render performance
  useRenderPerformance('FilterTabs');
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4 sm:gap-0">
      {/* Left Side - Event Title */}
      <div className="flex items-center">
        <h2 className="text-white font-marcellus text-xl sm:text-2xl">Event title</h2>
      </div>
      
      {/* Right Side - Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
        {/* Filter Label */}
        <span className="text-white font-marcellus text-sm">Filter:</span>
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.value)}
              className={`px-3 py-2 text-xs sm:text-sm font-marcellus transition-all duration-300 rounded whitespace-nowrap ${
                activeFilter === filter.value
                  ? 'text-white bg-blue-600'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});

FilterTabs.displayName = 'FilterTabs';

export default FilterTabs;
