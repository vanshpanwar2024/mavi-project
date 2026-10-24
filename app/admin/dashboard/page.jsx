"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, registrations: 0, todayApps: 0 });
  const [events, setEvents] = useState([]);
  const [dbError, setDbError] = useState(null);
  const [showSqlGuide, setShowSqlGuide] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Fashion Event",
    location: "",
    event_date: "",
    is_month_only: false,
    registration_deadline: "",
    preliminary_fee: "",
    finale_fee: "",
    max_participants: "",
    status: "Upcoming",
    is_featured: false,
    image_url: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [formStatus, setFormStatus] = useState({ type: "", message: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/admin/login");
      } else {
        fetchDashboardData();
      }
    };
    checkAuth();
  }, [router]);

  const fetchDashboardData = async () => {
    try {
      const { data: eventsData, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false });
        
      if (error) {
        console.error("Error fetching events:", error);
        if (error.code === 'PGRST205' || error.message?.toLowerCase().includes("could not find the table") || error.message?.toLowerCase().includes("does not exist")) {
          setDbError("Database table 'events' has not been created yet in your Supabase project.");
        } else {
          setDbError(error.message);
        }
        return;
      }

      setDbError(null);
      if (eventsData) {
        setEvents(eventsData);
        setStats(prev => ({
          ...prev,
          total: eventsData.length,
          upcoming: eventsData.filter(e => e.status === 'Upcoming').length
        }));
      }
    } catch (err) {
      console.error("Fetch dashboard error:", err);
      setDbError(err.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormStatus({ type: "", message: "" });
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16);
    const filePath = `${Date.now()}_${cleanName}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
        if (uploadError.message?.toLowerCase().includes('bucket not found') || uploadError.statusCode === '404') {
          throw new Error("Storage bucket 'event-images' does not exist in Supabase yet. Please run the setup script in Supabase, or paste an image URL directly into the field below.");
        }
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
      setFormStatus({ type: "success", message: "Cover image uploaded successfully!" });
    } catch (error) {
      console.error('Error uploading image:', error);
      setFormStatus({ type: "error", message: error.message || "Failed to upload image." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "", message: "" });

    if (!formData.title?.trim()) {
      setFormStatus({ type: "error", message: "Event Title is required." });
      return;
    }
    if (!formData.event_date) {
      setFormStatus({ type: "error", message: "Event Date is required." });
      return;
    }

    try {
      // Create a clean, typed object for Supabase
      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description?.trim() || "",
        category: formData.category || "Fashion Event",
        location: formData.location?.trim() || null,
        event_date: formData.event_date,
        is_month_only: Boolean(formData.is_month_only),
        status: formData.status || "Upcoming",
        is_featured: Boolean(formData.is_featured),
        image_url: formData.image_url?.trim() || null,
        registration_deadline: formData.registration_deadline || null,
        preliminary_fee: formData.preliminary_fee !== "" && formData.preliminary_fee !== null ? Number(formData.preliminary_fee) : null,
        finale_fee: formData.finale_fee !== "" && formData.finale_fee !== null ? Number(formData.finale_fee) : null,
        max_participants: formData.max_participants !== "" && formData.max_participants !== null ? parseInt(formData.max_participants, 10) : null,
      };

      console.log("Submitting event data:", dataToSubmit);

      if (editingId) {
        const { error } = await supabase
          .from('events')
          .update(dataToSubmit)
          .eq('id', editingId);
        if (error) throw error;
        setFormStatus({ type: "success", message: "Event updated successfully." });
      } else {
        const { error } = await supabase
          .from('events')
          .insert([dataToSubmit]);
        if (error) throw error;
        setFormStatus({ type: "success", message: "Event published successfully! It is now live on the Events page." });
      }
      
      // Reset form
      setFormData({
        title: "", description: "", category: "Fashion Event", location: "",
        event_date: "", is_month_only: false, registration_deadline: "", preliminary_fee: "", finale_fee: "",
        max_participants: "", status: "Upcoming", is_featured: false, image_url: ""
      });
      setEditingId(null);
      fetchDashboardData();
      
      setTimeout(() => setFormStatus({ type: "", message: "" }), 6000);
    } catch (error) {
      console.error("Error saving event:", error);
      if (error.code === 'PGRST205' || error.message?.toLowerCase().includes("could not find the table") || error.message?.toLowerCase().includes("does not exist")) {
        setFormStatus({ 
          type: "error", 
          message: "Database table 'events' does not exist in Supabase yet. Please run the SQL in supabase_setup.sql in your Supabase SQL Editor (see guide banner above)." 
        });
        setDbError("Database table 'events' has not been created yet in your Supabase project.");
      } else {
        setFormStatus({ type: "error", message: `Failed to save event: ${error.message || JSON.stringify(error)}` });
      }
    }
  };

  const handleEdit = (event) => {
    setFormData({
      title: event.title || "",
      description: event.description || "",
      category: event.category || "Fashion Event",
      location: event.location || "",
      event_date: event.event_date || "",
      is_month_only: event.is_month_only || false, // Should be fetched from DB
      registration_deadline: event.registration_deadline || "",
      preliminary_fee: event.preliminary_fee || "",
      finale_fee: event.finale_fee || "",
      max_participants: event.max_participants || "",
      status: event.status || "Upcoming",
      is_featured: event.is_featured || false,
      image_url: event.image_url || ""
    });
    setEditingId(event.id);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event? This cannot be undone.")) {
      await supabase.from('events').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#050505] pb-[100px]">
      {/* Top Navbar */}
      <nav className="w-full bg-[#0e0e0e] border-b border-[rgba(201,168,76,0.15)] p-[20px_40px] flex items-center justify-between z-50 fixed top-0">
        <div className="relative w-28 h-10">
          <Image
            src="/logo.png"
            alt="Logo"
            fill
            className="object-contain"
          />
        </div>
        <div className="font-body text-[10px] text-gold tracking-[3px] uppercase">Admin Dashboard</div>
        <button 
          onClick={handleLogout}
          className="border border-gold text-gold font-body text-[9px] uppercase tracking-wider py-2 px-4 hover:bg-gold hover:text-black-deep transition-all"
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <div className="pt-[100px] px-[40px] max-w-[1240px] mx-auto">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px] mb-[56px]">
          {[
            { label: "Total Events", value: stats.total },
            { label: "Upcoming Events", value: stats.upcoming },
            { label: "Total Registrations", value: stats.registrations },
            { label: "New Apps (Today)", value: stats.todayApps },
          ].map((stat, i) => (
            <div key={i} className="relative bg-[#0e0e0e] border border-[rgba(201,168,76,0.1)] p-[24px]">
              <div className="absolute top-0 left-0 w-[8px] h-[8px] border-t border-l border-gold m-[4px]" />
              <div className="absolute bottom-0 right-0 w-[8px] h-[8px] border-b border-r border-gold m-[4px]" />
              <h3 className="font-body text-[10px] text-off-white-dim uppercase tracking-wider mb-2">{stat.label}</h3>
              <p className="font-display text-[32px] text-gold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Setup / DB Warning Banner */}
        {dbError && (
          <div className="relative bg-[#1c1408] border border-gold/40 p-6 mb-8 text-off-white">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gold text-lg">⚠️</span>
                  <h3 className="font-display text-lg text-gold tracking-wide">Supabase Database Setup Required</h3>
                </div>
                <p className="font-body text-xs text-off-white/80 leading-relaxed max-w-2xl">
                  {dbError} You need to run the database setup script in your Supabase SQL Editor to create the <code className="text-gold bg-black/40 px-1 py-0.5 rounded">events</code> table and <code className="text-gold bg-black/40 px-1 py-0.5 rounded">event-images</code> storage bucket.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlGuide(!showSqlGuide)}
                className="bg-gold text-black px-4 py-2 font-body text-[10px] tracking-wider uppercase hover:bg-off-white transition-all whitespace-nowrap self-start md:self-center"
              >
                {showSqlGuide ? "Hide Setup Script" : "View Setup SQL"}
              </button>
            </div>

            {showSqlGuide && (
              <div className="mt-4 pt-4 border-t border-gold/20">
                <p className="font-body text-[11px] text-off-white-dim mb-3">
                  Open your <a href="https://supabase.com/dashboard/project/jgppzmnzknikwyahuqig/sql" target="_blank" rel="noopener noreferrer" className="text-gold underline hover:text-white">Supabase SQL Editor</a>, paste the SQL below, and click <strong>Run</strong>:
                </p>
                <div className="relative">
                  <pre className="bg-black/80 border border-gold/20 p-4 font-mono text-[10px] text-off-white-dim max-h-60 overflow-y-auto selection:bg-gold selection:text-black">
{`-- 1. Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'Fashion Event',
    location TEXT,
    event_date DATE NOT NULL,
    is_month_only BOOLEAN DEFAULT FALSE,
    registration_deadline DATE,
    preliminary_fee NUMERIC,
    finale_fee NUMERIC,
    max_participants INTEGER,
    status TEXT DEFAULT 'Upcoming',
    is_featured BOOLEAN DEFAULT FALSE,
    image_url TEXT
);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow all on events" ON public.events FOR ALL USING (true) WITH CHECK (true);

