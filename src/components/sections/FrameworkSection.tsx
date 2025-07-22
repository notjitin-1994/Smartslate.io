import React from 'react';
import { Reveal } from '../common/reveal';
import { Zap, Brain, Code, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface FrameworkSectionProps {
  onRevealNext: () => void;
  onDiscoverROI?: () => void;
}

const solutions = [
  {
    id: 'ignite',
    icon: <Zap className="w-8 h-8 text-brand-accent" />,
    title: 'Ignite Series',
    subtitle: 'AI-Powered Learning',
    tag: {
      text: 'In-Development',
      className: 'bg-yellow-500/20 text-yellow-400'
    },
    description: <span>Experience the <strong className="gradient-text">future of education</strong> with our pre-built <strong className="gradient-text">AI-assisted courses</strong>, featuring your personal <strong className="gradient-text">AI tutor</strong>. Our <strong className="gradient-text">intelligent learning companion</strong> adapts to each learner's pace, providing <strong className="text-brand-accent">real-time feedback</strong> and <strong className="text-brand-accent">personalized guidance</strong>.</span>,
    link: '/#courses',
    isExternal: false
  },
  {
    id: 'architecture',
    icon: <Brain className="w-8 h-8 text-brand-accent" />,
    title: 'Strategic Skill Architecture',
    subtitle: 'Future-Proof Workforce',
    description: <span>We conduct <strong className="gradient-text">comprehensive skill gap analysis</strong> and design <strong className="gradient-text">custom learning ecosystems</strong> that <strong className="text-brand-accent">evolve with your needs</strong>, delivering <strong className="gradient-text">personalized learning paths</strong> and <strong className="gradient-text">continuous skill assessment</strong>.</span>,
    link: 'mailto:jitin@smartslate.io?subject=Strategic%20Skill%20Architecture%20Inquiry',
    isExternal: true
  },
  {
    id: 'solara',
    icon: <Code className="w-8 h-8 text-brand-accent" />,
    title: 'Solara',
    subtitle: 'End-to-End Learning Platform',
    tag: {
      text: 'Coming Soon',
      className: 'bg-brand-accent/20 text-brand-accent'
    },
    description: <span>Revolutionize <strong className="text-brand-accent">learning content creation</strong> with our <strong className="gradient-text">all-in-one platform</strong> featuring <strong className="gradient-text">interactive elements</strong> and a <strong className="gradient-text">custom interaction builder</strong> in a <strong className="text-brand-accent">minimal-code web environment</strong>.</span>,
    link: '/solutions#solara',
    isExternal: false
  }
];

export const FrameworkSection: React.FC<FrameworkSectionProps> = ({ onRevealNext, onDiscoverROI }) => {
  return (
    <section id="framework" className="relative py-20 md:py-28 bg-brand-bg">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-left mb-12 max-w-5xl">
            <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">Smartslate <strong className="gradient-text">Framework</strong></h2>
            <p className="mt-4 text-text-secondary text-base md:text-lg">
              We don't just train; we <strong className="gradient-text">transform</strong>. Our <strong className="gradient-text">integrated ecosystem</strong> bridges the <strong className="gradient-text">critical gap</strong> between education and industry.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-brand-card-bg/50 backdrop-blur-sm rounded-2xl p-8 border border-brand-accent/10 hover:border-brand-accent/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand-accent/5"
            >
              <div className="w-16 h-16 rounded-xl bg-brand-accent/10 flex items-center justify-center mb-6">
                {solution.icon}
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-2xl font-bold text-white font-quicksand">{solution.title}</h3>
                {solution.tag && (
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${solution.tag.className}`}>
                    {solution.tag.text}
                  </span>
                )}
              </div>
              <p className="text-brand-accent font-medium mb-4">{solution.subtitle}</p>
              <p className="text-text-secondary mb-6">{solution.description}</p>
              <div className="mt-4">
                {solution.isExternal ? (
                  <a
                    href={solution.link}
                    className="text-brand-accent font-medium hover:underline flex items-center group w-fit focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md px-2 py-1 touch-manipulation min-h-[44px] transition-all duration-300"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Contact us about ${solution.title} - Opens in new tab`}
                  >
                    Get Started Today
                    <svg 
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    to={solution.link}
                    className="text-brand-accent font-medium hover:underline flex items-center group w-fit focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-gray-900 rounded-md px-2 py-1 touch-manipulation min-h-[44px] transition-all duration-300"
                    aria-label={`Learn more about ${solution.title}`}
                  >
                    Explore Solution
                    <svg 
                      className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        {onDiscoverROI && (
          <div className="mt-12">
            <button 
              onClick={onDiscoverROI}
              className="px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-gray-900 touch-manipulation min-h-[44px] active:scale-95"
              aria-label="Calculate your return on investment - See the business impact"
            >
              <span>Calculate Your Business Impact</span>
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
        )}
      </div>
    </section>
  );
};
