import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockNewsData } from '../data/mockNews';

const PrayerDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [prayer] = useState(location.state?.prayer || null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventData = async () => {
      if (prayer?.eventTitle) {
        try {
          // Find event by matching title (using mock data for now)
          const matchedEvent = mockNewsData.find(
            newsItem => newsItem.eventTitle === prayer.eventTitle
          );
          
          if (matchedEvent) {
            setEvent(matchedEvent);
          }
        } catch (error) {
          console.error('Error fetching event data:', error);
        }
      }
      setIsLoading(false);
    };

    fetchEventData();
  }, [prayer?.eventTitle]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!prayer) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Prayer not found</div>
      </div>
    );
  }

  return (
    <>
      {/* Earth Background */}
      <img 
        src="/earth.png" 
        alt="Earth" 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-60"
        style={{ 
          pointerEvents: 'none',
          zIndex: -12
        }}
      />

      {/* Red Light Overlay */}
      <img 
        src="/redlight.png" 
        alt="Red Light" 
        className="fixed top-0 left-0 w-full h-full object-cover opacity-70"
        style={{ 
          pointerEvents: 'none',
          zIndex: -11
        }}
      />

      <div className="min-h-screen relative">
        {/* Header */}
        <div className="text-center py-8 mb-12 top-20">
          <h1 className="text-white font-marcellus text-4xl">Wall of Prayers</h1>
        </div>

        {/* Main Content */}
        <div className="flex justify-center items-start px-8 gap-8 mt-8">
          
          {/* Left Event Card */}
          {event && (
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-8 w-96 mt-12">
              <div className="text-center mb-6">
                <img 
                  src="/candle.png" 
                  alt="Candle" 
                  className="w-16 h-16 mx-auto mb-4"
                />
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-white font-marcellus text-xl mb-4">EVENT TITLE</h2>
              </div>
              
              <div className="space-y-4 text-center">
                <div className="text-gray-300 text-base">Location</div>
                <div className="text-gray-300 text-base">Description</div>
                <div className="text-gray-300 text-base">Category</div>
                <div className="text-gray-300 text-base">Username</div>
                <div className="text-gray-300 text-base">Location</div>
              </div>
              
              <div className="mt-8 text-center">
                <button className="px-8 py-3 border border-yellow-400 text-yellow-400 rounded font-marcellus hover:bg-yellow-400/10 transition-all duration-300">
                  Join the global prayer
                </button>
              </div>
            </div>
          )}

          {/* Right Prayer Card */}
          <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg p-8 w-[500px]">
            <div className="mb-6">
              <p className="text-white text-base">
                {prayer.username} from {prayer.userLocation} left a prayer:
              </p>
            </div>
            
            <div className="bg-black/40 rounded p-6 mb-6 min-h-[250px]">
              <p className="text-white leading-relaxed text-base">
                "{prayer.prayerText}"
              </p>
            </div>
            
            <div className="flex justify-end">
              <div className="text-right">
                <button
                  onClick={() => navigate('/globe', { 
                    state: { 
                      openPrayerModal: true,
                      event: event 
                    } 
                  })}
                  className="w-40 h-40 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center hover:border-yellow-400/50 hover:bg-yellow-400/5 transition-all duration-300 cursor-pointer"
                >
                  <div className="text-center">
                    <div className="text-white text-base font-marcellus">Share</div>
                    <div className="text-white text-base font-marcellus">prayer</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute top-8 left-8 z-10">
          <button
            onClick={() => navigate('/wall-of-prayers')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-300"
          >
            <span className="text-xl">←</span>
            <span className="font-marcellus">Back to Wall</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default PrayerDetailPage;
