import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Mail, Calendar, Trash2 } from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message forever?')) return;
    await supabase.from('contact_messages').delete().eq('id', id);
    fetchMessages();
  };

  return (
    <div className="max-w-5xl max-h-screen">
      <h2 className="text-4xl font-display font-bold mb-8">Inbox</h2>

      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <div className="space-y-4">
           {messages.length === 0 && <p className="text-text-dim">No messages yet.</p>}
           
           {messages.map(msg => (
              <div key={msg.id} className="glass-card p-6 rounded-[24px] group">
                 <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4 md:gap-0">
                    <div>
                      <h4 className="font-bold text-xl">{msg.name}</h4>
                      <p className="text-[12px] font-bold tracking-[2px] text-accent uppercase flex items-center gap-2 mt-1">
                        <Mail size={14}/> <span className="break-all">{msg.email}</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-between w-full md:w-auto gap-4">
                      <span className="text-[10px] text-text-dim font-bold tracking-[1px] uppercase flex items-center gap-1">
                         <Calendar size={12}/> {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      <button onClick={() => handleDelete(msg.id)} className="text-text-dim hover:text-red-400 transition-colors md:opacity-0 group-hover:opacity-100">
                         <Trash2 size={16} />
                      </button>
                    </div>
                 </div>
                 <div className="bg-black/5 p-4 rounded-xl">
                    <p className="text-sm leading-relaxed text-text-main whitespace-pre-wrap">{msg.message}</p>
                 </div>
              </div>
           ))}
        </div>
      )}
    </div>
  );
}
