'use client';

import { useState, useEffect, memo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ArrowRight, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  tags: string[];
  github?: string;
  live?: string;
  order?: number;
  category?: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('order', 'asc'),
      limit(6)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Project));
      setProjects(projectsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category || 'Development')))];
  const filteredProjects = filter === 'All' ? projects : projects.filter(p => (p.category || 'Development') === filter);

  if (loading) {
    return (
      <section id="projects" className="py-40 bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center gap-8">
          <div className="w-20 h-20 border-t-2 border-neon-blue rounded-full animate-spin" />
          <div className="text-neon-blue text-xs font-black uppercase tracking-[0.5em] animate-pulse">Synchronizing Portfolio...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-neon-blue/5 blur-[200px] rounded-full -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-neon-purple/5 blur-[180px] rounded-full translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-32"
        >
          <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-neon-blue mb-8">
            Selected Works
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-10 text-white tracking-tighter uppercase font-display leading-none">
            Digital <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Showcase</span>
          </h2>
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-6 mt-16">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 border ${
                  filter === cat 
                    ? 'bg-white text-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)]' 
                    : 'bg-white/5 text-gray-500 border-white/10 hover:border-neon-blue hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div 
                  onClick={() => router.push(`/projects/${project.id}`)}
                  className="relative aspect-[4/3] rounded-[4rem] overflow-hidden border border-white/10 bg-white/5 cursor-pointer group-hover:border-neon-blue/30 transition-all duration-700"
                >
                  <Image
                    src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 flex flex-col justify-end p-12">
                    <div className="space-y-6 translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                      <div className="flex flex-wrap gap-3">
                        {project.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-[8px] font-black uppercase tracking-widest text-white">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 font-outfit font-light">
                        {project.shortDescription}
                      </p>
                      <div className="flex items-center gap-6 pt-4">
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white hover:text-black transition-all duration-500"
                          >
                            <Github size={20} />
                          </a>
                        )}
                        {project.live && (
                          <a 
                            href={project.live} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-4 rounded-2xl bg-white/10 border border-white/10 hover:bg-white hover:text-black transition-all duration-500"
                          >
                            <ExternalLink size={20} />
                          </a>
                        )}
                        <button className="flex-1 py-4 rounded-2xl bg-neon-blue text-black font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-500">
                          Case Study <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex justify-center mt-32"
        >
          <button 
            onClick={() => router.push('/projects')}
            className="group flex items-center space-x-8 px-14 py-7 bg-white/5 border border-white/10 rounded-[2.5rem] text-white font-black hover:bg-white/10 transition-all hover:scale-105 shadow-2xl"
          >
            <span className="text-[10px] uppercase tracking-[0.5em]">Explore Full Archive</span>
            <div className="p-4 bg-neon-blue rounded-2xl text-black group-hover:translate-x-2 transition-transform shadow-[0_0_30px_rgba(0,243,255,0.4)]">
              <ArrowRight size={24} />
            </div>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default memo(Projects);
