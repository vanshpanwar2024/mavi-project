"use client";
import { motion } from "framer-motion";

export default function PreviousEvents() {
  return (
    <main className="w-full bg-[#050505] min-h-screen relative overflow-hidden flex justify-center items-center px-6 md:px-12">
      {/* Global Fixed Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="font-display text-[15vw] text-white opacity-10 tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      <motion.div 
        className="relative z-10 flex flex-col items-center text-center max-w-3xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-6 block">
          Our Legacy
        </span>
        <h1 className="font-display font-[300] text-5xl md:text-[80px] text-off-white leading-[1.1] mb-8">
          Previous Events
        </h1>
        <div className="w-[60px] h-[1px] bg-gold opacity-30 mb-8" />
        <p className="font-body text-[13px] md:text-[15px] text-off-white-dim leading-[2.2]">
          A look back at the stages that started it all. Relive the spectacular production, incredible performances, and the extraordinary talent that defined our past seasons. Currently curating the visual archives.
        </p>
      </motion.div>
    </main>
  );
}