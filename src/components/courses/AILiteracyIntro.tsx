import React, { useEffect } from 'react';
import { Reveal } from '../common/reveal';
import { Calendar, ArrowRight, BrainCircuit, Code, Database, Cpu, Zap, BarChart3, Globe, Shield, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AILiteracyIntro: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        <div className="absolute inset-0 bg-grid-white/[0.03] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10 py-24">
          <div className="max-w-4xl">
            <Reveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6"
              >
                <BrainCircuit className="w-4 h-4 mr-2" />
                Coming August 2025
              </motion.div>
            </Reveal>
            
            <Reveal delay={0.2}>
              <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent via-blue-400 to-purple-500 leading-tight">
                AI Literacy: <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">Master the Future</span>
              </h1>
            </Reveal>
            
            <Reveal delay={0.4}>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Unlock the power of artificial intelligence and understand how it's transforming our world. 
                Gain practical skills and knowledge to navigate the AI revolution with confidence.
              </p>
            </Reveal>
            
            <Reveal delay={0.6}>
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-base font-medium hover:bg-white/10 transition-all duration-300 group w-full sm:w-auto text-center relative overflow-hidden">
                  <span className="relative z-10 font-semibold">
                    Join Waitlist
                    <ArrowRight className="inline-block ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="absolute inset-0 bg-gradient-to-r from-brand-accent/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                <button className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-base font-medium hover:bg-white/10 transition-all duration-300 w-full sm:w-auto text-center">
                  View Course Details
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 md:py-24 relative bg-[#091420] border-t border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
        <div className="container mx-auto px-6 relative z-10">
          <Reveal>
            <div className="max-w-5xl mx-auto">
              <div className="text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">
                  Course Overview
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 mx-auto rounded-full" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    title: 'Foundational Knowledge',
                    description: 'Understand core AI concepts, terminology, and how AI systems work in the real world.',
                    icon: <BrainCircuit className="w-6 h-6 text-brand-accent" />,
                    color: 'from-purple-500 to-blue-500'
                  },
                  {
                    title: 'Practical Skills',
                    description: 'Learn to use AI tools and platforms effectively in your personal and professional life.',
                    icon: <Code className="w-6 h-6 text-blue-400" />,
                    color: 'from-blue-400 to-cyan-400'
                  },
                  {
                    title: 'Ethical Understanding',
                    description: 'Explore the ethical implications of AI and how to use it responsibly.',
                    icon: <Shield className="w-6 h-6 text-green-400" />,
                    color: 'from-green-400 to-teal-400'
                  },
                  {
                    title: 'Future-Proofing',
                    description: 'Develop the skills to adapt as AI continues to evolve and transform industries.',
                    icon: <Zap className="w-6 h-6 text-yellow-400" />,
                    color: 'from-yellow-400 to-orange-400'
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                    className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/5"
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center mb-4`}>
                      {React.cloneElement(item.icon, { 
                        className: `w-6 h-6 ${item.icon.props.className || ''} text-transparent bg-clip-text bg-gradient-to-br ${item.color}` 
                      })}
                    </div>
                    <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-300/80 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-16 md:py-24 relative bg-[#091420] border-t border-white/5">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">
                  Course Modules
                </h2>
                <p className="text-lg text-gray-300/80 max-w-2xl">
                  A comprehensive curriculum designed to take you from AI novice to confident user
                </p>
              </div>
            </Reveal>

            <div className="space-y-6">
              {[
                {
                  week: 'Week 1-2',
                  title: 'AI Fundamentals',
                  description: 'Understanding the basics of AI, machine learning, and neural networks.',
                  icon: <BrainCircuit className="w-5 h-5" />,
                  color: 'from-purple-500 to-blue-500'
                },
                {
                  week: 'Week 3-4',
                  title: 'AI in Practice',
                  description: 'Hands-on experience with popular AI tools and platforms.',
                  icon: <Code className="w-5 h-5" />,
                  color: 'from-blue-400 to-cyan-400'
                },
                {
                  week: 'Week 5-6',
                  title: 'Ethics & Responsibility',
                  description: 'Exploring the ethical implications and responsible use of AI.',
                  icon: <Shield className="w-5 h-5" />,
                  color: 'from-green-400 to-teal-400'
                },
                {
                  week: 'Week 7-8',
                  title: 'Future of AI',
                  description: 'Emerging trends and how to stay ahead in the AI revolution.',
                  icon: <Zap className="w-5 h-5" />,
                  color: 'from-yellow-400 to-orange-400'
                }
              ].map((module, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/5 hover:border-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-brand-accent/5"
                >
                  <div className="flex items-start">
                    <div className={`w-12 h-12 rounded-xl bg-gray-800/50 border border-white/5 flex items-center justify-center mr-4 flex-shrink-0`}>
                      {React.cloneElement(module.icon, { 
                        className: `w-5 h-5 text-transparent bg-clip-text bg-gradient-to-br ${module.color}` 
                      })}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-gray-400 to-gray-300">
                        {module.week}
                      </span>
                      <h3 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                        {module.title}
                      </h3>
                      <p className="text-gray-300/80">{module.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-900/50 to-gray-900/80">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="text-left mb-16">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-blue-400">
                  What You'll Learn
                </h2>
                <p className="text-lg text-gray-300/80 max-w-2xl">
                  Master the essential skills and knowledge to navigate the AI revolution with confidence
                </p>
                <div className="w-20 h-1 bg-gradient-to-r from-brand-accent to-brand-accent/60 mx-auto mt-6 rounded-full" />
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: <Zap className="w-5 h-5 text-brand-accent" />,
                    title: 'AI Fundamentals',
                    description: 'Understand core AI concepts, machine learning, and neural networks',
                    items: [
                      'Introduction to AI and its capabilities',
                      'Machine learning basics',
                      'Neural networks and deep learning',
                      'Natural language processing',
                      'Computer vision fundamentals'
                    ]
                  },
                  {
                    icon: <Code className="w-5 h-5 text-brand-accent" />,
                    title: 'Practical Applications',
                    description: 'Learn how AI is transforming industries and everyday life',
                    items: [
                      'AI in business and finance',
                      'Healthcare innovations',
                      'Smart cities and IoT',
                      'Creative AI applications',
                      'Future career opportunities'
                    ]
                  },
                  {
                    icon: <BarChart3 className="w-5 h-5 text-brand-accent" />,
                    title: 'Ethics & Responsibility',
                    description: 'Navigate the ethical landscape of AI development and use',
                    items: [
                      'Bias and fairness in AI',
                      'Privacy and data protection',
                      'AI governance',
                      'Responsible AI development',
                      'Future societal impacts'
                    ]
                  },
                  {
                    icon: <BrainCircuit className="w-5 h-5 text-brand-accent" />,
                    title: 'Hands-on Projects',
                    description: 'Apply your knowledge with real-world projects',
                    items: [
                      'Build a simple AI model',
                      'Work with AI APIs',
                      'Data analysis with AI',
                      'Create an AI-powered app',
                      'Capstone project'
                    ]
                  }
                ].map((section, sectionIndex) => (
                  <motion.div 
                    key={sectionIndex}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50 hover:border-brand-accent/30 transition-all duration-300"
                  >
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-lg bg-brand-accent/10 flex items-center justify-center mr-3">
                        {section.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300 mb-4">
                          {section.title}
                        </h3>
                        <p className="text-sm text-gray-300/80">{section.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-3 mt-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <div className="flex-shrink-0 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5" />
                          </div>
                          <span className="ml-3 text-gray-300/90">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-gray-900/80 to-gray-900/95" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        }} />
        
        <div className="container mx-auto px-6 relative z-10">
          <Reveal>
            <div className="max-w-4xl text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="inline-flex items-center px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-sm font-medium mb-6"
              >
                <Zap className="w-4 h-4 mr-2" />
                Early Access
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Ready to Master AI?
              </h2>
              <p className="text-xl text-gray-300/90 mb-8 max-w-2xl mx-auto">
                Join our exclusive waitlist to be among the first to access this transformative course.
                Early subscribers will receive special launch pricing and bonus materials.
              </p>
              
              <div className="max-w-md mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl p-1 border border-gray-700/50 shadow-xl">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-5 py-3.5 rounded-lg bg-gray-800/80 border border-gray-700/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 focus:border-transparent transition-all duration-300"
                  />
                  <button className="px-8 py-3.5 bg-gradient-to-r from-brand-accent to-brand-accent/90 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-brand-accent/20 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center">
                    Join Waitlist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
              
              <div className="mt-10 flex items-center justify-center space-x-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border border-brand-accent/20 flex items-center justify-center text-brand-accent/80"
                  >
                    {i}
                  </motion.div>
                ))}
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  viewport={{ once: true }}
                  className="text-sm text-gray-400"
                >
                  and counting...
                </motion.span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};

export default AILiteracyIntro;
