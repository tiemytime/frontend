import React from 'react';
import PropTypes from 'prop-types';

const PrayerCard = React.memo(({ prayer, onClick }) => {
  return (
    <div 
      onClick={() => onClick(prayer)}
      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-white/15 hover:border-white/30 transition-all duration-300 group h-28 sm:h-32 flex flex-col justify-between"
    >
      {/* Note Title */}
      <div className="text-white font-marcellus text-xs sm:text-sm font-medium mb-1 sm:mb-2 group-hover:text-yellow-400 transition-colors duration-300 line-clamp-2">
        {prayer.noteTitle}
      </div>
      
      {/* Event Title and Theme */}
      <div className="flex-1 text-xs text-gray-300 space-y-1">
        <div className="line-clamp-1 sm:line-clamp-2">
          {prayer.eventTitle}
        </div>
        <div className="text-gray-400 text-xs">
          {prayer.theme}
        </div>
      </div>
      
      {/* Username */}
      <div className="text-xs text-gray-400 pt-1 sm:pt-2 border-t border-white/10">
        {prayer.username}
      </div>
    </div>
  );
});

PrayerCard.displayName = 'PrayerCard';

PrayerCard.propTypes = {
  prayer: PropTypes.shape({
    id: PropTypes.string.isRequired,
    noteTitle: PropTypes.string.isRequired,
    eventTitle: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    prayerText: PropTypes.string.isRequired,
    userLocation: PropTypes.string.isRequired,
    eventLocation: PropTypes.string.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

export default PrayerCard;
