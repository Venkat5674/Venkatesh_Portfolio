'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
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
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('order', 'asc'),
      limit(5)
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

  if (loading) {
    return (
      <section id="projects" className="relative bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="text-neon-blue animate-pulse text-2xl font-mono uppercase tracking-[0.5em]">Initializing Projects...</div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section id="projects" className="relative bg-[#050505] min-h-screen pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-neon-blue/5 blur-[200px] rounded-full -translate-x-1/2" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-neon-blue mb-6">
            Portfolio
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter uppercase font-display">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-outfit font-light">
            A curated collection of digital experiences, blending technical excellence with creative vision.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10">
        <ScrollStack 
          itemDistance={50} 
          itemStackDistance={40} 
          stackPosition="15%" 
          baseScale={0.9}
          useWindowScroll={true}
        >
          {projects.map((project, i) => (
            <ScrollStackItem key={project.id} itemClassName="glass border border-white/10 overflow-hidden !p-0 mb-12 rounded-[3rem] shadow-2xl">
              <div 
                onClick={() => router.push(`/projects/${project.id}`)}
                className="block group/card cursor-pointer"
              >
                <div className="flex flex-col md:flex-row h-full min-h-[500px]">
                  <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-between bg-black/40 backdrop-blur-3xl">
                    <div>
                      <div className="flex items-center space-x-4 mb-8">
                        <span className="text-[10px] font-black font-mono text-neon-blue uppercase tracking-[0.3em]">Featured 0{i + 1}</span>
                        <div className="h-px w-12 bg-neon-blue/30" />
                      </div>
                      <h3 className="text-4xl md:text-6xl font-black text-white mb-8 group-hover/card:text-neon-blue transition-colors uppercase tracking-tight font-display">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-lg leading-relaxed mb-10 font-outfit font-light">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-3 mb-10">
                        {project.tags.map((tag) => (
                          <span key={tag} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-300 font-mono">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-8" onClick={(e) => e.stopPropagation()}>
                      {project.github && (
                        <a 
                          href={project.github} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center space-x-3 text-white hover:text-neon-blue transition-all duration-300 group/link"
                        >
                          <Github size={24} className="group-hover/link:scale-110 transition-transform" />
                          <span className="text-[10px] font-black uppercase tracking-widest font-mono">Source Code</span>
                        </a>
                      )}
                      {project.live && (
                        <a 
                          href={project.live} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-10 py-4 rounded-2xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-neon-blue transition-all duration-500 shadow-xl"
                        >
                          Live Demo
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 relative h-80 md:h-auto overflow-hidden">
                    <Image
                      src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover/card:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent md:bg-gradient-to-l" />
                    
                    {/* Overlay with arrow on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 bg-black/20 backdrop-blur-[2px]">
                      <div className="p-6 rounded-full bg-white text-black scale-50 group-hover/card:scale-100 transition-transform duration-500">
                        <ArrowRight size={32} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="flex justify-center mt-24 relative z-10"
      >
        <Link 
          href="/projects" 
          className="group flex items-center space-x-6 px-12 py-6 bg-white/5 border border-white/10 rounded-3xl text-white font-black hover:bg-white/10 transition-all hover:scale-105 shadow-2xl"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">View All Projects</span>
          <div className="p-3 bg-neon-blue rounded-2xl text-black group-hover:translate-x-2 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]">
            <ArrowRight size={24} />
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
