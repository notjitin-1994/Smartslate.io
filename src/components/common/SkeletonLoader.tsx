import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  variant = 'rectangular',
  width = '100%',
  height = '1rem',
  lines = 1
}) => {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-md',
    circular: 'rounded-full'
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width,
            }}
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
};

export const CourseCardSkeleton: React.FC = () => (
  <div className="bg-brand-card-bg/50 backdrop-blur-sm rounded-2xl p-8 border border-brand-accent/10">
    <div className="w-16 h-16 rounded-xl mb-6">
      <SkeletonLoader variant="rectangular" width="100%" height="100%" />
    </div>
    <div className="mb-4">
      <SkeletonLoader variant="text" width="60%" height="1.5rem" />
    </div>
    <div className="mb-4">
      <SkeletonLoader variant="text" width="40%" height="1rem" />
    </div>
    <div className="mb-6">
      <SkeletonLoader variant="text" lines={3} height="0.875rem" />
    </div>
    <div className="flex gap-2">
      <SkeletonLoader variant="rectangular" width="80px" height="2rem" />
      <SkeletonLoader variant="rectangular" width="100px" height="2rem" />
    </div>
  </div>
);
