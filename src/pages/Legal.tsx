import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, FileText, Cpu, ChevronLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '../lib/utils';

const LEGAL_CONTENT = {
  PRIVACY: {
    title: 'PRIVACY PROTOCOL',
    icon: Lock,
    content: 'Your neural data is encrypted using AES-256 standards. We do not sell your flavor profiles to third-party megacorporations. All biometric inputs are stored in isolated Sector 7 hubs.',
    color: 'gold'
  },
  TERMS: {
    title: 'TERMS OF SERVICE',
    icon: FileText,
    content: 'By accessing the MAC Neural Link, you agree to the Sector 7 Hub regulations. Any unauthorized hacking of the AI Concierge will result in immediate credit forfeiture.',
    color: 'red'
  },
  SECURITY: {
    title: 'SECURITY CLEARANCE',
    icon: ShieldCheck,
    content: 'Our systems are protected by advanced ICE (Intrusion Countermeasures Electronics). Multi-factor neural authentication is mandatory for all high-value transactions.',
    color: 'gold'
  },
  NEURAL_LINK: {
    title: 'NEURAL LINK INTERFACE',
    icon: Cpu,
    content: 'The MAC Neural Link provides a direct interface between your taste buds and our flavor architects. By using this interface, you acknowledge that flavor hallucinations are a known side effect.',
    color: 'red'
  }
};

const Legal: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const content = LEGAL_CONTENT[type?.toUpperCase() as keyof typeof LEGAL_CONTENT] || LEGAL_CONTENT.PRIVACY;

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6 md:p-12 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full glass p-12 rounded-[40px] border-white/10 space-y-8 relative overflow-hidden"
      >
        <div className={cn(
          "absolute top-0 left-0 w-full h-1",
          content.color === 'gold' ? "bg-[#FFC72C]" : "bg-[#DA291C]"
        )} />

        <button 
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">BACK TO HUB</span>
        </button>

        <div className="space-y-6">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center",
            content.color === 'gold' ? "bg-[#FFC72C]/10" : "bg-[#DA291C]/10"
          )}>
            <content.icon className={cn(
              "w-8 h-8",
              content.color === 'gold' ? "neon-gold" : "neon-red"
            )} />
          </div>

          <div className="space-y-2">
            <h2 className={cn(
              "text-4xl font-black tracking-tighter uppercase italic",
              content.color === 'gold' ? "neon-gold" : "neon-red"
            )}>
              {content.title}
            </h2>
            <p className="text-[10px] font-mono text-white/40 tracking-widest uppercase">LEGAL_DOC_V4.2.0</p>
          </div>

          <p className="text-lg text-white/60 leading-relaxed font-light italic">
            {content.content}
          </p>
        </div>

        <div className="pt-8 border-t border-white/10">
          <motion.button
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
          >
            ACKNOWLEDGE & RETURN
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Legal;
