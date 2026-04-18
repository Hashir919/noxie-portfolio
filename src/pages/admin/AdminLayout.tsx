import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../../store';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Settings, Image, FileText, MessageSquare, LogOut, Globe, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    useStore.setState({ authSession: null });
    navigate('/admin/login');
  };

  const menu = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
    { name: 'Homepage', icon: <Globe size={20} />, path: '/admin/homepage' },
    { name: 'Portfolio', icon: <Image size={20} />, path: '/admin/portfolio' },
    { name: 'About', icon: <FileText size={20} />, path: '/admin/about' },
    { name: 'Messages', icon: <MessageSquare size={20} />, path: '/admin/messages' },
  ];

  const SidebarContent = () => (
    <>
      <h1 className="text-2xl font-display font-bold tracking-tighter mb-12">NOXIE. <span className="text-accent text-sm ml-2">ADMIN</span></h1>
      
      <nav className="flex-1 space-y-2">
        {menu.map(item => (
          <Link
            key={item.name}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path ? 'bg-accent text-white shadow-lg' : 'hover:bg-text-dim/10 text-text-dim'
            }`}
          >
            {item.icon}
            <span className="font-semibold text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-auto"
      >
        <LogOut size={20} />
        <span className="font-semibold text-sm">Sign Out</span>
      </button>
    </>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-base text-text-main font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-6 bg-white/5 border-b border-text-dim/10">
         <h1 className="text-xl font-display font-bold tracking-tighter">NOXIE. <span className="text-accent text-xs ml-1">ADMIN</span></h1>
         <button onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} />
         </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
           <motion.div 
             initial={{ opacity: 0, x: -100 }}
             animate={{ opacity: 1, x: 0 }}
             exit={{ opacity: 0, x: -100 }}
             className="fixed inset-0 z-50 bg-base p-6 flex flex-col md:hidden"
           >
              <button onClick={() => setMobileMenuOpen(false)} className="self-end mb-8"><X size={24}/></button>
              <SidebarContent />
           </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden w-64 border-r border-text-dim/10 bg-white/5 p-6 md:flex flex-col">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 relative w-full overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
