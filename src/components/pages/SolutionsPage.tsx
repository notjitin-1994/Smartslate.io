import React from 'react';
import { BusinessSolutions } from '../sections/BusinessSolutions';
import { StarryNight } from '../common/StarryNight';
import { useModal } from '@/contexts/ModalContext';

const SolutionsPage: React.FC = () => {
  const { openModal } = useModal();

  return (
    <main>
      <section className="relative py-24 md:py-32">
        <div className="container mx-auto px-6 text-left relative z-10">
          <h1 className="font-quicksand text-4xl md:text-6xl font-bold text-white leading-tight mb-4 max-w-3xl">
            Solutions Built for <span className="gradient-text">Impact & Scale</span>
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-3xl">
            From instant-impact courses to fully bespoke learning ecosystems, our solutions are designed to bridge the skills gap and build your future-ready workforce.
          </p>
        </div>
        <StarryNight className="opacity-80" />
      </section>

      <BusinessSolutions onContactClick={() => openModal('contact', 'leader')} />

    </main>
  );
};

export default SolutionsPage;