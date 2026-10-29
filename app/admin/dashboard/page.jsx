"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, registrations: 0, todayApps: 0 });
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventFilter, setSelectedEventFilter] = useState("all");
  const [viewingRegistrant, setViewingRegistrant] = useState(null);
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

      // Fetch event registrations
      const { data: regData, error: regError } = await supabase
        .from('event_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (regError) {
        console.warn("Registrations fetch notice:", regError.message);
      } else if (regData) {
        setRegistrations(regData);
        const todayStr = new Date().toISOString().split('T')[0];
        const todayCount = regData.filter(r => r.created_at && r.created_at.startsWith(todayStr)).length;
        setStats(prev => ({
          ...prev,
          registrations: regData.length,
          todayApps: todayCount
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
        setFormStatus({ 
          type: "error", 
          message: uploadError.message?.toLowerCase().includes("bucket not found")
            ? "Storage bucket 'event-images' does not exist in Supabase. Please run the setup SQL from supabase_setup.sql."
            : `Image upload failed: ${uploadError.message}` 
        });
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setFormStatus({ type: "success", message: "Image uploaded successfully to Supabase Storage!" });
      setTimeout(() => setFormStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      console.error("Upload error:", err);
      setFormStatus({ type: "error", message: `Upload error: ${err.message}` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "", message: "" });

    try {
      if (!formData.title || !formData.description || !formData.event_date) {
        setFormStatus({ type: "error", message: "Title, Description, and Event Date are required." });
        return;
      }

      const dataToSubmit = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category || 'Fashion Event',
        location: formData.location ? formData.location.trim() : null,
        event_date: formData.event_date,
        is_month_only: Boolean(formData.is_month_only),
        registration_deadline: formData.registration_deadline || null,
        preliminary_fee: formData.preliminary_fee ? Number(formData.preliminary_fee) : null,
        finale_fee: formData.finale_fee ? Number(formData.finale_fee) : null,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        status: formData.status || 'Upcoming',
        is_featured: Boolean(formData.is_featured),
        image_url: formData.image_url ? formData.image_url.trim() : null
      };

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
          message: "Database table 'events' does not exist in Supabase yet. Please run the SQL in supabase_setup.sql in your Supabase SQL Editor." 
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
      is_month_only: event.is_month_only || false,
      registration_deadline: event.registration_deadline || "",
      preliminary_fee: event.preliminary_fee || "",
      finale_fee: event.finale_fee || "",
      max_participants: event.max_participants || "",
      status: event.status || "Upcoming",
      is_featured: event.is_featured || false,
      image_url: event.image_url || ""
    });
    setEditingId(event.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event? This will also remove registrations associated with it.")) {
      await supabase.from('events').delete().eq('id', id);
      fetchDashboardData();
    }
  };

  const filteredRegistrations = selectedEventFilter === "all"
    ? registrations
    : registrations.filter(r => String(r.event_id) === String(selectedEventFilter));

  const exportRegistrationsCsv = () => {
    if (filteredRegistrations.length === 0) return;
    const headers = [
      "ID", "Event Title", "Full Name", "Email", "Age", "DOB",
      "Gender", "Category", "Social Media", "Portfolio", "Bio", "Date Registered"
    ];
    const rows = filteredRegistrations.map(r => [
      r.id,
      `"${(r.event_title || '').replace(/"/g, '""')}"`,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      r.age || '',
      r.date_of_birth || '',
      `"${(r.gender || '').replace(/"/g, '""')}"`,
      `"${(r.category || '').replace(/"/g, '""')}"`,
      `"${(r.social_media_profile || '').replace(/"/g, '""')}"`,
      `"${(r.portfolio_link || '').replace(/"/g, '""')}"`,
      `"${(r.professional_bio || '').replace(/"/g, '""')}"`,
      r.created_at ? new Date(r.created_at).toLocaleString() : ''
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations_${selectedEventFilter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      <div className="pt-[100px] px-[20px] md:px-[40px] max-w-[1240px] mx-auto">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[20px] mb-[56px]">
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
                  {dbError} Run the setup SQL in your Supabase SQL Editor to initialize tables and storage.
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

-- 2. Create event_registrations table (Event-wise)
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    event_id BIGINT REFERENCES public.events(id) ON DELETE CASCADE,
    event_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    age INTEGER,
    date_of_birth DATE,
    gender TEXT,
    category TEXT,
    social_media_profile TEXT,
    portfolio_link TEXT,
    professional_bio TEXT,
    terms_accepted BOOLEAN DEFAULT TRUE NOT NULL,
    status TEXT DEFAULT 'Pending'
);
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert on event_registrations" ON public.event_registrations FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all on event_registrations" ON public.event_registrations FOR ALL TO public USING (true) WITH CHECK (true);`}
                  </pre>
                  <p className="font-body text-[10px] text-gold/80 mt-2">
                    * The full script is in <code className="text-white">supabase_setup.sql</code>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Section: Event Registrations (Event-Wise) */}
        <div className="mb-[64px]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[10px] text-gold font-body uppercase tracking-[3px] block mb-1">
                Participant Submissions
              </span>
              <h2 className="font-display text-[32px] text-off-white">
                Event Registrations
              </h2>
            </div>

            {/* Filter by event & export */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedEventFilter}
                onChange={(e) => setSelectedEventFilter(e.target.value)}
                className="bg-[#0e0e0e] border border-gold/30 text-off-white text-xs font-body p-2.5 outline-none focus:border-gold cursor-pointer"
              >
                <option value="all">All Events ({registrations.length})</option>
                {events.map((evt) => {
                  const count = registrations.filter(r => String(r.event_id) === String(evt.id)).length;
                  return (
                    <option key={evt.id} value={evt.id}>
                      {evt.title} ({count})
                    </option>
                  );
                })}
              </select>

              {filteredRegistrations.length > 0 && (
                <button
                  type="button"
                  onClick={exportRegistrationsCsv}
                  className="bg-transparent border border-gold text-gold hover:bg-gold hover:text-black font-body text-[10px] uppercase tracking-wider px-4 py-2.5 transition-colors"
                >
                  Download CSV ({filteredRegistrations.length})
                </button>
              )}
            </div>
          </div>

          <div className="w-full overflow-x-auto border border-[rgba(201,168,76,0.1)] bg-[#0e0e0e]">
            <table className="w-full text-left border-collapse min-w-[950px]">
              <thead>
                <tr className="bg-[#111] border-b border-[rgba(201,168,76,0.1)]">
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Participant</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Event</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Category</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Age / DOB</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Gender</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase">Links</th>
                  <th className="p-[14px_20px] font-body text-[8px] text-gold tracking-[3px] uppercase text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.map((reg, index) => (
                  <tr key={reg.id} className={`border-b border-[rgba(255,255,255,0.05)] ${index % 2 === 0 ? 'bg-[#0e0e0e]' : 'bg-[#121212]'}`}>
                    <td className="p-[14px_20px]">
                      <div className="font-body text-sm text-off-white font-medium">{reg.full_name}</div>
                      <div className="font-body text-[11px] text-off-white-dim">{reg.email}</div>
                    </td>
                    <td className="p-[14px_20px] font-display text-sm text-gold">
                      {reg.event_title}
                    </td>
                    <td className="p-[14px_20px]">
                      <span className="inline-block border border-gold/40 text-gold/90 font-body text-[9px] px-2 py-0.5 uppercase tracking-wider">
                        {reg.category || 'General'}
                      </span>
                    </td>
                    <td className="p-[14px_20px] font-body text-xs text-off-white-dim">
                      {reg.age ? `${reg.age} yrs` : '—'}
                      {reg.date_of_birth && <span className="block text-[10px] text-off-white-dim/60">{reg.date_of_birth}</span>}
                    </td>
                    <td className="p-[14px_20px] font-body text-xs text-off-white-dim">
                      {reg.gender || '—'}
                    </td>
                    <td className="p-[14px_20px] font-body text-xs space-y-1">
                      {reg.social_media_profile ? (
                        <a
                          href={reg.social_media_profile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-gold hover:underline text-[11px] truncate max-w-[150px]"
                        >
                          Social Profile ↗
                        </a>
                      ) : null}
                      {reg.portfolio_link ? (
                        <a
                          href={reg.portfolio_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-off-white hover:underline text-[11px] truncate max-w-[150px]"
                        >
                          Portfolio ↗
                        </a>
                      ) : null}
                      {!reg.social_media_profile && !reg.portfolio_link && (
                        <span className="text-off-white-dim/40">—</span>
                      )}
                    </td>
                    <td className="p-[14px_20px] text-right">
                      <button
                        type="button"
                        onClick={() => setViewingRegistrant(reg)}
                        className="border border-gold/40 text-gold font-body text-[9px] uppercase px-3 py-1.5 hover:bg-gold hover:text-black transition-colors"
                      >
                        View Full
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredRegistrations.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center font-body text-xs text-off-white-dim">
                      {registrations.length === 0
                        ? "No registrations recorded yet. When users submit registration forms for events, they will appear here."
                        : "No registrations for the selected event."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: View Registrant Details */}
        {viewingRegistrant && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-[#0e0e0e] border border-gold/40 max-w-xl w-full p-6 md:p-8 text-off-white relative">
              <button
                type="button"
                onClick={() => setViewingRegistrant(null)}
                className="absolute top-4 right-4 text-off-white-dim hover:text-gold text-lg"
              >
                ✕
              </button>

              <span className="text-[10px] text-gold uppercase tracking-[3px] block mb-1 font-body">
                Registration Detail
              </span>
              <h3 className="font-display text-2xl text-off-white mb-2">
                {viewingRegistrant.full_name}
              </h3>
              <p className="font-body text-xs text-gold mb-6">
                Event: {viewingRegistrant.event_title}
              </p>

              <div className="grid grid-cols-2 gap-4 text-xs font-body mb-6 border-y border-white/10 py-4">
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Email:</span>
                  <a href={`mailto:${viewingRegistrant.email}`} className="text-off-white hover:text-gold underline">
                    {viewingRegistrant.email}
                  </a>
                </div>
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Category:</span>
                  <span>{viewingRegistrant.category || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Age / DOB:</span>
                  <span>{viewingRegistrant.age ? `${viewingRegistrant.age} years` : 'N/A'} {viewingRegistrant.date_of_birth ? `(${viewingRegistrant.date_of_birth})` : ''}</span>
                </div>
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Gender:</span>
                  <span>{viewingRegistrant.gender || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Social Media:</span>
                  {viewingRegistrant.social_media_profile ? (
                    <a href={viewingRegistrant.social_media_profile} target="_blank" rel="noopener noreferrer" className="text-gold underline truncate block">
                      {viewingRegistrant.social_media_profile}
                    </a>
                  ) : 'None'}
                </div>
                <div>
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-1">Portfolio:</span>
                  {viewingRegistrant.portfolio_link ? (
                    <a href={viewingRegistrant.portfolio_link} target="_blank" rel="noopener noreferrer" className="text-gold underline truncate block">
                      {viewingRegistrant.portfolio_link}
                    </a>
                  ) : 'None'}
                </div>
              </div>

              {viewingRegistrant.professional_bio && (
                <div className="mb-6">
                  <span className="text-off-white-dim text-[10px] uppercase tracking-wider block mb-2 font-body">Professional Bio:</span>
                  <p className="font-body text-xs text-off-white-dim bg-black/50 p-4 border border-white/5 leading-relaxed whitespace-pre-wrap">
                    {viewingRegistrant.professional_bio}
                  </p>
                </div>
              )}

              <div className="text-[10px] text-off-white-dim/60 font-body flex justify-between items-center">
                <span>Terms Accepted: {viewingRegistrant.terms_accepted ? "Yes" : "No"}</span>
                <span>Submitted: {new Date(viewingRegistrant.created_at).toLocaleString()}</span>
              </div>
            </div>
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
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
                placeholder="e.g. Runway Revolution 2026"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Description</label>
              <textarea 
                rows="4"
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                required
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold resize-none"
                placeholder="Describe the event format, categories, prizes, and stage details..."
              ></textarea>
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold appearance-none"
              >
                <option value="Fashion Event">Fashion Event</option>
                <option value="Dance Competition">Dance Competition</option>
                <option value="Talent Show">Talent Show</option>
                <option value="Audition / Workshop">Audition / Workshop</option>
                <option value="Grand Finale">Grand Finale</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Location / Venue</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
                placeholder="e.g. Siri Fort Auditorium, New Delhi"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Event Date</label>
              <input 
                type="date" 
                value={formData.event_date}
                onChange={e => setFormData({...formData, event_date: e.target.value})}
                required
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
              />
              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="monthOnly"
                  checked={formData.is_month_only}
                  onChange={e => setFormData({...formData, is_month_only: e.target.checked})}
                  className="accent-gold"
                />
                <label htmlFor="monthOnly" className="font-body text-[10px] text-off-white-dim uppercase">Show Month & Year Only (e.g. December 2026)</label>
              </div>
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Registration Deadline</label>
              <input 
                type="date" 
                value={formData.registration_deadline}
                onChange={e => setFormData({...formData, registration_deadline: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Preliminary Fee (₹)</label>
              <input 
                type="number" 
                value={formData.preliminary_fee}
                onChange={e => setFormData({...formData, preliminary_fee: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
                placeholder="e.g. 500 (leave blank for free)"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Finale Fee (₹)</label>
              <input 
                type="number" 
                value={formData.finale_fee}
                onChange={e => setFormData({...formData, finale_fee: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
                placeholder="e.g. 2000"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Max Participants</label>
              <input 
                type="number" 
                value={formData.max_participants}
                onChange={e => setFormData({...formData, max_participants: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold"
                placeholder="e.g. 50"
              />
            </div>

            <div>
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[16px] text-off-white font-body text-sm outline-none focus:border-gold appearance-none"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.is_featured}
                  onChange={e => setFormData({...formData, is_featured: e.target.checked})}
                  className="accent-gold"
                />
                <label htmlFor="featured" className="font-body text-[10px] text-gold uppercase tracking-wider">Feature this event on Homepage</label>
              </div>
            </div>

            {/* Image Upload / URL */}
            <div className="md:col-span-2 border border-dashed border-[rgba(201,168,76,0.25)] p-[24px] bg-black/40">
              <label className="block font-body text-[10px] text-gold uppercase tracking-wider mb-2">Event Cover Image</label>
              <p className="font-body text-[11px] text-off-white-dim mb-4">Upload an image file directly to Supabase Storage, or paste an external image URL below.</p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-4">
                <label className="cursor-pointer bg-gold/10 hover:bg-gold/20 text-gold border border-gold/40 px-4 py-2 font-body text-[10px] uppercase tracking-wider transition-colors inline-block">
                  {isUploading ? "Uploading..." : "Choose Image File"}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="hidden" 
                  />
                </label>
                <span className="font-body text-[10px] text-off-white-dim">or paste direct image URL below</span>
              </div>

              <input 
                type="url"
                value={formData.image_url}
                onChange={e => setFormData({...formData, image_url: e.target.value})}
                placeholder="https://example.com/event-banner.jpg"
                className="w-full bg-black border border-[rgba(201,168,76,0.2)] p-[14px] text-off-white font-body text-xs outline-none focus:border-gold"
              />

              {formData.image_url && (
                <div className="mt-4 p-3 bg-black/60 border border-gold/20 flex items-center gap-4">
                  <div className="relative w-20 h-14 bg-black flex-shrink-0 overflow-hidden border border-gold/30">
                    <Image 
                      src={formData.image_url} 
                      alt="Cover Preview" 
                      fill 
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
