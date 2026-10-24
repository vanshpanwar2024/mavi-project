"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { 
    name: "Events", 
    href: "/events",
    dropdown: [
      { name: "Upcoming Events", href: "/events/upcoming" },
      { name: "Previous Events", href: "/events/previous" }
    ]
  },
  { name: "Services", href: "/services" },
  { name: "Collaborate", href: "/collaborate" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled 
            ? "bg-[rgba(5,5,5,0.95)] backdrop-blur-md" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center group hover:scale-[1.02] transition-transform duration-300">
            <div className="relative w-36 h-14 md:w-48 md:h-16">
              <Image 
                src="/logo.png" 
                alt="Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href && link.href !== '/';
              
              if (link.dropdown) {
                return (
                  <div key={link.name} className="group relative py-6">
                    <span 
                      className="cursor-pointer relative font-body font-[300] text-sm tracking-[3px] text-off-white hover:text-white transition-colors"
                    >
                      {link.name}
                      <motion.span 
                        className={`absolute -bottom-1 left-0 h-[1px] bg-gold transition-all duration-300 origin-left ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                      />
                    </span>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="bg-[#0b0b0b] border border-[rgba(201,168,76,0.2)] p-5 flex flex-col gap-5 min-w-[200px] shadow-2xl relative">
                        <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0b0b0b] border-t border-l border-[rgba(201,168,76,0.2)] rotate-45" />
                        {link.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="font-body font-[300] text-[11px] tracking-[2px] uppercase text-off-white-dim hover:text-gold transition-colors text-center"
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link 
                  key={link.name} 
                  href={link.href}
                  className="group relative font-body font-[300] text-sm tracking-[3px] text-off-white hover:text-white transition-colors py-6"
                >
                  {link.name}
                  <motion.span 
                    className={`absolute bottom-[23px] left-0 h-[1px] bg-gold transition-all duration-300 origin-left ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Right CTA / Mobile Toggle */}
          <div className="flex items-center space-x-4">
            <Link 
              href="/events/upcoming"
              className="hidden md:inline-block border border-gold text-gold font-body text-sm uppercase tracking-wide py-2 px-6 rounded-none hover:bg-gold hover:text-black-deep transition-all duration-300"
            >
              Register Now
            </Link>
            
            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden flex flex-col space-y-1.5 p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="w-6 h-0.5 bg-gold block"></span>
              <span className="w-6 h-0.5 bg-gold block"></span>
              <span className="w-4 h-0.5 bg-gold block"></span>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-[60] bg-black-deep flex flex-col justify-center items-center"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
          >
            <button 
              className="absolute top-8 right-6 text-gold text-sm uppercase tracking-widest font-body border border-gold/30 px-4 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Close
            </button>
            
            <div className="flex flex-col space-y-8 items-center text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  {link.dropdown ? (
                    <div className="flex flex-col items-center">
                      <span className="font-display text-4xl text-off-white mb-5">
                        {link.name}
                      </span>
                      <div className="flex flex-col space-y-5 border-l border-gold/30 pl-4 py-1">
                        {link.dropdown.map((d) => (
                          <Link
                            key={d.name}
                            href={d.href}
                            className="font-body text-xs tracking-[3px] text-off-white-dim uppercase hover:text-gold transition-colors text-left"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {d.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      href={link.href}
                      className="font-display text-4xl text-off-white hover:text-gold transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="pt-8"
              >
                <Link 
                  href="/events/upcoming"
                  className="inline-block border border-gold text-gold font-body text-sm uppercase tracking-wide py-3 px-8 rounded-none hover:bg-gold hover:text-black-deep transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
