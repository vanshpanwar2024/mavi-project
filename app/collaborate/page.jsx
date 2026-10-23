"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { supabase } from "../../lib/supabase";

export default function JoinUs() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [hasReadBrochure, setHasReadBrochure] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    portfolio: "",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const openModal = (roleTitle) => {
    setSelectedRole(roleTitle);
    setHasReadBrochure(false);
    setIsModalOpen(true);
    setSubmitStatus(null);
    setFormData({ name: "", phone: "", email: "", portfolio: "", details: "" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    let tableName = "";
    // Map roles to table names
    switch (selectedRole) {
      case 'Studio Partners': tableName = 'studio_partners'; break;
      case 'Models': tableName = 'models'; break;
      case 'Photographers & Videographers': tableName = 'photographers_videographers'; break;
      case 'Artists & Performers': tableName = 'artists_performers'; break;
      case 'Makeup Artists': tableName = 'makeup_artists'; break;
      case 'Sponsors & Brands': tableName = 'sponsors_brands'; break;
      default: 
        console.error("Unknown role");
        setIsSubmitting(false);
        return;
    }

    const dataToInsert = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      details: formData.details,
    };

    // Add portfolio link only if applicable
    if (!['Studio Partners', 'Sponsors & Brands'].includes(selectedRole)) {
        dataToInsert.portfolio_link = formData.portfolio;
    }

    try {
        const { error } = await supabase
            .from(tableName)
            .insert([dataToInsert]);

        if (error) throw error;

        setSubmitStatus('success');
        
        // Close modal after success
        setTimeout(() => {
            setIsModalOpen(false);
            setSubmitStatus(null);
            setFormData({ name: "", phone: "", email: "", portfolio: "", details: "" });
        }, 2000);

    } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitStatus('error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const getBrochureFile = (role) => {
    // Map the selected role to its specific PDF filename
    switch (role) {
      case 'Studio Partners': return '/brochures/studio-partners.pdf';
      case 'Models': return '/brochures/models.pdf';
      case 'Photographers & Videographers': return '/brochures/photographers.pdf';
      case 'Artists & Performers': return '/brochures/artists.pdf';
      case 'Makeup Artists': return '/brochures/makeup-artists.pdf';
      case 'Sponsors & Brands': return '/brochures/sponsors.pdf';
      default: return '#';
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden selection:bg-gold selection:text-black-deep relative">
      
      {/* Background Text */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <h1 className="font-display text-[15vw] text-white opacity-10 tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      {/* SECTION 1 — HERO */}
      <section className="relative w-full h-screen flex flex-col justify-center items-center px-6 isolate z-10">
        <motion.div 
          className="text-center w-full max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Section Label */}
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 mb-6">
            <div className="w-12 h-[1px] bg-gold opacity-50" />
            <span className="font-body text-[10px] tracking-[4px] text-gold uppercase">
              BE PART OF MAVI
            </span>
            <div className="w-12 h-[1px] bg-gold opacity-50" />
          </motion.div>

          {/* Main Heading */}
          <motion.h2 variants={itemVariants} className="font-display text-[50px] md:text-[80px] font-[300] text-off-white leading-[1.1]">
            Build Something
          </motion.h2>
          <motion.h2 variants={itemVariants} className="font-display text-[50px] md:text-[80px] italic text-gold leading-[1.1]">
            Extraordinary With Us.
          </motion.h2>

          {/* Description */}
          <motion.p variants={itemVariants} className="font-body text-[12px] text-off-white-dim leading-loose max-w-[600px] mx-auto mt-6">
            Mavi Entertainment Production House is more than an events company — it is a growing ecosystem of talent, creativity, and ambition. Whether you are a studio, a model, a photographer, an artist, a makeup artist, or a brand — there is a place for you here.
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => scrollToSection('overview')}
        >
          <span className="font-body text-[9px] text-gold tracking-widest uppercase opacity-60">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent" />
        </motion.div>
      </section>

      {/* SECTION 2 — OVERVIEW CARDS */}
      <section id="overview" className="bg-transparent py-[100px] px-[24px] md:px-[60px]">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-16">
            <span className="font-body text-[10px] tracking-[4px] text-gold uppercase opacity-80 mb-4 block">
              WHO WE ARE LOOKING FOR
            </span>
            <h2 className="font-display text-[40px] md:text-[56px] text-off-white font-[300] leading-tight mb-6">
              Six Ways to Join Mavi.
            </h2>
            <p className="font-body text-[12px] text-off-white-dim leading-loose max-w-[500px] mx-auto">
              Every role in the Mavi ecosystem is built on real value exchange. You bring your talent and expertise. We bring the platform, the audience, and the opportunity.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px] max-w-[1200px] mx-auto">
            {[
              { num: '01', image: '/join-1.png', title: 'Studio Partners', desc: "Partner with Mavi and earn revenue share while giving your students Delhi NCR's most prestigious stage.", target: 'studio-partners' },
              { num: '02', image: '/join-2.png', title: 'Models', desc: "Walk our runways, build your portfolio, and get discovered by brands and agencies actively looking for fresh faces.", target: 'models' },
              { num: '03', image: '/join-3.png', title: 'Photographers & Videographers', desc: "Shoot our events, join our marketplace, and build your client base through Mavi's growing talent community.", target: 'photographers' },
              { num: '04', image: '/join-4.png', title: 'Artists & Performers', desc: "Perform at Mavi events as showcase artists, opening acts, or brand activation performers on a real professional stage.", target: 'artists' },
              { num: '05', image: '/join-5.png', title: 'Makeup Artists', desc: "Be our official glam team. Get credited on all event content and build your clientele through our performer community.", target: 'makeup-artists' },
              { num: '06', image: '/join-6.png', title: 'Sponsors & Brands', desc: "Reach Delhi NCR's most passionate youth audience through event sponsorship, on ground activation, and digital campaigns.", target: 'sponsors' }
            ].map((card, idx) => (
              <motion.div 
                key={card.num}
                variants={itemVariants}
                className="group relative bg-[#111111] border border-[rgba(201,168,76,0.08)] p-[48px] px-[40px] cursor-pointer transition-all duration-500 hover:-translate-y-[6px] hover:border-[rgba(201,168,76,0.4)] overflow-hidden"
                onClick={() => openModal(card.title)}
              >
                {/* Image Background Fill replacing large number */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500">
                  <Image 
                    src={card.image} 
                    alt={card.title} 
                    fill 
                    className="object-cover object-center mix-blend-overlay opacity-80 group-hover:opacity-100 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-[#111111]/60 to-transparent" />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="font-display text-[28px] text-off-white mt-[16px]">{card.title}</h3>
                  <p className="font-body text-[11px] text-off-white-dim leading-[2] mt-[12px] max-w-[280px]">
                    {card.desc}
                  </p>
                  
                  <div className="font-body text-[9px] text-gold tracking-[3px] uppercase mt-[24px] inline-flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                    Learn More <span>→</span>
                  </div>
                </div>

                {/* Animated Bottom Line */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-gold w-0 group-hover:w-full transition-all duration-500 ease-out" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* SECTION 4 — WHY MAVI */}
      <section className="bg-transparent py-[120px] px-[24px] md:px-[60px] relative z-10">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-24">
            <span className="font-body text-[10px] tracking-[4px] text-gold uppercase block mb-4">
              WHY MAVI
            </span>
            <h2 className="font-display text-[40px] md:text-[56px] text-off-white font-[300] leading-tight max-w-[700px] mx-auto">
              Real Value. Real Opportunity. Real Growth.
            </h2>
          </motion.div>

          {/* Feature Blocks */}
          <div className="flex flex-col md:flex-row items-start justify-center divide-y md:divide-y-0 md:divide-x md:divide-[rgba(201,168,76,0.12)] gap-[60px] md:gap-0">
            
            {/* Block 1 */}
            <motion.div variants={itemVariants} className="flex-1 text-center px-0 md:px-[60px]">
              <div className="text-gold text-[20px] opacity-80 mb-[24px]">◆</div>
              <h3 className="font-display text-[28px] text-off-white">Ground Floor Opportunity</h3>
              <p className="font-body text-[11px] text-off-white-dim leading-[2] mt-[16px]">
                Mavi Entertainment Production House is at the beginning of something national. Joining us now means growing with a platform that is building toward every major city in India. The relationships and credibility you build here compound over time.
              </p>
            </motion.div>

            {/* Block 2 */}
            <motion.div variants={itemVariants} className="flex-1 text-center px-0 md:px-[60px] pt-[60px] md:pt-0">
              <div className="text-gold text-[20px] opacity-80 mb-[24px]">◆</div>
              <h3 className="font-display text-[28px] text-off-white">Real Value Exchange</h3>
              <p className="font-body text-[11px] text-off-white-dim leading-[2] mt-[16px]">
                We do not offer exposure as payment. Every partner, artist, and collaborator in the Mavi ecosystem gets real tangible value — revenue share, credits, marketplace listings, audience access, and industry connections that actually open doors.
              </p>
            </motion.div>

            {/* Block 3 */}
            <motion.div variants={itemVariants} className="flex-1 text-center px-0 md:px-[60px] pt-[60px] md:pt-0">
              <div className="text-gold text-[20px] opacity-80 mb-[24px]">◆</div>
              <h3 className="font-display text-[28px] text-off-white">A Community That Grows</h3>
              <p className="font-body text-[11px] text-off-white-dim leading-[2] mt-[16px]">
                When you join Mavi Entertainment Production House you join a network of studios, performers, creators, and brands all moving in the same direction. The connections you make here — between events, through the marketplace, across the community — are the real long term value.
              </p>
            </motion.div>

          </div>
        </motion.div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-[#0e0e0e] border border-[rgba(201,168,76,0.15)] p-[32px] md:p-[48px] w-full max-w-[500px] relative max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-off-white-dim hover:text-gold transition-colors font-body text-xl"
              >
                ✕
              </button>

              <h3 className="font-display text-[28px] text-off-white mb-2">Apply as <span className="text-gold italic">{selectedRole}</span></h3>
              <p className="font-body text-[10px] text-off-white-dim mb-6">Fill in your details to directly contact our team.</p>

              <form className="flex flex-col gap-[16px]" onSubmit={handleSubmit}>
                
                {/* Freezed Role Input */}
                <div className="flex flex-col gap-2">
                  <span className="font-body text-[9px] text-gold tracking-widest uppercase">Applying For</span>
                  <input 
                    type="text" 
                    value={selectedRole}
                    disabled
                    className="w-full bg-[#111111] border border-[rgba(201,168,76,0.3)] text-off-white-dim font-body text-[12px] p-[14px_18px] opacity-70 cursor-not-allowed"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-[16px]">
                  <input 
                    type="text" 
                    placeholder="Your Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-[rgba(201,168,76,0.15)] text-off-white placeholder-[rgba(245,240,232,0.3)] font-body text-[12px] p-[14px_18px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] focus:ring-1 focus:ring-[rgba(201,168,76,0.6)] transition-all duration-300"
                    required
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-[rgba(201,168,76,0.15)] text-off-white placeholder-[rgba(245,240,232,0.3)] font-body text-[12px] p-[14px_18px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] focus:ring-1 focus:ring-[rgba(201,168,76,0.6)] transition-all duration-300"
                    required
                  />
                </div>

                <input 
                  type="email" 
                  placeholder="Email Address" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[rgba(201,168,76,0.15)] text-off-white placeholder-[rgba(245,240,232,0.3)] font-body text-[12px] p-[14px_18px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] focus:ring-1 focus:ring-[rgba(201,168,76,0.6)] transition-all duration-300"
                  required
                />

                {/* Conditional Portfolio Link */}
                {!['Studio Partners', 'Sponsors & Brands'].includes(selectedRole) && (
                  <input 
                    type="url" 
                    placeholder="Portfolio / Instagram Link" 
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    className="w-full bg-[#111111] border border-[rgba(201,168,76,0.15)] text-off-white placeholder-[rgba(245,240,232,0.3)] font-body text-[12px] p-[14px_18px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] focus:ring-1 focus:ring-[rgba(201,168,76,0.6)] transition-all duration-300"
                    required
                  />
                )}

                <textarea 
                  rows="4" 
                  placeholder="Tell us about yourself or your work..." 
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  className="w-full bg-[#111111] border border-[rgba(201,168,76,0.15)] text-off-white placeholder-[rgba(245,240,232,0.3)] font-body text-[12px] p-[14px_18px] resize-none focus:outline-none focus:border-[rgba(201,168,76,0.6)] focus:ring-1 focus:ring-[rgba(201,168,76,0.6)] transition-all duration-300"
                  required
                ></textarea>

                {/* Brochure and Checkbox */}
                <div className="flex flex-col gap-4 mt-2 p-4 border border-[rgba(201,168,76,0.08)] bg-[#0a0a0a]">
                  <a 
                    href={getBrochureFile(selectedRole)}
                    download 
                    className="inline-flex items-center justify-center gap-2 border border-gold bg-[rgba(201,168,76,0.05)] text-gold font-body text-[10px] tracking-[2px] uppercase p-[12px] hover:bg-gold hover:text-black-deep transition-all duration-300"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Brochure
                  </a>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-0.5">
                      <input 
                        type="checkbox" 
                        className="appearance-none w-4 h-4 border border-[rgba(201,168,76,0.4)] bg-[#111] checked:bg-gold checked:border-gold transition-all cursor-pointer"
                        checked={hasReadBrochure}
                        onChange={(e) => setHasReadBrochure(e.target.checked)}
                      />
                      {hasReadBrochure && (
                        <svg className="w-3 h-3 absolute text-black-deep pointer-events-none" viewBox="0 0 14 10" fill="none">
                          <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <span className="font-body text-[10px] text-off-white-dim group-hover:text-off-white transition-colors leading-relaxed">
                      I have explicitly read and understood the details in the brochure attached above.
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={!hasReadBrochure || isSubmitting}
                  className={`w-full font-body text-[10px] tracking-[3px] uppercase mt-2 p-[18px] transition-all duration-300 font-semibold
                    ${!hasReadBrochure || isSubmitting
                      ? "bg-[#222] text-gray-500 cursor-not-allowed border border-[#333]" 
                      : "bg-gold text-[#000000] hover:bg-[#b0923d] cursor-pointer"}`}
                >
                  {isSubmitting ? "Sending..." : submitStatus === "success" ? "Sent Successfully" : submitStatus === "error" ? "Error Sending" : "Send Message"}
                </button>

              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}