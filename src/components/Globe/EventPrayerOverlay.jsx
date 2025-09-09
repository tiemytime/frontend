import React from 'react';
import AudioPrayerPlayer from './AudioPrayerPlayer';
import DefaultPrayerText from './DefaultPrayerText';

const EventPrayerOverlay = ({ event, isVisible }) => {
  if (!isVisible || !event) return null;

  return (
    <>
      {/* Audio Player - Bottom Left, positioned higher */}
      <div className="fixed bottom-20 left-6 z-30 w-80 max-w-sm animate-fade-in">
        <AudioPrayerPlayer eventId={event.id} autoPlay={true} />
      </div>

      {/* Default Prayer Text - Bottom Center, positioned higher */}
      <div className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-30 w-96 max-w-md animate-fade-in">
        <DefaultPrayerText eventId={event.id} />
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default EventPrayerOverlay;
