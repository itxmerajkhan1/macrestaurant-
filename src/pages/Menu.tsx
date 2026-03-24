import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MENU_JSON } from '../constants';
import { Utensils, Search, Filter, Plus } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../contexts/CartContext';
import { toast } from 'sonner';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();

  const categories = ['all', 'burger', 'chicken', 'breakfast', 'sides', 'drinks', 'desserts'];

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image
    });
    toast.success(`${item.name} added to neural link! ⚡`, {
      style: {
        background: '#0F0F0F',
        border: '1px solid rgba(255, 199, 44, 0.3)',
        color: '#FFC72C',
        fontFamily: 'monospace',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em'
      }
    });
  };

  const filteredItems = MENU_JSON.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter neon-gold uppercase">NEURAL MENU</h2>
            <p className="text-white/40 font-mono text-xs tracking-widest uppercase">8K CINEMATIC GRADE SELECTIONS</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text" 
                placeholder="SEARCH SECTOR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="glass bg-white/5 border-white/10 rounded-xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-[#FFC72C]/50 transition-all w-full sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border",
                activeCategory === cat 
                  ? "bg-[#FFC72C] text-black border-[#FFC72C] shadow-[0_0_15px_rgba(255,199,44,0.3)]" 
                  : "bg-white/5 border-white/10 text-white/40 hover:border-white/30"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="glass rounded-3xl overflow-hidden group hover:border-[#FFC72C]/30 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent opacity-60" />
                  <div className="absolute top-4 right-4 glass px-3 py-1 rounded-full text-[10px] font-bold neon-gold">
                    ${item.price}
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold tracking-tight group-hover:neon-gold transition-colors">{item.name}</h3>
                    <p className="text-xs text-white/40 line-clamp-2 font-light leading-relaxed">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex gap-1">
                      {item.dietary.slice(0, 2).map(d => (
                        <span key={d} className="text-[8px] font-mono text-white/20 border border-white/10 px-2 py-0.5 rounded uppercase">
                          {d}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="w-8 h-8 bg-white/5 hover:bg-[#DA291C] rounded-lg flex items-center justify-center transition-all group-hover:shadow-[0_0_10px_rgba(218,41,28,0.3)]"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
