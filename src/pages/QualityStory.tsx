import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Leaf, FlaskConical, Zap, Sparkles, ArrowRight, Globe, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

const QualityStory: React.FC = () => {
  const navigate = useNavigate();
  const metrics = [
    { label: "BEEF PURITY", value: "100%", icon: CheckCircle, color: "gold" },
    { label: "POTATO GRADE", value: "8K SELECT", icon: Leaf, color: "red" },
    { label: "OIL FILTRATION", value: "NEURAL-PURE", icon: FlaskConical, color: "gold" },
    { label: "CHICKEN SOURCE", value: "SECTOR 4", icon: ShieldCheck, color: "red" },
  ];

  const handleOrderNow = () => {
    navigate('/menu');
  };

  const handleLearnMore = () => {
    navigate('/legal/neural_link');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-6 md:p-12 overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto w-full space-y-24">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="w-full lg:w-1/2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none neon-gold uppercase italic">QUALITY <br /> STORY</h2>
              <p className="text-white/40 font-mono text-xs tracking-widest uppercase">8K CINEMATIC GRADE INGREDIENTS</p>
            </div>
            
            <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-xl italic">
              In the neon-lit sectors of the future, quality is the only currency that matters. 
              We don't just serve food; we engineer flavor experiences using the purest 
              ingredients sourced from across the globe.
            </p>

            <div className="flex flex-wrap gap-4">
              <motion.button 
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="px-8 py-4 bg-[#DA291C] text-white font-black rounded-xl shadow-[0_0_20px_rgba(218,41,28,0.3)] flex items-center gap-2 uppercase tracking-widest text-xs"
              >
                OUR SOURCES <Globe className="w-5 h-5" />
              </motion.button>
              <motion.button 
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleLearnMore}
                className="px-8 py-4 glass text-white font-black rounded-xl hover:border-[#FFC72C]/50 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
              >
                LEARN MORE <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="aspect-square glass rounded-full overflow-hidden border-4 border-white/5 relative group">
              <img 
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000" 
                alt="Quality Ingredients"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F0F] via-transparent to-transparent opacity-60" />
              
              {/* Floating Metrics */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 w-full px-8">
                {metrics.slice(0, 2).map((m, i) => (
                  <div key={i} className="flex-1 glass p-4 rounded-2xl border-l-2 border-l-[#FFC72C]">
                    <m.icon className="w-4 h-4 text-white/40 mb-1" />
                    <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">{m.label}</p>
                    <p className="text-lg font-black neon-gold italic">{m.value}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-32 h-32 glass rounded-full border border-white/10 animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 glass rounded-full border border-white/10 animate-pulse [animation-delay:1s]" />
          </div>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="space-y-6">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border-l-2 border-l-[#DA291C]">
              <Leaf className="w-6 h-6 neon-red" />
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase italic">SUSTAINABLE SECTORS</h3>
            <p className="text-sm text-white/40 leading-relaxed italic">
              Our potatoes are grown in high-tech vertical farms in Sector 4, 
              using 90% less water than traditional methods. Every fry is a 
              testament to our commitment to the planet.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border-l-2 border-l-[#FFC72C]">
              <ShieldCheck className="w-6 h-6 neon-gold" />
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase italic">NEURAL-PURE BEEF</h3>
            <p className="text-sm text-white/40 leading-relaxed italic">
              100% pure beef, no fillers, no additives. We use advanced 
              spectroscopy to ensure every patty meets our 8K grade standards 
              before it hits the grill.
            </p>
          </div>

          <div className="space-y-6">
            <div className="w-12 h-12 glass rounded-xl flex items-center justify-center border-l-2 border-l-[#DA291C]">
              <Sparkles className="w-6 h-6 neon-red" />
            </div>
            <h3 className="text-2xl font-black tracking-tight uppercase italic">FLAVOR ARCHITECTURE</h3>
            <p className="text-sm text-white/40 leading-relaxed italic">
              Our chefs are flavor architects, designing taste profiles that 
              resonate with your neural pathways. Every bite is calibrated 
              for maximum satisfaction.
            </p>
          </div>
        </div>

        {/* Quality Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <motion.div 
              key={i} 
              whileHover={{ scale: 1.05 }}
              className="glass p-8 rounded-3xl border-l-2 border-l-[#FFC72C] group hover:border-white/20 transition-all"
            >
              <m.icon className={cn("w-8 h-8 mb-4", m.color === 'gold' ? "neon-gold" : "neon-red")} />
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">{m.label}</p>
              <p className="text-3xl font-black tracking-tighter group-hover:neon-gold transition-colors italic">{m.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="glass p-12 rounded-3xl text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#DA291C]/5 via-transparent to-[#FFC72C]/5" />
          <div className="relative space-y-4">
            <h3 className="text-4xl font-black tracking-tight uppercase italic">READY TO EXPERIENCE THE QUALITY?</h3>
            <p className="text-white/40 max-w-2xl mx-auto italic">
              The future of fast food is here. Every ingredient has a story, and every story is 8K cinematic grade. 
              Calibrate your taste buds today.
            </p>
          </div>
          <motion.button 
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={handleOrderNow}
            className="relative px-12 py-5 bg-[#DA291C] text-white font-black rounded-xl shadow-[0_0_30px_rgba(218,41,28,0.4)] text-lg uppercase tracking-widest italic"
          >
            ORDER NOW
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default QualityStory;
