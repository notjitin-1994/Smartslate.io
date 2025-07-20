import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, BrainCircuit, Award, Link as LinkIcon, Clock, Info, Briefcase, GraduationCap, User, ArrowLeft, ArrowDown, ArrowRight } from 'lucide-react';
import Tooltip from '../Tooltip';

interface ROICalculatorProps {
  onRevealNext: () => void;
}

// --- HELPER HOOKS & COMPONENTS ---

/**
 * Custom hook for observing when an element enters the viewport.
 * @param {object} options - IntersectionObserver options.
 * @returns {[React.RefObject<HTMLElement>, boolean]} - A ref and a boolean indicating intersection.
 */
const useIntersectionObserver = (options: IntersectionObserverInit) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsIntersecting(true);
                observer.unobserve(element);
            }
        }, options);

        observer.observe(element);
        return () => {
            if (element) observer.unobserve(element);
        };
    }, [options]);

    return [ref, isIntersecting];
};

/**
 * A component that reveals its children with a fade-in and slide-up animation.
 * @param {{children: React.ReactNode, delay?: number, threshold?: number}} props
 */
const Reveal = ({ children, delay = 0, threshold = 0.1, className = '' }: { children: React.ReactNode, delay?: number, threshold?: number, className?: string }) => {
    const options = useMemo(() => ({ threshold }), [threshold]);
    const [ref, isIntersecting] = useIntersectionObserver(options);

    const style: React.CSSProperties = {
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        transitionDelay: `${delay}ms`,
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? 'translateY(0)' : 'translateY(20px)',
    };

    return <div ref={ref as React.RefObject<HTMLDivElement>} style={style} className={className}>{children}</div>;
};

/**
 * Custom hook for animating a number from its previous state to a new target.
 * @param {number} target - The target value to animate to.
 * @param {number} duration - The animation duration in milliseconds.
 * @returns {number} - The current animated value.
 */
const useAnimatedCounter = (target: number, duration = 800) => {
    const [currentValue, setCurrentValue] = useState(0);
    const frameRef = useRef<number>();
    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        const startValue = currentValue;
        let startTime: number | null = null;

        const animate = (timestamp: number) => {
            if (!isMounted.current) return;
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const nextValue = startValue + (target - startValue) * progress;
            setCurrentValue(nextValue);

            if (progress < 1) {
                frameRef.current = requestAnimationFrame(animate);
            } else {
                setCurrentValue(target);
            }
        };

        frameRef.current = requestAnimationFrame(animate);

        return () => {
            if(frameRef.current) {
                cancelAnimationFrame(frameRef.current)
            }
        };
    }, [target, duration]);

    return currentValue;
};


// --- ROI CALCULATOR COMPONENTS ---

/**
 * A styled card to display a single ROI metric.
 * @param {{icon: React.ElementType, title: string, value: number, unit?: string, description: string, source: string, isCurrency?: boolean}} props
 */
const MetricCard = ({ icon: Icon, title, value, unit = '', description, source, isCurrency = false }: { icon: React.ElementType, title: string, value: number, unit?: string, description: string, source: string, isCurrency?: boolean }) => {
    const formattedValue = isCurrency 
        ? `₹${Math.round(value).toLocaleString('en-IN')}` 
        : `${Math.round(value).toLocaleString()}${unit}`;

    return (
        <div className="group bg-brand-card-bg p-6 rounded-xl h-full text-left flex flex-col border border-brand-accent/10 hover:border-brand-accent/30 transition-all duration-300 relative">
            <div className="flex items-start justify-between mb-3">
                <div className="p-3 bg-brand-accent/10 rounded-full w-max">
                    <Icon className="h-6 w-6 text-brand-accent" />
                </div>
                <Tooltip text={source}>
                    <Info className="h-4 w-4 text-text-secondary/50 cursor-help" />
                </Tooltip>
            </div>
            <h3 className="font-quicksand text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-4xl font-bold gradient-text tabular-nums mb-3">
                {formattedValue}
            </p>
            <p className="text-text-secondary text-sm flex-grow">{description}</p>
        </div>
    );
};

/**
 * Persona selection screen with improved visual design.
 * @param {{onSelect: (persona: string) => void}} props
 */
