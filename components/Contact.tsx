'use client';

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { useState, memo } from 'react';
import { Mail, MessageSquare, Send, Github, Linkedin, Twitter, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Contact = () => {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormState('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      message: formData.get('message'),
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, 'messages'), data);
      setFormState('success');
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Error sending message:', error);
      setFormState('error');
    }
  };

  return (
    <section id="contact" className="py-40 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-neon-purple/5 blur-[200px] rounded-full -translate-x-1/2 translate-y-1/2" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/5 blur-[180px] rounded-full translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <div className="inline-block px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.5em] text-neon-blue mb-8">
            Get In Touch
          </div>
          <h2 className="text-6xl md:text-9xl font-black mb-10 text-white tracking-tighter uppercase font-display leading-none">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Conversation</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-outfit font-light leading-relaxed">
            Have a project in mind or just want to say hello? I&apos;m always open to discussing new opportunities and technical challenges.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-16"
          >
            <div className="space-y-10">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight font-display flex items-center gap-4">
                <Sparkles className="text-neon-blue" size={28} />
                Connect with me
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <a 
                  href="mailto:vpamudurti@gmail.com"
                  className="glass p-10 rounded-[3rem] border border-white/10 hover:border-neon-blue/40 transition-all duration-700 group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-neon-blue/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Mail className="text-neon-blue" size={28} />
                  </div>
                  <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Email</h4>
                  <p className="text-xl text-white font-display break-all">vpamudurti@gmail.com</p>
                </a>
                
                <div className="glass p-10 rounded-[3rem] border border-white/10 hover:border-neon-purple/40 transition-all duration-700 group">
                  <div className="w-16 h-16 rounded-2xl bg-neon-purple/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <MessageSquare className="text-neon-purple" size={28} />
                  </div>
                  <h4 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-2">Social</h4>
                  <div className="flex gap-6 mt-4">
                    <a href="#" className="text-white hover:text-neon-purple transition-colors"><Github size={24} /></a>
                    <a href="#" className="text-white hover:text-neon-purple transition-colors"><Linkedin size={24} /></a>
                    <a href="#" className="text-white hover:text-neon-purple transition-colors"><Twitter size={24} /></a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-12 rounded-[4rem] border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-neon-blue/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
              <h4 className="text-2xl font-black text-white uppercase tracking-tight font-display mb-8">Current Availability</h4>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full animate-ping absolute inset-0" />
                  <div className="w-4 h-4 bg-emerald-500 rounded-full relative z-10" />
                </div>
                <p className="text-xl text-gray-400 font-outfit font-light">Available for new architectural challenges and collaborations.</p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={handleSubmit} className="glass p-12 md:p-16 rounded-[4rem] border border-white/10 space-y-10 relative overflow-hidden">
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-neon-purple/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2" />
              
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-blue/50 transition-all font-outfit text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="john@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-blue/50 transition-all font-outfit text-lg"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-2">Your Message</label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-neon-blue/50 transition-all font-outfit text-lg resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={formState === 'submitting'}
                className="w-full py-8 rounded-[2.5rem] bg-white text-black font-black text-[12px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-neon-blue transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              >
                {formState === 'submitting' ? (
                  <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : formState === 'success' ? (
                  'Transmission Received'
                ) : (
                  <>
                    Send Message <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                  </>
                )}
              </button>

              {formState === 'error' && (
                <p className="text-neon-purple text-center text-sm font-black uppercase tracking-widest animate-pulse">
                  Transmission Failed. Please retry.
                </p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);
