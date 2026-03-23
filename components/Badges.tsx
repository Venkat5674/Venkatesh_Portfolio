'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Badge {
  id: string;
  name: string;
  issuer: string;
  explanation: string;
  image: string;
  link: string;
}

export default function Badges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'badges'), orderBy('name', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBadges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge)));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading || badges.length === 0) return null;

  return (
    <section id="badges" className="py-24 px-6 bg-dark-bg relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
            Skill <span className="text-neon-blue">Badges</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Recognitions from platforms like GitHub, LeetCode, and more.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass p-6 rounded-3xl border border-white/10 hover:border-neon-blue/30 transition-all duration-300 group flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 mb-6 rounded-2xl overflow-hidden bg-white/5 p-2 flex items-center justify-center border border-white/5 group-hover:border-neon-blue/20 transition-colors">
                <Image
                  src={badge.image}
                  alt={badge.name}
                  width={80}
                  height={80}
                  className="object-contain group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <ShieldCheck size={14} className="text-neon-blue" />
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-mono">{badge.issuer}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-neon-blue transition-colors">
                  {badge.name}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                  {badge.explanation}
                </p>
              </div>

              <a
                href={badge.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>View Badge</span>
                <ExternalLink size={12} />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
