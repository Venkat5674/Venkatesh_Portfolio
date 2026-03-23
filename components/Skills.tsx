'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { memo } from 'react';
import { 
  Cloud, 
  Layout, 
  Server, 
  Cpu
} from 'lucide-react';

const skillCategories = [
  {
    title: 'Frontend Architecture',
    icon: <Layout className="text-neon-blue" />,
    skills: ['React 19', 'Next.js 15', 'Tailwind CSS', 'TypeScript', 'Framer Motion', 'Zustand'],
    color: 'neon-blue'
  },
  {
    title: 'Backend Systems',
    icon: <Server className="text-neon-purple" />,
    skills: ['Node.js', 'Express', 'Python', 'PostgreSQL', 'Redis', 'GraphQL'],
    color: 'neon-purple'
  },
  {
    title: 'Cloud & DevOps',
    icon: <Cloud className="text-neon-cyan" />,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Vercel'],
    color: 'neon-cyan'
  },
  {
    title: 'AI & Intelligence',
    icon: <Cpu className="text-yellow-400" />,
    skills: ['GenAI', 'LLMs', 'RAG', 'LangChain', 'OpenAI', 'Gemini'],
    color: 'yellow-400'
  },
];

const Skills = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section id="skills" className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] bg-[size:60px_60px]" />
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
            Technical Stack
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-10 text-white tracking-tighter uppercase font-display leading-none">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Arsenal</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-outfit font-light leading-relaxed">
            A comprehensive overview of the technologies I utilize to architect and deploy high-performance digital solutions at scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {skillCategories.map((category, i) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="glass p-12 rounded-[3.5rem] border border-white/10 hover:border-neon-blue/40 transition-all duration-700 group relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center space-x-6 mb-12">
                  <div className="p-5 bg-white/5 rounded-2xl group-hover:bg-neon-blue/10 group-hover:scale-110 transition-all duration-700 border border-white/10 group-hover:border-neon-blue/30">
                    {category.icon}
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display">{category.title}</h3>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-auto">
                  {category.skills.map((skill, idx) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={inView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + i * 0.1 + idx * 0.05 }}
                      className="px-5 py-2.5 text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-500 rounded-xl border border-white/10 hover:border-neon-blue hover:text-white hover:bg-neon-blue/10 transition-all duration-500 font-mono"
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
};

export default memo(Skills);
