import { motion } from 'motion/react';
import { useStore } from '../store';

export default function Portfolio() {
  const { portfolio, categories } = useStore();
  const getCatName = (id: string) => categories?.find((c: any) => c.id === id)?.name || 'Uncategorized';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
    >
      <section className="py-40 min-h-screen">
        <div className="container-grid">
          <div className="col-span-12 mb-32 flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <span className="text-[11px] uppercase tracking-[4px] font-bold text-accent mb-4 block">Selected Archive</span>
              <h2 className="text-7xl lg:text-8xl font-display font-bold title-gradient">GALLERY</h2>
            </div>
            <div className="flex gap-4">
               <button className="px-10 py-4 bg-text-main text-white rounded-full text-[10px] font-bold uppercase tracking-[3px]">ALL WORKS</button>
            </div>
          </div>
          
          {portfolio?.length === 0 && (
            <div className="col-span-12 text-center text-text-dim text-2xl py-20">
              No portfolio items found. Add some from the admin panel!
            </div>
          )}

          {portfolio?.map((work: any, i: number) => (
            <motion.div
              key={work.id}
              className={`col-span-12 md:col-span-6 ${i % 2 !== 0 ? 'md:mt-48' : ''}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="group cursor-pointer">
                <div className="aspect-[4/5] rounded-[60px] overflow-hidden glass-card p-4 shadow-xl group-hover:-translate-y-4 transition-all duration-700">
                   <img 
                     src={work.image_url} 
                     alt={work.title} 
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
        </div>
      </section>
    </motion.div>
  );
}
