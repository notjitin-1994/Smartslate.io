import React, { useEffect, useState } from 'react';
import { Reveal } from '../animations/Reveal';
import { Calendar, ArrowRight, BrainCircuit, Code, Database, Cpu, Zap, BarChart3, Globe, Shield, ChevronLeft, Sparkles, Target, Users, BookOpen, TrendingUp, Award } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const AILiteracyIntro: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-[#091420] text-white">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          to="/courses" 
          className="inline-flex items-center text-gray-300 hover:text-white transition-colors duration-200 group"
        >
          <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Courses
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-start overflow-hidden bg-[#091420] border-b border-white/5">
        <motion.div 
          className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none"
          style={{ y: backgroundY }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 py-24">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <BrainCircuit className="w-4 h-4 mr-2" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Launching August 2025 • Early Access Available
              </motion.span>
            </motion.div>
            
            <motion.h1 
              className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-blue-400 to-purple-500"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Master AI in 8 Weeks
              </motion.span>
              <br />
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                Transform Your Future
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              Join <strong className="text-brand-accent">10,000+ professionals</strong> who are already future-proofing their careers. 
              Master AI fundamentals, practical applications, and ethical considerations in our comprehensive 8-week program.
            </motion.p>
            
            <motion.div 
              className="inline-flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.button 
                className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/90 text-white text-base font-semibold hover:shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 group w-full sm:w-auto text-center relative overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span className="relative z-10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Secure Early Access
                  <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
              </motion.button>
              
              <motion.button 
                className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white text-base font-medium hover:bg-white/10 hover:border-white/20 transition-all duration-300 w-full sm:w-auto text-center backdrop-blur-sm"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <BookOpen className="inline-block mr-2 h-4 w-4" />
                Explore Curriculum
              </motion.button>
            </motion.div>

            <motion.div 
              className="mt-12 flex items-center gap-8 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-accent" />
                <span>10,000+ enrolled</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-accent" />
                <span>Industry certified</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-accent" />
                <span>98% completion rate</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 md:py-24 relative bg-[#091420] border-t border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Why Choose Our AI Literacy Program?
                </motion.h2>
                <motion.p 
                  className="text-lg text-gray-300/80 max-w-2xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Comprehensive, practical, and designed for real-world application
                </motion.p>
                <motion.div 
                  className="w-20 h-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </div>
            </Reveal>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'AI Fundamentals Mastery',
                  description: 'Build a rock-solid foundation in AI concepts, machine learning, and neural networks with hands-on examples.',
                  icon: <BrainCircuit className="w-6 h-6" />,
                  color: 'from-purple-500 to-blue-500',
                  stats: '15+ core concepts'
                },
                {
                  title: 'Real-World Applications',
                  description: 'Master industry-standard AI tools and platforms used by Fortune 500 companies and startups alike.',
                  icon: <Code className="w-6 h-6" />,
                  color: 'from-blue-400 to-cyan-400',
                  stats: '20+ tools covered'
                },
                {
                  title: 'Ethical AI Leadership',
                  description: 'Navigate complex ethical considerations and become a responsible AI advocate in your organization.',
                  icon: <Shield className="w-6 h-6" />,
                  color: 'from-green-400 to-teal-400',
                  stats: '5+ case studies'
                },
                {
                  title: 'Career Future-Proofing',
                  description: 'Develop adaptive skills and strategic thinking to thrive as AI transforms every industry.',
                  icon: <Zap className="w-6 h-6" />,
                  color: 'from-yellow-400 to-orange-400',
                  stats: '3x career growth'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-brand-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {React.cloneElement(item.icon, { 
                        className: 'w-6 h-6 text-white'
                      })}
                    </motion.div>
                    <motion.span 
                      className="text-xs font-semibold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {item.stats}
                    </motion.span>
                  </div>
                  
                  <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-3 group-hover:from-brand-accent group-hover:to-blue-400 transition-all duration-300">
                    {item.title}
                  </h3>
                  <p className="text-gray-300/80 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {item.description}
                  </p>
                  
                  <motion.div 
                    className="mt-4 flex items-center text-brand-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Learn more <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-16 md:py-24 relative bg-[#091420] border-t border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Your 8-Week AI Transformation Journey
                </motion.h2>
                <motion.p 
                  className="text-lg text-gray-300/80 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  From AI novice to confident practitioner in just 8 weeks
                </motion.p>
              </div>
            </Reveal>

            <div className="relative">
              {/* Timeline line */}
              <motion.div 
                className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-accent via-blue-400 to-purple-500"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
              
              <div className="space-y-8">
                {[
                  {
                    week: 'Week 1-2',
                    title: 'AI Foundations & Core Concepts',
                    description: 'Master the fundamentals of AI, machine learning, and neural networks with interactive demos and real-world examples.',
                    icon: <BrainCircuit className="w-5 h-5" />,
                    color: 'from-purple-500 to-blue-500',
                    highlights: ['Machine Learning Basics', 'Neural Network Architecture', 'AI vs ML vs DL', 'Hands-on Demos']
                  },
                  {
                    week: 'Week 3-4',
                    title: 'Practical AI Tools & Platforms',
                    description: 'Get hands-on experience with ChatGPT, Claude, Midjourney, and other cutting-edge AI tools used by professionals.',
                    icon: <Code className="w-5 h-5" />,
                    color: 'from-blue-400 to-cyan-400',
                    highlights: ['ChatGPT Mastery', 'Image Generation', 'Code Assistance', 'Workflow Integration']
                  },
                  {
                    week: 'Week 5-6',
                    title: 'AI Ethics & Responsible Use',
                    description: 'Navigate the complex ethical landscape of AI and learn to implement responsible AI practices in your work.',
                    icon: <Shield className="w-5 h-5" />,
                    color: 'from-green-400 to-teal-400',
                    highlights: ['Bias Detection', 'Privacy Protection', 'Ethical Guidelines', 'Case Studies']
                  },
                  {
                    week: 'Week 7-8',
                    title: 'Future Trends & Career Strategy',
                    description: 'Explore emerging AI trends and develop a personal strategy to leverage AI for career advancement.',
                    icon: <Zap className="w-5 h-5" />,
                    color: 'from-yellow-400 to-orange-400',
                    highlights: ['Industry Trends', 'Career Planning', 'Networking', 'Capstone Project']
                  }
                ].map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: index * 0.2,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    viewport={{ once: true }}
                    className="relative pl-16"
                  >
                    {/* Timeline dot */}
                    <motion.div 
                      className={`absolute left-4 top-6 w-4 h-4 rounded-full bg-gradient-to-br ${module.color} border-2 border-white shadow-lg`}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.2, duration: 0.4 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.2 }}
                    />
                    
                    <motion.div
                      className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-brand-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10 group"
                      whileHover={{ y: -4, scale: 1.01 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <motion.span 
                            className="text-sm font-semibold text-brand-accent bg-brand-accent/10 px-3 py-1 rounded-full"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {module.week}
                          </motion.span>
                          <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mt-2 group-hover:from-brand-accent group-hover:to-blue-400 transition-all duration-300">
                            {module.title}
                          </h3>
                        </div>
                        
                        <motion.div 
                          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center`}
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {React.cloneElement(module.icon, { 
                            className: 'w-5 h-5 text-white'
                          })}
                        </motion.div>
                      </div>
                      
                      <p className="text-gray-300/80 leading-relaxed mb-4 group-hover:text-gray-200 transition-colors duration-300">
                        {module.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {module.highlights.map((highlight, highlightIndex) => (
                          <motion.span
                            key={highlightIndex}
                            className="text-xs font-medium text-gray-400 bg-gray-800/50 px-2 py-1 rounded-md border border-gray-700/50"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 + highlightIndex * 0.05 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(167, 218, 219, 0.1)' }}
                          >
                            {highlight}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900/50 to-gray-900/80 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-purple-500/5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Master These Essential AI Skills
                </motion.h2>
                <motion.p 
                  className="text-lg text-gray-300/80 max-w-2xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Comprehensive curriculum designed for immediate real-world application
                </motion.p>
                <motion.div 
                  className="w-20 h-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 mx-auto rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  viewport={{ once: true }}
                />
              </div>
            </Reveal>
            
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <BrainCircuit className="w-5 h-5" />,
                  title: 'AI Fundamentals Mastery',
                  description: 'Build unshakeable foundations in AI concepts and terminology',
                  color: 'from-purple-500 to-blue-500',
                  items: [
                    'AI vs Machine Learning vs Deep Learning',
                    'Neural networks and how they learn',
                    'Natural language processing basics',
                    'Computer vision fundamentals',
                    'AI model training and evaluation'
                  ]
                },
                {
                  icon: <Code className="w-5 h-5" />,
                  title: 'Practical Tool Mastery',
                  description: 'Master the AI tools transforming every industry',
                  color: 'from-blue-400 to-cyan-400',
                  items: [
                    'ChatGPT and advanced prompting techniques',
                    'AI-powered code generation and debugging',
                    'Image and video generation tools',
                    'AI workflow automation',
                    'Integration with existing business processes'
                  ]
                },
                {
                  icon: <Shield className="w-5 h-5" />,
                  title: 'Ethical AI Leadership',
                  description: 'Navigate AI ethics and become a responsible AI advocate',
                  color: 'from-green-400 to-teal-400',
                  items: [
                    'Identifying and mitigating AI bias',
                    'Privacy protection and data governance',
                    'Transparent AI decision-making',
                    'Regulatory compliance and best practices',
                    'Building ethical AI policies'
                  ]
                },
                {
                  icon: <Target className="w-5 h-5" />,
                  title: 'Strategic Implementation',
                  description: 'Apply AI strategically for maximum business impact',
                  color: 'from-yellow-400 to-orange-400',
                  items: [
                    'AI opportunity assessment',
                    'ROI measurement and optimization',
                    'Change management for AI adoption',
                    'Building AI-ready teams',
                    'Future-proofing your career'
                  ]
                }
              ].map((section, sectionIndex) => (
                <motion.div 
                  key={sectionIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.6, 
                    delay: sectionIndex * 0.15,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  whileHover={{ 
                    y: -8, 
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-brand-accent/30 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/10 group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center`}
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {React.cloneElement(section.icon, { 
                        className: 'w-5 h-5 text-white'
                      })}
                    </motion.div>
                    <motion.span 
                      className="text-xs font-semibold text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + sectionIndex * 0.1 }}
                      viewport={{ once: true }}
                    >
                      Essential
                    </motion.span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-3 group-hover:from-brand-accent group-hover:to-blue-400 transition-all duration-300">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-300/80 mb-6 group-hover:text-gray-200 transition-colors duration-300">
                    {section.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <motion.li 
                        key={itemIndex} 
                        className="flex items-start group/item"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ 
                          delay: 0.4 + sectionIndex * 0.1 + itemIndex * 0.05,
                          duration: 0.4
                        }}
                        viewport={{ once: true }}
                      >
                        <motion.div 
                          className="flex-shrink-0 mt-2"
                          whileHover={{ scale: 1.2 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${section.color}`} />
                        </motion.div>
                        <span className="ml-3 text-gray-300/90 group-hover/item:text-gray-200 transition-colors duration-200">
                          {item}
                        </span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  <motion.div 
                    className="mt-6 flex items-center text-brand-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    Explore curriculum <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900/80 to-[#091420] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/10 via-transparent to-purple-500/10 pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6 backdrop-blur-sm"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 mr-2" />
              </motion.div>
              Limited Early Access • 50% Off Launch Price
            </motion.div>
            
            <motion.h2 
              className="text-3xl md:text-4xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Ready to Transform Your Career with AI?
            </motion.h2>
            
            <motion.p 
              className="text-lg text-gray-300/80 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join <strong className="text-brand-accent">10,000+ professionals</strong> already on the waitlist. 
              Secure your spot now and get exclusive early access with special launch pricing.
            </motion.p>
            
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 px-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-brand-accent/50 transition-all duration-300 backdrop-blur-sm"
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  />
                  <motion.button 
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-brand-accent to-brand-accent/90 text-white font-semibold hover:shadow-lg hover:shadow-brand-accent/25 transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.span className="relative z-10 flex items-center justify-center">
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Users className="w-4 h-4 mr-2" />
                          Secure My Spot
                        </>
                      )}
                    </motion.span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </div>
                
                <motion.p 
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  viewport={{ once: true }}
                >
                  🔒 We respect your privacy. Unsubscribe at any time. No spam, ever.
                </motion.p>
              </form>
            </motion.div>
            
            <motion.div 
              className="flex items-center justify-center gap-6 mt-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <motion.div 
                      key={num} 
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-brand-accent/20 to-blue-500/20 border-2 border-gray-800 text-gray-300 text-xs font-semibold"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 1 + num * 0.1, 
                        duration: 0.5,
                        type: "spring",
                        stiffness: 200
                      }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.2, zIndex: 10 }}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
                <motion.span 
                  className="text-gray-400 ml-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  viewport={{ once: true }}
                >
                  <strong className="text-brand-accent">10,247</strong> professionals already enrolled
                </motion.span>
              </div>
            </motion.div>

            <motion.div 
              className="mt-8 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-accent" />
                <span>Industry Certified</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-brand-accent" />
                <span>Money-Back Guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-accent" />
                <span>98% Success Rate</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AILiteracyIntro;
