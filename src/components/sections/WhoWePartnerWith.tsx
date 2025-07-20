import React, { useState, useEffect } from 'react';
import type { FormType } from '../../lib/formUtils';
import { Link } from 'react-router-dom';
import { Reveal } from '../common/reveal';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, GraduationCap, Briefcase, Lightbulb, BarChart, Users, Zap, BookOpen, SlidersHorizontal, ArrowRight } from 'lucide-react';
import './WhoWePartnerWith.css';

// DOMPurify configuration
const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'span', 'br'],
    ALLOWED_ATTR: ['class']
  });
};

type Tab = 'institutions' | 'businesses';

interface Benefit {
  icon: React.ReactElement;
  text: string;
}

interface Content {
  title: string;
  subtitle: string;
  pitch: string;
  benefits: Benefit[];
  gradient: string;
  iconColor: string;
  bgColor: string;
}

const content: Record<Tab, Content> = {
  institutions: {
    title: 'Educational Institutions',
    subtitle: 'Shaping the future of education',
    pitch: 'In an era where a degree\'s value is defined by <strong class="gradient-text">graduate outcomes</strong>, stand out by embedding real-world, in-demand skills directly into your curriculum. We partner with you to bridge the gap between academic theory and industry reality, ensuring your students are the <strong class="gradient-text">first choice for top employers</strong>.',
    benefits: [
      { icon: <GraduationCap className="h-6 w-6" />, text: '<strong>Industry-Informed</strong> Curriculum' },
      { icon: <Zap className="h-6 w-6" />, text: '<strong>AI-Powered</strong> Learning' },
      { icon: <Users className="h-6 w-6" />, text: 'Enhanced <strong>Graduate Employability</strong>' },
    ],
    gradient: 'bg-gradient-to-r from-purple-500/10 to-blue-500/10',
    iconColor: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  businesses: {
    title: 'Business Leaders',
    subtitle: 'Building future-ready teams',
    pitch: 'In a <strong class="gradient-text">skills-first economy</strong>, the most resilient companies build their talent from within. Stop the endless search for the perfect hire and start <strong class="gradient-text">cultivating the skills you need</strong>. We provide the tools to upskill your existing workforce, turning your team into your greatest competitive advantage.',
    benefits: [
      { icon: <Lightbulb className="h-6 w-6" />, text: 'Targeted <strong>Upskilling at Scale</strong>' },
      { icon: <BarChart className="h-6 w-6" />, text: '<strong>AI-Driven</strong> Performance Insights' },
      { icon: <Users className="h-6 w-6" />, text: 'Boost <strong>Retention & Innovation</strong>' },
    ],
    gradient: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
  },
};

export const WhoWePartnerWith: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('institutions');
  const activeContent = content[activeTab];
  const [hoveredTab, setHoveredTab] = useState<Tab | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
  }, []);

  return (
    <section className="py-16 md:py-24 lg:py-32 bg-brand-background relative overflow-hidden">
      <Reveal>
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
          <div className="w-full mb-12">
            <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white mb-4">
              Who We Partner With
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl">
              We collaborate with forward-thinking organizations to build the future of education and workforce development
            </p>
          </div>

        <div className="flex flex-col gap-8">
          {/* Tab Navigation */}
          <div className="w-full">
            <div className="flex flex-wrap gap-4">
              {Object.entries(content).map(([key, tabContent]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as Tab)}
                  className={`px-6 py-3 rounded-lg text-left transition-colors ${
                    activeTab === key
                      ? `${tabContent.bgColor} text-white`
                      : 'bg-gray-800/50 text-gray-300 hover:bg-gray-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {key === 'institutions' ? (
                      <GraduationCap className="h-5 w-5" />
                    ) : (
                      <Briefcase className="h-5 w-5" />
                    )}
                    <span className="font-medium">{tabContent.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="w-full">
            <div className={`p-8 rounded-2xl ${activeContent.gradient} min-h-[400px]`}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-white font-quicksand">{activeContent.title}</h3>
                  <p
                    className="text-gray-200 text-lg leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeContent.pitch) }}
                  />
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-lg font-semibold text-white">Key Benefits:</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {activeContent.benefits.map((benefit, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className={`p-2 rounded-lg ${activeContent.bgColor} flex-shrink-0`}>
                          {React.cloneElement(benefit.icon, {
                            className: `h-5 w-5 ${activeContent.iconColor}`,
                          })}
                        </div>
                        <p
                          className="text-gray-200 text-base"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(benefit.text) }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    className="px-6 py-3 rounded-lg bg-white text-gray-900 font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    {activeTab === 'institutions' ? 'Explore Our Programs' : 'Learn More'}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    className="px-6 py-3 rounded-lg border border-white/20 text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    Contact Us
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
};

export default WhoWePartnerWith;
