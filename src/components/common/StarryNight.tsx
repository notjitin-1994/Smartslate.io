import React, { useEffect, useRef } from 'react';

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dir: number;
  speed: number;
};

interface StarryNightProps {
  className?: string;
  style?: React.CSSProperties;
  backgroundColor?: string; // Optional solid background color
}

export const StarryNight: React.FC<StarryNightProps> = ({ className = '', style = {}, backgroundColor }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const animationRef = useRef<number>();

  const initStars = (width: number, height: number) => {
    const density = 2000; // Stars per million pixels
    const count = Math.floor((width * height) / density);
    
    stars.current = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.7 + 0.3,
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: Math.random() * 0.02 + 0.01
    }));
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { width, height } = canvas.getBoundingClientRect();
    
    // Set canvas size to match display size
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background: solid color if provided, else gradient
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    } else {
      const rootStyles = getComputedStyle(document.documentElement);
      const bgColor = rootStyles.getPropertyValue('--background').trim();
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(0,0,0,1)');
      gradient.addColorStop(0.7, `hsl(${bgColor} / 0.9)`);
      gradient.addColorStop(1, `hsl(${bgColor})`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    // Draw stars
    stars.current.forEach(star => {
      // Update star alpha for twinkling effect
      star.alpha += star.speed * star.dir;
      if (star.alpha > 0.9 || star.alpha < 0.3) {
        star.dir *= -1;
      }
      
      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      
      // Create glow effect
      const glowGradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.r * 2
      );
      glowGradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
      glowGradient.addColorStop(0.7, `rgba(200, 220, 255, ${star.alpha * 0.7})`);
      glowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = glowGradient;
      ctx.fill();
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  // Initialize and clean up
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const { width, height } = canvas.getBoundingClientRect();
    initStars(width, height);
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      const { width: newWidth, height: newHeight } = canvas.getBoundingClientRect();
      initStars(newWidth, newHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{
        ...style,
        zIndex: -1,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
};

export default StarryNight;
