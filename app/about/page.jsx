"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

// CountUp Component for Section 6 stats
const CountUp = ({ end, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, end, duration]);

  return <span ref={nodeRef}>{count}</span>;
};

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" } 
    }
  };

  return (
    <main className="w-full bg-[#050505] min-h-screen overflow-hidden text-off-white relative">
      
      {/* Global Fixed Watermark */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="font-display text-[15vw] text-white opacity-10 tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      {/* SECTION 1 - HERO */}
      <section className="relative w-full h-[100svh] flex flex-col justify-center items-center px-6 md:px-12 z-10 bg-transparent">
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-[1px] bg-gold opacity-50" />
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.4em]">
              The Mavi Story
            </span>
            <div className="w-12 h-[1px] bg-gold opacity-50" />
          </motion.div>

          <motion.h2 variants={itemVariants} className="font-display font-[300] text-5xl md:text-[80px] text-off-white leading-[1.1]">
            We Don&apos;t Just Organise Events.
          </motion.h2>
          <motion.h2 variants={itemVariants} className="font-display font-[300] italic text-4xl md:text-[80px] text-gold leading-[1.1] mb-10">
            We Build Legacies.
          </motion.h2>

          <motion.p variants={itemVariants} className="font-body text-[13px] text-off-white-dim leading-[2.2] max-w-[700px]">
            Every great performer remembers the moment they first stepped onto a real stage. The lights. The silence before the music. The feeling that everything they had worked for had led to exactly this moment. At Mavi Entertainment Production House, we exist to create that moment — for every dancer, every model, every performer who dares to dream bigger than their classroom.
          </motion.p>
        </motion.div>

        <motion.div 
          className="absolute bottom-12 flex flex-col items-center z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          <span className="font-body text-[9px] uppercase tracking-[3px] text-gold mb-3">Scroll</span>
          <motion.div 
            className="w-[1px] h-12 bg-gold"
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* SECTION 2 - WHERE IT BEGAN */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="relative flex flex-col justify-center order-2 md:order-1 flex-1">
            <span className="absolute -top-12 -left-6 md:-left-12 font-display text-[100px] text-[rgba(201,168,76,0.08)] leading-none select-none pointer-events-none">
              01
            </span>
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-6 relative z-10">
              Where It Began
            </span>
            <h2 className="font-display font-[300] text-4xl md:text-[48px] text-off-white leading-[1.1] mb-8 relative z-10">
              Born From a Gap Nobody Was Filling.
            </h2>
            <p className="font-body text-[12px] text-off-white-dim leading-[2.2] relative z-10">
              Delhi NCR is home to thousands of dance academies, fashion studios, and talent coaches quietly producing some of the most gifted young performers in the country. We saw them every day — in YouTube videos filmed on phone cameras, in local competitions with no real production value, in studios full of students who had the talent of national champions but no platform worthy of showcasing it. <br/><br/>
              That gap — between raw extraordinary talent and a stage that truly honours it — is exactly why Mavi Entertainment Production House was born. We started with a simple but powerful belief: talent in India is not scarce. Opportunity is.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="relative w-full md:w-[400px] aspect-[4/5] bg-[#111] border border-[rgba(201,168,76,0.5)] order-1 md:order-2 flex items-center justify-center shrink-0">
             <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold -translate-x-[1px] -translate-y-[1px] z-20" />
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold translate-x-[1px] translate-y-[1px] z-20" />
             <Image 
               src="/about-1.jpg" 
               alt="Where It Began" 
               fill
               className="object-cover opacity-80" 
             />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 3 - WHAT MAVI MEANS */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="relative w-full md:w-[400px] aspect-[4/5] bg-[#111] border border-[rgba(201,168,76,0.5)] flex items-center justify-center shrink-0">
             <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-gold -translate-x-[1px] -translate-y-[1px] z-20" />
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-gold translate-x-[1px] translate-y-[1px] z-20" />
             <Image 
               src="/about-2.jpg" 
               alt="What Mavi Means" 
               fill
               className="object-cover opacity-80" 
             />
          </motion.div>

          <motion.div variants={itemVariants} className="relative flex flex-col justify-center flex-1">
            <span className="absolute -top-12 -left-6 md:-left-12 font-display text-[100px] text-[rgba(201,168,76,0.08)] leading-none select-none pointer-events-none">
              02
            </span>
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-6 relative z-10">
              What Mavi Means
            </span>
            <h2 className="font-display font-[300] text-4xl md:text-[48px] text-off-white leading-[1.1] mb-8 relative z-10">
              Expansion. For Everyone.
            </h2>
            <p className="font-body text-[12px] text-off-white-dim leading-[2.2] relative z-10">
              Mavi represents expansion, growth, and the act of spreading beyond your current boundaries into something far greater. It is not just our name. It is our promise.<br/><br/>
              To every participant — we promise to expand your world. To every studio partner — we promise to expand your reach. To every sponsor — we promise to expand your brand&apos;s connection with India&apos;s most passionate young audience. Mavi is expansion. For everyone.
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 4 - WHAT WE ACTUALLY DO */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] text-center block mb-4">
              What We Do
            </span>
            <h2 className="font-display font-[300] text-4xl md:text-[56px] text-off-white leading-[1.1]">
              More Than Events. An Ecosystem.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-[80px] mb-20 text-justify md:text-left">
            <motion.p variants={itemVariants} className="font-body text-[13px] text-off-white-dim leading-[2] m-0">
              We are not just an events company. We are building India&apos;s most complete talent ecosystem. On the surface, we organise premium fashion and dance competitions across Delhi NCR. We bring together hundreds of participants per event, partner with the finest studios and academies, attract brand sponsors, and produce events that feel national in scale even at the city level.
            </motion.p>
            <motion.p variants={itemVariants} className="font-body text-[13px] text-off-white-dim leading-[2] m-0">
              But beneath the surface we are building something much larger. Our marketplace connects performers with professional photographers, coaches, and casting opportunities. Our studio partnership program creates a revenue-sharing ecosystem where academies grow alongside us. Our talent discovery program is laying the groundwork for a national platform that will give performers from every city in India access to opportunities they deserve.
            </motion.p>
          </div>

          <motion.div variants={itemVariants} className="flex flex-col gap-6 md:gap-10">
            {[
              { title: "Premium Events", desc: "Multi-stage fashion and dance competitions with world class production value" },
              { title: "Talent Marketplace", desc: "Connecting performers with photographers, coaches, and casting opportunities" },
              { title: "Studio Ecosystem", desc: "Revenue sharing partnerships with Delhi NCR's finest dance and fashion academies" }
            ].map((feature, idx) => (
              <div key={idx} className="border-l-[1px] border-[rgba(201,168,76,0.3)] pl-6 flex flex-col">
                <h4 className="font-display font-[300] text-[22px] text-off-white mb-2">{feature.title}</h4>
                <p className="font-body text-[11px] text-off-white-dim">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 5 - OUR EVENTS PHILOSOPHY */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-20">
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] block mb-4">
              Our Philosophy
            </span>
            <h2 className="font-display font-[300] text-4xl md:text-[56px] text-off-white leading-[1.1]">
              Three Principles. Zero Compromises.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              { num: "I", title: "Every Participant Deserves Dignity.", text: "Regardless of whether you make it to the finale or not, your participation with us is honoured. You receive professional evaluation, an official certificate, and the knowledge that you competed on a platform that took your talent seriously." },
              { num: "II", title: "Every Stage Deserves Production.", text: "We do not do school auditorium setups with a laptop speaker and a bedsheet backdrop. Every Mavi event has professional lighting, sound, a real stage, a credible judging panel, and production value that makes participants feel like they have truly arrived." },
              { num: "III", title: "Every Winner Deserves a Launchpad.", text: "Winning a Mavi title is not just about a trophy. It is about the doors that open afterward — the portfolio shoot, the sponsor visibility, the industry connections, and the credibility that comes with performing on a platform the industry respects." }
            ].map((card, idx) => (
              <motion.div 
                key={idx}
                variants={itemVariants}
                viewport={{ once: true }}
                className="group relative bg-[#111] border border-[rgba(201,168,76,0.12)] p-10 md:p-12 overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-[rgba(201,168,76,0.4)]"
              >
                <div className="absolute top-4 right-8 text-[80px] font-display text-gold opacity-[0.08] leading-none pointer-events-none group-hover:opacity-20 transition-opacity duration-500 z-0">
                  {card.num}
                </div>
                <div className="absolute bottom-0 left-0 h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-500 ease-out z-10" />

                <div className="relative z-10 h-full flex flex-col">
                  <h3 className="font-display font-[300] text-[28px] text-off-white mb-6 leading-snug">{card.title}</h3>
                  <p className="font-body text-[12px] text-off-white-dim leading-[2] mt-auto">{card.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 6 - STATS */}
      <section className="relative w-full bg-transparent py-[80px] md:py-[100px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start divide-y md:divide-y-0 md:divide-x divide-[rgba(201,168,76,0.15)]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { num: 50, suffix: "+", label: "Studio Partners Across Delhi NCR" },
            { num: 300, suffix: "+", label: "Participants Per Event" },
            { num: 3, suffix: "", label: "Core Event Categories" },
            { num: 2026, suffix: "", label: "The Year Everything Changes", duration: 2 }
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="w-full md:w-1/4 py-10 md:py-0 px-4 flex flex-col items-center text-center">
              <span className="font-display font-[300] text-6xl md:text-[88px] text-gold mb-2 leading-none">
                <CountUp end={stat.num} duration={stat.duration || 2} />{stat.suffix}
              </span>
              <span className="font-body text-[9px] text-off-white-dim uppercase tracking-[3px]">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SECTION 7 - WHERE WE ARE GOING */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 md:gap-24 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Left Text */}
          <motion.div variants={itemVariants} className="relative flex flex-col justify-center flex-1">
            <span className="absolute -top-12 -left-6 md:-left-12 font-display text-[100px] text-[rgba(201,168,76,0.08)] leading-none select-none pointer-events-none">
              03
            </span>
            <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em] mb-6 relative z-10">
              The Vision
            </span>
            <h2 className="font-display font-[300] text-4xl md:text-[48px] text-off-white leading-[1.1] mb-8 relative z-10">
              Delhi NCR Is Our Beginning.<br className="hidden md:block"/> Not Our Limit.
            </h2>
            <p className="font-body text-[12px] text-off-white-dim leading-[2.2] relative z-10">
              Within the next three years Mavi Entertainment Production House will expand its events to Mumbai, Bangalore, Hyderabad, Pune, and Chandigarh. Our marketplace will become the go-to platform for talent discovery across India. <br/><br/>
              We are building toward a national grand finale — one event per year that brings the best talent from every city onto a single spectacular stage. India&apos;s answer to a world class talent championship. Produced by Mavi Entertainment Production House.
            </p>
          </motion.div>

          {/* Right Visual Timeline */}
          <motion.div variants={itemVariants} className="flex flex-col pl-8 border-l-[1px] border-[rgba(201,168,76,0.3)] space-y-12 relative md:w-[400px] shrink-0">
            {[
              { year: "2026", desc: "Launch — Delhi NCR Events + Marketplace" },
              { year: "2026", desc: "Expansion — Mumbai and Chandigarh" },
              { year: "2027", desc: "National — 5 Cities Simultaneously" },
              { year: "2027", desc: "Platform — Full Marketplace Launch" },
              { year: "2028", desc: "Grand Finale — National Championship" }
            ].map((milestone, idx) => (
              <div key={idx} className="relative flex flex-col group cursor-default">
                <div className="absolute -left-[37px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-transparent border-[1px] border-gold flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                   <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                </div>
                <span className="font-body text-[12px] font-bold text-gold tracking-widest mb-1">{milestone.year}</span>
                <span className="font-body text-[11px] text-off-white-dim">{milestone.desc}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 8 - THE FOUNDERS */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[140px] px-[24px] md:px-[60px] z-10">
        <motion.div 
          className="max-w-6xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="flex flex-col items-center mb-16 text-center">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-[1px] bg-gold opacity-50" />
              <span className="text-[10px] text-gold font-body uppercase tracking-[0.3em]">The Founder</span>
              <div className="w-12 h-[1px] bg-gold opacity-50" />
            </div>
            <h2 className="font-display font-[300] text-4xl md:text-[56px] text-off-white mb-4">
              The Visionary Behind Mavi
            </h2>
            <p className="font-body text-[12px] text-off-white-dim">
              Built from passion. Driven by purpose. Committed to Indian talent.
            </p>
          </motion.div>

          {/* Vivek Panwar Feature Card */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: "easeOut" } }
            }}
            className="w-full max-w-4xl bg-gradient-to-b from-[#121212] to-[#0a0a0a] border border-[rgba(201,168,76,0.2)] p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Corner Decorative Brackets */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gold z-20" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gold z-20" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gold z-20" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gold z-20" />

            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10 md:gap-14">
              
              {/* Photo Column */}
              <div className="relative w-[220px] md:w-[280px] shrink-0 flex flex-col items-center">
                <div className="relative w-full aspect-[4/5] overflow-hidden border border-[rgba(201,168,76,0.3)] shadow-[0_10px_30px_rgba(0,0,0,0.6)] group">
                  <Image 
                    src="/vivek-panwar.jpg" 
                    alt="Vivek Panwar" 
                    fill 
                    className="object-cover object-center filter grayscale contrast-[1.08] hover:grayscale-0 transition-all duration-700"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Subtle inner corner accents */}
                  <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-gold/70" />
                  <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-gold/70" />
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                  <span className="font-body text-[9px] uppercase tracking-[3px] text-gold/80">
                    Founder & Managing Director
                  </span>
                </div>
              </div>

              {/* Bio & Details Column */}
              <div className="flex flex-col justify-between flex-1 text-center md:text-left">
                <div>
                  <span className="font-body text-[9px] tracking-[4px] text-gold uppercase block mb-2">
                    Leadership & Vision
                  </span>
                  <h3 className="font-display font-[300] text-4xl md:text-5xl text-off-white tracking-wide">
                    Vivek Panwar
                  </h3>
                  
                  <div className="w-16 h-[1px] bg-gradient-to-r from-gold to-transparent my-6 mx-auto md:mx-0" />
                  
                  <p className="font-body text-[12px] text-off-white-dim leading-[2.3] mb-6">
                    Vivek Panwar is the visionary founder driving Mavi Entertainment Production House. With a steadfast dedication to elevating artistic standards and creating genuine production value, he laid the foundation for an ecosystem where emerging models, dancers, and creative artists are given the professional platform their craft deserves.
                  </p>
                  
                  <p className="font-body text-[12px] text-off-white-dim leading-[2.3] mb-8">
                    Under his leadership, Mavi Entertainment Production House is forging groundbreaking studio partnerships, elite runway productions, and an expansive nationwide talent marketplace that redefines talent discovery across India.
                  </p>
                </div>

                {/* Quote Box */}
                <div className="border-l-[2px] border-gold pl-5 bg-white/[0.02] p-4 border border-white/[0.05] relative">
                  <p className="font-display italic text-[17px] text-off-white mb-2 leading-relaxed">
                    &quot;Every performer carries extraordinary potential. Our responsibility is to build the spotlight that honors that gift.&quot;
                  </p>
                  <p className="font-body text-[9px] tracking-[2px] text-gold uppercase">
                    — Vivek Panwar
                  </p>
                </div>

              </div>

            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 9 - FOUNDER QUOTE BANNER */}
      <section className="relative w-full bg-transparent py-[100px] md:py-[120px] px-[24px] md:px-[60px] z-10 flex justify-center items-center overflow-hidden">
        <motion.div 
          className="relative z-10 flex flex-col items-center text-center w-full max-w-[800px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.span variants={itemVariants} className="font-display text-[120px] text-gold opacity-15 leading-[0.5] mb-6 block">
            &quot;
          </motion.span>
          <motion.h3 variants={itemVariants} className="font-display italic text-3xl md:text-[42px] text-off-white font-[300] leading-[1.4] mb-12">
            We started with a simple but powerful belief — talent in India is not scarce. Opportunity is. Mavi Entertainment Production House is our answer to that.
          </motion.h3>

          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="w-[60px] h-[1px] bg-gold mb-6 opacity-30" />
            <span className="font-body text-[10px] text-gold tracking-[4px] uppercase mb-2">Vivek Panwar</span>
            <span className="font-body text-[9px] text-off-white-dim tracking-[2px] uppercase">Founder, Mavi Entertainment Production House</span>
          </motion.div>
        </motion.div>
      </section>

    </main>
  );
}
