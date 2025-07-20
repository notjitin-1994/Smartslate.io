import React from 'react';
import { Reveal } from '../common/reveal';

interface DifferenceHeroProps {
  onRevealNext: () => void;
}

export const DifferenceHero: React.FC<DifferenceHeroProps> = ({ onRevealNext }) => (
  <section className="relative text-center container mx-auto px-6 py-16 md:py-24">
    <Reveal>
      <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
        Engineered for <span className="gradient-text">Excellence</span>
      </h1>
      <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
        Smartslate isn't just another learning platform. It's a meticulously crafted ecosystem designed to bridge the gap between potential and performance, built on a foundation of deep research and real-world insights.
      </p>
      <div className="mt-8">
        <button 
          onClick={onRevealNext}
          className="px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5 mx-auto"
        >
          <span>Discover the Core</span>
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
    </Reveal>
  </section>
);
