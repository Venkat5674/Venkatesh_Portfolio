'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail, Sparkles, Globe, Cpu, Zap } from 'lucide-react';
import { useRef, useEffect, useState, memo } from 'react';

// Animation variants for staggered text reveal
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
};

const letterVariants = {
  hidden: { y: 100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.9]);
  const y = useTransform(scrollY, [0, 400], [0, 100]);
  
  // Mouse movement for 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [10, -10]), { damping: 30, stiffness: 100 });
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-10, 10]), { damping: 30, stiffness: 100 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX - innerWidth / 2);
      mouseY.set(clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fullName = "VENKATESH PAMUDURTI";

  const bgOpacity = useTransform(scrollY, [0, 500], [0.4, 0]);
  
  if (!isMounted) return <div className="min-h-screen bg-[#050505]" />;

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]"
      id="home"
    >
      {/* Immersive Background (Recipe 7) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1a1a1a_0%,#050505_100%)]" />
        
        <motion.div 
          style={{ opacity: bgOpacity }}
          className="absolute inset-0"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-neon-blue/10 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-neon-purple/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </motion.div>
        
        {/* Subtle Grid (Recipe 1) */}
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
        
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-20 lg:pt-0">
        <div className="flex flex-col space-y-12 lg:space-y-16">
          
          {/* Top Section: Name & Badges */}
          <motion.div 
            style={{ opacity, scale, y }}
            className="space-y-8"
          >
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center space-x-6"
            >
              <div className="flex -space-x-4">
                {[Globe, Cpu, Zap].map((Icon, i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center backdrop-blur-xl shadow-2xl"
                  >
                    <Icon size={16} className={i === 0 ? "text-neon-blue" : i === 1 ? "text-neon-purple" : "text-yellow-400"} />
                  </div>
                ))}
              </div>
              <div className="h-[1px] w-12 lg:w-16 bg-gradient-to-r from-white/20 to-transparent" />
              <span className="text-[8px] lg:text-[10px] font-black tracking-[0.6em] uppercase text-gray-500 font-mono">
                EST. 2026 // ARCHITECT
              </span>
            </motion.div>
            
            <h1 className="text-[8vw] sm:text-[9vw] lg:text-[8.5vw] font-black leading-none tracking-tighter text-white uppercase font-display whitespace-nowrap overflow-hidden">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex"
              >
                {fullName.split("").map((char, i) => (
                  <motion.span 
                    key={i} 
                    variants={letterVariants} 
                    className={`inline-block hover:text-neon-blue transition-colors duration-500 ${char === " " ? "w-[0.2em]" : ""}`}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.div>
            </h1>
          </motion.div>

          {/* Bottom Section: Grid for Bio and Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Left: Bio & Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-10"
            >
              <p className="text-lg lg:text-3xl text-gray-400 max-w-3xl leading-tight font-light font-outfit">
                Engineering <span className="text-white font-bold italic">Digital Frontiers</span> with <span className="text-neon-blue font-medium">Full Stack Precision</span> and <span className="text-neon-purple font-medium">Neural Intelligence</span>.
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em]">
                <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.5)]" /> Next.js 15</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-neon-purple shadow-[0_0_10px_rgba(189,0,255,0.5)]" /> TypeScript</span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="flex items-center gap-3"><span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" /> AI Systems</span>
              </div>

              <div className="flex flex-wrap gap-8 items-center pt-4">
                <button className="group relative px-10 py-5 lg:px-14 lg:py-7 bg-white text-black font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)]">
                  <span className="relative z-10 flex items-center gap-4 uppercase tracking-[0.3em] text-[10px] lg:text-[11px]">
                    View Projects <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                
                <div className="flex items-center space-x-8 lg:space-x-10">
                  {[
                    { icon: Github, href: "https://github.com", label: "Github" },
                    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                    { icon: Mail, href: "mailto:vpamudurti@gmail.com", label: "Email" }
                  ].map((social, i) => (
                    <motion.a
                      key={i}
                      href={social.href}
                      whileHover={{ y: -8 }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="p-3 lg:p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:border-neon-blue/50 group-hover:bg-neon-blue/5 transition-all duration-500">
                        <social.icon size={20} className="text-gray-500 group-hover:text-neon-blue transition-colors" />
                      </div>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-gray-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{social.label}</span>
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right: Image */}
            <div className="lg:col-span-5 relative perspective-2000">
              <motion.div
                style={{ rotateX, rotateY }}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                className="relative aspect-[4/5] w-full max-w-[400px] lg:ml-auto"
              >
                {/* Image Container */}
                <div className="relative w-full h-full rounded-[40px] lg:rounded-[60px] overflow-hidden border border-white/10 group shadow-[0_60px_120px_rgba(0,0,0,0.6)]">
                  <Image
                    src="https://picsum.photos/seed/venkatesh-portfolio/1000/1250"
                    alt="Venkatesh Pamudurti"
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.4] group-hover:grayscale-0"
                    referrerPolicy="no-referrer"
                    priority
                  />
                  
                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 bg-neon-blue/5 mix-blend-overlay" />
                </div>

                {/* Floating Stats */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-6 -right-6 glass p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border border-white/20 shadow-2xl z-20 backdrop-blur-2xl"
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-neon-blue/20 flex items-center justify-center animate-pulse">
                      <Sparkles className="text-neon-blue" size={24} />
                    </div>
                    <div>
                      <p className="text-[7px] lg:text-[8px] uppercase tracking-[0.3em] text-gray-500 font-black">Expertise</p>
                      <p className="text-sm lg:text-lg font-black text-white font-display">Full Stack</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[8px] uppercase tracking-[0.8em] text-gray-700 font-black">Initiate Scroll</span>
        <div className="w-[1px] h-16 bg-white/5 relative overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue to-transparent" 
          />
        </div>
      </motion.div>
    </section>
  );
};

export default memo(Hero);
