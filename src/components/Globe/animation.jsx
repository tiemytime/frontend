import { useEffect } from 'react';
import { gsap } from 'gsap';

const useGlobeAnimation = () => {
    useEffect(() => {
        // GSAP animation for simple globe - zoom in effect
        const animateGlobe = () => {
            // Check if element exists before animating
            const globeElement = document.querySelector(".globe");
            if (!globeElement) {
                setTimeout(animateGlobe, 100); // Retry if element doesn't exist
                return;
            }

            // Set initial state: small scale and transparent
            gsap.set(".globe", { 
                scale: 0.1, 
                opacity: 0,
                rotationY: -10
            });
            
            // Animate to normal size with smooth easing
            gsap.to(".globe", {
                scale: 1.3,
                opacity: 1,
                rotationY: 0,
                ease: "back.out(1.2)",
                duration: 4,
            });
        };

        // Start animation after a delay to ensure globe is loaded
        const timer = setTimeout(animateGlobe, 1000);

        return () => clearTimeout(timer);
    }, []);
};

export default useGlobeAnimation;
