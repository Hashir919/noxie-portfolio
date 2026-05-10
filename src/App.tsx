import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { useStore } from './store';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';

import { ProtectedRoute } from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHomepage from './pages/admin/AdminHomepage';
import AdminPortfolio from './pages/admin/AdminPortfolio';
import AdminAbout from './pages/admin/AdminAbout';
import AdminMessages from './pages/admin/AdminMessages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const { globalSettings, fetchAuthSession, fetchData, loading } = useStore();

  useEffect(() => {
    fetchAuthSession();
    fetchData();
  }, []);

  // Inject Title dynamically
  useEffect(() => {
    if (globalSettings) {
      document.title = globalSettings.site_title || 'Dynamic Portfolio';
    }
  }, [globalSettings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base flex flex-col items-center justify-center text-text-main gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin"></div>
        <div className="text-[10px] uppercase tracking-[4px] font-bold text-text-dim">Loading Data...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-base min-h-screen text-text-main font-sans selection:bg-accent selection:text-white transition-colors duration-500">
        <Routes>
           {/* Admin Routes */}
           <Route path="/admin/login" element={<AdminLogin />} />
           <Route path="/admin" element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                 <Route index element={<AdminDashboard />} />
                 <Route path="settings" element={<AdminSettings />} />
                 <Route path="homepage" element={<AdminHomepage />} />
                 <Route path="portfolio" element={<AdminPortfolio />} />
                 <Route path="about" element={<AdminAbout />} />
                 <Route path="messages" element={<AdminMessages />} />
              </Route>
           </Route>

           {/* Public Routes */}
           <Route path="*" element={
             <>
                <Navbar />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                  </Routes>
                </AnimatePresence>
                <footer className="py-12 md:py-24 border-t border-text-dim/10">
                  <div className="container-grid text-center md:text-left gap-y-6">
                     <div className="col-span-12 md:col-span-6 text-[10px] uppercase font-bold tracking-[5px] text-text-dim">
                        © {new Date().getFullYear()} {globalSettings?.site_title || 'PORTFOLIO'}
                     </div>
                     <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end gap-12 text-[10px] uppercase font-bold tracking-[5px] text-text-dim">
                        <a href="#" className="hover:text-accent transition-colors">Privacy</a>
                        <a href="#" className="hover:text-accent transition-colors">Terms</a>
                     </div>
                  </div>
                </footer>
             </>
           } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
