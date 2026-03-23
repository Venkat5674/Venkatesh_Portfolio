'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Send, Github, Linkedin, Mail, MapPin, Phone, CheckCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await addDoc(collection(db, 'messages'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-32 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neon-blue/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-24"
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-neon-blue mb-6">
            Contact
          </div>
          <h2 className="text-5xl md:text-8xl font-black mb-8 text-white tracking-tighter uppercase font-display">
            Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple">Conversation</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-outfit font-light">
            Have a project in mind or just want to say hi? I&apos;m always open to discussing new opportunities and creative ideas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-12"
          >
            <div className="space-y-8">
              {[
                { icon: Mail, title: "Email", value: "vpamudurti@gmail.com", color: "text-neon-blue" },
                { icon: MapPin, title: "Location", value: "Hyderabad, India", color: "text-neon-purple" },
                { icon: Phone, title: "Phone", value: "+91 98765 43210", color: "text-neon-cyan" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-8 group">
                  <div className={`p-5 glass rounded-3xl ${item.color} border border-white/10 group-hover:border-neon-blue/50 transition-all duration-500`}>
                    <item.icon size={28} />
                  </div>
                  <div className="pt-2">
                    <h4 className="text-xs font-black text-gray-500 uppercase tracking-[0.3em] mb-2 font-mono">{item.title}</h4>
                    <p className="text-xl font-bold text-white font-display">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-12 border-t border-white/5 flex space-x-8">
              {[
                { icon: Github, href: "https://github.com" },
                { icon: Linkedin, href: "https://linkedin.com" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-5 glass rounded-2xl border border-white/10 hover:bg-neon-blue hover:text-black hover:border-neon-blue transition-all duration-500 group"
                >
                  <social.icon size={28} />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 glass p-10 md:p-16 rounded-[3rem] border border-white/10 backdrop-blur-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-neon-blue/5 blur-3xl rounded-full" />
            
            {isSubmitted ? (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-6">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-neon-blue p-6 rounded-full bg-neon-blue/10 border border-neon-blue/20"
                >
                  <CheckCircle size={80} />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black text-white uppercase font-display">Message Received</h3>
                  <p className="text-gray-400 font-outfit">Thank you for reaching out. I&apos;ll get back to you within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono ml-1">Name</label>
                    <input
                      {...register('name')}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all duration-500 font-outfit"
                      placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.name.message}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono ml-1">Email</label>
                    <input
                      {...register('email')}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all duration-500 font-outfit"
                      placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] font-mono ml-1">Message</label>
                  <textarea
                    {...register('message')}
                    rows={6}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-neon-blue focus:bg-white/10 outline-none transition-all duration-500 font-outfit resize-none"
                    placeholder="Tell me about your project..."
                  />
                  {errors.message && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-2 ml-1">{errors.message.message}</p>}
                </div>
                
                {error && (
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-500 text-xs font-bold uppercase tracking-widest text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded-2xl bg-white text-black font-black flex items-center justify-center space-x-4 hover:bg-neon-blue transition-all duration-500 disabled:opacity-50 group shadow-xl"
                >
                  {isSubmitting ? (
                    <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span className="uppercase tracking-[0.3em] text-[10px]">Transmit Message</span>
                      <Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
