'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, ExternalLink, ArrowLeft, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image: string;
  link?: string;
  techLearned?: string[];
  order?: number;
}

interface Badge {
  id: string;
  name: string;
  issuer: string;
  explanation: string;
  image: string;
  link: string;
  order?: number;
}

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const qCerts = query(collection(db, 'certifications'), orderBy('order', 'asc'));
    const unsubCerts = onSnapshot(qCerts, (snapshot) => {
      setCertifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certification)));
    });

    const qBadges = query(collection(db, 'badges'), orderBy('order', 'asc'));
    const unsubBadges = onSnapshot(qBadges, (snapshot) => {
      setBadges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge)));
      setLoading(false);
    });

    return () => {
      unsubCerts();
      unsubBadges();
    };
  }, []);

  const filteredCerts = certifications.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBadges = badges.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-dark-bg text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-32">
        <div className="mb-16">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-neon-blue transition-colors mb-8 group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tighter">
            Credentials & <span className="text-neon-blue">Badges</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl leading-relaxed">
            A verified collection of my professional certifications, technical badges, and academic achievements.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-16 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search credentials..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 focus:border-neon-blue outline-none transition-all"
          />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-neon-blue animate-pulse text-2xl font-mono">Loading Credentials...</div>
          </div>
        ) : (
          <div className="space-y-32">
            {/* Certifications Section */}
            <section>
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-3 bg-neon-blue/20 rounded-2xl">
                  <Award className="text-neon-blue" size={32} />
                </div>
                <h2 className="text-4xl font-bold">Certifications</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredCerts.map((cert) => (
                    <motion.div
                      layout
                      key={cert.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass border border-white/10 rounded-[32px] overflow-hidden flex flex-col group hover:border-neon-blue/50 transition-all duration-500"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={cert.image}
                          alt={cert.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        {cert.link && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform">
                              <ExternalLink size={24} />
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-bold group-hover:text-neon-blue transition-colors">
                            {cert.name}
                          </h3>
                        </div>
                        <p className="text-neon-blue font-medium mb-2">{cert.issuer}</p>
                        <p className="text-gray-500 text-sm mb-6">{cert.date}</p>
                        
                        {cert.techLearned && cert.techLearned.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-auto">
                            {cert.techLearned.map(tech => (
                              <span key={tech} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono text-gray-400">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Badges Section */}
            <section>
              <div className="flex items-center space-x-4 mb-12">
                <div className="p-3 bg-neon-purple/20 rounded-2xl">
                  <ShieldCheck className="text-neon-purple" size={32} />
                </div>
                <h2 className="text-4xl font-bold">Technical Badges</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredBadges.map((badge) => (
                    <motion.div
                      layout
                      key={badge.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass border border-white/10 rounded-[32px] p-8 flex flex-col items-center text-center group hover:border-neon-purple/50 transition-all duration-500"
                    >
                      <div className="relative w-24 h-24 mb-6 group-hover:scale-110 transition-transform duration-500">
                        <Image
                          src={badge.image}
                          alt={badge.name}
                          fill
                          className="object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-neon-purple transition-colors">
                        {badge.name}
                      </h3>
                      <p className="text-neon-purple text-sm font-medium mb-4">{badge.issuer}</p>
                      <p className="text-gray-400 text-xs leading-relaxed mb-6 flex-1">
                        {badge.explanation}
                      </p>
                      <a 
                        href={badge.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center space-x-2"
                      >
                        <ExternalLink size={14} />
                        <span>Verify Badge</span>
                      </a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          </div>
        )}

        {!loading && filteredCerts.length === 0 && filteredBadges.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No credentials found matching your search.</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-4 text-neon-blue hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
