import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';
import StarfieldBackground from '../components/background/Starfeildbackground';
import GlobeHeader from '../components/Globe/GlobeHeader';
import GlobalPrayerDisplay from '../components/Globe/GlobalPrayerDisplay';
import ShareLightButton from '../components/Globe/ShareLightButton';
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
            globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 8 }, 0);
            
            // Smooth zoom into Earth - closer for larger globe
            setTimeout(() => {
                globeInstance.pointOfView({ lat: 20, lng: 0, altitude: 1.8 }, 3000);
            }, 500);
            
            // Setup controls for smooth interaction
            const controls = globeInstance.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.3;
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enableZoom = true;
            controls.enablePan = false;
            controls.minDistance = 150; // Allow closer zoom
            controls.maxDistance = 1000;
        }
    }, [globeReady]);

    const handleGlobeReady = () => {
        setGlobeReady(true);
        
        // Globe entrance animation
        if (!hasAnimated.current) {
            hasAnimated.current = true;
            
            setTimeout(() => {
                const globeCanvas = document.querySelector(".globe canvas");
                if (globeCanvas) {
                    // Set initial state - start invisible
                    gsap.set(".globe canvas", { 
                        opacity: 0,
                        transformOrigin: "center center"
                    });
                    
                    // Fade in the globe smoothly
                    gsap.to(".globe canvas", {
                        opacity: 1,
                        ease: "power2.out",
                        duration: 2,
                    });
                }
            }, 200);
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
            {/* Fixed Starfield Background */}
            <StarfieldBackground />
            
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
                zIndex: 10
            }}>
                <div className="globe" style={{
                    willChange: 'transform, opacity',
                    transform: 'translateZ(0)',
                }}>
                    <Globe
                        ref={globeRef}
                        // Night-time Earth with city lights
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        
                        // Transparent background to show starfield
                        backgroundColor="rgba(0,0,0,0)"
                        
                        // No atmospheric glow to blend with starfield
                        enableAtmosphere={false}
                        atmosphereAltitude={0}
                        atmosphereColor="rgba(0,0,0,0)"
                        
                        // Elegant fading golden dots for country borders
                        hexPolygonsData={countryData}
                        hexPolygonResolution={3}
                        hexPolygonMargin={0.7}
                        hexPolygonUseDots={true}
                        hexPolygonColor={() => `rgba(255, 215, 0, ${Math.random() * 0.4 + 0.1})`}
                        hexPolygonAltitude={0.002}
                        
                        // Remove old polygon borders
                        polygonsData={[]}
                        
                        // News markers - golden yellow lights
                        pointsData={mockNewsData}
                        pointLat={d => d.lat}
                        pointLng={d => d.lng}
                        pointColor={() => 'rgba(255, 215, 0, 0.9)'}
                        pointAltitude={0.01}
                        pointRadius={0.8}
                        onPointClick={handleMarkerClick}
                        pointLabel={d => d.eventTitle}
                        
                        // Enhanced lighting for dramatic effect
                        showGraticules={false}
                        
                        // Interaction
                        enablePointerInteraction={true}
                        
                        // Globe ready callback
                        onGlobeReady={handleGlobeReady}
                        
                        // Size
                        width={window.innerWidth}
                        height={window.innerHeight}
                    />
                </div>
            </div>
            
            {/* Global Prayer Display */}
            <GlobalPrayerDisplay 
                mostRelevantEvent={null}
                shortPrayer="Gaza victims and families"
                isLoading={false}
            />
            
            {/* Share Light Button */}
            <ShareLightButton 
                onClick={testPrayerSubmission}
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
                className="fixed bottom-4 right-4 z-50 bg-yellow-400/20 backdrop-blur-sm border border-yellow-400 text-yellow-400 px-4 py-2 rounded font-marcellus hover:bg-yellow-400/30 transition-all duration-300"
            >
                Test Prayer Submission
            </button>
        </>
    );
};

export default GlobeComponent;