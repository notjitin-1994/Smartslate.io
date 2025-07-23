import React, { useEffect, useRef } from 'react';
import './Hero.css';
import { Reveal } from '../common/reveal';

interface HeroProps {
  onRevealNext: () => void;
}

type Star = {
  x: number;
  y: number;
  r: number;
  alpha: number;
  dir: number;
  speed: number;
};

export const Hero: React.FC<HeroProps> = ({ onRevealNext }) => {
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
    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw gradient background that matches the website's background
    const rootStyles = getComputedStyle(document.documentElement);
    const bgColor = rootStyles.getPropertyValue('--background').trim();
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, 'rgba(0,0,0,1)');
    bgGradient.addColorStop(0.7, `hsl(${bgColor} / 0.9)`);
    bgGradient.addColorStop(1, `hsl(${bgColor})`);
    
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);
    

    
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
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.r * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${star.alpha})`);
      gradient.addColorStop(0.7, `rgba(200, 220, 255, ${star.alpha * 0.7})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = gradient;
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
    <section className="relative w-full overflow-hidden" style={{ minHeight: '60vh' }}>
      <div className="absolute inset-0 z-0">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 flex items-center py-12 md:py-14">
        <Reveal>
          <div className="w-full backdrop-blur-[1px] rounded-xl p-6 border border-brand-accent/40 relative">
            <div className="space-y-6 md:space-y-8">
              <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Build Your <span className="gradient-text">Future-Ready</span> <span className="gradient-text">Workforce</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                India is on the cusp of a major economic expansion, fueled by its vibrant young population. However, a <strong><span className="gradient-text">significant skills gap</span></strong> threatens progress—companies need <strong><span className="gradient-text">job-ready talent</span></strong> but emerging professionals aren't yet prepared.
              </p>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                The future of business is being written in India, yet a <strong><span className="gradient-text">silent crisis</span></strong> threatens to derail it all. Millions of ambitious individuals are entering the workforce, but they lack the specific, critical skills your company needs to innovate and compete. This <strong><span className="gradient-text">talent paradox</span></strong> isn't just a statistic—it's a <strong><span className="gradient-text">direct threat to your bottom line and future success</span></strong>.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={onRevealNext} 
                  className="px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center space-x-2 group hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5"
                >
                  <span>Uncover the Crisis</span>
                  <svg 
                    className="w-5 h-5 arrow-bounce group-hover:translate-y-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};