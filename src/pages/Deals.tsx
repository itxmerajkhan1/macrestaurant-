import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Tag, Clock, Zap, Sparkles, ArrowRight, Timer } from 'lucide-react';
import { cn } from '../lib/utils';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  expiry: number; // seconds
  color: 'gold' | 'red';
  image: string;
}

const DEALS: Deal[] = [
  {
    id: '1',
    title: 'NEON BREAKFAST',
    description: 'BOGO on all McMuffins before 10:30 AM.',
    discount: 'BUY 1 GET 1',
    code: 'MORNING_NEON',
    expiry: 3600,
    color: 'gold',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=600'
  },
  {
    id: '2',
    title: 'CYBER QUARTER',
    description: 'Quarter Pounder with Cheese for half the credits.',
    discount: '50% OFF',
    code: 'QUARTER_CYBER',
    expiry: 7200,
    color: 'red',
    image: 'https://images.unsplash.com/photo-1594179047519-f347310d3322?q=80&w=600'
  },
  {
    id: '3',
    title: 'DATA DESSERT',
    description: 'Free McFlurry with any order over $15.',
    discount: 'FREE ITEM',
    code: 'FLURRY_DATA',
    expiry: 1800,
    color: 'gold',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?q=80&w=600'
  }
];

export default function Deals() {
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({
    '1': 3600,
    '2': 7200,
    '3': 1800
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(id => {
          if (next[id] > 0) next[id] -= 1;
        });
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        <div className="space-y-2">
          <h2 className="text-5xl font-black tracking-tighter neon-red uppercase">SPECIAL DEALS</h2>
          <p className="text-white/40 font-mono text-xs tracking-widest uppercase">TEMPORAL DISCOUNTS DETECTED</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {DEALS.map((deal, i) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-white/20 transition-all"
            >
              <div className="w-full md:w-1/2 h-64 md:h-auto overflow-hidden relative">
                <img 
                  src={deal.image} 
                  alt={deal.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-transparent to-transparent hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] to-transparent md:hidden" />
                
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full flex items-center gap-2">
                  <Timer className="w-3 h-3 neon-gold" />
                  <span className="text-[10px] font-mono font-bold">{formatTime(timeLeft[deal.id])}</span>
                </div>
              </div>

              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase",
                    deal.color === 'gold' ? "bg-[#FFC72C] text-black" : "bg-[#DA291C] text-white"
                  )}>
                    <Tag className="w-3 h-3" /> {deal.discount}
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black tracking-tight group-hover:neon-gold transition-colors">{deal.title}</h3>
                    <p className="text-sm text-white/40 font-light leading-relaxed">{deal.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 glass rounded-xl border-dashed border-white/20">
                    <div className="space-y-1">
                      <p className="text-[8px] font-mono text-white/20 uppercase tracking-widest">NEURAL CODE</p>
                      <p className="text-sm font-mono font-bold tracking-tighter">{deal.code}</p>
                    </div>
                    <button className="text-[10px] font-bold neon-gold hover:underline">COPY</button>
                  </div>
                  
                  <button className="w-full py-3 glass rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                    REDEEM NOW <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bonus Section */}
        <div className="glass p-8 rounded-3xl border-l-4 border-l-[#FFC72C] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <Sparkles className="w-6 h-6 neon-gold" /> UNLOCK HIDDEN PERKS
            </h3>
            <p className="text-sm text-white/40 max-w-xl">
              Connect your neural link to the MAC Rewards program and earn credits on every order. 
              Exclusive 8K grade deals await our loyal sector citizens.
            </p>
          </div>
          <button className="px-8 py-4 btn-neon-gold whitespace-nowrap">
            JOIN REWARDS
          </button>
        </div>
      </div>
    </motion.div>
  );
}
