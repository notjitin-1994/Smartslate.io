import React from 'react';
import { motion } from 'framer-motion';
import { User, Brain, Lightbulb, Users, BarChart, BookOpen, Zap, Shield } from 'lucide-react';

const NUM_AVATARS = 8;
const RADIUS = 180;
const CENTER = 210;
const AVATAR_SIZE = 56;
const ICONS = [User, Brain, Lightbulb, Users, BarChart, BookOpen, Zap, Shield];
const ICON_COLORS = [
  '#A5B4FC', '#6366F1', '#4F46E5', '#818CF8', '#C7D2FE', '#818CF8', '#6366F1', '#A5B4FC'
];

const avatars = Array.from({ length: NUM_AVATARS }, (_, i) => {
  const angle = (i / NUM_AVATARS) * 2 * Math.PI;
  return {
    id: i,
    angle,
    x: CENTER + RADIUS * Math.cos(angle),
    y: CENTER + RADIUS * Math.sin(angle),
    color: ICON_COLORS[i % ICON_COLORS.length],
    Icon: ICONS[i % ICONS.length],
    delay: i * 0.08,
  };
});

const OUTER_RADIUS = 70;
const INNER_RADIUS = 48;

export const TeamConstellationAnimation: React.FC = () => {
  return (
    <motion.div
      className="relative w-full h-[420px] flex items-center justify-center"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
      }}
    >
      <svg viewBox="0 0 420 420" className="absolute w-full h-full overflow-visible">
        <defs>
          <radialGradient id="solara-gradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD600" stopOpacity="1" />
            <stop offset="100%" stopColor="#FF9900" stopOpacity="1" />
          </radialGradient>
          <filter id="glow-center" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="48" result="superGlow" />
            <feFlood floodColor="#FFD600" result="flood1" floodOpacity="0.7" />
            <feFlood floodColor="#FF9900" result="flood2" floodOpacity="0.5" />
            <feComposite in="flood1" in2="superGlow" operator="in" result="glow1" />
            <feComposite in="flood2" in2="superGlow" operator="in" result="glow2" />
            <feMerge>
              <feMergeNode in="glow1" />
              <feMergeNode in="glow2" />
              <feMergeNode in="superGlow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-avatar" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Lines from avatars to center (outer and inner) */}
        {avatars.map((avatar, i) => [
          <motion.line
            key={`outer-${i}`}
            x1={avatar.x}
            y1={avatar.y}
            x2={CENTER}
            y2={CENTER}
            stroke="#FFD600"
            strokeWidth="2.8"
            filter="url(#glow-avatar)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.22 }}
            transition={{ duration: 1.1, delay: 0.5 + i * 0.07, ease: 'easeInOut' }}
          />,
          <motion.line
            key={`inner-${i}`}
            x1={avatar.x}
            y1={avatar.y}
            x2={CENTER + Math.cos(avatar.angle) * INNER_RADIUS}
            y2={CENTER + Math.sin(avatar.angle) * INNER_RADIUS}
            stroke="#FFD600"
            strokeWidth="1.5"
            filter="url(#glow-avatar)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.18 }}
            transition={{ duration: 1.1, delay: 0.7 + i * 0.07, ease: 'easeInOut' }}
          />
        ])}
        {/* Center Solara (yellow-orange gradient, more intense glow, animated) */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_RADIUS}
          fill="url(#solara-gradient)"
          filter="url(#glow-center)"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.08, 1], opacity: 1 }}
          transition={{ duration: 1.8, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_RADIUS}
          fill="#fff"
          opacity={0.13}
          filter="url(#glow-center)"
          animate={{ scale: [1, 1.04, 1], opacity: 0.13 }}
          transition={{ duration: 2.2, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
        {/* Animated icon avatars */}
        {avatars.map((avatar, i) => (
          <motion.g
            key={avatar.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.08, 1],
              opacity: 1,
              x: [0, Math.cos(avatar.angle) * 8, 0],
              y: [0, Math.sin(avatar.angle) * 8, 0],
            }}
            transition={{
              delay: avatar.delay,
              duration: 2.2,
              repeat: Infinity,
              repeatType: 'mirror',
              ease: 'easeInOut',
            }}
          >
            <circle
              cx={avatar.x}
              cy={avatar.y}
              r={AVATAR_SIZE / 2}
              fill={avatar.color}
              filter="url(#glow-avatar)"
              stroke="#fff"
              strokeWidth="2"
            />
            {/* Animated icon, perfectly centered */}
            <foreignObject
              x={avatar.x - AVATAR_SIZE / 2}
              y={avatar.y - AVATAR_SIZE / 2}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <avatar.Icon color="#fff" size={32} style={{ display: 'block', margin: 'auto', filter: 'drop-shadow(0 0 6px #fff)' }} />
              </div>
            </foreignObject>
          </motion.g>
        ))}
      </svg>
    </motion.div>
  );
}; 