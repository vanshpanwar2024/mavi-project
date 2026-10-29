"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function EventRegistrationModal({ event, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    category: "",
    socialMediaProfile: "",
    portfolioLink: "",
    professionalBio: "",
    termsAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState("");

  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      age: "",
      dateOfBirth: "",
      gender: "",
      category: "",
      socialMediaProfile: "",
      portfolioLink: "",
      professionalBio: "",
      termsAccepted: false,
    });
    setSubmitStatus(null);
    setErrorMessage("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const formatDobForDb = (dobString) => {
    if (!dobString) return null;
    const trimmed = dobString.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parts = trimmed.split(/[\/\-]/);
    if (parts.length === 3) {
      if (parts[0].length === 4) {
        return `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
      }
      const month = parts[0].padStart(2, "0");
      const day = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return trimmed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event) return;

    if (!formData.termsAccepted) {
      setErrorMessage("Please accept the legal terms to proceed.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const payload = {
        event_id: event.id,
        event_title: event.title,
        full_name: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        date_of_birth: formatDobForDb(formData.dateOfBirth),
        gender: formData.gender,
        category: formData.category,
        social_media_profile: formData.socialMediaProfile.trim() || null,
        portfolio_link: formData.portfolioLink.trim() || null,
        professional_bio: formData.professionalBio.trim() || null,
        terms_accepted: formData.termsAccepted,
        status: "Pending",
      };

      const { error } = await supabase
        .from("event_registrations")
        .insert([payload]);

      if (error) {
        console.error("Supabase registration error:", error);
        if (
          error.code === "PGRST205" ||
          error.message?.toLowerCase().includes("does not exist") ||
          error.message?.toLowerCase().includes("could not find the table")
        ) {
          setErrorMessage(
            "Database table 'event_registrations' has not been created yet in Supabase. Please run the setup SQL from supabase_setup.sql in your Supabase SQL Editor."
          );
        } else {
          setErrorMessage(error.message || "Failed to submit registration. Please try again.");
        }
        setSubmitStatus("error");
      } else {
        setSubmitStatus("success");
      }
    } catch (err) {
      console.error("Registration submission error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !event) return null;

  const eventDateFormatted = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Compact Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative w-full max-w-lg max-h-[90vh] bg-[#0c0c0c] border border-[rgba(201,168,76,0.35)] shadow-[0_0_40px_rgba(0,0,0,0.95)] text-off-white z-10 flex flex-col rounded-none overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Decorative Gold Accent Line */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold to-transparent flex-shrink-0" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center border border-[rgba(201,168,76,0.25)] text-off-white-dim hover:text-gold hover:border-gold transition-colors z-20 group"
            aria-label="Close modal"
          >
            <span className="text-sm leading-none transform group-hover:rotate-90 transition-transform duration-200">
              ✕
            </span>
          </button>

          {/* Compact Modal Header */}
          <div className="px-5 py-3.5 md:px-6 md:py-4 border-b border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[#141414] to-[#0c0c0c] flex-shrink-0 pr-12">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] uppercase tracking-[2.5px] text-gold font-body">
                Event Registration
              </span>
              <span className="w-6 h-[1px] bg-gold/40" />
            </div>

            <h2 className="font-display text-xl md:text-2xl text-off-white leading-snug line-clamp-1">
              {event.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[10px] font-body text-off-white-dim">
              {eventDateFormatted && (
                <span className="flex items-center gap-1">
                  <span className="text-gold">📅</span> {eventDateFormatted}
                </span>
              )}
              {event.location && (
                <span className="flex items-center gap-1 truncate max-w-[180px]">
                  <span className="text-gold">📍</span> {event.location}
                </span>
              )}
              {event.category && (
                <span className="text-[9px] tracking-wider text-gold/90 border border-gold/25 px-1.5 py-0.2 uppercase">
                  {event.category}
                </span>
              )}
              {event.preliminary_fee !== undefined && event.preliminary_fee !== null && (
                <span className="text-[9px] tracking-wider text-off-white/80 bg-white/5 border border-white/10 px-1.5 py-0.2 uppercase">
                  {Number(event.preliminary_fee) > 0 ? `₹${event.preliminary_fee}` : "Free"}
                </span>
              )}
            </div>
          </div>

          {/* Modal Scrollable Body */}
          <div className="p-5 md:p-6 overflow-y-auto flex-1 custom-modal-scroll">
            {submitStatus === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 px-2 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-full border border-gold flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(201,168,76,0.3)]">
                  <span className="text-gold text-xl">✓</span>
                </div>
                <span className="text-[9px] uppercase tracking-[3px] text-gold font-body mb-1">
                  Registration Confirmed
                </span>
                <h3 className="font-display text-2xl text-off-white mb-2">
                  You&apos;re Registered!
                </h3>
                <p className="font-body text-xs text-off-white-dim max-w-sm leading-relaxed mb-6">
                  Thank you, <span className="text-off-white font-medium">{formData.fullName}</span>. We&apos;ve recorded your details for{" "}
                  <span className="text-gold italic">{event.title}</span>. Our team will review your application and contact you at{" "}
                  <span className="text-off-white">{formData.email}</span>.
                </p>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-gold text-black-deep font-body text-[11px] uppercase tracking-[2.5px] font-semibold hover:bg-off-white transition-all shadow-[0_0_15px_rgba(201,168,76,0.3)]"
                >
                  Done
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                {errorMessage && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-200 text-[11px] font-body leading-relaxed flex items-start gap-2">
                    <span className="text-red-400 text-xs mt-0.5">⚠️</span>
                    <div className="flex-1">{errorMessage}</div>
                  </div>
                )}

                {/* Row 1: Full Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Full Name <span className="text-gold">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Your Full Name"
                      required
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Email Address <span className="text-gold">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full"
                    />
                  </div>
                </div>

                {/* Row 2: Age & Date of Birth */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Age <span className="text-gold">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      min="1"
                      max="120"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="e.g. 21"
                      required
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1 flex justify-between items-center">
                      <span>Date of Birth <span className="text-gold">*</span></span>
                      <span className="text-[8px] text-off-white-dim/50 normal-case tracking-normal">mm/dd/yyyy</span>
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      placeholder="mm/dd/yyyy"
                      required
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 rounded-none w-full [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Row 3: Gender & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Gender <span className="text-gold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 rounded-none w-full appearance-none cursor-pointer pr-8"
                      >
                        <option value="" disabled className="bg-[#111] text-off-white-dim">
                          Select Gender
                        </option>
                        <option value="Female" className="bg-[#111]">Female</option>
                        <option value="Male" className="bg-[#111]">Male</option>
                        <option value="Non-Binary" className="bg-[#111]">Non-Binary</option>
                        <option value="Other" className="bg-[#111]">Other</option>
                        <option value="Prefer not to say" className="bg-[#111]">Prefer not to say</option>
                      </select>
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gold/70 pointer-events-none text-[10px]">
                        ▼
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Category <span className="text-gold">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 rounded-none w-full appearance-none cursor-pointer pr-8"
                      >
                        <option value="" disabled className="bg-[#111] text-off-white-dim">
                          Select Category
                        </option>
                        {event.category && (
                          <option value={event.category} className="bg-[#111] text-gold">
                            {event.category} (Event Specific)
                          </option>
                        )}
                        <option value="Fashion / Runway Model" className="bg-[#111]">Fashion / Runway Model</option>
                        <option value="Dance / Choreography" className="bg-[#111]">Dance / Choreography</option>
                        <option value="Acting / Theatre" className="bg-[#111]">Acting / Theatre</option>
                        <option value="Music / Singing" className="bg-[#111]">Music / Singing</option>
                        <option value="Photography / Videography" className="bg-[#111]">Photography / Videography</option>
                        <option value="Styling / Makeup Artist" className="bg-[#111]">Styling / Makeup Artist</option>
                        <option value="Other" className="bg-[#111]">Other</option>
                      </select>
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gold/70 pointer-events-none text-[10px]">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>

                {/* Row 4: Social Media Profile & Portfolio Link (Side by side for neatness) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Social Media Profile
                    </label>
                    <input
                      type="url"
                      name="socialMediaProfile"
                      value={formData.socialMediaProfile}
                      onChange={handleChange}
                      placeholder="https://instagram.com/..."
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full"
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                      Portfolio Link
                    </label>
                    <input
                      type="url"
                      name="portfolioLink"
                      value={formData.portfolioLink}
                      onChange={handleChange}
                      placeholder="https://yourportfolio.com"
                      className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full"
                    />
                  </div>
                </div>

                {/* Row 5: Professional Bio */}
                <div className="flex flex-col">
                  <label className="font-body text-[9px] uppercase tracking-[1.5px] text-off-white-dim mb-1">
                    Professional Bio
                  </label>
                  <textarea
                    rows="2"
                    name="professionalBio"
                    value={formData.professionalBio}
                    onChange={handleChange}
                    placeholder="Tell us a bit about your experience and background..."
                    className="bg-[#050505] border border-[rgba(201,168,76,0.25)] text-off-white py-2 px-3 font-body text-xs outline-none focus:border-gold transition-colors duration-200 placeholder:text-off-white-dim/35 rounded-none w-full resize-none"
                  />
                </div>

                {/* Legal Terms Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer group select-none">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      required
                      className="mt-0.5 h-3.5 w-3.5 rounded-none accent-gold border-[rgba(201,168,76,0.4)] bg-[#050505] cursor-pointer flex-shrink-0"
                    />
                    <span className="font-body text-[11px] text-off-white-dim leading-snug group-hover:text-off-white transition-colors">
                      I accept the legal terms and confirm that the information I provide is accurate.
                    </span>
                  </label>
                </div>

                {/* Complete Registration Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.termsAccepted}
                  className={`mt-2 w-full font-body text-[10px] font-bold uppercase tracking-[3px] py-3 transition-all duration-200 rounded-none flex items-center justify-center gap-2
                    ${
                      isSubmitting || !formData.termsAccepted
                        ? "bg-[#181818] text-off-white-dim/40 border border-[#262626] cursor-not-allowed"
                        : "bg-gold text-black-deep hover:bg-off-white hover:text-black shadow-[0_0_15px_rgba(201,168,76,0.2)] hover:shadow-[0_0_25px_rgba(201,168,76,0.4)] cursor-pointer"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-black-deep border-t-transparent rounded-full animate-spin" />
                      <span>Completing Registration...</span>
                    </>
                  ) : (
                    <span>Complete Registration</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .custom-modal-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .custom-modal-scroll::-webkit-scrollbar-track {
          background: #080808;
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb {
          background: rgba(201, 168, 76, 0.35);
        }
        .custom-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(201, 168, 76, 0.7);
        }
      `}</style>
    </AnimatePresence>
  );
}
