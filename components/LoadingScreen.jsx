"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or wait for window load
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 2000); // 2-second splash screen
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      // Fallback in case load event already fired or never fires
      const timeout = setTimeout(handleLoad, 3000); 
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[50000] flex flex-col items-center justify-center bg-[#050505]"
        >
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-10 relative w-[220px] h-[220px] md:w-[300px] md:h-[300px]"
          >
             <Image 
               src="/logo.png" 
               alt="Logo" 
               fill
               className="object-contain"
               priority
             />
          </motion.div>

          {/* Stylized Loading Line */}
          <div className="w-[200px] h-[1px] bg-[rgba(255,255,255,0.1)] overflow-hidden relative">
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 left-0 w-full h-full bg-gold"
            />
          </div>
          
           <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-4 font-body text-[10px] text-off-white-dim tracking-[3px] uppercase"
           >
              Loading Experience
           </motion.span>

        </motion.div>
      )}
    </AnimatePresence>
  );
}