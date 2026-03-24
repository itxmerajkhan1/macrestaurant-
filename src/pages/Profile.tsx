import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Settings, 
  History, 
  CreditCard, 
  LogOut, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Star,
  Edit3,
  Camera,
  Check,
  X,
  Plus,
  Trash2,
  Calendar
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Profile() {
  const { userProfile, logout, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState(userProfile?.displayName || '');
  const [editBio, setEditBio] = useState(userProfile?.bio || '');

  // Sync edit states when userProfile changes and we're not editing
  React.useEffect(() => {
    if (!isEditing) {
      setEditName(userProfile?.displayName || '');
      setEditBio(userProfile?.bio || '');
    }
  }, [userProfile, isEditing]);
  const [uploading, setUploading] = useState(false);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardExpiry, setNewCardExpiry] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!userProfile) return null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: editName,
        bio: editBio
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userProfile) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profiles/${userProfile.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: url });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const toggleDietary = async (key: keyof typeof userProfile.dietaryFlags) => {
    const newFlags = {
      ...userProfile.dietaryFlags,
      [key]: !userProfile.dietaryFlags[key]
    };
    await updateUserProfile({ dietaryFlags: newFlags });
  };

  const addCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCardNumber.length !== 16) return;
    
    const currentCards = userProfile.paymentCards || [];
    const newCards = [...currentCards, { number: newCardNumber, expiry: newCardExpiry }];
    
    await updateUserProfile({ paymentCards: newCards });
    setNewCardNumber('');
    setNewCardExpiry('');
    setShowCardForm(false);
  };

  const removeCard = async (index: number) => {
    const currentCards = userProfile.paymentCards || [];
    const newCards = currentCards.filter((_, i) => i !== index);
    await updateUserProfile({ paymentCards: newCards });
  };

  const stats = [
    { label: "TOTAL ORDERS", value: userProfile.orderHistory.length.toString(), icon: History },
    { label: "SAVINGS", value: "$0.00", icon: Zap },
    { label: "REWARDS", value: "0", icon: Star },
  ];

  const hoverScale = { scale: 1.05 };
  const tapScale = { scale: 0.95 };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full flex flex-col p-6 md:p-12 overflow-y-auto bg-[#0F0F0F]"
    >
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              {/* Circular Glassmorphic Image Container */}
              <motion.div 
                whileHover={hoverScale}
                className="w-32 h-32 rounded-full p-1 glass backdrop-blur-2xl border-2 border-[#FFC72C]/30 shadow-[0_0_30px_rgba(255,199,44,0.2)] overflow-hidden relative"
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                  {userProfile.photoURL ? (
                    <img 
                      src={userProfile.photoURL} 
                      alt={userProfile.displayName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className="w-16 h-16 text-white/10" />
                  )}
                </div>
                
                {/* Upload Overlay */}
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1"
                >
                  <Camera className="w-6 h-6 text-[#FFC72C]" />
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">UPDATE</span>
                </button>
                
                {uploading && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </motion.div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
                accept="image/*"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#DA291C] p-2.5 rounded-full shadow-[0_0_15px_rgba(218,41,28,0.5)] border-2 border-[#0F0F0F]">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h2 className="text-5xl font-black tracking-tighter neon-gold uppercase italic">
                  {userProfile.displayName}
                </h2>
                <motion.button
                  whileHover={hoverScale}
                  whileTap={tapScale}
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 glass rounded-xl border-[#FFC72C]/20 text-[#FFC72C] hover:bg-[#FFC72C]/10 transition-colors"
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                </motion.button>
              </div>
              <p className="text-white/40 font-mono text-xs tracking-widest uppercase">{userProfile.email}</p>
              {userProfile.bio && (
                <p className="text-white/60 text-sm max-w-md font-medium leading-relaxed italic">
                  "{userProfile.bio}"
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black neon-red border-[#DA291C]/30 uppercase tracking-widest italic">ELITE CITIZEN</span>
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black neon-gold border-[#FFC72C]/30 uppercase tracking-widest italic">0 CREDITS</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <motion.button 
              whileHover={hoverScale}
              whileTap={tapScale}
              className="p-5 glass rounded-2xl hover:border-[#FFC72C]/40 transition-all group"
            >
              <Settings className="w-6 h-6 text-white/40 group-hover:neon-gold transition-colors" />
            </motion.button>
            <motion.button 
              whileHover={hoverScale}
              whileTap={tapScale}
              onClick={() => logout()}
              className="p-5 glass rounded-2xl hover:border-[#DA291C]/40 transition-all group"
            >
              <LogOut className="w-6 h-6 text-white/40 group-hover:neon-red transition-colors" />
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleUpdateProfile} className="glass p-8 rounded-3xl border-[#FFC72C]/20 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#FFC72C] uppercase tracking-widest ml-1">DISPLAY NAME</label>
                    <input 
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-bold"
                      placeholder="NEURAL_ALIAS"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#FFC72C] uppercase tracking-widest ml-1">BIO / STATUS</label>
                    <input 
                      type="text"
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-bold"
                      placeholder="SYSTEM_MESSAGE"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-3 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white"
                  >
                    CANCEL
                  </motion.button>
                  <motion.button
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    type="submit"
                    disabled={saving}
                    className="px-8 py-3 bg-[#FFC72C] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,199,44,0.3)] flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        SAVING...
                      </>
                    ) : (
                      'SAVE CHANGES'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div 
                  key={i} 
                  whileHover={hoverScale}
                  className="glass p-8 rounded-3xl border-l-4 border-l-[#FFC72C] group hover:border-white/20 transition-all"
                >
                  <stat.icon className="w-6 h-6 text-white/40 mb-4 group-hover:neon-gold transition-colors" />
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-black tracking-tighter group-hover:neon-gold transition-colors italic">{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Dietary Preferences */}
            <div className="glass p-8 rounded-3xl border-t-4 border-t-[#DA291C] space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <ShieldCheck className="w-7 h-7 neon-red" /> DIETARY PROTOCOLS
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'halal', label: 'HALAL', icon: ShieldCheck },
                  { id: 'vegetarian', label: 'VEGETARIAN', icon: Zap },
                  { id: 'glutenFree', label: 'GLUTEN FREE', icon: Sparkles },
                ].map((pref) => (
                  <motion.button
                    key={pref.id}
                    whileHover={hoverScale}
                    whileTap={tapScale}
                    onClick={() => toggleDietary(pref.id as any)}
                    className={cn(
                      "p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                      userProfile.dietaryFlags[pref.id as keyof typeof userProfile.dietaryFlags]
                        ? "bg-[#DA291C]/20 border-[#DA291C] text-white shadow-[0_0_20px_rgba(218,41,28,0.2)]"
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    )}
                  >
                    <pref.icon className={cn(
                      "w-6 h-6 transition-colors",
                      userProfile.dietaryFlags[pref.id as keyof typeof userProfile.dietaryFlags] ? "neon-red" : "group-hover:text-white"
                    )} />
                    <span className="text-xs font-black tracking-widest uppercase">{pref.label}</span>
                    <div className={cn(
                      "w-10 h-5 rounded-full p-1 transition-colors relative",
                      userProfile.dietaryFlags[pref.id as keyof typeof userProfile.dietaryFlags] ? "bg-[#DA291C]" : "bg-white/10"
                    )}>
                      <div className={cn(
                        "w-3 h-3 bg-white rounded-full transition-all",
                        userProfile.dietaryFlags[pref.id as keyof typeof userProfile.dietaryFlags] ? "translate-x-5" : "translate-x-0"
                      )} />
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-[#FFC72C]">
              <div className="p-8 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <History className="w-7 h-7 neon-gold" /> NEURAL LOGS
                </h3>
                <motion.button 
                  whileHover={hoverScale}
                  className="text-[10px] font-black neon-gold hover:underline uppercase tracking-widest"
                >
                  VIEW ALL
                </motion.button>
              </div>
              
              <div className="divide-y divide-white/10">
                {userProfile.orderHistory.length > 0 ? (
                  userProfile.orderHistory.map((order) => (
                    <div key={order.id} className="p-8 flex items-center justify-between hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center border-l-4 border-l-[#DA291C]">
                          <Zap className="w-7 h-7 text-white/40 group-hover:neon-red transition-colors" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black group-hover:neon-gold transition-colors italic">{order.items.join(', ')}</p>
                          <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-2">
                        <p className="text-xl font-black tracking-tighter italic">${order.total.toFixed(2)}</p>
                        <span className="text-[8px] font-black text-[#FFC72C] uppercase tracking-widest border border-[#FFC72C]/30 px-3 py-1 rounded-lg">DELIVERED</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-16 text-center">
                    <p className="text-white/20 font-mono text-xs uppercase tracking-widest italic tracking-[0.2em]">NO NEURAL LOGS DETECTED</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Wallet / Cards */}
            <div className="glass p-8 rounded-3xl border-t-4 border-t-[#FFC72C] space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                    <CreditCard className="w-7 h-7 neon-gold" /> MY CARDS
                  </h3>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">ENCRYPTED WALLET</p>
                </div>
                <motion.button
                  whileHover={hoverScale}
                  whileTap={tapScale}
                  onClick={() => setShowCardForm(!showCardForm)}
                  className="p-2 glass rounded-xl border-[#FFC72C]/20 text-[#FFC72C]"
                >
                  {showCardForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </motion.button>
              </div>

              <AnimatePresence>
                {showCardForm && (
                  <motion.form
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onSubmit={addCard}
                    className="space-y-4 p-4 glass rounded-2xl border-[#FFC72C]/10"
                  >
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-[#FFC72C] uppercase tracking-widest">CARD NUMBER (16 DIGITS)</label>
                      <input 
                        type="text"
                        maxLength={16}
                        value={newCardNumber}
                        onChange={(e) => setNewCardNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-mono"
                        placeholder="0000 0000 0000 0000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-[#FFC72C] uppercase tracking-widest">EXPIRY (MM/YY)</label>
                      <input 
                        type="text"
                        maxLength={5}
                        value={newCardExpiry}
                        onChange={(e) => setNewCardExpiry(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white text-xs font-mono"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <motion.button
                      whileHover={hoverScale}
                      whileTap={tapScale}
                      type="submit"
                      className="w-full py-3 bg-[#FFC72C] text-black text-[10px] font-black uppercase tracking-widest rounded-xl"
                    >
                      REGISTER CARD
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
              
              <div className="space-y-4">
                {userProfile.paymentCards && userProfile.paymentCards.length > 0 ? (
                  userProfile.paymentCards.map((card, i) => (
                    <motion.div 
                      key={i}
                      whileHover={hoverScale}
                      className="p-5 glass rounded-2xl border-white/10 flex items-center justify-between group hover:border-[#FFC72C]/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                          <CreditCard className="w-6 h-6 text-white/40 group-hover:neon-gold transition-colors" />
                        </div>
                        <div>
                          <p className="text-sm font-black italic">•••• {card.number.slice(-4)}</p>
                          <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">EXP: {card.expiry}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeCard(i)}
                        className="p-2 text-white/20 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="p-8 text-center glass rounded-2xl border-dashed border-white/10">
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">NO CARDS DETECTED</p>
                  </div>
                )}
              </div>
            </div>

            {/* Security Status */}
            <div className="glass p-8 rounded-3xl border-t-4 border-t-[#DA291C] space-y-8">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <ShieldCheck className="w-7 h-7 neon-red" /> SECURITY
                </h3>
                <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SYSTEM STATUS: OPTIMAL</p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: 'NEURAL LINK', value: 'ENCRYPTED', icon: Zap },
                  { label: '2FA STATUS', value: 'ACTIVE', icon: ShieldCheck },
                  { label: 'LAST ACCESS', value: 'JUST NOW', icon: Calendar },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 glass rounded-xl border-white/5">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4 text-[#DA291C]" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-[#FFC72C] uppercase tracking-widest italic">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