const PersonaSelector = ({ onSelect }: { onSelect: (persona: string) => void }) => (
    <Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
            <button 
                onClick={() => onSelect('educator')} 
                className="group relative overflow-hidden bg-brand-card-bg hover:bg-brand-card-bg/90 transition-all duration-300 p-6 h-36 rounded-xl text-left border border-brand-accent/15 hover:border-brand-accent/40 flex items-center transform hover:-translate-y-1 hover:shadow-lg"
            >
                <div className="flex items-center gap-4 w-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all duration-300">
                        <GraduationCap className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                        <h3 className="font-quicksand text-lg font-bold text-white mb-0.5">Academic Leader</h3>
                        <p className="text-sm text-text-secondary">
                            <span className="font-medium text-brand-accent">Student employability</span> & <span className="font-medium text-brand-accent">industry partnerships</span>
                        </p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto text-brand-accent transition-transform duration-300 sm:group-hover:translate-x-1 group-hover:translate-y-1 sm:rotate-0 rotate-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
                onClick={() => onSelect('businessman')} 
                className="group relative overflow-hidden bg-brand-card-bg hover:bg-brand-card-bg/90 transition-all duration-300 p-6 h-36 rounded-xl text-left border border-brand-accent/15 hover:border-brand-accent/40 flex items-center transform hover:-translate-y-1 hover:shadow-lg"
            >
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all duration-300">
                        <Briefcase className="w-6 h-6 text-brand-accent" />
                    </div>
                    <div>
                        <h3 className="font-quicksand text-lg font-bold text-white mb-0.5">Corporate Leader</h3>
                        <p className="text-sm text-text-secondary">
                            <span className="font-medium text-brand-accent">ROI</span>, <span className="font-medium text-brand-accent">productivity</span> & <span className="font-medium text-brand-accent">talent retention</span>
                        </p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto text-brand-accent transition-transform duration-300 sm:group-hover:translate-x-1 group-hover:translate-y-1 sm:rotate-0 rotate-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <button 
                onClick={() => onSelect('student')} 
                className="group relative overflow-hidden bg-brand-card-bg hover:bg-brand-card-bg/90 transition-all duration-300 p-6 h-36 rounded-xl text-left border border-brand-accent/15 hover:border-brand-accent/40 flex items-center transform hover:-translate-y-1 hover:shadow-lg"
            >
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-shrink-0 w-14 h-14 rounded-full bg-brand-accent/10 flex items-center justify-center group-hover:bg-brand-accent/20 transition-all duration-300">
                        <User className="w-8 h-8 text-brand-accent" />
                    </div>
                    <div>
                        <h3 className="font-quicksand text-lg font-bold text-white mb-0.5">Aspiring Professional</h3>
                        <p className="text-sm text-text-secondary">
                            <span className="font-medium text-brand-accent">Career acceleration</span> & <span className="font-medium text-brand-accent">dream job readiness</span>
                        </p>
                    </div>
                </div>
                <ArrowRight className="w-5 h-5 ml-auto text-brand-accent transition-transform duration-300 sm:group-hover:translate-x-1 group-hover:translate-y-1 sm:rotate-0 rotate-90" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-brand-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
        </div>
    </Reveal>
);

/**
 * The main ROI Calculator component, rewritten to match the new design system.
 */
