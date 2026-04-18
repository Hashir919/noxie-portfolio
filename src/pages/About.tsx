import { motion } from 'motion/react';
import { useStore } from '../store';

export default function About() {
  const { about } = useStore();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <section className="py-24 md:py-40 min-h-screen flex items-center">
        <div className="container-grid items-center gap-12 md:gap-20">
          <div className="col-span-12 md:col-span-5">
            <div className="aspect-[3/4] rounded-[40px] md:rounded-[60px] border-[10px] md:border-[20px] border-white shadow-2xl glass-card overflow-hidden animate-float">
               {about?.profile_image ? (
                 <img 
                   src={about.profile_image} 
                   alt="Profile" 
                   className="w-full h-full object-cover"
                 />
               ) : (
                 <div className="w-full h-full bg-black/10 flex items-center justify-center">
                    <span className="text-text-dim text-sm uppercase tracking-widest">No Image</span>
                 </div>
               )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-7 md:pl-16 space-y-8 md:space-y-12">
            <span className="text-[11px] uppercase tracking-[5px] font-bold text-accent mb-4 block">Meet the Artist</span>
            <h2 className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold title-gradient mb-8 md:mb-12 leading-[0.85] whitespace-pre-wrap">
               {about?.heading}
            </h2>
            <p className="text-xl md:text-2xl text-text-dim font-light leading-relaxed max-w-2xl whitespace-pre-wrap">
               {about?.bio_text}
            </p>
            <div className="flex gap-12 pt-12 border-t border-accent/20">
               <div>
                  <p className="text-[10px] uppercase font-bold tracking-[3px] text-accent mb-2">EXPERIENCE</p>
                  <p className="text-2xl font-display font-bold">{about?.experience}</p>
               </div>
               <div>
                  <p className="text-[10px] uppercase font-bold tracking-[3px] text-accent mb-2">CLIENTS</p>
                  <p className="text-2xl font-display font-bold">{about?.clients}</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
