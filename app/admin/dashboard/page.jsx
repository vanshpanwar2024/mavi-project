"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({ total: 0, upcoming: 0, registrations: 0, todayApps: 0 });
  const [events, setEvents] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Fashion Event",
    location: "",
    event_date: "",
    is_month_only: false, // Added state for month-only toggle
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
    // Fetch events
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
      
    if (eventsData) {
      setEvents(eventsData);
      setStats(prev => ({
        ...prev,
        total: eventsData.length,
        upcoming: eventsData.filter(e => e.status === 'Upcoming').length
      }));
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: data.publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      setFormStatus({ type: "error", message: "Failed to upload image." });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ type: "", message: "" });

    try {
      // Create a clean object for submission
      const dataToSubmit = { ...formData };
      
      // Remove empty strings for numeric/date fields to avoid type errors in Supabase
      if (!dataToSubmit.preliminary_fee) delete dataToSubmit.preliminary_fee;
      if (!dataToSubmit.finale_fee) delete dataToSubmit.finale_fee;
      if (!dataToSubmit.max_participants) delete dataToSubmit.max_participants;
      if (!dataToSubmit.registration_deadline) delete dataToSubmit.registration_deadline;
      
      console.log("Submitting data:", dataToSubmit); // Debug log

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
        setFormStatus({ type: "success", message: "Event published successfully. It is now live on the Events page." });
      }
      
      // Reset form
      setFormData({
        title: "", description: "", category: "Fashion Event", location: "",
        event_date: "", is_month_only: false, registration_deadline: "", preliminary_fee: "", finale_fee: "",
        max_participants: "", status: "Upcoming", is_featured: false, image_url: ""
      });
      setEditingId(null);
      fetchDashboardData();
      
      setTimeout(() => setFormStatus({ type: "", message: "" }), 5000);
    } catch (error) {
      console.error("Error saving event:", error);
      setFormStatus({ type: "error", message: `Failed to save event: ${error.message}` });
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
        <div className="relative w-28 h-10 mix-blend-screen">
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
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full bg-[#111] border border-[rgba(201,168,76,0.15)] text-off-white p-[10px] font-body text-[12px] file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[10px] file:font-body file:uppercase file:tracking-wider file:bg-[rgba(201,168,76,0.1)] file:text-gold hover:file:bg-[rgba(201,168,76,0.2)] focus:outline-none"
              />
              {isUploading && <p className="text-gold text-[10px] mt-2 font-body">Uploading...</p>}
              {formData.image_url && (
                <div className="mt-4 border border-[rgba(201,168,76,0.3)] inline-block p-1">
                  <div className="relative w-[200px] h-[150px]">
                    <Image 
                      src={formData.image_url} 
                      alt="Preview" 
                      fill 
                      sizes="200px"
                      className="object-cover" 
                    />
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