'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'motion/react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-neon-blue pointer-events-none z-[9999] hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 2.5 : 1,
          backgroundColor: isHovering ? 'rgba(0, 243, 255, 0.1)' : 'transparent',
          borderColor: isHovering ? '#bc13fe' : '#00f3ff',
        }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-neon-blue rounded-full pointer-events-none z-[9999] hidden lg:block shadow-[0_0_10px_#00f3ff]"
        style={{
          x: useSpring(mouseX, { damping: 15, stiffness: 250 }),
          y: useSpring(mouseY, { damping: 15, stiffness: 250 }),
          backgroundColor: isHovering ? '#bc13fe' : '#00f3ff',
        }}
      />
    </>
  );
}
