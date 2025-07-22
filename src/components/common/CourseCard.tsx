import React, { useState, useRef, useEffect } from 'react';
import { LucideIcon, Clock, Loader2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import CourseBackgroundAnimation from '../animations/CourseBackgroundAnimation';

interface CourseCardProps {
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string;
  Icon: LucideIcon;
  comingSoon?: boolean;
  badge?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  title,
  description,
  category,
  tags,
  imageUrl,
  Icon,
  comingSoon = false,
  badge,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div 
      ref={ref}
      className="group relative cursor-pointer rounded-xl border border-white/10 p-4 overflow-hidden transition-all duration-300 hover:border-brand-accent/40 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-gray-900 touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setTimeout(() => setIsHovered(false), 150)}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      tabIndex={0}
      role="button"
      aria-label={`${title} course card - ${description}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsHovered(true);
          setTimeout(() => setIsHovered(false), 300);
        }
      }}
    >
      <CourseBackgroundAnimation 
        color={isHovered ? 'var(--brand-accent)' : 'var(--text-secondary)'}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      />
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            className="absolute inset-0 -z-10 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'radial-gradient(400px at 50% 50%, hsl(var(--brand-accent) / 0.1), transparent 80%)',
            }}
          />
        )}
      </AnimatePresence>

      {comingSoon && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-yellow-300 ring-1 ring-inset ring-yellow-300/20 backdrop-blur-sm">
          <Clock className="h-3 w-3" />
          Coming Soon
        </div>
      )}

      <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-900/80 to-gray-800/80">
        {!isImageLoaded && (
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-lg bg-brand-accent/10 text-brand-accent">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-brand-accent">{category}</span>
              </div>
              {badge && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                  {badge}
                </span>
              )}
            </div>
          </div>
        )}
        <motion.div 
          className="h-full w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ 
            opacity: isImageLoaded ? 1 : 0, 
            y: isImageLoaded ? 0 : 10,
            scale: isHovered ? 1.03 : 1
          }}
          transition={{ duration: 0.4 }}
        >
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover" 
            width="341" 
            height="192" 
            loading="lazy" 
            decoding="async"
            onLoad={() => setIsImageLoaded(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <motion.div 
            className="absolute bottom-4 left-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1.1 : 1, 
              opacity: 1,
              transition: { delay: 0.1 }
            }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/20 backdrop-blur-sm ring-1 ring-inset ring-brand-accent/30 transition-all duration-300 group-hover:bg-brand-accent/30">
              <Icon className="h-7 w-7 text-brand-accent-light transition-transform duration-300 group-hover:scale-110" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isImageLoaded ? 1 : 0, 
          y: isImageLoaded ? 0 : 10,
          transition: { delay: 0.1 }
        }}
      >
        <div className="text-sm font-medium text-brand-accent">{category}</div>
        <h3 className="mt-1 text-xl font-bold text-text-main">{title}</h3>
        <p className="mt-2 text-sm text-text-secondary">{description}</p>
      </motion.div>

      <motion.div
        className="mt-4 flex flex-col items-start gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isImageLoaded ? 1 : 0, 
          y: isImageLoaded ? 0 : 10,
          transition: { delay: 0.2 }
        }}
      >
        <motion.div 
          className="flex items-center gap-1 text-sm text-brand-accent-light/80 group-hover:text-brand-accent transition-colors"
          initial={{ x: -5, opacity: 0 }}
          animate={{ 
            x: isImageLoaded ? 0 : -5, 
            opacity: isImageLoaded ? 1 : 0,
            transition: { delay: 0.3 }
          }}
        >
          Learn more <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
        </motion.div>
        {tags.map((tag, index) => (
          <motion.div 
            key={tag} 
            className="flex-initial"
            initial={{ opacity: 0, y: 5 }}
            animate={{ 
              opacity: isImageLoaded ? 1 : 0, 
              y: isImageLoaded ? 0 : 5,
              transition: { 
                delay: 0.3 + (index * 0.1),
                type: 'spring',
                stiffness: 100,
                damping: 10
              }
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <span className="inline-block rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary ring-1 ring-inset ring-white/10 transition-all duration-200 hover:bg-brand-accent/10 hover:ring-brand-accent/30">
              {tag}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
