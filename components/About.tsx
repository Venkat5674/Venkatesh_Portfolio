'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';

const skills = [
  { name: 'Frontend Development', value: 90 },
  { name: 'Backend Development', value: 85 },
  { name: 'AI & Machine Learning', value: 75 },
  { name: 'Problem Solving', value: 95 },
];

export default function About() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section id="about" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-blue/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-purple/10 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -top-10 -left-10 text-[10rem] font-black text-white/[0.03] select-none pointer-events-none font-display">
            01
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black mb-10 text-white tracking-tighter uppercase font-display">
            The <span className="text-neon-blue">Architect</span> <br />
            Behind the <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Code</span>
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-gray-400 leading-relaxed font-outfit font-light">
            <p>
              I&apos;m a passionate <span className="text-white font-medium">Full Stack Developer</span> with a deep love for building scalable, high-performance applications. 
              My journey in tech is driven by a curiosity for how things work and a desire to solve complex problems through code.
            </p>
            <p>
              With a strong foundation in modern web technologies and a keen interest in <span className="text-neon-blue font-medium">Artificial Intelligence</span>, 
              I strive to create digital experiences that are not only functional but also intuitive and visually stunning.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 mt-16">
            <div className="space-y-2">
              <h4 className="text-5xl font-black text-white font-display">2+</h4>
              <p className="text-[10px] text-neon-blue uppercase tracking-[0.4em] font-bold font-mono">Years Experience</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-5xl font-black text-white font-display">15+</h4>
              <p className="text-[10px] text-neon-purple uppercase tracking-[0.4em] font-bold font-mono">Projects Completed</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="glass p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-3xl space-y-10">
            <h3 className="text-2xl font-bold text-white tracking-tight font-display mb-8 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-neon-blue" />
              Technical Proficiency
            </h3>
            
            <div className="space-y-10">
              {skills.map((skill, index) => (
                <div key={skill.name} className="group">
                  <div className="flex justify-between mb-4 items-end">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-widest font-mono group-hover:text-neon-blue transition-colors">
                      {skill.name}
                    </span>
                    <span className="text-xs font-black text-neon-blue font-mono">{skill.value}%</span>
                  </div>
                  <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${skill.value}%` } : {}}
                      transition={{ duration: 1.5, delay: 0.5 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full bg-gradient-to-r from-neon-blue to-neon-purple relative"
                    >
                      <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full -translate-y-1/2 blur-[2px]" />
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 grid grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-neon-blue/30 transition-all group">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">Primary Stack</p>
                <p className="text-sm font-bold text-white group-hover:text-neon-blue transition-colors">Next.js // TS</p>
              </div>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-neon-purple/30 transition-all group">
                <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2">AI Focus</p>
                <p className="text-sm font-bold text-white group-hover:text-neon-purple transition-colors">GenAI // LLMs</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
