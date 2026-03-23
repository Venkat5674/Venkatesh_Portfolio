'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { memo } from 'react';
import { Calendar, MapPin, Briefcase } from 'lucide-react';

const experiences = [
  {
    role: 'Full Stack Architect',
    company: 'ServiceNow',
    period: '2023 - Present',
    location: 'Hyderabad, India',
    description: 'Spearheading the development of mission-critical web ecosystems. Engineered performance optimizations resulting in a 40% reduction in latency and implemented advanced caching architectures.',
  },
  {
    role: 'Software Systems Engineer',
    company: 'Tech Solutions',
    period: '2022 - 2023',
    location: 'Bangalore, India',
    description: 'Architected real-time analytical engines for enterprise e-commerce. Integrated neural networks for predictive behavioral analysis and market forecasting.',
  },
  {
    role: 'Frontend Systems Intern',
    company: 'Creative Web Agency',
    period: '2021 - 2022',
    location: 'Remote',
    description: 'Engineered high-fidelity user interfaces with a focus on accessibility and atomic design principles. Delivered 10+ successful client deployments.',
  },
];

const Experience = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="experience" className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-[800px] h-[800px] bg-neon-purple/5 blur-[180px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-neon-blue mb-8">
            Professional Journey
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-10 text-white tracking-tighter uppercase font-display leading-none">
            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Timeline</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-outfit font-light leading-relaxed">
            A chronological progression of my professional evolution and the technical impact delivered across global organizations.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent md:-translate-x-1/2" />

          <div className="space-y-32">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col md:flex-row items-center ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-black border border-neon-blue md:-translate-x-1/2 z-20 shadow-[0_0_20px_rgba(0,243,255,0.6)]" />

                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-24' : 'md:pr-24'} pl-16`}>
                  <div className="glass p-12 rounded-[4rem] border border-white/10 hover:border-neon-blue/40 transition-all duration-700 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-neon-blue/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-5 mb-10">
                        <div className="flex items-center space-x-3 px-5 py-2 rounded-full bg-neon-blue/5 border border-neon-blue/20">
                          <Calendar size={14} className="text-neon-blue" />
                          <span className="text-[10px] font-black font-mono text-neon-blue uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <div className="flex items-center space-x-3 px-5 py-2 rounded-full bg-white/5 border border-white/10">
                          <MapPin size={14} className="text-gray-500" />
                          <span className="text-[10px] font-black font-mono text-gray-500 uppercase tracking-widest">{exp.location}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-white mb-3 uppercase tracking-tight font-display">{exp.role}</h3>
                      <h4 className="text-xl font-bold text-neon-purple mb-8 font-display flex items-center gap-3">
                        <Briefcase size={18} className="text-neon-purple/50" />
                        {exp.company}
                      </h4>
                      
                      <p className="text-gray-400 text-xl leading-relaxed font-outfit font-light">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Empty space for the other side */}
                <div className="hidden md:block md:w-1/2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(Experience);
