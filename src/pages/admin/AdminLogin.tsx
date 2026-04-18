import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base p-6">
      <div className="glass-card p-10 rounded-[40px] w-full max-w-md">
        <h2 className="text-3xl font-display font-bold mb-8 text-center text-text-main">Admin Login</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase font-display">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main"
              placeholder="admin@noxie.com"
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-[3px] text-text-dim mb-2 block uppercase font-display">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/5 rounded-xl px-4 py-3 outline-none text-text-main"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-text-main text-base border border-white hover:text-white rounded-xl font-bold uppercase tracking-[2px] text-[12px] hover:bg-accent transition-all disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
