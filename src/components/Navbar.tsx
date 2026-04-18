import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { globalSettings } = useStore();

  const navLinks = globalSettings?.nav_links?.filter((l: any) => l.enabled && l.type !== 'social') || [
    { name: 'Home', href: '/' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[60] py-10">
      <div className="container-grid items-center">
        {/* Logo Area */}
        <div className="col-span-8 md:col-span-4 flex flex-col truncate">
          <span className="text-[10px] tracking-[4px] uppercase font-bold text-text-dim mb-1 truncate">
             {globalSettings?.meta_description || 'Digital Artist Portfolio'}
          </span>
          <Link to="/" className="text-xl md:text-3xl font-display font-bold tracking-tighter truncate">
             {globalSettings?.site_title?.split(' ')[0] || 'NOXIE.'}
          </Link>
        </div>

        {/* Dynamic Center Space */}
        <div className="hidden md:block col-span-2" />

        {/* Unified Nav links */}
        <div className="col-span-4 md:col-span-6 flex justify-end gap-6 md:gap-12 text-[11px] tracking-[4px] uppercase font-bold text-text-dim">
          {navLinks.map((link: any) => (
            <Link 
              key={link.name} 
              to={link.href} 
              className={`hidden md:block hover:text-accent transition-all hover:-translate-y-0.5 ${location.pathname === link.href ? 'text-accent' : ''}`}
            >
              {link.name}
            </Link>
          ))}
          <button className="md:hidden ml-auto p-2" onClick={() => setMobileMenuOpen(true)}>
             <Menu size={24}/>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-base z-[70] flex items-center justify-center p-10"
          >
            <div className="flex flex-col items-center gap-10 text-3xl font-display font-bold uppercase tracking-widest text-text-main">
              {navLinks.map((link: any) => (
                <Link key={link.name} to={link.href} onClick={() => setMobileMenuOpen(false)}>
                  {link.name}
                </Link>
              ))}
            </div>
            <button className="absolute top-10 right-10 p-4" onClick={() => setMobileMenuOpen(false)}>
               <X size={32} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
