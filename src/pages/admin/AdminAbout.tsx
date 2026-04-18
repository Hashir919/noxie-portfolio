import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';
import { uploadImage } from '../../lib/uploadImage';
import { Upload } from 'lucide-react';

export default function AdminAbout() {
  const { about, updateAbout } = useStore();
  const [formData, setFormData] = useState(about);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(about);
  }, [about]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0]);
      if (url) {
        setFormData({ ...formData, profile_image: url });
      }
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateAbout(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert('Failed to save');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl max-h-screen">
      <h2 className="text-4xl font-display font-bold mb-8">About Page Content</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 glass-card p-10 rounded-[40px]">
        <div>
          <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Heading</label>
          <input type="text" name="heading" value={formData.heading} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main" />
        </div>
        
        <div>
          <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Bio Text</label>
          <textarea rows={4} name="bio_text" value={formData.bio_text} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main resize-none" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div>
              <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Experience</label>
              <input type="text" name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main" />
           </div>
           <div>
              <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Clients</label>
              <input type="text" name="clients" value={formData.clients} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main" />
           </div>
        </div>

        <div>
           <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Profile Image</label>
           <div className="border-2 border-dashed border-text-dim/20 rounded-xl p-8 flex flex-col items-center justify-center relative hover:bg-black/5 transition-all max-w-sm">
              {formData.profile_image ? (
                 <img src={formData.profile_image} className="h-32 object-contain mb-4" alt="Profile" />
              ) : (
                 <Upload className="text-text-dim mb-2" />
              )}
              <span className="text-sm font-bold text-text-dim">Upload Image</span>
              <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
           </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-[2px] text-[12px] hover:bg-accent/80 transition-all"
        >
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save About'}
        </button>
      </form>
    </div>
  );
}
