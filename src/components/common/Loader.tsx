import React from 'react';
import './Loader.css';

interface LoaderProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  overlay?: boolean;
}

export const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  size = 'medium',
  overlay = true 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const LoaderContent = () => (
    <div className="loader-container flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} mb-4 animate-spin`}>
        <img 
          src="/images/SmartSlateLogo_Swirl.png" 
          alt="Loading..." 
          className="loader-logo w-full h-full object-contain" 
        />
      </div>
      <p className="text-text-secondary text-sm font-medium" aria-live="polite">
        {message}
      </p>
    </div>
  );

  if (!overlay) {
    return <LoaderContent />;
  }

  return (
    <div className="loader-overlay fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <LoaderContent />
    </div>
  );
};
