import React, { useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { useStore } from '../store';

export default function Contact() {
  const { globalSettings } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  
  const socialLinks = globalSettings?.nav_links?.filter((l: any) => l.type === 'social') || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert([{
      name: formData.name,
      email: formData.email,
      message: formData.message
    }]);

    if (!error) {
       setSent(true);
       setFormData({ name: '', email: '', message: '' });
    } else {
       alert("Failed to send message: " + error.message);
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <section className="py-24 md:py-40 bg-black/5 min-h-screen flex items-center">
        <div className="container-grid">
          <div className="col-span-12 text-center mb-20 md:mb-40">
            <h2 className="text-6xl md:text-[120px] lg:text-[160px] font-display font-bold title-gradient leading-none tracking-tighter">CONNECT.</h2>
          </div>
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <div className="glass-card rounded-[40px] md:rounded-[70px] p-8 md:p-24 shadow-2xl">
              {sent ? (
                <div className="text-center py-10 md:py-20">
                  <h3 className="text-3xl md:text-4xl font-display font-bold mb-4 text-accent">Message Sent!</h3>
                  <p className="text-text-dim text-lg md:text-xl">Thank you for reaching out. We will get back to you soon.</p>
                  <button onClick={() => setSent(false)} className="mt-8 px-8 py-3 bg-text-main text-white rounded-full font-bold uppercase tracking-[2px] text-[10px]">Send Another</button>
                </div>
              ) : (
                <form className="space-y-12 md:space-y-20" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-8 md:gap-16">
                     <div className="border-b border-text-dim/20 pb-6 group">
                       <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-4 block uppercase font-display group-focus-within:text-accent transition-colors">Your Name</label>
                       <input 
                         type="text" 
                         required
                         value={formData.name}
                         onChange={e => setFormData({...formData, name: e.target.value})}
                         placeholder="JOHN DOE" 
                         className="bg-transparent w-full outline-none text-xl md:text-2xl font-display uppercase font-bold text-text-main placeholder:text-text-dim/30" 
                       />
                     </div>
                     <div className="border-b border-text-dim/20 pb-6 group">
                       <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-4 block uppercase font-display group-focus-within:text-accent transition-colors">Your Email</label>
                       <input 
                         type="email" 
                         required
                         value={formData.email}
                         onChange={e => setFormData({...formData, email: e.target.value})}
                         placeholder="JOHN@DOE.COM" 
                         className="bg-transparent w-full outline-none text-xl md:text-2xl font-display uppercase font-bold text-text-main placeholder:text-text-dim/30" 
                       />
                     </div>
                  </div>
                  <div className="border-b border-text-dim/20 pb-6 group">
                    <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-4 block uppercase font-display group-focus-within:text-accent transition-colors">Message Vision</label>
                    <textarea 
                      required
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      placeholder="DESCRIBE YOUR VISION" 
                      rows={3} 
                      className="bg-transparent w-full outline-none text-xl md:text-2xl font-display uppercase font-bold resize-none text-text-main placeholder:text-text-dim/30" 
                    />
                  </div>
                  <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-8 md:gap-12">
                    <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10">
                       {socialLinks.map((link: any, i: number) => (
                           <a 
                             key={i} 
                             href={link.href} 
                             target="_blank" 
                             rel="noreferrer"
                             className="text-[10px] uppercase font-bold tracking-[3px] text-text-dim hover:text-accent transition-colors"
                           >
                              {link.name}
                           </a>
                       ))}
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full md:w-auto px-12 md:px-16 py-6 md:py-8 bg-text-main text-white rounded-full font-bold uppercase tracking-[4px] text-[12px] hover:bg-accent hover:shadow-2xl transition-all disabled:opacity-50"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
