import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  MapPin, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  ShoppingCart,
  ChevronLeft,
  Mail,
  Phone,
  Building2,
  Hash
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cvv: '',
    expiry: ''
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <ShoppingCart className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter uppercase italic">YOUR CART IS EMPTY</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-[#FFC72C] text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,199,44,0.3)]"
          >
            RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newOrderId = `#MC-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);
    setIsProcessing(false);
    setIsSuccess(true);
    
    // Trigger Confetti
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC72C', '#DA291C', '#FFFFFF']
    });

    clearCart();
    toast.success('ORDER TRANSMITTED TO SECTOR 7! 🚀');
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md glass p-12 rounded-[40px] border-[#00FF00]/20 shadow-[0_0_50px_rgba(0,255,0,0.1)]"
        >
          <div className="w-24 h-24 bg-[#00FF00]/10 rounded-full flex items-center justify-center mx-auto border-2 border-[#00FF00]/30 shadow-[0_0_40px_rgba(0,255,0,0.2)]">
            <CheckCircle2 className="w-12 h-12 text-[#00FF00] animate-bounce" />
          </div>
          <div className="space-y-2">
            <h2 className="text-5xl font-black tracking-tighter uppercase italic text-[#00FF00] drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">CONFIRMED</h2>
            <p className="text-white/40 font-mono text-xs tracking-widest uppercase">ORDER {orderId} TRANSMITTED</p>
          </div>
          <div className="space-y-4">
            <p className="text-white/80 text-lg font-black italic">
              Order Confirmed! Your Big Mac is on the way! 🍟
            </p>
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest">
              REDIRECTING TO HUB IN 5 SECONDS...
            </p>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-5 bg-[#FFC72C] text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,199,44,0.3)] flex items-center justify-center gap-2 group"
          >
            RETURN TO HUB <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">BACK TO MENU</span>
          </button>
          <div className="text-right">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic neon-gold">CHECKOUT</h2>
            <p className="text-[8px] font-mono text-white/40 tracking-widest uppercase">SECURE NEURAL TRANSACTION</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              {/* Contact Info */}
              <div className="glass p-8 rounded-3xl border-t-4 border-t-[#FFC72C] space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <User className="w-6 h-6 neon-gold" /> CONTACT INFO
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">FULL NAME</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-bold"
                        placeholder="CITIZEN NAME"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">EMAIL</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-bold"
                          placeholder="NEURAL_MAIL@LINK.COM"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">PHONE</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-bold"
                          placeholder="+1 000 000 0000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="glass p-8 rounded-3xl border-t-4 border-t-[#DA291C] space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <MapPin className="w-6 h-6 neon-red" /> SHIPPING PROTOCOL
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">ADDRESS</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#DA291C]/50 transition-all font-bold"
                        placeholder="SECTOR / HUB / UNIT"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">CITY</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#DA291C]/50 transition-all font-bold"
                          placeholder="NEO-CITY"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">ZIP CODE</label>
                      <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input 
                          required
                          type="text"
                          value={formData.zip}
                          onChange={(e) => setFormData({...formData, zip: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#DA291C]/50 transition-all font-bold"
                          placeholder="00000"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div className="glass p-8 rounded-3xl border-t-4 border-t-[#FFC72C] space-y-6">
                <h3 className="text-xl font-black tracking-tight flex items-center gap-3 uppercase italic">
                  <CreditCard className="w-6 h-6 neon-gold" /> PAYMENT ENCRYPTION
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">CARD NUMBER</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        required
                        type="text"
                        maxLength={16}
                        value={formData.cardNumber}
                        onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-mono font-bold"
                        placeholder="0000 0000 0000 0000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">EXPIRY</label>
                    <input 
                      required
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({...formData, expiry: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/40 uppercase tracking-widest ml-1">CVV</label>
                    <input 
                      required
                      type="password"
                      maxLength={3}
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-[#FFC72C]/50 transition-all font-mono font-bold"
                      placeholder="***"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isProcessing}
                className="w-full py-6 bg-[#FFC72C] text-black rounded-3xl text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(255,199,44,0.3)] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-4 border-black border-t-transparent rounded-full animate-spin" />
                    PROCESSING TRANSACTION...
                  </>
                ) : (
                  <>
                    PLACE NEURAL ORDER <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Summary Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-3xl border-white/10 space-y-8 sticky top-32">
              <h3 className="text-xl font-black tracking-tight uppercase italic flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-white/40" /> ORDER SUMMARY
              </h3>

              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 scrollbar-hide">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden glass border border-white/5">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="font-black text-sm uppercase italic group-hover:neon-gold transition-colors">{item.name}</h4>
                        <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">QTY: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black italic">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/10">
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <span>SUBTOTAL</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-white/40 uppercase tracking-widest">
                  <span>NEURAL SURCHARGE (TAX)</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <p className="text-[10px] font-mono text-[#FFC72C] uppercase tracking-widest font-black">TOTAL PAYABLE</p>
                  <p className="text-4xl font-black tracking-tighter italic neon-gold">${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
                <ShieldCheck className="w-8 h-8 text-[#FFC72C]" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">SECURE TRANSACTION</p>
                  <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest">AES-256 NEURAL ENCRYPTION ACTIVE</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
