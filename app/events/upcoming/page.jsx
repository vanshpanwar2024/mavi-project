"use client";

import { useEffect, useState } from "react";
// Adjust the import path for supabase based on your project structure
// If supabase.js is in src/lib, use @/lib/supabase or ../../../lib/supabase
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Fetch ALL events (status check removed for debugging/flexibility as requested)
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true });
        
        if (error) {
          console.error("Supabase error:", error);
          setError("Failed to load events. Please try again later.");
        } else {
          setEvents(data || []);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("An unexpected error occurred.");
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

      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-[64px] text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
             <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-4 block">
                What Is Next
             </span>
             <h1 className="font-display text-5xl md:text-7xl text-off-white tracking-wide mb-6">
               Upcoming <span className="italic text-gold font-[300]">Events</span>
             </h1>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[60px] h-[1px] bg-gold opacity-50"
          />
        </div>

        {loading ? (
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            {/* Loading Skeletons */}
            {[1, 2].map(i => (
              <div key={i} className="w-full h-[240px] bg-[#111] animate-pulse border border-[rgba(201,168,76,0.1)] relative overflow-hidden rounded-sm" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <p className="text-red-400 font-body text-sm mb-4">{error}</p>
             <button 
                onClick={() => window.location.reload()}
                className="border border-gold text-gold px-6 py-2 uppercase text-[10px] tracking-widest hover:bg-gold hover:text-black transition-colors"
             >
               Retry
             </button>
          </div>
        ) : events.length === 0 ? (
           <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <p className="font-body text-[14px] md:text-[16px] text-off-white-dim uppercase tracking-[3px] mb-8">
              No upcoming events announced yet.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
            {events.map((event, i) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="group relative flex flex-col md:flex-row w-full bg-[#0A0A0A] border border-[rgba(255,255,255,0.05)] overflow-hidden hover:border-[rgba(201,168,76,0.3)] transition-all duration-500"
              >
                  {/* Image Section */}
                  <div className="relative w-full md:w-[45%] h-[300px] md:h-auto overflow-hidden">
                     {event.image_url ? (
                       <Image 
                          src={event.image_url}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 45vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                       />
                     ) : (
                        <div className="w-full h-full bg-[#111] flex items-center justify-center">
                          <span className="text-off-white-dim text-xs uppercase tracking-widest">Image Unavailable</span>
                        </div>
                     )}
                     {/* Overlay for subtle darkening on hover */}
                     <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-center w-full md:w-[55%] p-8 md:p-12 relative">
                      
                      {/* Date */}
                      <div className="mb-4">
                          <span className="inline-block text-gold font-body text-[11px] uppercase tracking-[2px]">
                              {event.is_month_only 
                                ? new Date(event.event_date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
                                : new Date(event.event_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                              }
                          </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-3xl md:text-4xl text-off-white mb-3 group-hover:text-gold transition-colors duration-300">
                          {event.title}
                      </h3>
                      
                      {/* Category */}
                      {event.category && (
                        <span className="text-[10px] text-[rgba(245,240,232,0.6)] tracking-[1.5px] uppercase mb-6 block">
                             {event.category}
                        </span>
                      )}

                      {/* Description */}
                      <p className="font-body text-[13px] text-[rgba(245,240,232,0.7)] leading-[1.8] mb-8 line-clamp-3">
                          {event.description}
                      </p>
                    
                      <div className="flex items-center gap-2 mb-8 font-body text-[11px] text-[rgba(245,240,232,0.6)] uppercase tracking-wider border-t border-[rgba(255,255,255,0.05)] pt-6 w-full">
                           <span className="text-gold">📍</span> 
                           <span className="truncate">{event.location}</span>
                      </div>

                      {/* Link (if needed, or just card click) */}
                      {/* <div className="mt-auto">
                          <Link href="/contact" className="inline-block text-gold font-body text-[10px] uppercase tracking-[2px] border-b border-gold pb-1 hover:text-white hover:border-white transition-all duration-300">
                              More Details
                          </Link>
                      </div> */}
                  </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}