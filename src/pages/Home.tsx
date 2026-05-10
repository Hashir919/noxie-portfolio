import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { supabase } from '../lib/supabase';


export default function Home() {
  const { homepage, portfolio, categories, about, globalSettings } = useStore();
  
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    setContactLoading(true);
    const { error } = await supabase.from('contact_messages').insert([{
      name: contactForm.name,
      email: contactForm.email,
      message: contactForm.message
    }]);

    if (!error) {
       setContactSent(true);
       setContactForm({ name: '', email: '', message: '' });
    }
    setContactLoading(false);
  };
  
  const featuredWorks = portfolio?.slice(0, 3) || [];
  const getCatName = (id: string) => categories?.find((c: any) => c.id === id)?.name || 'Uncategorized';
  const socialLinks = globalSettings?.nav_links?.filter((l: any) => l.type === 'social') || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <section className="relative min-h-screen flex items-center pt-24 overflow-hidden">
        <div className="bg-grain" />
        
        {/* Background 3D Blobs */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.img 
            src="https://framerusercontent.com/images/Oky87768uWz7kKzY2Z4vX1R5M.png"
            className="absolute -top-20 -left-20 w-[600px] opacity-40 blur-3xl"
            animate={{ x: [0, 40, 0], y: [0, 60, 0], rotate: [0, 15, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.img 
            src="https://framerusercontent.com/images/Oky87768uWz7kKzY2Z4vX1R5M.png"
            className="absolute top-1/2 -right-40 w-[500px] opacity-30 contrast-125 saturate-150 rotate-90"
            animate={{ x: [0, -60, 0], y: [0, 40, 0], rotate: [90, 70, 90] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-accent/10 blur-[150px] rounded-full" />
        </div>

        <div className="container-grid h-full items-center relative z-10">
          
          {/* Left Side */}
          <div className="col-span-12 md:col-span-4 flex flex-col pt-12 md:pt-0 text-center md:text-left justify-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-[110px] font-display font-bold title-gradient mb-8 md:mb-16 whitespace-pre-wrap">
                {homepage?.heading}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card rounded-[40px] p-6 lg:p-8 max-w-[340px] mx-auto md:mx-0 hidden md:block"
            >
               <div className="aspect-[4/3] rounded-[24px] overflow-hidden mb-6 group cursor-pointer">
                  {homepage?.side_image && (
                    <img 
                      src={homepage.side_image} 
                      alt="Side Art" 
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  )}
               </div>
               <p className="text-[10px] uppercase tracking-[3px] text-text-dim font-bold leading-relaxed">
                 {homepage?.bottom_text}
               </p>
            </motion.div>
          </div>

          {/* Center Mockup */}
          <div className="col-span-12 md:col-span-4 flex justify-center items-center py-6 md:py-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full flex justify-center"
            >
              <div className="relative w-[280px] sm:w-[320px] lg:w-[380px] aspect-[3/4] rounded-[40px] md:rounded-[60px] glass-card border-[1px] border-white shadow-[0_40px_80px_-20px_rgba(154,140,255,0.15)] flex items-center justify-center overflow-hidden">
                 <div className="absolute top-0 left-0 right-0 flex justify-center pt-6 md:pt-8 text-[10px] uppercase font-bold tracking-[6px] text-accent/40 z-20">
                   SOFT AESTHETICS
                 </div>
                 <div className="absolute w-64 h-64 bg-accent/15 blur-[120px] rounded-full" />
                 <motion.div 
                   animate={{ y: [0, -14, 0], scale: [1, 1.02, 1] }}
                   transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                   className="relative w-full h-full flex items-center justify-center p-4"
                 >
                   <div className="absolute w-56 h-56 bg-accent/20 blur-[100px] rounded-full crystal-glow" />
                   {homepage?.hero_image && (
                     <img 
                       src={homepage.hero_image} 
                       alt="Main Character" 
                       loading="eager"
                       decoding="async"
                       className="w-full h-full object-contain relative z-10 drop-shadow-[0_20px_50px_rgba(154,140,255,0.4)]"
                     />
                   )}
                 </motion.div>
                 <div className="absolute bottom-0 left-0 right-0 pb-6 px-8 text-center z-20">
                    <div className="w-10 h-0.5 bg-accent/20 mx-auto mb-3" />
                    <p className="text-[9px] uppercase tracking-[4px] text-text-dim mb-1">Portfolio Reveal</p>
                 </div>
              </div>
            </motion.div>
          </div>

          {/* Right Content */}
          <div className="col-span-12 md:col-span-4 flex flex-col justify-center md:pl-10 text-center md:text-left mt-8 md:mt-0 mb-20 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 md:mb-8 mx-auto md:mx-0">
                <Sparkles className="text-accent" size={24} />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6 md:mb-8 leading-[1.1] text-text-main">
                 {homepage?.subtext?.split('.')[0] + '.' || 'Transform Your Space.'}
              </h2>
              <p className="text-sm md:text-base text-text-dim font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                 {homepage?.subtext?.split('.').slice(1).join('.') || 'Digital art is redefining the way we experience emotion and character.'}
              </p>
              <Link to={homepage?.button_link || "/about"} className="mt-12 inline-flex items-center gap-4 text-[10px] uppercase font-bold tracking-[4px] text-accent hover:gap-6 transition-all group">
                {homepage?.button_text || 'READ PROFILE'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

        </div>
        
        {/* Decorative large text */}
        <div className="absolute bottom-10 right-10 whitespace-nowrap overflow-hidden pointer-events-none hidden lg:block">
           <span className="text-[200px] font-bold text-accent opacity-[0.03] select-none leading-none">NOXIE WORLD NOXIE WORLD</span>
        </div>
      </section>

      {/* Featured Works Section */}
      {featuredWorks.length > 0 && (
        <section className="py-24 md:py-32 relative z-10">
          <div className="container-grid">
            <div className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-0">
               <div>
                  <h3 className="text-4xl md:text-5xl font-display font-bold title-gradient mb-2 md:mb-4">Selected Works</h3>
                  <p className="text-text-dim text-xs md:text-sm tracking-widest uppercase font-bold">A glimpse into the reality</p>
               </div>
               <Link to="/portfolio" className="hidden md:flex text-[10px] uppercase font-bold tracking-[3px] text-accent hover:text-text-main transition-colors gap-2 items-center border border-accent/20 px-6 py-3 rounded-full hover:bg-accent/10">
                  VIEW FULL GALLERY <ArrowRight size={14} />
               </Link>
            </div>
            
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
               {featuredWorks.map((work: any, i: number) => (
                  <motion.div 
                     key={work.id}
                     initial={{ opacity: 0, y: 40 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: "-100px" }}
                     transition={{ duration: 0.6, delay: Math.min(i * 0.1, 0.3), ease: [0.16, 1, 0.3, 1] }}
                     className="glass-card rounded-[30px] md:rounded-[40px] overflow-hidden group cursor-pointer block"
                  >
                     <div className="aspect-[4/5] relative bg-black/5 overflow-hidden">
                        <img src={work.image_url} alt={work.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                     </div>
                     <div className="p-6 md:p-8">
                        <h4 className="font-display font-bold text-2xl mb-1 truncate">{work.title}</h4>
                        <p className="text-[10px] uppercase font-bold text-text-dim tracking-[2px] truncate">{getCatName(work.category_id)}</p>
                     </div>
                  </motion.div>
               ))}
            </div>

            <div className="col-span-12 flex justify-center mt-12 md:hidden">
               <Link to="/portfolio" className="text-[10px] uppercase font-bold tracking-[3px] text-accent transition-colors flex gap-2 items-center px-8 py-4 glass-card rounded-full border border-accent/20">
                  VIEW GALLERY <ArrowRight size={14} />
               </Link>
            </div>
          </div>
        </section>
      )}

      {/* Short About Section */}
      <section className="py-24 md:py-32 relative z-10 border-t border-white/5 bg-black/5">
        <div className="container-grid items-center gap-12 md:gap-20">
           <div className="col-span-12 md:col-span-4 flex justify-center md:justify-end">
             <div className="w-56 h-56 md:w-80 md:h-80 rounded-[40px] md:rounded-[60px] border-[10px] border-white shadow-2xl overflow-hidden glass-card">
                {about?.profile_image ? (
                   <img src={about.profile_image} loading="lazy" decoding="async" className="w-full h-full object-cover" alt="Profile" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-text-dim text-xs">No Image</div>
                )}
             </div>
           </div>
           <div className="col-span-12 md:col-span-7 flex flex-col justify-center text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-display font-bold title-gradient mb-6">Meet the Creator</h3>
              <p className="text-text-dim leading-relaxed mb-8 max-w-lg mx-auto md:mx-0">
                 {about?.bio_text?.substring(0, 180)}...
              </p>
              <Link to="/about" className="inline-flex mx-auto md:mx-0 items-center justify-center w-max px-8 py-4 bg-text-main text-white rounded-full text-[10px] uppercase font-bold tracking-[3px] hover:bg-accent transition-all gap-3">
                 READ PROFILE <ArrowRight size={14}/>
              </Link>
           </div>
        </div>
      </section>

      {/* Short Contact Section */}
      <section className="py-24 md:py-32 relative z-10 border-t border-white/5">
        <div className="container-grid">
           <div className="col-span-12 md:col-span-8 md:col-start-3 glass-card p-8 md:p-16 rounded-[40px] md:rounded-[60px] text-center shadow-2xl">
              <h3 className="text-4xl md:text-5xl lg:text-[80px] font-display font-bold title-gradient mb-12">REACH OUT.</h3>
              {contactSent ? (
                <div className="text-center py-10">
                  <h3 className="text-2xl font-display font-bold mb-4 text-accent">Message Sent!</h3>
                  <button onClick={() => setContactSent(false)} className="mt-4 px-6 py-3 bg-text-main text-white rounded-full font-bold uppercase tracking-[2px] text-[10px]">Send Another</button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6 text-left max-w-2xl mx-auto">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        required 
                        placeholder="YOUR NAME" 
                        value={contactForm.name}
                        onChange={e => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full bg-black/5 px-6 py-4 rounded-xl outline-none text-text-main font-bold placeholder:font-normal uppercase tracking-[3px] text-xs border border-transparent focus:border-accent/30 transition-colors" 
                      />
                      <input 
                        required 
                        type="email"
                        placeholder="YOUR EMAIL" 
                        value={contactForm.email}
                        onChange={e => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full bg-black/5 px-6 py-4 rounded-xl outline-none text-text-main font-bold placeholder:font-normal uppercase tracking-[3px] text-xs border border-transparent focus:border-accent/30 transition-colors" 
                      />
                   </div>
                   <textarea 
                     required 
                     placeholder="YOUR VISION..." 
                     rows={3}
                     value={contactForm.message}
                     onChange={e => setContactForm({...contactForm, message: e.target.value})}
                     className="w-full bg-black/5 px-6 py-4 rounded-xl outline-none text-text-main font-bold placeholder:font-normal uppercase tracking-[3px] text-xs resize-none border border-transparent focus:border-accent/30 transition-colors" 
                   />
                   <div className="pt-4 text-center">
                     <button disabled={contactLoading} type="submit" className="w-full md:w-auto px-16 py-4 bg-text-main text-white rounded-full uppercase font-bold tracking-[3px] text-[10px] hover:bg-accent hover:shadow-2xl transition-all disabled:opacity-50">
                       {contactLoading ? 'SENDING...' : 'SEND MESSAGE'}
                     </button>
                   </div>
                   
                   {socialLinks.length > 0 && (
                     <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center gap-6 mt-6">
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
                   )}
                </form>
              )}
           </div>
        </div>
      </section>

    </motion.div>
  );
}
