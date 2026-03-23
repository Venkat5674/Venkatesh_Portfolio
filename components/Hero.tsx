'use client';

import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import Image from 'next/image';
import { ArrowRight, Github, Linkedin, Mail, MousePointer2, Sparkles, Globe, Cpu, Zap } from 'lucide-react';
import { useRef, useEffect } from 'react';

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

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);
  
  // Mouse movement for 3D tilt and background reaction
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-500, 500], [15, -15]), { damping: 25, stiffness: 120 });
  const rotateY = useSpring(useTransform(mouseX, [-500, 500], [-15, 15]), { damping: 25, stiffness: 120 });

  const bgX = useSpring(useTransform(mouseX, [-500, 500], [-30, 30]), { damping: 40, stiffness: 100 });
  const bgY = useSpring(useTransform(mouseY, [-500, 500], [-30, 30]), { damping: 40, stiffness: 100 });

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

  const name1 = "Venkatesh";
  const name2 = "Pamudurti";

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] pt-20"
      id="home"
    >
      {/* Immersive Background (Recipe 7) */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ x: bgX, y: bgY }}
          className="absolute inset-0 opacity-40"
        >
          <div className="absolute top-[5%] left-[10%] w-[50vw] h-[50vw] bg-neon-blue/15 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-[5%] right-[10%] w-[45vw] h-[45vw] bg-neon-purple/15 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        </motion.div>
        
        {/* Animated Grid Overlay (Recipe 1) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-50 contrast-150" />
        <motion.div 
          style={{ x: useTransform(mouseX, [-500, 500], [5, -5]), y: useTransform(mouseY, [-500, 500], [5, -5]) }}
          className="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px]" 
        />
        
        {/* Scanning Line Effect */}
        <motion.div 
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent z-10 pointer-events-none"
        />

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: [null, "-40px", "0px"],
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              duration: Math.random() * 5 + 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content: Editorial Typography (Recipe 2) */}
        <motion.div 
          style={{ opacity, scale }}
          className="lg:col-span-7 space-y-10"
        >
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex items-center space-x-4"
            >
              <div className="flex -space-x-3">
                {[Globe, Cpu, Zap].map((Icon, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ y: -5, scale: 1.1 }}
                    className="w-10 h-10 rounded-full border border-white/20 bg-black/40 flex items-center justify-center backdrop-blur-md shadow-xl"
                  >
                    <Icon size={16} className={i === 0 ? "text-neon-blue" : i === 1 ? "text-neon-purple" : "text-yellow-400"} />
                  </motion.div>
                ))}
              </div>
              <div className="h-[1px] w-12 bg-white/20" />
              <span className="text-[11px] font-black tracking-[0.5em] uppercase text-gray-500 font-mono">
                System.Initialize(Future)
              </span>
            </motion.div>
            
            <h1 className="text-[15vw] lg:text-[9vw] font-black leading-[0.75] tracking-tighter text-white uppercase font-display">
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap"
              >
                {name1.split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants} className="inline-block hover:text-neon-blue transition-colors duration-300">
                    {char}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-white to-neon-purple"
              >
                {name2.split("").map((char, i) => (
                  <motion.span key={i} variants={letterVariants} className="inline-block hover:scale-110 transition-transform duration-300">
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-6"
          >
            <p className="text-xl lg:text-3xl text-gray-400 max-w-2xl leading-tight font-light font-outfit">
              Crafting <span className="text-white font-bold italic tracking-tight">Digital Masterpieces</span> through the synergy of <span className="text-neon-blue font-medium">Full Stack Architecture</span> and <span className="text-neon-purple font-medium">Artificial Intelligence</span>.
            </p>
            
            <div className="flex items-center gap-4 text-xs font-mono text-gray-600 uppercase tracking-widest">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse" /> Next.js 15</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" /> TypeScript</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" /> AI Integration</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap gap-8 items-center"
          >
            <button className="group relative px-12 py-6 bg-white text-black font-black rounded-[2rem] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)]">
              <span className="relative z-10 flex items-center gap-4 uppercase tracking-[0.2em] text-[10px]">
                Explore Work <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-blue to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            
            <div className="flex items-center space-x-8">
              {[
                { icon: Github, href: "https://github.com", label: "Github" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                { icon: Mail, href: "mailto:vpamudurti@gmail.com", label: "Email" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -10 }}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:border-neon-blue/50 group-hover:bg-neon-blue/10 transition-all duration-300">
                    <social.icon size={22} className="text-gray-400 group-hover:text-neon-blue transition-colors" />
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-gray-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">{social.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right Content: Futuristic Hero Image with 3D Tilt */}
        <div className="lg:col-span-5 relative perspective-2000">
          <motion.div
            style={{ rotateX, rotateY }}
            initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] as const }}
            className="relative aspect-[4/5] w-full max-w-[520px] mx-auto"
          >
            {/* Image Container */}
            <div className="relative w-full h-full rounded-[80px] overflow-hidden border border-white/10 group shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
              <Image
                src="https://picsum.photos/seed/venkatesh-portfolio/1000/1250"
                alt="Venkatesh Pamudurti"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.5] group-hover:grayscale-0"
                referrerPolicy="no-referrer"
                priority
              />
              
              {/* Dynamic Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90" />
              <div className="absolute inset-0 bg-neon-blue/5 mix-blend-overlay" />
              
              {/* Floating Glass Stats (Recipe 3) */}
              <motion.div 
                animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-16 -right-10 glass p-6 rounded-[2.5rem] border border-white/20 shadow-2xl z-20 backdrop-blur-3xl"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 flex items-center justify-center animate-pulse">
                    <Sparkles className="text-neon-blue" size={28} />
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 font-black mb-1">Expertise</p>
                    <p className="text-xl font-black text-white font-display">Full Stack</p>
                  </div>
                </div>
              </motion.div>

              {/* Bottom Interactive Panel */}
              <div className="absolute bottom-12 left-12 right-12 glass p-8 rounded-[3rem] border border-white/20 backdrop-blur-3xl overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue/50 to-transparent" />
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <p className="text-[9px] uppercase tracking-[0.4em] text-neon-blue font-black">Current Status</p>
                    <p className="text-base font-bold text-white flex items-center gap-3">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                      </span>
                      Available for Hire
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 90 }}
                    className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"
                  >
                    <MousePointer2 className="text-white/60" size={20} />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Decorative Cyberpunk Elements */}
            <div className="absolute -top-16 -left-16 w-48 h-48 border-t-[6px] border-l-[6px] border-neon-blue/30 rounded-tl-[100px] pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-48 h-48 border-b-[6px] border-r-[6px] border-neon-purple/30 rounded-br-[100px] pointer-events-none" />
            
            {/* Tech Labels */}
            <div className="absolute top-1/4 -left-20 vertical-text text-[10px] font-mono text-white/20 tracking-[1em] uppercase pointer-events-none">
              Architecture // 2026
            </div>
            <div className="absolute bottom-1/4 -right-20 vertical-text text-[10px] font-mono text-white/20 tracking-[1em] uppercase pointer-events-none rotate-180">
              Innovation // AI
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator (Recipe 3) */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
      >
        <span className="text-[9px] uppercase tracking-[0.6em] text-gray-600 font-black">Scroll to Begin</span>
        <div className="relative w-[2px] h-24 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-neon-blue to-transparent" 
          />
        </div>
      </motion.div>
    </section>
  );
}
