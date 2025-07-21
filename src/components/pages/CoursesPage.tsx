import React from 'react';
import { Reveal } from '../common/reveal';
import { BrainCircuit, Database, Sparkles, Users, Code, Target, BarChart2, Cpu } from 'lucide-react';
import { StarryNight } from '../common/StarryNight';
import { CourseCard } from '../common/CourseCard';
import { Link } from 'react-router-dom';

const CoursesPage: React.FC = () => (
  <>
    <section id="courses-hero" className="relative w-full pt-32 pb-20 md:pt-40 md:pb-24">
      <StarryNight className="opacity-80" />
      <div className="container mx-auto px-6 relative z-10 text-left">
        <Reveal>
          <h1 className="font-quicksand text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Unlock Your <span className="gradient-text">Potential</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-gray-300 max-w-3xl">
            Our courses are meticulously crafted to provide you with the most relevant, in-demand skills for the future of work.
          </p>
        </Reveal>
      </div>
    </section>

    <section id="course-catalog" className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI Literacy Course */}
            <Link to="/courses/ai-literacy" className="block h-full hover:scale-[1.02] transition-transform duration-300">
              <CourseCard 
                title="AI Literacy"
                description="Master the fundamentals of AI, from neural networks to ethical considerations. Learn how AI is transforming industries and how to leverage it effectively in your career."
                badge="Coming August 2025"
                category="Foundational Course"
                tags={['AI Basics', 'Machine Learning', 'Future Tech']}
                imageUrl="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                Icon={Cpu}
              />
            </Link>
            
            {/* Data Science Course */}
            <CourseCard 
              title="Data Science"
              description="Transform raw data into actionable insights. Master Python, statistical analysis, and machine learning to solve complex business problems with data-driven solutions."
              category="Technical Course"
              tags={['Python', 'Data Analysis', 'Machine Learning']}
              imageUrl="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              Icon={BarChart2}
            />
            
            {/* Leadership Course */}
            <CourseCard 
              title="Leadership Development"
              description="Develop the skills to lead with confidence and vision. Learn strategic decision-making, team motivation, and effective communication for modern leaders."
              category="Professional Growth"
              tags={['Management', 'Strategy', 'Communication']}
              imageUrl="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              Icon={Target}
            />
            
            {/* New Course: Web Development */}
            <CourseCard 
              title="Web Development"
              description="Build modern, responsive websites from scratch. Master HTML, CSS, JavaScript, and popular frameworks to create engaging web experiences."
              category="Technical Course"
              tags={['HTML/CSS', 'JavaScript', 'React']}
              imageUrl="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
              Icon={Code}
            />
            
            {/* More Courses Coming Soon Card */}
            <div className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 p-8 text-center transition-all duration-300 hover:border-indigo-500/50 hover:bg-neutral-800/30">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 ring-1 ring-inset ring-white/10 transition-colors duration-300 group-hover:bg-indigo-500/10 group-hover:ring-indigo-500/30">
                <Sparkles className="h-8 w-8 text-neutral-400 transition-colors duration-300 group-hover:text-indigo-400" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white transition-colors duration-300 group-hover:text-indigo-300">More on the Horizon</h3>
              <p className="mt-2 text-sm text-neutral-400 transition-colors duration-300 group-hover:text-indigo-200/80">New learning opportunities are coming soon. Stay tuned!</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default CoursesPage;
