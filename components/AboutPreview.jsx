"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

import Image from "next/image";

export default function AboutPreview() {
  const containerRef = useRef(null);
  
  // Set up the overlapping scroll effect
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Animate the image overlapping / translating upwards slower than the background
  const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  
  return (
    <section 
      ref={containerRef}
      className="relative w-full bg-black-deep py-20 md:py-48 overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        
        {/* Left: Text Content */}
        <motion.div 
          className="flex flex-col justify-center order-2 md:order-1"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em]">
              Who We Are
            </span>
          </div>

          <h2 className="font-display font-[300] text-5xl md:text-7xl text-off-white mb-8 leading-tight">
            Elevating <br />
            <span className="text-gold italic">Standards</span>
          </h2>

          <p className="text-off-white-dim font-body text-sm md:text-base tracking-[1px] leading-relaxed mb-10 max-w-md">
            At Mavi Entertainment Production House, we blur the lines between high fashion and raw talent. We are a premier production house dedicated to orchestrating elite runway shows, competitive dance forums, and portfolio-defining shoots that catapult emerging artists onto the national stage.
          </p>

          <a href="/about" className="group relative inline-flex items-center space-x-4 w-max pointer-events-auto">
            <span className="font-body text-[9px] uppercase tracking-[4px] text-off-white group-hover:text-gold transition-colors duration-300">
              Discover Our Story
            </span>
            <div className="w-12 h-[1px] bg-off-white/30 group-hover:w-20 group-hover:bg-gold transition-all duration-500 ease-out" />
          </a>
        </motion.div>

        {/* Right: Stacked Fanned Cards (Desktop Only - Large Screens) */}
        <motion.div 
          className="relative h-[80vh] w-full hidden xl:flex items-center justify-center order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <div className="relative w-[320px] h-[440px] cursor-pointer perspective-[1000px]">
            {[
              { id: 1, src: "/gallery-1.png", defaultRotate: -15, defaultX: -130, defaultY: 30, zIndex: 10 },
              { id: 2, src: "/gallery-2.png", defaultRotate: -5,  defaultX: -45,  defaultY: 0,  zIndex: 20 },
              { id: 3, src: "/gallery-3.png", defaultRotate: 5,   defaultX: 45,   defaultY: 0,  zIndex: 30 },
              { id: 4, src: "/gallery-4.png", defaultRotate: 15,  defaultX: 130,  defaultY: 30, zIndex: 40 },
            ].map((card) => (
              <motion.div
                key={card.id}
                className="absolute inset-0 w-full h-full rounded-[4px] border-[1px] border-[rgba(201,168,76,0.3)] bg-[#080808] overflow-hidden drop-shadow-[0_25px_25px_rgba(0,0,0,0.9)] origin-bottom"
                initial={{ 
                  rotate: card.defaultRotate, 
                  x: card.defaultX, 
                  y: card.defaultY,
                  zIndex: card.zIndex,
                  scale: 1
                }}
                whileHover={{
                  scale: 1.08,
                  rotate: card.defaultRotate * 0.2, // slightly straighten out, but not fully stiff
                  y: card.defaultY - 40,
                  zIndex: 50,
                  transition: { duration: 0.4, ease: [0.25, 1, 0.5, 1] } // smooth ease out
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Image 
                  src={card.src}
                  alt={`Mavi Card ${card.id}`}
                  fill
                  className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-transparent transition-colors duration-500" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right: Single Straight Image (Tablet & iPad Pro) */}
        <motion.div 
          className="relative h-[60vh] w-full hidden md:flex xl:hidden items-center justify-center order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <motion.div 
            className="relative w-[300px] h-[400px] rounded-[4px] border-[1px] border-[rgba(201,168,76,0.3)] bg-[#080808] overflow-hidden drop-shadow-[0_25px_25px_rgba(0,0,0,0.9)]"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <Image 
              src="/gallery-2.png" // Using the second image as the representative one
              alt="Mavi About"
              fill
              className="object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}