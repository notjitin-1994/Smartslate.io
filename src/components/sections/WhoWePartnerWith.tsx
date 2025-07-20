import React, { useState } from 'react';
import type { FormType } from '../../lib/formUtils';
import { Link } from 'react-router-dom';
import { Reveal } from '../common/reveal';
import DOMPurify from 'dompurify';

// DOMPurify configuration
const sanitizeHtml = (html: string) => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['strong', 'span', 'br'],
    ALLOWED_ATTR: ['class']
  });
};
import { Building, GraduationCap, Lightbulb, BarChart, Users, Zap, BookOpen, SlidersHorizontal } from 'lucide-react';
import './WhoWePartnerWith.css';

interface Benefit {
  icon: React.ReactNode;
  text: string;
}

interface Content {
  title: string;
  pitch: string;
  benefits: Benefit[];
}

type Tab = 'institutions' | 'businesses';

const content: Record<Tab, Content> = {
  institutions: {
    title: 'For Educational Institutions',
    pitch: 'In an era where a degree\'s value is defined by <strong class="gradient-text">graduate outcomes</strong>, stand out by embedding real-world, in-demand skills directly into your curriculum. We partner with you to bridge the gap between academic theory and industry reality, ensuring your students are the <strong class="gradient-text">first choice for top employers</strong>.',
    benefits: [
      { icon: <GraduationCap className="h-6 w-6 text-brand-accent" />, text: '<strong>Industry-Informed</strong> Curriculum' },
      { icon: <Zap className="h-6 w-6 text-brand-accent" />, text: '<strong>AI-Powered</strong> Learning' },
      { icon: <Users className="h-6 w-6 text-brand-accent" />, text: 'Enhanced <strong>Graduate Employability</strong>' },
    ],
  },
  businesses: {
    title: 'For Business Leaders',
    pitch: 'In a <strong class="gradient-text">skills-first economy</strong>, the most resilient companies build their talent from within. Stop the endless search for the perfect hire and start <strong class="gradient-text">cultivating the skills you need</strong>. We provide the tools to upskill your existing workforce, turning your team into your greatest competitive advantage.',
    benefits: [
      { icon: <Lightbulb className="h-6 w-6 text-brand-accent" />, text: 'Targeted <strong>Upskilling at Scale</strong>' },
      { icon: <BarChart className="h-6 w-6 text-brand-accent" />, text: '<strong>AI-Driven</strong> Performance Insights' },
      { icon: <Users className="h-6 w-6 text-brand-accent" />, text: 'Boost <strong>Retention & Innovation</strong>' },
    ],
  },
};

export const WhoWePartnerWith: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('institutions');

  const activeContent = content[activeTab] ?? content['institutions']; // Fallback to institutions if undefined

  return (
    <section id="partners" className="py-16 md:py-24 bg-brand-background">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="text-left mb-12 max-w-4xl">
            <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">Bridging the <strong className="gradient-text">Talent Gap</strong>, Together</h2>
            <p className="mt-4 text-text-secondary text-base md:text-lg" dangerouslySetInnerHTML={{ __html: 'We forge <strong class="gradient-text">strategic partnerships</strong> with the two <strong class="gradient-text">core pillars</strong> of the modern economy to create a workforce that\'s not just qualified, but <strong class="gradient-text">future-ready</strong>.' }} />
          </div>
        </Reveal>

        <Reveal>
          <div className="border border-brand-accent/20 rounded-xl p-8">
            <div className="flex flex-col gap-8">
              {/* Top Row: Tab Buttons */}
              <div className="flex flex-col md:flex-row gap-4">
                <button 
                  onClick={() => setActiveTab('institutions')} 
                  className={`tab-button ${activeTab === 'institutions' ? 'active' : ''}`}>
                  <GraduationCap className="h-5 w-5 mr-3" />
                  Educational Institutions
                </button>
                <button 
                  onClick={() => setActiveTab('businesses')} 
                  className={`tab-button ${activeTab === 'businesses' ? 'active' : ''}`}>
                  <Building className="h-5 w-5 mr-3" />
                  Business Leaders
                </button>
              </div>

              {/* Content Section */}
              <div className="flex-1 border-t border-brand-accent/20 pt-8">
                <div className="bg-brand-card-bg p-8 md:p-10 rounded-xl h-full">
                  <h3 className="font-quicksand text-xl md:text-2xl font-bold text-white mb-4">{activeContent.title}</h3>
                  <p className="text-text-secondary mb-8 text-base md:text-lg max-w-3xl" dangerouslySetInnerHTML={{ __html: sanitizeHtml(activeContent.pitch) }}></p>
                  <ul className="space-y-4">
                    {activeContent.benefits.map((item, index) => (
                      <li key={index} className="flex items-center">
                        {item.icon}
                        <span className="ml-4 text-text-primary font-medium" dangerouslySetInnerHTML={{ __html: item.text }}></span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col sm:flex-row items-start gap-4">
          <Link to="/courses" className="group inline-flex items-center justify-center text-left w-full sm:w-auto px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5">
            <BookOpen className="w-5 h-5 arrow-bounce" />
            <span>Explore Courses</span>
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent<FormType>('open-contact', { detail: 'leader' }))}
            className="group inline-flex items-center justify-center text-left w-full sm:w-auto px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5">
            <SlidersHorizontal className="w-5 h-5 arrow-bounce" />
            <span>Build Your Own</span>
          </button>
        </div>
      </div>
    </section>
  );
};
