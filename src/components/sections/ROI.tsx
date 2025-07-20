import React, { useMemo } from 'react';
import { ArrowDown } from 'lucide-react';
import { Reveal } from '@/components/common/reveal';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';

interface BarChartProps {
  label: string;
  value: number;
  suffix: string;
  targetWidth: number;
}

const BarChart: React.FC<BarChartProps> = ({ label, value, suffix, targetWidth }) => {
  const options = useMemo(() => ({ threshold: 0.5 }), []);
  const [ref, isVisible] = useIntersectionObserver(options);

  return (
    <div ref={ref} className="bar-chart-container">
      <div className="flex justify-between items-center mb-1">
        <p className="text-text-secondary">{label}</p>
        <p className="text-lg font-bold text-brand-accent-dark">
          <AnimatedNumber 
            value={value} 
            formatValue={(val) => `${val.toFixed(0)}${suffix}`} 
          />
        </p>
      </div>
      <div className="w-full bg-brand-card-bg rounded-full h-4">
        <div
          className="h-4 rounded-full"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--brand-accent)), hsl(var(--brand-accent-dark)))',
            width: isVisible ? `${targetWidth}%` : '0%',
            transition: 'width 1.5s ease-out',
          }}
        />
      </div>
    </div>
  );
};

interface ROIProps {
  onContact: () => void;
}

export const ROI: React.FC<ROIProps> = ({ onContact }) => (
  <section id="roi" className="py-20">
    <div className="container mx-auto px-6">
      <Reveal>
        <div className="mb-12 max-w-4xl">
          <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">The <span className="gradient-text">ROI of Future-Proofing Talent</span> is Undeniable</h2>
          <p className="mt-4 text-text-secondary">Investing in strategic skill development isn't an expense—it's one of the highest-return investments an organization can make.</p>
        </div>
      </Reveal>
      <div className="space-y-8">
        <BarChart label="Median ROI from Skilling Programs" value={6.67} suffix="x" targetWidth={85} />
        <BarChart label="Employee Retention (5-Year Potential)" value={90} suffix="%" targetWidth={90} />
        <BarChart label="Salary Growth with AI Skills" value={54} suffix="%+" targetWidth={54} />
      </div>
      <Reveal>
        <div className="mt-12">
          <p className="text-lg text-text-secondary max-w-4xl mb-8">The cost of inaction is far greater. Failing to adapt means <strong className="gradient-text">lost productivity, higher employee churn, and being outmaneuvered by the competition</strong>.</p>
          <button 
            onClick={onContact}
            className="px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5"
          >
            <span>Contact Us</span>
            <ArrowDown className="w-5 h-5 arrow-bounce group-hover:translate-y-1" />
          </button>
        </div>
      </Reveal>
    </div>
  </section>
);