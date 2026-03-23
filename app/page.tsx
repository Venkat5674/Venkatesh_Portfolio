'use client';

import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import LoadingScreen from '@/components/LoadingScreen';
import { LogIn, LogOut } from 'lucide-react';

// Lazy load components below the fold
const About = dynamic(() => import('@/components/About'), { ssr: true });
const Skills = dynamic(() => import('@/components/Skills'), { ssr: true });
const Projects = dynamic(() => import('@/components/Projects'), { ssr: false });
const Experience = dynamic(() => import('@/components/Experience'), { ssr: true });
const Contact = dynamic(() => import('@/components/Contact'), { ssr: true });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <main className="relative min-h-screen bg-dark-bg selection:bg-neon-blue/30 overflow-x-hidden">
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />

      {/* Admin Login Button (Fixed bottom right) */}
      <div className="fixed bottom-6 right-6 z-40">
        {user ? (
          <div className="flex items-center space-x-2 glass p-2 rounded-full">
            <div className="relative w-8 h-8 rounded-full border border-neon-blue overflow-hidden">
              <Image 
                src={user.photoURL || ''} 
                alt={user.displayName || ''} 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="p-3 glass rounded-full text-gray-400 hover:text-neon-blue transition-all duration-300 hover:neon-glow"
            title="Admin Login"
          >
            <LogIn size={20} />
          </button>
        )}
      </div>
    </main>
  );
}
