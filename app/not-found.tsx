import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-blue/10 blur-[120px] rounded-full" />
      </div>
      
      <h1 className="text-[12rem] font-black text-white/[0.05] leading-none select-none font-display">
        404
      </h1>
      
      <div className="relative z-10 -mt-20">
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-display mb-6">
          System <span className="text-neon-blue">Anomaly</span>
        </h2>
        <p className="text-xl text-gray-400 max-w-md mx-auto font-outfit font-light mb-12">
          The coordinates you&apos;ve requested do not exist in this digital dimension.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center px-8 py-4 bg-white text-black font-black uppercase tracking-widest text-sm hover:bg-neon-blue hover:text-white transition-all duration-500 rounded-full"
        >
          Return to Base
        </Link>
      </div>
    </div>
  );
}
