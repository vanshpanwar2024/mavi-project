"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EventsPreview() {
  const containerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .eq('status', 'Upcoming')
          .order('event_date', { ascending: true })
          .limit(3);
        
        if (error) {
           console.error("Supabase error:", error);
           setError(true);
        } else if (data) {
           setEvents(data);
        }
      } catch (err) {
         console.error("Fetch error:", err);
         setError(true);
      }
    };

    fetchEvents();
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  
  return (
    <section 
      id="events"
      ref={containerRef}
      className="relative w-full bg-black-deep py-20 md:py-32 overflow-hidden z-10"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-12 flex flex-col items-center">
        
        {/* Top Section: Centered Heading & Subtext */}
        <div className="flex flex-col items-center text-center max-w-4xl mb-16 md:mb-24 px-2">
          
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
             viewport={{ once: true }}
          >
            <span className="block text-[9px] md:text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-4 md:mb-6">
              Upcoming Events
            </span>
            {/* Heading in one line as requested */}
            <h2 className="font-display font-[300] text-[clamp(28px,6vw,64px)] text-off-white leading-[1.2] md:leading-[1.1] mb-6 md:mb-8">
              Where Every Stage <span className="text-gold italic block sm:inline">Tells a Story.</span>
            </h2>
          </motion.div>

          <motion.div 
             className="max-w-xl"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             viewport={{ once: true }}
          >
             <p className="text-off-white-dim font-body text-[13px] tracking-[0.05em] leading-[1.8]">
              At Mavi Entertainment Production House, every event is a carefully produced experience where emerging talent steps into the spotlight. From preliminary rounds to grand finales, we build stages designed to honour the art.
            </p>
          </motion.div>

        </div>

        {/* Middle Section: Grid of Smaller Event Cards (2-3 per row) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-20">
          {error ? (
             <div className="col-span-1 md:col-span-3 w-full h-[200px] border border-dashed border-red-900/30 flex flex-col items-center justify-center gap-4">
                 <p className="text-red-400 text-sm uppercase tracking-widest">Unable to load events</p>
                 <button onClick={() => window.location.reload()} className="text-[10px] uppercase tracking-widest border-b border-red-400 text-red-400 pb-1 hover:text-white hover:border-white transition-colors">Retry</button>
             </div>
          ) : events.length > 0 ? (
            events.map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative flex flex-col w-full h-[480px] border border-[rgba(255,255,255,0.05)] bg-[#0A0A0A] overflow-hidden hover:border-[rgba(201,168,76,0.3)] transition-all duration-500"
              >
                {/* Background Image full fill */}
                <div className="absolute inset-0 w-full h-full z-0">
                   {event.image_url ? (
                     <Image 
                        src={event.image_url}
                        alt={event.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80"
                     />
                   ) : (
                      <div className="w-full h-full bg-[#111] flex items-center justify-center">
                        <span className="text-off-white-dim text-xs">No Image</span>
                      </div>
                   )}
                   {/* Gradient overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-[#111111]/80 to-transparent z-10" />
                </div>

                {/* Content Section - Overlay */}
                <div className="relative z-20 flex flex-col justify-end h-full p-6 md:p-8">
                    
                    <div className="mb-2">
                      <span className="inline-block text-gold font-body text-[9px] uppercase tracking-[2px]">
                         {event.is_month_only 
                            ? new Date(event.event_date).toLocaleDateString("en-US", { month: 'long', year: 'numeric' })
                            : new Date(event.event_date).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })
                         }
                      </span>
                    </div>

                    <h3 className="font-display text-xl md:text-2xl text-off-white mb-2 drop-shadow-md group-hover:text-gold transition-colors duration-300">
                      {event.title}
                    </h3>

                    <p className="font-body text-[11px] text-[rgba(245,240,232,0.8)] leading-relaxed mb-4 line-clamp-3 drop-shadow-md">
                      {event.description}
                    </p>
                    
                     <div className="flex flex-wrap gap-4 text-[9px] text-off-white-dim font-body uppercase tracking-[0.1em] mb-4">
                        <div className="flex items-center gap-1.5">
                           <span className="text-gold">📍</span> <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                    </div>

                    <Link href={`/events/upcoming?register=${event.id}`} className="inline-block border-b border-gold text-gold font-body text-[9px] uppercase tracking-[2px] pb-1 w-max hover:text-white hover:border-white transition-all duration-300">
                       Register Now →
                    </Link>
                </div>

                {/* Animated Bottom Line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gold scale-x-0 origin-left transition-transform duration-500 ease-out group-hover:scale-x-100 z-30" />
              </motion.div>
            ))
          ) : (
             <div className="col-span-1 md:col-span-3 w-full h-[200px] border border-dashed border-[rgba(255,255,255,0.1)] flex items-center justify-center">
                 <p className="text-off-white-dim text-sm uppercase tracking-widest">No upcoming events found</p>
             </div>
          )}
        </div>

        {/* Bottom: Explore Button */}
        <div className="flex justify-center">
          <Link 
            href="/events" 
            className="group relative inline-flex items-center justify-center px-12 py-4 border border-[rgba(201,168,76,0.3)] hover:border-gold hover:bg-[rgba(201,168,76,0.05)] transition-all duration-300"
          >
            <span className="font-body text-[10px] uppercase tracking-[3px] text-off-white group-hover:text-gold transition-colors">
              Explore All Events
            </span>
          </Link>
        </div>

      </div>
    </section>
  );
}