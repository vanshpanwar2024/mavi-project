"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors
    
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        console.error("Login error:", authError);
        setError(authError.message || "An error occurred during login");
      } else {
        router.refresh();
        router.push("/admin/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Network error: Please check your connection or configuration.");
    }
  };

  return (
    <main className="w-full h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="relative bg-[#0e0e0e] border border-[rgba(201,168,76,0.2)] p-[56px_48px] w-full max-w-[420px] flex flex-col items-center">
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-[15px] h-[15px] border-t border-l border-gold m-[10px]" />
        <div className="absolute top-0 right-0 w-[15px] h-[15px] border-t border-r border-gold m-[10px]" />
        <div className="absolute bottom-0 left-0 w-[15px] h-[15px] border-b border-l border-gold m-[10px]" />
        <div className="absolute bottom-0 right-0 w-[15px] h-[15px] border-b border-r border-gold m-[10px]" />

        {/* Logo */}
        <div className="relative w-44 h-20 mix-blend-screen">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Separator */}
        <div className="w-[6px] h-[6px] rotate-45 bg-gold my-6 opacity-80" />

        <h1 className="font-display text-[28px] text-off-white mb-2 text-center">Admin Access</h1>
        <p className="font-body text-[10px] text-off-white-dim text-center mb-6">Mavi Entertainment Production House internal dashboard</p>

        <div className="w-full h-[1px] bg-gold opacity-30 mb-[24px]" />

        <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] rounded-none font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] rounded-none font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-gold text-black-deep mt-[8px] p-[16px] font-body text-[9px] tracking-[3px] uppercase rounded-none hover:bg-off-white transition-colors duration-300"
          >
            Access Dashboard
          </button>
        </form>

        {error && (
          <div className="mt-4 w-full bg-red-900/20 border border-red-500/30 p-2 flex items-center justify-center">
            <p className="font-body text-[10px] text-red-400 tracking-wide text-center">
              {error}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}