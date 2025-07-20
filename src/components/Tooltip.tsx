import React from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 min-w-[200px] max-w-[300px] w-auto bg-brand-bg/70 backdrop-blur-lg text-text-secondary text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-lg border border-brand-accent/20 z-20 whitespace-normal text-left shadow-brand-accent/10 hover:shadow-brand-accent/20 hover:border-brand-accent/30">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-bg/70"></div>
      </div>
    </div>
  );
};

export default Tooltip;
