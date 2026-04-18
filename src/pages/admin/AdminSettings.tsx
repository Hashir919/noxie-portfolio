import React, { useState, useEffect } from 'react';
import { useStore } from '../../store';

export default function AdminSettings() {
  const { globalSettings, updateGlobalSettings } = useStore();
  const [formData, setFormData] = useState(globalSettings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(globalSettings);
  }, [globalSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateGlobalSettings(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      alert('Failed to save settings');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl max-h-screen">
      <h2 className="text-4xl font-display font-bold mb-8">Global Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8 glass-card p-10 rounded-[40px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Site Title</label>
            <input name="site_title" value={formData.site_title} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main" />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Meta Description</label>
            <input name="meta_description" value={formData.meta_description} onChange={handleChange} className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main" />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Accent Color</label>
            <div className="flex gap-4 items-center">
              <input type="color" name="accent_color" value={formData.accent_color} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer" />
              <input type="text" name="accent_color" value={formData.accent_color} onChange={handleChange} className="flex-1 bg-black/5 rounded-xl px-4 py-3 outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase">Background Color</label>
            <div className="flex gap-4 items-center">
              <input type="color" name="bg_color" value={formData.bg_color} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer" />
              <input type="text" name="bg_color" value={formData.bg_color} onChange={handleChange} className="flex-1 bg-black/5 rounded-xl px-4 py-3 outline-none" />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5">
          <div className="flex justify-between items-end mb-6">
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim uppercase">Social Links</label>
            <button 
              type="button"
              onClick={() => {
                const newLinks = [...(formData.nav_links || []), { name: 'Instagram', href: 'https://', type: 'social', enabled: true }];
                setFormData({ ...formData, nav_links: newLinks });
                setSaved(false);
              }}
              className="text-[10px] uppercase font-bold tracking-[2px] text-accent hover:text-white transition-colors"
            >
              + ADD LINK
            </button>
          </div>
          
          <div className="space-y-4">
            {(formData.nav_links || []).map((link: any, index: number) => {
               if (link.type !== 'social') return null;
               
               return (
                 <div key={index} className="flex gap-4 items-center bg-black/10 p-4 rounded-xl">
                   <input 
                     placeholder="Platform (e.g. Instagram)"
                     value={link.name}
                     onChange={(e) => {
                       const updated = [...formData.nav_links];
                       updated[index].name = e.target.value;
                       setFormData({ ...formData, nav_links: updated });
                       setSaved(false);
                     }}
                     className="bg-transparent w-1/3 outline-none text-sm font-bold text-text-main"
                   />
                   <input 
                     placeholder="URL (https://...)"
                     value={link.href}
                     onChange={(e) => {
                       const updated = [...formData.nav_links];
                       updated[index].href = e.target.value;
                       setFormData({ ...formData, nav_links: updated });
                       setSaved(false);
                     }}
                     className="bg-transparent flex-1 outline-none text-sm text-text-dim"
                   />
                   <button 
                     type="button"
                     onClick={() => {
                       const updated = formData.nav_links.filter((_: any, i: number) => i !== index);
                       setFormData({ ...formData, nav_links: updated });
                       setSaved(false);
                     }}
                     className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-[2px] px-2"
                   >
                     REMOVE
                   </button>
                 </div>
               );
            })}
            {!(formData.nav_links || []).some((l: any) => l.type === 'social') && (
               <p className="text-text-dim text-xs italic">No social links added yet.</p>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-4 bg-accent text-white rounded-xl font-bold uppercase tracking-[2px] text-[12px] hover:bg-accent/80 transition-all"
        >
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
        </button>
      </form>
    </div>
  );
}
