"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Services() {
  return (
    <main className="w-full bg-[#050505] min-h-screen overflow-hidden text-off-white relative">
      {/* Global Fixed Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="font-display text-[15vw] text-white opacity-10 tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      {/* Existing Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4 relative z-10 w-full overflow-hidden">
        <div className="relative w-full flex flex-col items-center justify-center">
          <div className="relative z-10 flex flex-col items-center">
            {/* Section Label */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="flex items-center space-x-[16px] mb-[32px]"
            >
              <div className="w-[50px] h-[1px] bg-gold" />
              <span className="font-body text-[8px] text-gold tracking-[5px] uppercase">
                WHAT WE OFFER
              </span>
              <div className="w-[50px] h-[1px] bg-gold" />
            </motion.div>

            {/* Main Heading */}
            <div className="flex flex-col items-center justify-center">
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                className="font-display text-[clamp(56px,8vw,80px)] font-[300] text-off-white leading-[1.1] m-0 p-0"
              >
                Everything Your Talent
              </motion.h1>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                className="font-display text-[clamp(56px,8vw,80px)] font-[300] italic text-gold leading-[1.1] m-0 p-0"
              >
                Journey Needs.
              </motion.h2>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
                className="font-body text-[12px] text-off-white-dim leading-loose max-w-[600px] mx-auto mt-6"
              >
                From elite competitions to portfolio shoots, workshops to casting auditions — everything a performer, studio, or brand needs to grow with Mavi Entertainment Production House.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION — PORTFOLIO SHOOTS */}
      <section id="portfolio-shoots" className="bg-transparent py-[120px] px-[24px] md:px-[60px] w-full relative z-10">
         <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
           {/* Image Side (Left on Desktop, Top on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: -60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 order-1"
           >
             <motion.div 
               whileHover={{ scale: 1.05 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="relative w-full aspect-[4/5] bg-[#111111] border border-[rgba(201,168,76,0.12)] group overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-[1.5px] border-l-[1.5px] border-gold z-20 m-[10px]" />
               <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-[1.5px] border-r-[1.5px] border-gold z-20 m-[10px]" />
               <Image 
                 src="/what-we-do-3.png"
                 alt="Portfolio Shoots"
                 fill
                 className="object-cover z-10"
               />
             </motion.div>
           </motion.div>

           {/* Text Side (Right on Desktop, Bottom on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: 60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 relative order-2"
           >
             {/* Background Number */}
             <div className="hidden md:block absolute top-[-60px] left-[-30px] font-display text-[140px] text-[rgba(201,168,76,0.05)] leading-none z-0 pointer-events-none select-none">
               02
             </div>

             <div className="relative z-10">
               <h3 className="font-body text-[8px] tracking-[5px] text-gold uppercase mb-8">
                 PORTFOLIO SHOOTS
                 <div className="w-[30px] h-[1px] bg-gold mt-[8px]" />
               </h3>
               
               <h2 className="font-display text-[40px] md:text-[52px] font-[300] text-off-white leading-[1.1]">
                 Build a Portfolio That Opens Doors.
               </h2>
               
               <div className="h-[1px] w-[48px] bg-gold my-[24px]" />
               
               <p className="font-body text-[12px] text-[rgba(255,255,255,0.7)] leading-[2.2] mb-10">
                 Your portfolio is your first impression — and in the world of fashion and performance, first impressions determine everything. Through the Mavi Entertainment Production House marketplace, book verified professional photographers and videographers who specialise in talent, fashion, and performance photography. Every shoot is tailored to showcase your unique presence and build your professional profile.
               </p>

               <div className="space-y-[20px] mb-12">
                 {[
                   { title: "Verified Professionals", text: "Every photographer on our platform is verified, reviewed, and rated by the Mavi community." },
                   { title: "Tailored to You", text: "Model portfolios, dance reels, fashion editorials, or performance videos — we have the right creative for every need." },
                   { title: "Special Rates for Participants", text: "Registered Mavi participants get exclusive discounted rates on all marketplace bookings." }
                 ].map((feature, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + (0.15 * i), duration: 0.5 }}
                     className="border-l-[2px] border-gold pl-[16px]"
                   >
                     <h4 className="font-display text-[18px] text-off-white mb-[2px]">{feature.title}</h4>
                     <p className="font-body text-[11px] text-[rgba(255,255,255,0.7)] leading-relaxed">{feature.text}</p>
                   </motion.div>
                 ))}
               </div>

               <Link href="/coming-soon" className="group inline-flex items-center cursor-pointer">
                 <span className="font-body text-[9px] text-gold tracking-[3px] uppercase relative pb-1">
                   Book Photographer &rarr;
                   <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                 </span>
               </Link>
             </div>
           </motion.div>
         </div>
      </section>

      {/* SECTION — WORKSHOPS */}
      <section id="workshops" className="bg-transparent py-[120px] px-[24px] md:px-[60px] w-full relative z-10">
         <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
           {/* Text Side (Left on Desktop, Bottom on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: -60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 relative order-2 md:order-1"
           >
             <div className="hidden md:block absolute top-[-60px] left-[-30px] font-display text-[140px] text-[rgba(201,168,76,0.05)] leading-none z-0 pointer-events-none select-none">
               03
             </div>

             <div className="relative z-10">
               <h3 className="font-body text-[8px] tracking-[5px] text-gold uppercase mb-8">
                 WORKSHOPS
                 <div className="w-[30px] h-[1px] bg-gold mt-[8px]" />
               </h3>
               
               <h2 className="font-display text-[40px] md:text-[52px] font-[300] text-off-white leading-[1.1]">
                 Sharpen Every Edge Before the Stage.
               </h2>
               
               <div className="h-[1px] w-[48px] bg-gold my-[24px]" />
               
               <p className="font-body text-[12px] text-[rgba(255,255,255,0.7)] leading-[2.2] mb-8">
                 Talent alone is not enough. The performers who make it to the national stage are the ones who never stop refining their craft. Our curated workshop program brings together Delhi NCR&apos;s finest coaches, choreographers, stylists, and industry professionals for intensive sessions designed to prepare you for the big stage. From ramp walk technique to contemporary choreography — we cover every dimension of a performer&apos;s development.
               </p>

               <div className="flex flex-wrap gap-[10px] mb-[24px]">
                 {["Dance Workshops", "Ramp Walk & Fashion", "Grooming & Personality", "Stage Presence"].map((pill, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + (0.1 * i), duration: 0.4 }}
                     className="border border-[rgba(201,168,76,0.3)] bg-transparent text-gold font-body text-[9px] tracking-[2px] uppercase py-[8px] px-[18px]"
                   >
                     {pill}
                   </motion.div>
                 ))}
               </div>

               <div className="space-y-[20px] mb-12">
                 {[
                   { title: "Industry Professionals", text: "Every workshop is conducted by verified coaches and working industry professionals with real experience." },
                   { title: "One-Time and Recurring", text: "Choose from intensive one-day masterclasses or recurring weekly sessions built around your schedule." },
                   { title: "Finale Preparation", text: "Selected finalists get access to exclusive pre-finale preparation workshops designed specifically for Mavi events." }
                 ].map((feature, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + 0.4 + (0.15 * i), duration: 0.5 }}
                     className="border-l-[2px] border-gold pl-[16px]"
                   >
                     <h4 className="font-display text-[18px] text-off-white mb-[2px]">{feature.title}</h4>
                     <p className="font-body text-[11px] text-[rgba(255,255,255,0.7)] leading-relaxed">{feature.text}</p>
                   </motion.div>
                 ))}
               </div>

               <Link href="/coming-soon" className="group inline-flex items-center cursor-pointer">
                 <span className="font-body text-[9px] text-gold tracking-[3px] uppercase relative pb-1">
                   Browse Workshops &rarr;
                   <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                 </span>
               </Link>
             </div>
           </motion.div>

           {/* Image Side (Right on Desktop, Top on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: 60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 order-1 md:order-2"
           >
             <motion.div 
               whileHover={{ scale: 1.05 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="relative w-full aspect-[4/5] bg-[#111111] border border-[rgba(201,168,76,0.12)] group overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-[1.5px] border-l-[1.5px] border-gold z-20 m-[10px]" />
               <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-[1.5px] border-r-[1.5px] border-gold z-20 m-[10px]" />
               <Image 
                 src="/what-we-do-4.png"
                 alt="Workshops"
                 fill
                 className="object-cover z-10"
               />
             </motion.div>
           </motion.div>
         </div>
      </section>

      {/* SECTION — CASTING AUDITIONS */}
      <section id="casting-auditions" className="bg-transparent py-[120px] px-[24px] md:px-[60px] w-full relative z-10">
         <div className="max-w-[1300px] mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
           {/* Image Side (Left on Desktop, Top on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: -60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 order-1"
           >
             <motion.div 
               whileHover={{ scale: 1.05 }}
               transition={{ duration: 0.6, ease: "easeOut" }}
               className="relative w-full aspect-[4/5] bg-[#111111] border border-[rgba(201,168,76,0.12)] group overflow-hidden"
             >
               <div className="absolute top-0 left-0 w-[20px] h-[20px] border-t-[1.5px] border-l-[1.5px] border-gold z-20 m-[10px]" />
               <div className="absolute bottom-0 right-0 w-[20px] h-[20px] border-b-[1.5px] border-r-[1.5px] border-gold z-20 m-[10px]" />
               <Image 
                 src="/what-we-do-7.png"
                 alt="Casting Auditions"
                 fill
                 className="object-cover z-10"
               />
             </motion.div>
           </motion.div>

           {/* Text Side (Right on Desktop, Bottom on Mobile) */}
           <motion.div 
             initial={{ opacity: 0, x: 60 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full md:w-1/2 relative order-2"
           >
             <div className="hidden md:block absolute top-[-60px] right-[-30px] font-display text-[140px] text-[rgba(201,168,76,0.05)] leading-none z-0 pointer-events-none select-none">
               04
             </div>

             <div className="relative z-10">
               <h3 className="font-body text-[8px] tracking-[5px] text-gold uppercase mb-8">
                 CASTING AUDITIONS
                 <div className="w-[30px] h-[1px] bg-gold mt-[8px]" />
               </h3>
               
               <h2 className="font-display text-[40px] md:text-[52px] font-[300] text-off-white leading-[1.1]">
                 Where Talent Meets Opportunity.
               </h2>
               
               <div className="h-[1px] w-[48px] bg-gold my-[24px]" />
               
               <p className="font-body text-[12px] text-[rgba(255,255,255,0.7)] leading-[2.2] mb-8">
                 Getting discovered is no longer about who you know. Through the Mavi Entertainment Production House casting board, brands, directors, and agencies post active casting calls directly to our platform — and our registered talent can apply in minutes. Whether you are looking for brand ambassador opportunities, commercial shoots, music video appearances, or fashion campaign features — our casting board connects you with real paid opportunities from verified clients.
               </p>

               <div className="grid grid-cols-2 gap-[16px] mb-[24px]">
                 {[
                   { stat: "Active", label: "Casting Board" },
                   { stat: "Verified", label: "Brand Clients" },
                   { stat: "Direct", label: "Applications" },
                   { stat: "Free", label: "For All Talent" }
                 ].map((box, i) => (
                   <motion.div
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + (0.1 * i), duration: 0.4 }}
                     className="bg-[#111111] border border-[rgba(201,168,76,0.1)] p-[20px]"
                   >
                     <div className="font-display text-[36px] text-gold leading-none">{box.stat}</div>
                     <div className="font-body text-[8px] text-[rgba(255,255,255,0.7)] tracking-[2px] uppercase mt-[6px]">
                       {box.label}
                     </div>
                   </motion.div>
                 ))}
               </div>

               <div className="space-y-[20px] mb-12">
                 {[
                   { title: "Real Paid Opportunities", text: "Every casting on our board is a genuine paid or credited opportunity — no unpaid exposure-only listings ever." },
                   { title: "Verified Brand Clients", text: "All brands and agencies are verified by the Mavi Entertainment Production House team before any listing goes live on the platform." },
                   { title: "Apply in Minutes", text: "Your Mavi talent profile works as your instant application. One click sends your portfolio to the casting client." }
                 ].map((feature, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + 0.4 + (0.15 * i), duration: 0.5 }}
                     className="border-l-[2px] border-gold pl-[16px]"
                   >
                     <h4 className="font-display text-[18px] text-off-white mb-[2px]">{feature.title}</h4>
                     <p className="font-body text-[11px] text-[rgba(255,255,255,0.7)] leading-relaxed">{feature.text}</p>
                   </motion.div>
                 ))}
               </div>

               <Link href="/coming-soon" className="group inline-flex items-center cursor-pointer">
                 <span className="font-body text-[9px] text-gold tracking-[3px] uppercase relative pb-1">
                   View Casting Board &rarr;
                   <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-gold transition-all duration-300 group-hover:w-full" />
                 </span>
               </Link>
             </div>
           </motion.div>
         </div>
      </section>

    </main>
  );
}
