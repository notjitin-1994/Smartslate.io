import React from 'react';
import { CollaborationCard } from './collaborate/CollaborationCard';
import { BrainCircuit, Users, TrendingUp, Code } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { StarryNight } from '../common/StarryNight';

const CollaboratePage: React.FC = () => {
  const { openModal } = useModal();
  return (
  <main>
    <section className="relative pt-24 md:pt-32 pb-12 md:pb-16">
      <StarryNight className="opacity-80" />
      <div className="container mx-auto px-6 text-left">
        <h1 className="font-quicksand text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
          Let's Build the <span className="gradient-text">Future of Learning.</span> Together.
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-3xl">
          Our mission to bridge the global skills gap is ambitious, and we can't do it alone. Join us in creating a self-sustaining ecosystem for talent development.
        </p>
      </div>
    </section>

    <section className="pb-16 md:pb-24">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CollaborationCard
            icon={<BrainCircuit className="w-10 h-10 text-brand-accent" />}
            title="Course Experts"
            description="Are you a subject matter expert or a seasoned professional? Partner with us to design and launch a world-class course. We provide the platform, the audience, and the support; you bring the knowledge. Let's empower the next generation of learners together."
            buttonText="Create a Course"
            onClick={() => openModal('contact', 'expert')}
          />
          <CollaborationCard
            icon={<Users className="w-10 h-10 text-brand-accent" />}
            title="Academic & Business Leaders"
            description="Lead your organization into the future. We collaborate with academic institutions and businesses to deploy bespoke, AI-driven learning solutions that tackle your specific challenges. Let's build a future-ready workforce and drive transformative results."
            buttonText="Partner with Us"
            onClick={() => openModal('contact', 'leader')}
          />
          <CollaborationCard
            icon={<TrendingUp className="w-10 h-10 text-brand-accent" />}
            title="Investors"
            description="Join us on our mission to redefine education. We are seeking strategic investors who share our passion for innovation and social impact. Invest in a scalable, high-growth startup and help shape the future of learning technology."
            buttonText="Invest in Us"
            onClick={() => openModal('contact', 'investor')}
          />
          <CollaborationCard
            icon={<Code className="w-10 h-10 text-brand-accent" />}
            title="AI Engineers & Coders"
            description="Are you passionate about building intelligent systems that make a real-world difference? We are looking for talented AI engineers and developers to join our core team. Help us build the next generation of personalized learning platforms. Note: As an early-stage startup, salary will be less though equity options are available."
            buttonText="Join the Team"
            onClick={() => openModal('contact', 'engineer')}
          />
        </div>
      </div>
    </section>
  </main>
  );
};

export default CollaboratePage;