import { useEffect, useRef } from 'react';


// Star colors optimized for the blue-black space theme
const STAR_COLORS = [
  { color: '#ffffff', weight: 80 }, // Pure white - most common
  { color: '#f8f9fa', weight: 10 }, // Very light blue-white
  { color: '#e1ecf4', weight: 5 },  // Subtle blue-white
  { color: '#ff6b6b', weight: 3 },  // Small red stars
  { color: '#ffd93d', weight: 2 },  // Golden (rare)
];

const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getRandomStarColor = () => {
      const random = Math.random() * 100;
      let cumulative = 0;
      
      for (const { color, weight } of STAR_COLORS) {
        cumulative += weight;
        if (random <= cumulative) {
          return color;
        }
      }
      return '#ffffff';
    };

    const getStarSize = () => {
      const random = Math.random() * 100;
      
      if (random <= 85) {
        // Small scattered stars (85%) - beautiful tiny points
        return { size: 0.3 + Math.random() * 0.4, baseOpacity: 0.4 + Math.random() * 0.4 };
      } else if (random <= 95) {
        // Medium stars (12%) - more visible but not overwhelming
        return { size: 0.5 + Math.random() * 0.5, baseOpacity: 0.5 + Math.random() * 0.3 };
      } else {
        // Bright stars (3%) - subtle focal points, less prominent
        return { size: 0.8 + Math.random() * 0.5, baseOpacity: 0.6 + Math.random() * 0.2 };
      }
    };

    const createStars = (width, height) => {
      const stars = [];
      
      // Reduced star density for cleaner look
      const starCount = Math.floor((width * height) / 2200) + 1600;
      
      for (let i = 0; i < starCount; i++) {
        const { size, baseOpacity } = getStarSize();
        
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size,
          color: getRandomStarColor(),
          opacity: baseOpacity,
          baseOpacity,
          twinkleSpeed: 0.1 + Math.random() * 0.5,
        });
      }
      
      return stars;
    };

    const drawStar = (ctx, star, time) => {
      // Gentle twinkling effect
      const currentOpacity = star.baseOpacity * (Math.sin(time * star.twinkleSpeed * 0.0008) * 0.2 + 0.8);
      
      ctx.save();
      
      // Draw star with subtle glow
      if (star.size > 0.5) {
        const glowRadius = star.size * 2;
        
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowRadius
        );
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(0.5, star.color + '40');
        gradient.addColorStop(1, star.color + '00');
        
        ctx.globalAlpha = currentOpacity * 0.3;
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Draw the star core
      ctx.globalAlpha = currentOpacity;
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = (time) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw all stars
      starsRef.current.forEach(star => {
        drawStar(ctx, star, time);
      });
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const { innerWidth, innerHeight } = window;
      
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      
      starsRef.current = createStars(innerWidth, innerHeight);
    };
    
    handleResize();
    animationFrameRef.current = requestAnimationFrame(animate);
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Smooth blue-black space background */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -20,
          background: `
            radial-gradient(
              ellipse 120% 100% at center center,
              rgba(5, 10, 25, 0.95) 0%,
              rgba(2, 5, 15, 0.98) 30%,
              rgba(0, 0, 8, 0.99) 60%,
              rgba(0, 0, 0, 1) 100%
            ),
            linear-gradient(
              180deg,
              rgba(8, 15, 30, 0.8) 0%,
              rgba(7, 20, 50, 0.85) 40%,
              rgba(0, 0, 0, 1) 100%
            )
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Subtle cosmic atmosphere */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -15,
          background: `
            radial-gradient(
              ellipse 400px 250px at 70% 30%,
              rgba(20, 30, 60, 0.05) 0%,
              transparent 70%
            ),
            radial-gradient(
              ellipse 350px 200px at 30% 80%,
              rgba(15, 25, 50, 0.03) 0%,
              transparent 80%
            )
          `,
          backgroundAttachment: 'fixed',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Beautiful scattered starfield canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -10,
          pointerEvents: 'none',
        }}
      />
    </>
  );
};

export default StarfieldBackground;