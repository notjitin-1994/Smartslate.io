import React from 'react';
import './Loader.css';

export const Loader: React.FC = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-container">
        <img src="/images/SmartSlateLogo_Swirl.png" alt="Loading..." className="loader-logo" />
      </div>
    </div>
  );
};