export const ROICalculator: React.FC<ROICalculatorProps> = ({ onRevealNext: onRevealNextFromProps }) => {
    const [persona, setPersona] = useState<string | null>(null);
    const [teamSize, setTeamSize] = useState(50);
    const [studentCount, setStudentCount] = useState(500);
    const [currentSalary, setCurrentSalary] = useState(180000);

    // --- Business Metric Calculations ---
    const retentionSavings = (teamSize * 0.20 * 0.50) * 75000;
    const productivityBoost = Math.floor(teamSize * 2000 * 0.25);
    const aiRevenueLift = teamSize * 10000;

    const animatedSavings = useAnimatedCounter(retentionSavings);
    const animatedProductivity = useAnimatedCounter(productivityBoost);
    const animatedRevenue = useAnimatedCounter(aiRevenueLift);

    // --- Education Metric Calculations ---
    const employabilityBoost = Math.round(studentCount * 0.15);
    const fasterPlacement = 6;
    const industryPartnerships = Math.ceil(studentCount / 100);

    const animatedEmployability = useAnimatedCounter(employabilityBoost);
    const animatedPartnerships = useAnimatedCounter(industryPartnerships);

    // --- Student Metric Calculations ---
    const salaryIncrease = currentSalary * 0.22; // 22% average increase
    const promotionTime = 18; // 18 months average
    const fasterPromotion = promotionTime * 0.35; // 35% faster
    const jobOpportunities = 5; // 5x multiplier

    const animatedSalary = useAnimatedCounter(salaryIncrease);
    const animatedPromotion = useAnimatedCounter(fasterPromotion);

    const renderCalculator = () => {
        if (!persona) {
            return <PersonaSelector onSelect={setPersona} />;
        }

        let calculatorView;
        let closingArgument;
        let headline;

        switch (persona) {
            case 'businessman':
                headline = "Turn <strong class=\"gradient-text\">Talent</strong> into Your <strong class=\"gradient-text\">Greatest Financial Asset</strong>";
                calculatorView = (
                    <>
                        <div className="bg-brand-bg p-6 rounded-xl border border-brand-accent/20">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="team-size-slider" className="block text-lg font-semibold text-white mb-2">How large is your team?</label>
                                    <div className="flex items-center gap-6 bg-brand-bg p-4 rounded-lg">
                                        <div className="flex-grow custom-slider">
                                            <input id="team-size-slider" type="range" min="10" max="1000" step="10" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} />
                                        </div>
                                        <span className="font-quicksand font-bold text-2xl text-brand-accent w-28 text-center bg-brand-card-bg py-2 rounded-md">{teamSize}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricCard icon={TrendingUp} title="Turnover Costs Saved" value={animatedSavings} isCurrency={true} description="Annually, by cutting attrition in half through targeted upskilling." source="Based on Gallup and LinkedIn Learning data on employee replacement costs." />
                            <MetricCard icon={TrendingUp} title="Productivity Hours Gained" value={animatedProductivity} unit="+" description="Per year, from a more efficient and capable workforce." source="Based on ATD findings on productivity increases from effective training." />
                            <MetricCard icon={TrendingUp} title="AI-Driven Revenue Lift" value={animatedRevenue} isCurrency={true} description="Potential annual gain by equipping your team with strategic AI skills." source="Modeled on McKinsey & Accenture reports on AI adoption and revenue growth." />
                        </div>
                    </>
                );
                closingArgument = (
                    <p className="text-lg text-text-secondary">
                        The data is clear: investing in your team is the most direct path to <strong className="gradient-text">sustainable growth</strong>. Beyond the numbers, a culture of learning fosters <strong className="gradient-text">unmatched loyalty</strong> and creates a <strong className="gradient-text">resilient workforce</strong> ready to outmaneuver the competition. Let's build your competitive advantage, together.
                    </p>
                );
                break;
            case 'educator':
                headline = "Forge the <strong class=\"gradient-text\">Future of Graduate Success</strong>";
                calculatorView = (
                    <>
                        <div className="bg-brand-bg p-6 rounded-xl border border-brand-accent/20">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="student-count-slider" className="block text-lg font-semibold text-white mb-2">How many students in your program?</label>
                                    <div className="flex items-center gap-6 bg-brand-bg p-4 rounded-lg">
                                        <div className="flex-grow custom-slider">
                                            <input id="student-count-slider" type="range" min="50" max="2000" step="50" value={studentCount} onChange={(e) => setStudentCount(Number(e.target.value))} />
                                        </div>
                                        <span className="font-quicksand font-bold text-2xl text-brand-accent w-24 text-center bg-brand-card-bg py-2 rounded-md">{studentCount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricCard icon={Award} title="Higher Employability" value={animatedEmployability} unit="+ Students" description="Placed in high-demand roles within six months of graduation." source="Based on Burning Glass data on the value of industry-recognized credentials." />
                            <MetricCard icon={Clock} title="Faster Placements" value={fasterPlacement} unit=" Weeks" description="Average reduction in time-to-hire for skilled graduates." source="Industry benchmark for graduates with specialized, in-demand skill sets." />
                            <MetricCard icon={LinkIcon} title="New Industry Partners" value={animatedPartnerships} unit="+" description="Attracted by a curriculum that produces work-ready talent." source="Modeled on the flywheel effect of universities supplying skilled graduates to corporate ecosystems." />
                        </div>
                    </>
                );
                closingArgument = (
                     <p className="text-lg text-text-secondary">
                        These numbers represent more than just statistics; they represent <strong className="gradient-text">enhanced institutional prestige</strong> and a direct answer to the demands of the modern economy. By producing <strong className="gradient-text">verifiably skilled graduates</strong>, you create a powerful flywheel of <strong className="gradient-text">industry partnerships and top-tier student recruitment</strong>. Let's build the future of education, together.
                    </p>
                );
                break;
            case 'student':
                headline = "Engineer Your <strong class=\"gradient-text\">Career Trajectory</strong>";
                calculatorView = (
                    <>
                        <div className="bg-brand-bg p-6 rounded-xl border border-brand-accent/20">
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="salary-slider" className="block text-lg font-semibold text-white mb-2">What is your current annual salary?</label>
                                    <div className="flex items-center gap-6 bg-brand-bg p-4 rounded-lg">
                                        <div className="flex-grow custom-slider">
                                            <input id="salary-slider" type="range" min="180000" max="20000000" step="10000" value={currentSalary} onChange={(e) => setCurrentSalary(Number(e.target.value))} />
                                        </div>
                                        <span className="font-quicksand font-bold text-2xl text-brand-accent w-32 text-center bg-brand-card-bg py-2 rounded-md">₹{currentSalary.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <MetricCard icon={TrendingUp} title="Potential Salary Increase" value={animatedSalary} isCurrency={true} description="Annual lift by acquiring in-demand skills in your field." source="Based on World Economic Forum data on salary premiums for upskilling." />
                            <MetricCard icon={TrendingUp} title="Faster Promotion" value={animatedPromotion} unit=" Months" description="Potential time saved to reach your next career milestone." source="Analysis of career progression data from leading HR analytics firms." />
                            <MetricCard icon={LinkIcon} title="Job Opportunities" value={jobOpportunities} unit="x" description="Multiplier for relevant job openings unlocked with new skills." source="Data compiled from major job boards on skill-based role availability." />
                        </div>
                    </>
                );
                closingArgument = (
                     <p className="text-lg text-text-secondary">
                       Your career is your most valuable asset. The right skills don't just lead to a better salary; they unlock <strong className="gradient-text">accelerated career paths</strong>, greater <strong className="gradient-text">professional influence</strong>, and the freedom to pursue <strong className="gradient-text">opportunities you're truly passionate about</strong>. Invest in yourself and take control of your future.
                    </p>
                );
                break;
            default:
                calculatorView = null;
        }

        return (
            <Reveal className="w-full">
                <div className="space-y-10 text-left w-full">
                     <div className="flex justify-between items-start">
                        <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white flex-1 pr-4 md:whitespace-nowrap" dangerouslySetInnerHTML={{ __html: headline }} />
                        <button onClick={() => setPersona(null)} className="text-text-secondary hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold flex-shrink-0 ml-4">
                            <ArrowLeft className="w-4 h-4" /> Go Back
                        </button>
                    </div>
                    {calculatorView}
                    <div className="pt-8 mt-4 border-t border-brand-accent/20">
                    {closingArgument}
                </div>
                </div>
            </Reveal>
        );
    };



    return (
        <section id="roi-calculator" className="py-4">
            <div className="container mx-auto px-6">
                <div className="mb-12 max-w-4xl">
                    <h2 className="font-quicksand text-3xl md:text-4xl font-bold text-white">
                        Choose your <strong className="gradient-text">Persona</strong>
                    </h2>
                    <p className="mt-4 text-text-secondary text-base md:text-lg" dangerouslySetInnerHTML={{ __html: 'Your goals are <strong class="gradient-text">unique</strong>. Your data should be too. Select the role that best describes you to unlock a <strong class="gradient-text">personalized impact analysis</strong>.' }} />
                </div>
                <div className="bg-brand-card-bg/80 backdrop-blur-md p-5 md:p-6 rounded-2xl min-h-[360px] flex flex-col justify-center border border-brand-accent/20">
                    {renderCalculator()}
                </div>
                <div className="mt-12">
                                        <button onClick={onRevealNextFromProps} className="px-8 py-3 bg-[hsl(var(--brand-accent))] text-[#2d1b69] font-semibold rounded-lg transition-all duration-300 flex items-center gap-2 group hover:bg-[hsl(var(--brand-accent-dark))] hover:shadow-lg hover:shadow-brand-accent/30 hover:-translate-y-0.5">
                        Collaborate with Us
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
            </div>
        </section>
    );
};

export default ROICalculator;