-- 2. Create Public Storage Bucket 'event-images'
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true) ON CONFLICT (id) DO UPDATE SET public = true;
CREATE POLICY "Allow public view on event-images" ON storage.objects FOR SELECT USING (bucket_id = 'event-images');
CREATE POLICY "Allow upload on event-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'event-images');
CREATE POLICY "Allow update on event-images" ON storage.objects FOR UPDATE USING (bucket_id = 'event-images');
CREATE POLICY "Allow delete on event-images" ON storage.objects FOR DELETE USING (bucket_id = 'event-images');`}
                  </pre>
                  <p className="font-body text-[10px] text-gold/80 mt-2">
                    * The complete script is also saved in your project root at <code className="text-white">supabase_setup.sql</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Form Section */}
        <h2 className="font-display text-[32px] text-off-white mb-[32px]">
          {editingId ? "Edit Event" : "Add New Event"}
        </h2>
        
        <div className="relative bg-[#0e0e0e] border border-[rgba(201,168,76,0.12)] p-[32px] md:p-[48px] mb-[56px]">
          <div className="absolute top-0 left-0 w-[12px] h-[12px] border-t border-l border-gold m-[4px]" />
          <div className="absolute bottom-0 right-0 w-[12px] h-[12px] border-b border-r border-gold m-[4px]" />
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
            
            <div className="md:col-span-2">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Event Title</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Short Description</label>
              <textarea 
                rows={3} 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] resize-none focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              >
                <option value="Fashion Event">Fashion Event</option>
                <option value="Dance Competition">Dance Competition</option>
                <option value="Both">Both</option>
                <option value="Grand Finale">Grand Finale</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Location</label>
              <input 
                type="text" 
                placeholder="Venue name, City"
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Event Date</label>
              
              {/* Toggle Event Date Type: Exact Date vs Month Only */}
              <div className="flex gap-4 mb-3">
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="dateType" 
                      checked={!formData.is_month_only} 
                      onChange={() => setFormData({...formData, is_month_only: false, event_date: ''})}
                      className="accent-gold"
                    />
                    <span className="text-off-white text-[10px] uppercase">Exact Date</span>
                 </label>
                 <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="dateType" 
                      checked={formData.is_month_only} 
                      onChange={() => setFormData({...formData, is_month_only: true, event_date: ''})}
                      className="accent-gold"
                    />
                    <span className="text-off-white text-[10px] uppercase">Month Only</span>
                 </label>
              </div>

              {formData.is_month_only ? (
                 <input 
                  type="month" 
                  value={formData.event_date ? formData.event_date.slice(0, 7) : ''}
                  onChange={e => setFormData({...formData, event_date: `${e.target.value}-01`})} // Store as 1st of month
                  required
                  className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
                  style={{ colorScheme: "dark" }}
                />
              ) : (
                <input 
                  type="date" 
                  value={formData.event_date}
                  onChange={e => setFormData({...formData, event_date: e.target.value})}
                  required
                  className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
                  style={{ colorScheme: "dark" }}
                />
              )}
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Registration Deadline</label>
              <input 
                type="date" 
                value={formData.registration_deadline}
                onChange={e => setFormData({...formData, registration_deadline: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Preliminary Fee (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 399"
                value={formData.preliminary_fee}
                onChange={e => setFormData({...formData, preliminary_fee: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Finale Fee (₹)</label>
              <input 
                type="number" 
                placeholder="e.g. 1499"
                value={formData.finale_fee}
                onChange={e => setFormData({...formData, finale_fee: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Max Participants</label>
              <input 
                type="number" 
                value={formData.max_participants}
                onChange={e => setFormData({...formData, max_participants: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[14px_18px] font-body text-[12px] focus:outline-none focus:border-[rgba(201,168,76,0.6)] transition-all"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-center gap-[16px]">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider">Featured Event</label>
              <div 
                className={`w-[44px] h-[24px] rounded-full p-[2px] cursor-pointer transition-colors ${formData.is_featured ? 'bg-gold' : 'bg-[#333]'}`}
                onClick={() => setFormData({...formData, is_featured: !formData.is_featured})}
              >
                <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-md transform transition-transform ${formData.is_featured ? 'translate-x-[20px]' : 'translate-x-0'}`} />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Cover Image</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Option A: File Upload */}
                <div className="bg-[#111] border border-[rgba(201,168,76,0.15)] p-4">
                  <span className="block font-body text-[9px] uppercase tracking-wider text-gold/80 mb-2">
                    Option 1: Upload from Device
                  </span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="w-full text-off-white text-[11px] file:mr-3 file:py-2 file:px-3 file:rounded-none file:border-0 file:text-[9px] file:font-body file:uppercase file:tracking-wider file:bg-gold file:text-black hover:file:bg-off-white file:cursor-pointer cursor-pointer focus:outline-none"
                  />
                  {isUploading && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="w-2 h-2 rounded-full bg-gold animate-ping" />
                      <p className="text-gold text-[10px] font-body">Uploading to Supabase Storage...</p>
                    </div>
                  )}
                </div>

                {/* Option B: Direct URL Input */}
                <div className="bg-[#111] border border-[rgba(201,168,76,0.15)] p-4">
                  <span className="block font-body text-[9px] uppercase tracking-wider text-gold/80 mb-2">
                    Option 2: Direct Image URL
                  </span>
                  <input 
                    type="url"
                    placeholder="https://images.unsplash.com/... or storage link"
                    value={formData.image_url}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    className="w-full bg-[#0a0a0a] border border-[rgba(201,168,76,0.15)] text-off-white p-[10px_14px] font-body text-[11px] focus:outline-none focus:border-gold transition-all"
                  />
                </div>
              </div>

              {/* Cover Image Preview */}
              {formData.image_url && (
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#111] p-3 border border-gold/30">
                  <div className="relative w-[160px] h-[100px] border border-gold/40 shrink-0 overflow-hidden">
                    <Image 
                      src={formData.image_url} 
                      alt="Preview" 
                      fill 
                      sizes="160px"
                      className="object-cover" 
                      unoptimized={formData.image_url.startsWith('http')}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] text-gold uppercase tracking-wider block font-body">Active Cover Image:</span>
                    <p className="font-mono text-[10px] text-off-white-dim truncate">{formData.image_url}</p>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                      className="mt-2 text-red-400 hover:text-red-300 font-body text-[9px] uppercase tracking-wider underline cursor-pointer"
                    >
                      Remove Cover Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="md:col-span-2 mt-[16px]">
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full bg-gold text-black-deep font-body text-[10px] tracking-[3px] uppercase p-[18px] hover:bg-off-white transition-colors duration-300 disabled:opacity-50"
              >
                {editingId ? "Update Event" : "Publish Event"}
              </button>
              
              {formStatus.message && (
                <p className={`mt-4 font-body text-[11px] text-center ${formStatus.type === 'error' ? 'text-red-400' : 'text-gold'}`}>
                  {formStatus.message}
                </p>
              )}
            </div>
          </form>
        </div>

        {/* Existing Events Table */}
        <h2 className="font-display text-[32px] text-off-white mb-[32px]">Manage Events</h2>
        
        <div className="w-full overflow-x-auto border border-[rgba(201,168,76,0.1)] bg-[#0e0e0e]">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#111] border-b border-[rgba(201,168,76,0.1)]">
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase">Event Title</th>
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase">Category</th>
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase">Date</th>
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase">Status</th>
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase text-center">Featured</th>
                <th className="p-[16px_24px] font-body text-[8px] text-gold tracking-[3px] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.id} className={`border-b border-[rgba(255,255,255,0.05)] ${index % 2 === 0 ? 'bg-[#0e0e0e]' : 'bg-[#121212]'}`}>
                  <td className="p-[16px_24px] font-display text-[16px] text-off-white">{event.title}</td>
                  <td className="p-[16px_24px]">
                    <span className="inline-block border border-gold text-gold font-body text-[9px] px-[8px] py-[2px] rounded-full">
                      {event.category}
                    </span>
                  </td>
                  <td className="p-[16px_24px] font-body text-[11px] text-off-white-dim">
                    {new Date(event.event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="p-[16px_24px]">
                    <span className={`font-body text-[10px] px-[8px] py-[3px] rounded-sm ${
                      event.status === 'Upcoming' ? 'bg-[rgba(50,200,100,0.1)] text-[#50d880]' :
                      event.status === 'Ongoing' ? 'bg-[rgba(201,168,76,0.1)] text-gold' :
                      'bg-[rgba(150,150,150,0.1)] text-[#aaaaaa]'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-[16px_24px] text-center">
                    {event.is_featured ? <span className="text-gold text-[16px]">★</span> : ""}
                  </td>
                  <td className="p-[16px_24px] text-right space-x-3">
                    <button 
                      onClick={() => handleEdit(event)}
                      className="border border-gold text-gold font-body text-[8px] uppercase px-[12px] py-[4px] hover:bg-gold hover:text-black transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(event.id)}
                      className="border border-red-500 text-red-500 font-body text-[8px] uppercase px-[12px] py-[4px] hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-[32px] text-center font-body text-[12px] text-off-white-dim">
                    No events found. Create your first event above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </main>
  );
}