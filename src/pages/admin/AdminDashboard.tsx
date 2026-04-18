import { useStore } from '../../store';
import { Settings, Image, MessageSquare, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { globalSettings, portfolio } = useStore();

  const stats = [
    { label: 'Site Title', value: globalSettings?.site_title, icon: <Globe className="text-blue-500" /> },
    { label: 'Works in Portfolio', value: portfolio?.length || 0, icon: <Image className="text-purple-500" /> },
  ];

  return (
    <div className="max-w-6xl">
      <h2 className="text-4xl font-display font-bold mb-2">Welcome Back</h2>
      <p className="text-text-dim mb-12">Here is what's happening on your website today.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         {stats.map((stat, i) => (
           <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center">
                 {stat.icon}
              </div>
              <div>
                 <p className="text-[10px] uppercase font-bold tracking-[2px] text-text-dim mb-1">{stat.label}</p>
                 <p className="text-2xl font-display font-bold">{stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/admin/homepage" className="glass-card p-6 md:p-8 rounded-[40px] group hover:bg-black/5 border border-transparent hover:border-text-dim/10 transition-all">
           <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">Edit Homepage</h3>
           <p className="text-text-dim">Update the hero section, text, and images.</p>
        </Link>
        <Link to="/admin/portfolio" className="glass-card p-6 md:p-8 rounded-[40px] group hover:bg-black/5 border border-transparent hover:border-text-dim/10 transition-all">
           <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">Manage Portfolio</h3>
           <p className="text-text-dim">Upload new artwork, assign categories, and organize.</p>
        </Link>
        <Link to="/admin/settings" className="glass-card p-6 md:p-8 rounded-[40px] group hover:bg-black/5 border border-transparent hover:border-text-dim/10 transition-all">
           <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">Global Settings</h3>
           <p className="text-text-dim">Change colors, fonts, and site meta information.</p>
        </Link>
        <Link to="/admin/messages" className="glass-card p-6 md:p-8 rounded-[40px] group hover:bg-black/5 border border-transparent hover:border-text-dim/10 transition-all">
           <h3 className="text-xl md:text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">View Messages</h3>
           <p className="text-text-dim">Read inquiries from the contact form.</p>
        </Link>
      </div>
    </div>
  );
}
