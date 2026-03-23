'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { memo } from 'react';

const skills = [
  { name: 'Frontend Architecture', value: 95 },
  { name: 'Backend Systems', value: 90 },
  { name: 'AI Integration', value: 85 },
  { name: 'Cloud Infrastructure', value: 80 },
];

const About = () => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="about" className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-neon-purple/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="absolute -top-16 -left-16 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none font-display leading-none">
            01
          </div>
          
          <div className="space-y-10 relative z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.4em] text-neon-blue">
              The Architect
            </div>
            
            <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase font-display leading-[0.9]">
              Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Digital Excellence</span>
            </h2>
            
            <div className="space-y-8 text-xl md:text-2xl text-gray-400 leading-relaxed font-outfit font-light">
              <p>
                I specialize in building <span className="text-white font-bold">High-Performance Ecosystems</span> that bridge the gap between complex backend logic and immersive frontend experiences.
              </p>
              <p>
                My approach combines <span className="text-neon-blue font-medium">Full Stack Architecture</span> with cutting-edge <span className="text-neon-purple font-medium">AI Integration</span> to deliver products that are not just tools, but competitive advantages.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-16 pt-8">
              <div className="space-y-3">
                <h4 className="text-6xl font-black text-white font-display">03+</h4>
                <p className="text-[9px] text-neon-blue uppercase tracking-[0.5em] font-black font-mono">Years of Innovation</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-6xl font-black text-white font-display">25+</h4>
                <p className="text-[9px] text-neon-purple uppercase tracking-[0.5em] font-black font-mono">Systems Deployed</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="glass p-12 md:p-20 rounded-[4rem] border border-white/10 backdrop-blur-3xl space-y-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
            
            <h3 className="text-2xl font-black text-white tracking-widest uppercase font-display flex items-center gap-6">
              <span className="w-12 h-[1px] bg-neon-blue" />
              Core Competencies
            </h3>
            
            <div className="space-y-12">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between mb-5 items-end">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] font-mono group-hover:text-neon-blue transition-colors duration-500">
                      {skill.name}
                    </span>
                    <span className="text-[10px] font-black text-neon-blue font-mono">{skill.value}%</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.value}%` } : {}}
                      transition={{ duration: 2, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple relative"
                    >
                      <div className="absolute top-0 right-0 w-4 h-4 bg-neon-blue rounded-full -translate-y-1/2 blur-[4px] opacity-50" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-10 grid grid-cols-2 gap-8">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-all duration-500 group">
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black mb-3">Primary Stack</p>
                <p className="text-base font-bold text-white group-hover:text-neon-blue transition-colors">Next.js // TS</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:border-neon-purple/30 transition-all duration-500 group">
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-600 font-black mb-3">AI Focus</p>
                <p className="text-base font-bold text-white group-hover:text-neon-purple transition-colors">LLMs // RAG</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(About);
