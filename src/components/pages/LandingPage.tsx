import React, { lazy, Suspense, useState, useEffect, useRef } from 'react';
import { Hero } from '../sections/Hero';
import { TalentParadox } from '../sections/TalentParadox';
import { FrameworkSection } from '../sections/FrameworkSection';
import { WhoWePartnerWith } from '../sections/WhoWePartnerWith';
const ROICalculator = lazy(() => import('../sections/ROICalculator'));

const LandingPage: React.FC = () => {
  const [revealedSections, setRevealedSections] = useState(() => {
    try {
      const savedState = sessionStorage.getItem('revealedSections');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Basic validation to ensure we don't crash on malformed data
        if (typeof parsed.talentParadox === 'boolean') {
          return parsed;
        }
      }
    } catch (error) {
    }
    return {
      talentParadox: false,
      framework: false,
      roiCalculator: false,
      partners: false,
    };
  });

  useEffect(() => {
    sessionStorage.setItem('revealedSections', JSON.stringify(revealedSections));
  }, [revealedSections]);

  const sectionRefs = {
    talentParadox: useRef<HTMLDivElement>(null),
    framework: useRef<HTMLDivElement>(null),
    roiCalculator: useRef<HTMLDivElement>(null),
    partners: useRef<HTMLDivElement>(null),
  };

  const handleReveal = (sectionId: keyof typeof revealedSections) => {
    setRevealedSections(prev => ({ ...prev, [sectionId]: true }));

    setTimeout(() => {
      const ref = sectionRefs[sectionId as keyof typeof sectionRefs];
      const header = document.getElementById('main-header');

      if (ref.current && header) {
        const headerHeight = header.offsetHeight;
        const elementPosition = ref.current.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      } else if (ref.current) {
        // Fallback for safety
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150); // Adjusted timeout for reliability
  };

  return (
    <div>
      <Hero onRevealNext={() => handleReveal('talentParadox')} />

      {revealedSections.talentParadox && (
        <div id="talent-paradox" ref={sectionRefs.talentParadox} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <TalentParadox onRevealNext={() => handleReveal('framework')} />
        </div>
      )}

      {revealedSections.framework && (
        <div id="framework" ref={sectionRefs.framework} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <FrameworkSection 
            onRevealNext={() => handleReveal('partners')} 
            onDiscoverROI={() => handleReveal('roiCalculator')}
          />
        </div>
      )}

      {revealedSections.roiCalculator && (
        <div id="roi-calculator" ref={sectionRefs.roiCalculator} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <Suspense fallback={<div className="loading-screen">Loading...</div>}>
            <ROICalculator onRevealNext={() => handleReveal('partners')} />
          </Suspense>
        </div>
      )}

      {revealedSections.partners && (
        <div id="partners" ref={sectionRefs.partners} className="section-wrapper transition-opacity duration-1000 ease-in opacity-100">
          <WhoWePartnerWith />
        </div>
      )}
    </div>
  );
};

export default LandingPage;
