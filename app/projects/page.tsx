'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, ArrowLeft, ExternalLink, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
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

  const allTags = ['All', ...Array.from(new Set(projects.flatMap(p => p.tags)))];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = selectedTag === 'All' || p.tags.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  return (
    <main className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-neon-blue transition-colors mb-8 group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-8">
            All <span className="text-neon-blue">Projects</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            A comprehensive archive of my technical journey, from experimental prototypes to production-ready applications.
          </p>
        </motion.div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search projects by name, description or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-neon-blue/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex items-center space-x-4 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <Filter size={20} className="text-neon-blue flex-shrink-0" />
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-6 py-2 rounded-full border transition-all whitespace-nowrap ${
                  selectedTag === tag
                    ? 'bg-neon-blue border-neon-blue text-black font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-neon-blue/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-neon-blue animate-pulse text-2xl font-mono">Loading Archive...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                >
                  <Link href={`/projects/${project.id}`} className="group block h-full">
                    <div className="glass border border-white/10 rounded-[32px] overflow-hidden h-full flex flex-col hover:border-neon-blue/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,255,0.1)]">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'}
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                          <span className="text-neon-blue font-bold flex items-center">
                            View Details <ExternalLink size={16} className="ml-2" />
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-neon-blue transition-colors">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 line-clamp-3 mb-6 flex-1">
                          {project.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-medium text-gray-400">
                              {tag}
                            </span>
                          ))}
                          {project.tags.length > 3 && (
                            <span className="text-[10px] text-gray-500 self-center">+{project.tags.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-block p-6 rounded-full bg-white/5 border border-white/10 mb-6">
              <Search size={40} className="text-gray-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No projects found</h3>
            <p className="text-gray-400 mb-8">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedTag('All'); }}
              className="text-neon-blue font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
