"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer 
      className="w-full z-10 relative flex flex-col"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* FOOTER UPPER SECTION */}
      <section className="w-full bg-[#080808] border-t border-[rgba(201,168,76,0.12)] py-[80px] px-[24px] md:px-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-center gap-[40px] md:gap-0 text-center md:text-left">
          
          {/* Left Column — Brand */}
          <div className="flex flex-col items-center md:items-start flex-1">
            <Link href="/" className="flex flex-col items-center md:items-start group mix-blend-screen hover:scale-[1.02] transition-transform duration-300">
              <div className="relative w-48 h-24 md:w-60 md:h-32">
                <Image 
                  src="/logo.png" 
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Center Column — Navigation */}
          <div className="flex flex-col items-center flex-1 gap-[16px] md:gap-[20px]">
            <div className="flex flex-wrap justify-center gap-[32px]">
              {['Home', 'About', 'Events', 'Services'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`}
                  className="font-body text-[10px] tracking-[2px] text-off-white-dim uppercase hover:text-gold transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-[32px]">
              {['Collaborate', 'Register Now'].map((item) => (
                <Link 
                  key={item} 
                  href={item === 'Register Now' ? '/events/upcoming' : `/${item.toLowerCase().replace(' ', '')}`}
                  className="font-body text-[10px] tracking-[2px] text-off-white-dim uppercase hover:text-gold transition-colors duration-300"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column — Contact */}
          <div className="flex flex-col items-center md:items-end flex-1">
            <div className="flex flex-col gap-[16px] items-center md:items-end mb-[20px]">
              <a 
                href="mailto:Maviproduction92@gmail.com" 
                className="font-display text-[16px] text-off-white hover:text-gold transition-colors duration-300"
              >
                Maviproduction92@gmail.com
              </a>
              <a 
                href="tel:+919217640015" 
                className="font-display text-[16px] text-off-white hover:text-gold transition-colors duration-300"
              >
                +91 92176 40015
              </a>
              <a 
                href="https://instagram.com/maviproduction92" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-display text-[16px] text-off-white hover:text-gold transition-colors duration-300"
              >
                @maviproduction92
              </a>
            </div>

            {/* Social Icons row */}
            <div className="flex gap-[20px] justify-center md:justify-end">
              <a href="https://instagram.com/maviproduction92" target="_blank" rel="noopener noreferrer" className="text-gold opacity-60 hover:opacity-100 transition-opacity duration-300" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="https://youtube.com/@maviproduction92" target="_blank" rel="noopener noreferrer" className="text-gold opacity-60 hover:opacity-100 transition-opacity duration-300" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
              </a>
              <a href="https://facebook.com/maviproduction92" target="_blank" rel="noopener noreferrer" className="text-gold opacity-60 hover:opacity-100 transition-opacity duration-300" aria-label="Facebook">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="https://wa.me/919217640015" target="_blank" rel="noopener noreferrer" className="text-gold opacity-60 hover:opacity-100 transition-opacity duration-300" aria-label="WhatsApp">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER BOTTOM BAR */}
      <section className="w-full bg-[#050505] border-t border-[rgba(201,168,76,0.08)] py-[24px] px-[24px] md:px-[60px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-[40px] md:gap-0">
          
          <div className="font-body text-[8px] text-off-white-dim tracking-[1px] order-3 md:order-1 text-center md:text-left">
            &copy; 2026 Mavi Entertainment Production House. All Rights Reserved.
          </div>

          <div className="text-gold opacity-40 text-[12px] order-1 md:order-2">
            ◆
          </div>

          <div className="flex flex-col md:flex-row items-center gap-[16px] order-2 md:order-3">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Use', href: '/terms-of-use' }
            ].map((link, idx) => (
              <div key={link.label} className="flex items-center gap-[16px]">
                <Link 
                  href={link.href}
                  className="font-body text-[8px] text-off-white-dim uppercase tracking-[1px] hover:text-gold transition-colors duration-300"
                >
                  {link.label}
                </Link>
                {/* Visual separator on desktop only, hidden on last item */}
                {idx < 1 && <span className="hidden md:block text-off-white-dim opacity-20 text-[8px]">—</span>}
              </div>
            ))}
          </div>

        </div>
      </section>
    </motion.footer>
  );
}
