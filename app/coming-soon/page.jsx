export default function ComingSoon() {
  return (
    <main className="w-full h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden text-center px-6">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="font-display text-[15vw] text-white opacity-[0.03] tracking-widest whitespace-nowrap select-none">
          MAVI
        </h1>
      </div>

      <div className="relative z-10">
        <h1 className="font-display text-[clamp(40px,8vw,80px)] text-off-white mb-4">
          Coming <span className="italic text-gold font-[300]">Soon</span>.
        </h1>
        <p className="font-body text-[12px] text-off-white-dim uppercase tracking-[3px] max-w-[600px] mx-auto">
          We are currently working on this feature. Stay tuned.
        </p>
      </div>
    </main>
  );
}