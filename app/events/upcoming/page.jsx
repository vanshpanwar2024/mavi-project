"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase"; 
import { motion } from "framer-motion";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import EventRegistrationModal from "@/components/EventRegistrationModal";

function UpcomingEventsContent() {
  const searchParams = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          setError("Failed to load events. Please try again later.");
        } else {
          const fetchedEvents = data || [];
          setEvents(fetchedEvents);

          // Check if register query param matches an event id
          const registerId = searchParams.get('register') || searchParams.get('event');
          if (registerId && fetchedEvents.length > 0) {
            const matched = fetchedEvents.find(e => String(e.id) === String(registerId));
            if (matched) {
              setSelectedEvent(matched);
              setIsModalOpen(true);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [searchParams]);

  const handleOpenRegistration = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseRegistration = () => {
    setIsModalOpen(false);
  };

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
             <p className="font-body text-xs md:text-sm text-off-white-dim uppercase tracking-[2px] max-w-lg mx-auto">
               Select an event to complete your registration
             </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-[60px] h-[1px] bg-gold opacity-50 mt-6"
          />
        </div>

        {loading ? (
          <div className="flex flex-col gap-12 max-w-5xl mx-auto">
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
                onClick={() => handleOpenRegistration(event)}
                className="group relative flex flex-col md:flex-row w-full bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] overflow-hidden hover:border-[rgba(201,168,76,0.45)] hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] transition-all duration-500 cursor-pointer"
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
                     <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                     
                     {/* Category badge over image */}
                     {event.category && (
                       <span className="absolute top-4 left-4 z-10 bg-black/80 backdrop-blur-sm border border-gold/30 text-gold text-[9px] uppercase tracking-[2px] px-3 py-1">
                         {event.category}
                       </span>
                     )}
                  </div>

                  {/* Content Section */}
                  <div className="flex flex-col justify-between w-full md:w-[55%] p-8 md:p-12 relative">
                      <div>
                        {/* Date */}
                        <div className="mb-3">
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

                        {/* Description */}
                        <p className="font-body text-[13px] text-[rgba(245,240,232,0.7)] leading-[1.8] mb-6 line-clamp-3">
                            {event.description}
                        </p>
                      
                        <div className="flex items-center gap-2 mb-6 font-body text-[11px] text-[rgba(245,240,232,0.6)] uppercase tracking-wider border-t border-[rgba(255,255,255,0.06)] pt-4 w-full">
                             <span className="text-gold">📍</span> 
                             <span className="truncate">{event.location || "Delhi NCR"}</span>
                        </div>
                      </div>

                      {/* Registration Action Area */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenRegistration(event);
                          }}
                          className="inline-flex items-center gap-2 border border-gold text-gold font-body text-[10px] uppercase tracking-[3px] py-3 px-6 hover:bg-gold hover:text-black-deep transition-all duration-300 group-hover:bg-gold group-hover:text-black-deep"
                        >
                          <span>Register For Event</span>
                          <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </button>

                        {event.preliminary_fee !== undefined && event.preliminary_fee !== null && (
                          <span className="font-body text-[10px] uppercase tracking-wider text-off-white-dim">
                            {Number(event.preliminary_fee) > 0 ? `Entry: ₹${event.preliminary_fee}` : "Free Entry"}
                          </span>
                        )}
                      </div>
                  </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleCloseRegistration}
      />
    </main>
  );
}

export default function UpcomingEvents() {
  return (
    <Suspense fallback={
      <main className="w-full bg-[#050505] min-h-screen pt-[120px] px-6 text-center text-off-white-dim">
        <p className="font-body text-xs uppercase tracking-widest">Loading Events...</p>
      </main>
    }>
      <UpcomingEventsContent />
    </Suspense>
  );
}
