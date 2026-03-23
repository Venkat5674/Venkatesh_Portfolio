'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import Image from 'next/image';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image: string;
  link?: string;
  techLearned?: string[];
}

export default function Certifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'certifications'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCertifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certification)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || certifications.length === 0) return null;

  return (
    <section id="certifications" className="py-24 px-6 bg-dark-bg relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            My <span className="text-neon-blue">Certifications</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Professional milestones and recognized expertise in various technologies.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certifications.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-[32px] border border-white/10 hover:border-neon-blue/50 transition-all duration-500 group"
            >
              <div className="relative h-48 w-full mb-6 rounded-2xl overflow-hidden">
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="p-2 bg-neon-blue/20 backdrop-blur-md rounded-lg border border-neon-blue/30">
                    <Award className="text-neon-blue" size={20} />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon-blue transition-colors">
                    {cert.name}
                  </h3>
                  <p className="text-neon-purple font-medium text-sm">{cert.issuer}</p>
                </div>

                {cert.techLearned && cert.techLearned.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {cert.techLearned.map((tech) => (
                      <span key={tech} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10 text-gray-500">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar size={14} />
                    <span>{cert.date}</span>
                  </div>
                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
