import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { uploadImage } from '../../lib/uploadImage';
import { useStore } from '../../store';
import { Plus, Trash2, Upload, Tag } from 'lucide-react';

export default function AdminPortfolio() {
  const { portfolio, categories, fetchData } = useStore();
  const [items, setItems] = useState<any[]>([]);
  const [catList, setCatList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New Item State
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', category_id: '', description: '', image_url: '' });

  // New Category State
  const [isAddingCat, setIsAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');

  useEffect(() => {
    setItems(portfolio);
    setCatList(categories);
  }, [portfolio, categories]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNew: boolean, id?: string) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      const url = await uploadImage(e.target.files[0]);
      if (url) {
        if (isNew) {
          setNewItem({ ...newItem, image_url: url });
        } else if (id) {
          await supabase.from('portfolio_works').update({ image_url: url }).eq('id', id);
          fetchData();
        }
      }
      setLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName) return;
    setLoading(true);
    await supabase.from('categories').insert([{ name: newCatName }]);
    setNewCatName('');
    setIsAddingCat(false);
    await fetchData();
    setLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Works will be kept but uncategorized.')) return;
    setLoading(true);
    await supabase.from('categories').delete().eq('id', id);
    await fetchData();
    setLoading(false);
  };

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.image_url) {
      alert("Title and Image are required.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from('portfolio_works').insert([{
       title: newItem.title,
       category_id: newItem.category_id || null, 
       description: newItem.description,
       image_url: newItem.image_url
    }]);

    if (error) {
       alert("Error saving item: " + error.message);
    } else {
       setNewItem({ title: '', category_id: '', description: '', image_url: '' });
       setIsAdding(false);
       await fetchData();
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    setLoading(true);
    await supabase.from('portfolio_works').delete().eq('id', id);
    await fetchData();
    setLoading(false);
  };

  const getCatName = (id: string) => catList.find(c => c.id === id)?.name || 'Uncategorized';

  return (
    <div className="w-full max-w-6xl max-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
         <h2 className="text-3xl md:text-4xl font-display font-bold">Portfolio Items</h2>
         <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto">
             <button onClick={() => setIsAddingCat(!isAddingCat)} className="px-6 py-3 bg-black/10 text-text-main rounded-full text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-black/20 transition-all">
                <Tag size={16} /> Categories
             </button>
             <button onClick={() => setIsAdding(!isAdding)} className="px-6 py-3 bg-text-main text-white rounded-full text-[10px] font-bold uppercase flex items-center gap-2 hover:bg-accent transition-all">
                <Plus size={16} /> Add New Work
             </button>
         </div>
      </div>

      {isAddingCat && (
         <div className="glass-card p-6 md:p-8 rounded-[40px] mb-8 space-y-6 border border-text-dim/20 overflow-x-hidden">
            <h3 className="text-xl font-bold">Manage Categories</h3>
            <div className="flex flex-wrap gap-4 mb-6">
                {catList.map(c => (
                    <div key={c.id} className="bg-black/5 px-4 py-2 rounded-lg flex items-center gap-3">
                        <span className="text-sm font-semibold">{c.name}</span>
                        <button onClick={() => handleDeleteCategory(c.id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                ))}
                {catList.length === 0 && <span className="text-text-dim text-sm py-2">No categories yet.</span>}
            </div>
            <div className="flex flex-col md:flex-row gap-4 max-w-sm">
                <input type="text" placeholder="New Category Name" value={newCatName} onChange={e => setNewCatName(e.target.value)} className="bg-black/5 px-4 py-3 rounded-xl outline-none w-full md:flex-1" />
                <button onClick={handleAddCategory} disabled={loading} className="px-6 py-3 bg-accent text-white rounded-xl font-bold text-xs hover:bg-accent/80 transition-all w-full md:w-auto">Add</button>
            </div>
         </div>
      )}

      {isAdding && (
         <div className="glass-card p-6 md:p-8 rounded-[40px] mb-8 space-y-6 border border-accent overflow-x-hidden">
            <h3 className="text-xl font-bold">Add New Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               <input type="text" placeholder="Title" value={newItem.title} onChange={e => setNewItem({...newItem, title: e.target.value})} className="bg-black/5 px-4 py-3 rounded-xl outline-none" />
               <select value={newItem.category_id} onChange={e => setNewItem({...newItem, category_id: e.target.value})} className="bg-black/5 px-4 py-3 rounded-xl outline-none">
                  <option value="">Select Category...</option>
                  {catList.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
               </select>
               
               <div className="col-span-1 md:col-span-2 border-2 border-dashed border-text-dim/20 rounded-xl p-8 flex flex-col items-center justify-center relative hover:bg-black/5 transition-all h-40">
                 {newItem.image_url ? (
                    <img src={newItem.image_url} className="h-full object-contain mb-4" alt="New Item" />
                 ) : (
                    <>
                       <Upload className="text-text-dim mb-2" />
                       <span className="text-sm font-bold text-text-dim">Upload Artwork</span>
                    </>
                 )}
                 <input type="file" onChange={(e) => handleImageUpload(e, true)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
               </div>
            </div>
            <button onClick={handleAddItem} disabled={loading} className="w-full md:w-auto px-8 py-3 bg-accent text-white rounded-xl font-bold uppercase tracking-[2px] text-[12px] hover:bg-accent/80 transition-all">
              {loading ? 'Saving...' : 'Save Item'}
            </button>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
         {items.map(item => (
            <div key={item.id} className="glass-card rounded-[30px] overflow-hidden group">
               <div className="aspect-[4/5] relative bg-black/5">
                  <img src={item.image_url || `https://picsum.photos/seed/${item.id}/400/500`} className="w-full h-full object-cover" alt={item.title} />
               </div>
               <div className="p-6">
                  <h4 className="font-display font-bold text-xl mb-1">{item.title}</h4>
                  <p className="text-[10px] uppercase font-bold text-text-dim mb-4">{getCatName(item.category_id)}</p>
                  
                  <div className="flex gap-4 border-t border-text-dim/10 pt-4">
                     <button onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-500 font-bold uppercase text-[10px] flex items-center gap-1">
                        <Trash2 size={14} /> Delete
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
