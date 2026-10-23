"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
        
        if (error) {
          console.error("Supabase error:", error);
        } else {
          console.log("Supabase data:", data);
          setEvents(data || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <main className="w-full bg-[#050505] min-h-screen relative overflow-hidden pt-[120px] pb-[80px] px-6 md:px-12 z-10">
      {/* Global Fixed Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="font-display text-[15vw] text-white opacity-10 tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      <div className="relative z-10 max-w-[1240px] mx-auto">
        <div className="flex flex-col items-center mb-[64px] text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display text-5xl md:text-7xl text-off-white tracking-wide mb-6"
          >
            Upcoming <span className="italic text-gold font-[300]">Events</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[60px] h-[1px] bg-gold opacity-50"
          />
        </div>

        {loading ? (
          // Adjusted skeleton to match zig-zag layout
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            {[1, 2].map(i => (
              <div key={i} className="w-full h-[240px] bg-[#111] animate-pulse border border-[rgba(201,168,76,0.1)] relative overflow-hidden" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="font-body text-[14px] md:text-[16px] text-off-white-dim uppercase tracking-[3px] mb-8">
              New events coming soon.
            </p>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="border border-gold text-gold font-body text-[10px] uppercase tracking-widest py-3 px-8 hover:bg-gold hover:text-black-deep transition-all duration-300"
            >
              Follow us on Instagram for updates
            </a>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            {events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                // Zig-Zag Layout: Even index (i%2===0) -> Row | Odd index -> Row-Reverse
                className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} w-full min-h-[240px] border border-[rgba(201,168,76,0.2)] bg-[#0e0e0e] group hover:border-[rgba(201,168,76,0.5)] transition-colors duration-500`}
              >
                {/* Image Section - 50% Width */}
                <div className="relative w-full md:w-1/2 min-h-[240px] md:min-h-full overflow-hidden">
                   {event.image_url ? (
                    <>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                      <Image 
                        src={event.image_url} 
                        alt={event.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                      />
                    </>
                   ) : (
                     <div className="w-full h-full bg-[#111] flex items-center justify-center">
                        <span className="text-off-white-dim text-xs">No Image</span>
                     </div>
                   )}
                </div>

                {/* Content Section - 50% Width */}
                <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-black-deep text-left relative">
                    
                    {/* Date Tag */}
                    <span className="inline-block text-gold font-body text-[9px] uppercase tracking-[2px] mb-3">
                        {new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>

                    {/* Title */}
                    <h3 className="font-display text-2xl md:text-3xl text-off-white mb-3 group-hover:text-gold transition-colors duration-300">
                        {event.title}
                    </h3>

                    {/* Category Label */}
                    <span className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-wider uppercase mb-4">
                        {event.category || 'Event'}
                    </span>

                    {/* Description */}
                    <p className="font-body text-[11px] text-off-white-dim leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                        {event.description}
                    </p>
                  
                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-8 font-body text-[10px] text-[rgba(255,255,255,0.6)] uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                             <span className="text-gold">📍</span> 
                             <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <span className="text-gold">🎟️</span> 
                             <span>{event.preliminary_fee ? `₹${event.preliminary_fee}` : 'Free'}</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-auto">
                        <Link href="/register" className="inline-block border-b border-gold text-gold font-body text-[10px] uppercase tracking-[3px] pb-1 hover:text-white hover:border-white transition-all duration-300">
                            Register Now
                        </Link>
                    </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </main>
  );
}
