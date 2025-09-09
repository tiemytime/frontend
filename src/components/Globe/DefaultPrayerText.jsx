import React, { useEffect, useState } from 'react';
import { newsAPI } from '../../services/newsAPI';

const DefaultPrayerText = ({ eventId, className = '' }) => {
  const [prayerData, setPrayerData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDefaultPrayer = async () => {
      if (!eventId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await newsAPI.getEventDefaultPrayer(eventId);
        
        if (response.success && response.data) {
          setPrayerData(response.data);
        } else {
          throw new Error('No default prayer available');
        }
      } catch (err) {
        console.error('Failed to fetch default prayer:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDefaultPrayer();
  }, [eventId]);

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <div className="w-24 h-4 bg-gray-600 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="w-full h-3 bg-gray-600 rounded"></div>
            <div className="w-5/6 h-3 bg-gray-600 rounded"></div>
            <div className="w-4/5 h-3 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-red-400/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-2 text-red-400">
          <span className="text-lg">⚠️</span>
          <div>
            <div className="text-sm font-marcellus">Prayer Unavailable</div>
            <div className="text-xs text-red-300">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // No prayer data
  if (!prayerData) {
    return (
      <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-center text-gray-400">
          <span className="text-sm">No prayer available for this event</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/20 backdrop-blur-sm border border-white/20 rounded-lg p-4 ${className}`}>
      {/* Prayer Header */}
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-yellow-400">🕯️</span>
        <h4 className="text-white font-marcellus text-sm">Default Prayer</h4>
        {prayerData.generatedAt && (
          <span className="text-gray-400 text-xs">
            • {new Date(prayerData.generatedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Prayer Text */}
      <div className="text-gray-200 text-sm leading-relaxed">
        <p className="whitespace-pre-line">{prayerData.prayerText}</p>
      </div>

      {/* Prayer Footer */}
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>AI Generated Prayer</span>
          {prayerData.duration && (
            <span>~{prayerData.duration}s reading time</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DefaultPrayerText;
