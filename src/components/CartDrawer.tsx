import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingCart, Trash2, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, removeFromCart, clearCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const upsellThreshold = 10;
  const showUpsell = totalPrice > 0 && totalPrice < upsellThreshold;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass backdrop-blur-2xl z-[70] border-l border-white/10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFC72C] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(255,199,44,0.3)]">
                  <ShoppingCart className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tighter italic uppercase">NEURAL CART</h3>
                  <p className="text-[8px] font-mono text-white/40 tracking-widest uppercase">SECTOR 7 HUB</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors"
              >
                <X className="w-6 h-6 text-white/40" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-20 h-20 rounded-2xl overflow-hidden glass border border-white/5">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="font-black text-sm uppercase italic group-hover:neon-gold transition-colors">{item.name}</h4>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">QTY: {item.quantity}</p>
                      <p className="text-sm font-black tracking-tighter italic">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-white/20 hover:text-[#DA291C] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white/10" />
                  </div>
                  <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest italic">NO NEURAL INPUTS DETECTED</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 glass border-t border-white/10 space-y-6">
              {showUpsell && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-[#FFC72C]/10 border border-[#FFC72C]/30 flex items-center gap-3 group"
                >
                  <Sparkles className="w-5 h-5 neon-gold animate-pulse" />
                  <p className="text-[10px] font-black neon-gold uppercase tracking-widest italic">
                    Hungry? Make it a Meal for just $3 more!
                  </p>
                </motion.div>
              )}

              <div className="space-y-2">
                <div className="flex justify-between items-end">
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">SUBTOTAL</p>
                  <p className="text-2xl font-black tracking-tighter italic">${totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono text-white/20 uppercase tracking-widest">
                  <span>TAX (NEURAL SURCHARGE)</span>
                  <span>$0.00</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={clearCart}
                  className="flex-1 py-4 glass rounded-xl text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#DA291C] transition-colors"
                >
                  CLEAR
                </button>
                <button 
                  className="flex-[2] py-4 bg-[#FFC72C] text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,199,44,0.3)] flex items-center justify-center gap-2 group"
                  onClick={handleCheckout}
                >
                  PROCEED TO CHECKOUT <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
