import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import GlobeHeader from '../components/Globe/GlobeHeader';
import GlobalPrayerDisplay from '../components/Globe/GlobalPrayerDisplay';
import SharePrayerButton from '../components/Globe/SharePrayerButton';
import { gsap } from 'gsap';
import { mockNewsData } from '../data/mockNews';
import { mockPrayerData } from '../data/mockPrayers';
import NewsModal from '../components/Globe/NewsModal';
import PrayerModal from '../components/Globe/PrayerModal';
import { useNavigate } from 'react-router-dom';

const GlobeComponent = () => {  
    const navigate = useNavigate();
    const [globeReady, setGlobeReady] = useState(false);
    const [countryData, setCountryData] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [showPrayerModal, setShowPrayerModal] = useState(false);
    const globeRef = useRef();
    const hasAnimated = useRef(false);

    useEffect(() => {
        // Load country boundaries data
        fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Failed to load map data: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setCountryData(data.features);
            })
            .catch(err => {
                console.error('Could not load country data:', err);
                // Continue without country boundaries - app still works
            });
    }, []);

    useEffect(() => {
        if (globeRef.current && globeReady) {
            const globeInstance = globeRef.current;  
            
            // Start from far away position for "entering Earth" effect
            globeInstance.pointOfView({ lat: 10, lng: 15, altitude: 6 }, 0);
            
            // Smooth zoom into Earth - optimal distance for dramatic view
            setTimeout(() => {
                globeInstance.pointOfView({ lat: 10, lng: 15, altitude: 2.2 }, 3000);
            }, 500);
            
            // Setup controls for smooth interaction
            const controls = globeInstance.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.2; // Slower, more elegant rotation
            controls.enableDamping = true;
            controls.dampingFactor = 0.08; // Smoother damping
            controls.enableZoom = true;
            controls.enablePan = true; // Allow panning for better exploration
            controls.minDistance = 180; // Prevent getting too close
            controls.maxDistance = 800; // Reasonable max distance
            controls.rotateSpeed = 0.5; // Smooth manual rotation
            controls.zoomSpeed = 0.8; // Controlled zoom speed
        }
    }, [globeReady]);

    const handleGlobeReady = () => {
        setGlobeReady(true);
        
        // Globe entrance animation - more dramatic
        if (!hasAnimated.current) {
            hasAnimated.current = true;
            
            setTimeout(() => {
                const globeCanvas = document.querySelector(".globe canvas");
                if (globeCanvas) {
                    // Set initial state - dramatic entrance
                    gsap.set(".globe canvas", { 
                        opacity: 0,
                        scale: 0.3,
                        transformOrigin: "center center"
                    });
                    
                    // Dramatic zoom-in effect only
                    gsap.to(".globe canvas", {
                        opacity: 1,
                        scale: 1,
                        ease: "power3.out",
                        duration: 2.5,
                        delay: 0.3
                    });
                }
            }, 100);
        }
    };

    const handleMarkerClick = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const handleSharePrayer = (event) => {
        setSelectedEvent(event);
        // Keep news modal open, just show prayer modal on top
        setShowPrayerModal(true);
    };

    // Test function to navigate to prayer submission with mock data
    const testPrayerSubmission = () => {
        navigate('/prayer-submission', { state: mockPrayerData });
    };

    return (
        <>
            {/* Globe Header */}
            <GlobeHeader />
            
            {/* Globe Container */}
            <div style={{ 
                position: 'relative',
                width: '100vw', 
                height: '100vh', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                zIndex: 10,
                background: 'transparent'
            }}>
                <div className="globe" style={{
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)',
                    filter: 'contrast(1.2) brightness(1.7) saturate(1.2)',
                    clipPath: 'circle(50% at 50% 50%)',
                }}>
                    <Globe
                        ref={globeRef}
                        // Dark, realistic Earth appearance - using night texture with enhancements
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        
                        // Transparent background to show starfield
                        backgroundColor="rgba(0,0,0,0)"
                        
                        // Completely disable atmospheric effects
                        enableAtmosphere={true}
                        atmosphereAltitude={0.07}
                        atmosphereColor="rgba(225, 214, 214, 0.47)"
                        
                        // Brilliant golden country border lights like reference
                        hexPolygonsData={countryData}
                        hexPolygonResolution={6}
                        hexPolygonMargin={0.1}
                        hexPolygonUseDots={true}
                        hexPolygonColor={() => {
                            const intensity = Math.random() * 0.2 + 1.4; // 1.4 to 1.6 intensity - maximum bright
                            const brightness = Math.random() * 20 + 250; // 250-270 brightness - brilliant
                            const golden = Math.random() * 15 + 220; // Strong golden component
                            return `rgba(${brightness}, ${golden}, 120, ${intensity})`;
                        }}
                        hexPolygonAltitude={0.015}
                        
                        // Remove old polygon borders
                        polygonsData={[]}
                        
                        // Bright, glowing event markers
                        pointsData={mockNewsData}
                        pointLat={d => d.lat}
                        pointLng={d => d.lng}
                        pointColor={() => {
                            const colors = [
                                'rgba(255, 255, 255, 1.0)', // Pure bright white
                                'rgba(255, 250, 220, 1.0)', // Brilliant warm white
                                'rgba(255, 240, 180, 1.0)', // Bright golden white
                                'rgba(255, 215, 0, 1.0)'    // Pure gold
                            ];
                            return colors[Math.floor(Math.random() * colors.length)];
                        }}
                        pointAltitude={0.015}
                        pointRadius={0.5}
                        onPointClick={handleMarkerClick}
                        pointLabel={d => d.eventTitle}
                        
                        // Enhanced lighting for dramatic effect
                        showGraticules={false}
                        
                        // Interaction
                        enablePointerInteraction={true}
                        
                        // Globe ready callback
                        onGlobeReady={handleGlobeReady}
                        
                        // Size - Responsive 
                        width={Math.min(window.innerWidth * 1.2,1500)}
                        height={Math.min(window.innerHeight * 1.2,1500)}
                    />
                </div>
            </div>
            
            {/* Global Prayer Display */}
            <GlobalPrayerDisplay />
            
            {/* Share Prayer Button */}
            <SharePrayerButton 
                onSharePrayer={handleSharePrayer}
                isLoading={false}
            />
            
            {/* Event Details Modal */}
            <NewsModal 
                event={selectedEvent}
                isOpen={showEventModal}
                onClose={() => setShowEventModal(false)}
                onSharePrayer={handleSharePrayer}
            />
            
            {/* Prayer Generation Modal */}
            <PrayerModal 
                event={selectedEvent}
                isOpen={showPrayerModal}
                onClose={() => setShowPrayerModal(false)}
            />
            
            {/* Test Button for Prayer Submission Page */}
            <button 
                onClick={testPrayerSubmission}
                className="fixed bottom-4 right-4 z-50 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400 text-yellow-400 px-3 py-2 sm:px-4 sm:py-2 rounded font-marcellus hover:bg-yellow-400/30 transition-all duration-300 text-xs sm:text-sm"
            >
                Test Prayer
            </button>
        </>
    );
};

export default GlobeComponent;