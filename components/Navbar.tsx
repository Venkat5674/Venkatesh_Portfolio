'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react';
import { Menu, X, Search, Lock, Home, Briefcase, Award, Mail } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const navLinks = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Certifications', href: '/certifications', icon: Award },
  { name: 'Contact', href: '/#contact', icon: Mail },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminPrompt, setShowAdminPrompt] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState('');
  const [isCompact, setIsCompact] = useState(false);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Only go compact if we have scrolled a bit and are currently moving
    if (latest > 50) {
      setIsCompact(true);
      
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      
      scrollTimeout.current = setTimeout(() => {
        setIsCompact(false);
      }, 800); // Return to original position after 800ms of no scrolling
    } else {
      setIsCompact(false);
    }
  });

  const navVariants = {
    expanded: {
      width: '90%',
      maxWidth: '1200px',
      top: '32px',
      left: '50%',
      x: '-50%',
      borderRadius: '32px',
      height: '64px',
      padding: '0 24px',
      opacity: 1,
    },
    compact: {
      width: '320px',
      maxWidth: '320px',
      top: '24px',
      left: '50%',
      x: '-50%',
      borderRadius: '28px',
      height: '56px',
      padding: '0 16px',
      opacity: 0.9,
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.toLowerCase() === 'admin') {
      setShowAdminPrompt(true);
      setSearchQuery('');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Venkatesh@123') {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      setShowAdminPrompt(false);
      setAdminPassword('');
      router.push('/admin');
    } else {
      setError('Incorrect password');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <>
      <motion.nav
        initial="expanded"
        animate={isCompact ? "compact" : "expanded"}
        variants={navVariants}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
        className="fixed z-[100] bg-black/40 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-xl flex items-center overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {!isCompact ? (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center w-full justify-between"
            >
              {/* Logo / Home Link */}
              <Link href="/" className="flex items-center space-x-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center font-bold text-sm text-white">
                  VP
                </div>
                <span className="font-bold text-white tracking-tight hidden sm:block">
                  Venkatesh
                </span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center space-x-2 md:space-x-6">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 group/item
                        ${isActive ? 'text-neon-blue' : 'text-gray-400 hover:text-white'}
                      `}
                    >
                      <Icon size={20} className="transition-transform group-hover/item:scale-110" />
                      <span className="text-sm font-medium hidden md:block">
                        {link.name}
                      </span>

                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-white/5 rounded-full -z-10 border border-white/10"
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <div className="absolute inset-0 rounded-full opacity-0 group-hover/item:opacity-100 transition-opacity bg-neon-blue/5 blur-md -z-20" />
                    </Link>
                  );
                })}
              </div>

              {/* Search / Admin Hidden Trigger */}
              <div className="flex items-center space-x-2">
                <div className="hidden lg:flex items-center relative group/search">
                  <Search className="absolute left-3 text-gray-500 group-focus-within/search:text-neon-blue transition-colors" size={16} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-neon-blue/50 w-32 transition-all focus:w-48"
                  />
                </div>
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors md:hidden text-white"
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="compact-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="w-full h-full flex items-center justify-between px-2"
            >
              {/* Compact Logo */}
              <Link href="/" className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center font-bold text-xs text-white">
                  VP
                </div>
              </Link>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Available to Work</span>
              </div>

              {/* Compact Menu Trigger */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(true);
                  setIsCompact(false);
                }}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
              >
                <Menu size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-6 right-6 z-[90] glass rounded-[32px] border border-white/10 overflow-hidden shadow-2xl"
          >
            <div className="p-6 flex flex-col space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
                  >
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-neon-blue/20 transition-colors">
                      <Icon size={20} className="text-gray-400 group-hover:text-neon-blue" />
                    </div>
                    <span className="text-lg font-medium text-white">{link.name}</span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Password Prompt */}
      <AnimatePresence>
        {showAdminPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 rounded-3xl w-full max-w-md border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-neon-blue/20 rounded-lg">
                    <Lock className="text-neon-blue" size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">Admin Access</h3>
                </div>
                <button onClick={() => setShowAdminPrompt(false)} className="text-gray-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                  <input
                    type="password"
                    autoFocus
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-neon-blue"
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  className="w-full py-3 bg-neon-blue text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
                >
                  Unlock Admin
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
