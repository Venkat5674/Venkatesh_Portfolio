'use client';
 
import { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Twitter, Heart } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="py-12 px-6 bg-dark-bg border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <a href="#" className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
            VP.
          </a>
          <p className="text-gray-500 text-sm max-w-xs text-center md:text-left">
            Building the future of the web with passion and precision.
          </p>
        </div>

        <div className="flex space-x-6">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
            <Github size={20} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
            <Linkedin size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-neon-blue transition-colors">
            <Twitter size={20} />
          </a>
          <a href="mailto:vpamudurti@gmail.com" className="text-gray-400 hover:text-neon-blue transition-colors">
            <Mail size={20} />
          </a>
        </div>

        <div className="text-gray-500 text-sm flex items-center space-x-1">
          <span>&copy; {currentYear} Venkatesh Pamudurti. Made with</span>
          <Heart size={14} className="text-red-500 animate-pulse" />
          <span>in India.</span>
        </div>
      </div>
    </footer>
  );
}
