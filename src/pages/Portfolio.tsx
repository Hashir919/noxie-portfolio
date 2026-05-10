import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Portfolio() {
  const { portfolio, categories } = useStore();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const getCatName = (id: string) => categories?.find((c: any) => c.id === id)?.name || 'Uncategorized';

  // Filter portfolio items based on active category
  const filteredWorks = activeCategory === 'all'
    ? portfolio
    : portfolio?.filter((work: any) => work.category_id === activeCategory) || [];

  // Get unique categories that have portfolio items
  const usedCategories = categories?.filter((cat: any) =>
    portfolio?.some((work: any) => work.category_id === cat.id)
  ) || [];

  // Lightbox navigation
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  };

  const goNext = useCallback(() => {
    if (lightboxIndex === null || !filteredWorks) return;
    setLightboxIndex((lightboxIndex + 1) % filteredWorks.length);
  }, [lightboxIndex, filteredWorks]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null || !filteredWorks) return;
    setLightboxIndex((lightboxIndex - 1 + filteredWorks.length) % filteredWorks.length);
  }, [lightboxIndex, filteredWorks]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, goNext, goPrev]);

  const currentWork = lightboxIndex !== null ? filteredWorks?.[lightboxIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <section className="py-40 min-h-screen">
        <div className="container-grid">
          <div className="col-span-12 mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <span className="text-[11px] uppercase tracking-[4px] font-bold text-accent mb-4 block">Selected Archive</span>
              <h2 className="text-7xl lg:text-8xl font-display font-bold title-gradient">GALLERY</h2>
            </div>

            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-3">
               <button 
                 onClick={() => setActiveCategory('all')}
                 className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[3px] transition-all duration-300 ${
                   activeCategory === 'all' 
                     ? 'bg-text-main text-white shadow-lg shadow-accent/10' 
                     : 'bg-black/5 text-text-dim hover:bg-black/10 hover:text-text-main'
                 }`}
               >
                 ALL WORKS
               </button>
               {usedCategories.map((cat: any) => (
                 <button 
                   key={cat.id}
                   onClick={() => setActiveCategory(cat.id)}
                   className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-[3px] transition-all duration-300 ${
                     activeCategory === cat.id 
                       ? 'bg-text-main text-white shadow-lg shadow-accent/10' 
                       : 'bg-black/5 text-text-dim hover:bg-black/10 hover:text-text-main'
                   }`}
                 >
                   {cat.name}
                 </button>
               ))}
            </div>
          </div>
          
          {filteredWorks?.length === 0 && (
            <div className="col-span-12 text-center text-text-dim text-2xl py-20">
              {portfolio?.length === 0 
                ? 'No portfolio items found. Add some from the admin panel!'
                : 'No items found in this category.'}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="col-span-12 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
            >
              {filteredWorks?.map((work: any, i: number) => (
                <motion.div
                  key={work.id}
                  className={`${i % 2 !== 0 ? 'md:mt-48' : ''}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.05, 0.2) }}
                >
                  <div 
                    className="group cursor-pointer"
                    onClick={() => openLightbox(i)}
                  >
                    <div className="aspect-[4/5] rounded-[60px] overflow-hidden glass-card p-4 shadow-xl group-hover:-translate-y-4 transition-all duration-700">
                       <img 
                         src={work.image_url} 
                         alt={work.title} 
                         loading="lazy"
                         decoding="async"
                         className="w-full h-full object-cover rounded-[48px] group-hover:scale-105 transition-transform duration-1000"
                       />
                    </div>
                    <div className="mt-10 flex justify-between items-center px-8">
                      <h3 className="text-3xl font-display font-bold">{work.title}</h3>
                      <span className="text-[10px] uppercase tracking-[3px] font-bold text-text-dim border-b border-accent/20 pb-1">{getCatName(work.category_id)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentWork && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={closeLightbox}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" />

            {/* Close Button */}
            <button 
              onClick={closeLightbox}
              className="absolute top-6 right-6 md:top-10 md:right-10 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
            >
              <X size={24} />
            </button>

            {/* Navigation - Previous */}
            {filteredWorks && filteredWorks.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); goPrev(); }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); goNext(); }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-[110] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Image Content */}
            <motion.div
              key={currentWork.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-[105] flex flex-col items-center max-w-5xl w-full mx-4 md:mx-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-h-[70vh] flex items-center justify-center">
                <img 
                  src={currentWork.image_url} 
                  alt={currentWork.title}
                  decoding="async"
                  className="max-w-full max-h-[70vh] object-contain rounded-[20px] md:rounded-[30px] shadow-2xl shadow-black/40"
                />
              </div>
              
              <div className="mt-6 md:mt-8 text-center">
                <h3 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">{currentWork.title}</h3>
                <p className="text-[10px] uppercase tracking-[4px] font-bold text-white/50">{getCatName(currentWork.category_id)}</p>
                {currentWork.description && (
                  <p className="text-white/60 mt-4 max-w-lg mx-auto text-sm leading-relaxed">{currentWork.description}</p>
                )}
                {filteredWorks && filteredWorks.length > 1 && (
                  <p className="text-white/30 text-[10px] uppercase tracking-[3px] mt-4">
                    {lightboxIndex + 1} / {filteredWorks.length}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
