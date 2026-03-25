import React from 'react';
import { motion } from 'motion/react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Zap, Sparkles, ArrowRight, Clock, ShieldCheck, MapPin } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: any) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full flex flex-col items-center justify-center p-6 text-center"
    >
      <div className="max-w-4xl space-y-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-mono neon-gold mb-4"
        >
          <Zap className="w-3 h-3" /> SYSTEM ONLINE: SECTOR 7
        </motion.div>
        
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
          TASTE THE <br />
          <span className="neon-red">FUTURE</span>
        </h2>
        
        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
          Experience the next evolution of fast food. Minimalist design, 
          cyberpunk aesthetics, and AI-driven flavor selection.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <button 
            onClick={() => onNavigate('concierge')}
            className="group relative px-8 py-4 btn-neon-red overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <span className="flex items-center gap-2">
              TALK TO MAC <Sparkles className="w-5 h-5" />
            </span>
          </button>
          
          <button 
            onClick={() => onNavigate('menu')}
            className="px-8 py-4 glass text-white font-bold rounded-xl hover:border-[#FFC72C]/50 transition-all flex items-center gap-2"
          >
            EXPLORE MENU <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats/Features */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 w-full max-w-5xl">
        {[
          { label: "DELIVERY", value: "15 MIN", icon: Clock },
          { label: "QUALITY", value: "8K GRADE", icon: ShieldCheck },
          { label: "SECTORS", value: "124+", icon: MapPin },
          { label: "AI TECH", value: "MAC V4", icon: Zap },
        ].map((stat, i) => (
          <div key={i} className="glass p-4 rounded-2xl text-left border-l-2 border-l-[#FFC72C]">
            <stat.icon className="w-5 h-5 text-white/40 mb-2" />
            <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</p>
            <p className="text-xl font-black neon-gold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-[10px] font-mono text-white/20">
        CREATED BY <span className="neon-gold">@THE_ME4AJ.KHAN</span>
      </div>
    </motion.div>
  );
}
