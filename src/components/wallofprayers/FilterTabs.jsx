import React from 'react';

const FilterTabs = ({ activeFilter, onFilterChange, filters }) => {
  return (
    <div className="flex justify-between items-center w-full">
      {/* Left Side - Event Title */}
      <div className="flex items-center">
        <h2 className="text-white font-marcellus text-2xl">Event title</h2>
      </div>
      
      {/* Right Side - Filter Tabs */}
      <div className="flex items-center gap-4">
        {/* Filter Label */}
        <span className="text-white font-marcellus text-sm">Filter:</span>
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-4">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.value)}
              className={`px-4 py-2 text-sm font-marcellus transition-all duration-300 rounded ${
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
};

export default FilterTabs;
