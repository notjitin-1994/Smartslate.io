import React from 'react';

const AIHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
      
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
};

export default AIHeroBackground;
