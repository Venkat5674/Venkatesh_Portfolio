'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Github, ExternalLink, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-neon-blue animate-pulse text-2xl font-mono">Loading Project Details...</div>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-dark-bg text-white">
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <p className="text-gray-400 mb-8 text-xl">The project you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link href="/projects" className="px-8 py-3 bg-neon-blue text-black font-bold rounded-full hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all">
            Back to Projects
          </Link>
        </div>
      </main>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <main className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
        <Link href="/projects" className="inline-flex items-center text-gray-400 hover:text-neon-blue transition-colors mb-12 group">
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              {project.title}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-12">
              {project.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-neon-blue">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-invert max-w-none mb-12">
              <p className="text-xl text-gray-300 leading-relaxed whitespace-pre-wrap">
                {project.fullDescription}
              </p>
            </div>

            <div className="flex flex-wrap gap-6">
              {project.github && (
                <a 
                  href={project.github} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all group"
                >
                  <Github size={24} />
                  <span>View Source</span>
                </a>
              )}
              {project.live && (
                <a 
                  href={project.live} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center space-x-3 px-8 py-4 rounded-2xl bg-neon-blue text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all"
                >
                  <ExternalLink size={24} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </motion.div>

          {/* Right: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="relative aspect-video rounded-[40px] overflow-hidden border border-white/10 group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={project.images[currentImageIndex] || 'https://picsum.photos/seed/placeholder/1200/800'}
                    alt={`${project.title} - Image ${currentImageIndex + 1}`}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </AnimatePresence>

              {project.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-blue hover:text-black"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-neon-blue hover:text-black"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {project.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative w-24 aspect-video rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      currentImageIndex === idx ? 'border-neon-blue scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
