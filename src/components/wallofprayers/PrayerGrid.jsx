import React from 'react';
import PropTypes from 'prop-types';
import PrayerCard from './PrayerCard';
import { useRenderPerformance } from '../../hooks/usePerformance';

const PrayerGrid = React.memo(({ prayers, onCardClick, isLoading }) => {
  // Track render performance
  useRenderPerformance('PrayerGrid');
  if (isLoading) {
    // Loading skeleton
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-8 lg:px-16 xl:px-24 mb-8">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 h-32 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/5 rounded mb-1"></div>
            <div className="h-3 bg-white/5 rounded mb-2"></div>
            <div className="h-3 bg-white/5 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-8 lg:px-16 xl:px-24 mb-8">
      {prayers.map((prayer) => (
        <PrayerCard
          key={prayer.id}
          prayer={prayer}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
});

PrayerGrid.displayName = 'PrayerGrid';

PrayerGrid.propTypes = {
  prayers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCardClick: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
};

export default PrayerGrid;
