'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { 
  Cloud, 
  Terminal, 
  Layout, 
  Server, 
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend',
    icon: <Layout className="text-neon-blue" />,
    skills: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Redux', 'Framer Motion'],
  },
  {
    title: 'Backend',
    icon: <Server className="text-neon-purple" />,
    skills: ['Node.js', 'Express', 'Python', 'Django', 'REST APIs', 'GraphQL'],
  },
  {
    title: 'Cloud & Database',
    icon: <Cloud className="text-neon-cyan" />,
    skills: ['AWS', 'Firebase', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    title: 'Tools & Others',
    icon: <Terminal className="text-white" />,
    skills: ['Git', 'CI/CD', 'Jest', 'Postman', 'Vercel', 'Netlify'],
  },
];

export default function Skills() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="skills" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:40px_40px]" />
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
            Expertise
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter uppercase font-display">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Arsenal</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-outfit font-light">
            A curated selection of technologies and frameworks I leverage to engineer high-performance digital solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="glass p-10 rounded-[3rem] border border-white/10 hover:border-neon-blue/40 transition-all duration-500 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-5 mb-10">
                  <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-neon-blue/10 group-hover:scale-110 transition-all duration-500 border border-white/10 group-hover:border-neon-blue/30">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">{category.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, idx) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 + idx * 0.05 }}
                      className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-400 rounded-xl border border-white/10 hover:border-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-300 font-mono"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
