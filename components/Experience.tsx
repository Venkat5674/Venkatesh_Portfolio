'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Calendar, MapPin } from 'lucide-react';

const experiences = [
  {
    role: 'Full Stack Developer',
    company: 'ServiceNow',
    period: '2023 - Present',
    location: 'Hyderabad, India',
    description: 'Developing scalable web applications using React and Node.js. Optimized performance by 40% through code refactoring and caching strategies.',
  },
  {
    role: 'Software Engineer Intern',
    company: 'Tech Solutions',
    period: '2022 - 2023',
    location: 'Bangalore, India',
    description: 'Worked on building a real-time analytics dashboard for e-commerce clients. Integrated AI models for predictive sales analysis.',
  },
  {
    role: 'Frontend Developer Intern',
    company: 'Creative Web Agency',
    period: '2021 - 2022',
    location: 'Remote',
    description: 'Designed and implemented responsive user interfaces for various client projects. Focused on accessibility and modern UI/UX principles.',
  },
];

export default function Experience() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="experience" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-neon-purple/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-neon-blue mb-6">
            Journey
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter uppercase font-display">
            Career <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Timeline</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-outfit font-light">
            A chronological overview of my professional growth and the impact I&apos;ve delivered across various roles.
          </p>
        </motion.div>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent md:-translate-x-1/2" />

          <div className="space-y-24">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role + exp.company}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                className={`relative flex flex-col md:flex-row items-center ${
                  i % 2 === 0 ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-black border-2 border-neon-blue md:-translate-x-1/2 z-20 shadow-[0_0_15px_rgba(0,243,255,0.5)]" />

                <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'md:pl-24' : 'md:pr-24'} pl-12`}>
                  <div className="glass p-10 rounded-[3rem] border border-white/10 hover:border-neon-blue/40 transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-4 mb-6">
                        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-neon-blue/10 border border-neon-blue/20">
                          <Calendar size={12} className="text-neon-blue" />
                          <span className="text-[10px] font-black font-mono text-neon-blue uppercase tracking-widest">{exp.period}</span>
                        </div>
                        <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-[10px] font-black font-mono text-gray-400 uppercase tracking-widest">{exp.location}</span>
                        </div>
                      </div>

                      <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight font-display">{exp.role}</h3>
                      <h4 className="text-xl font-bold text-neon-purple mb-6 font-display">{exp.company}</h4>
                      
                      <p className="text-gray-400 text-lg leading-relaxed font-outfit font-light">
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
}
