'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setLoading(false);
    };

    if (document.readyState === 'complete') {
      // If already loaded, wait a tiny bit for animations to settle
      const timer = setTimeout(() => setLoading(false), 800);
      return () => clearTimeout(timer);
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback timer in case load event doesn't fire as expected
      const fallbackTimer = setTimeout(() => setLoading(false), 3000);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(fallbackTimer);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-dark-bg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent mb-8"
          >
            VP.
          </motion.div>
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-500 font-mono text-xs uppercase tracking-widest"
          >
            Initializing Universe...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
