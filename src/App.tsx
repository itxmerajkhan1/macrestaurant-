import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  Bot, 
  Utensils, 
  Tag, 
  ShieldCheck, 
  User as UserIcon, 
  MapPin, 
  ChevronRight,
  Zap,
  Sparkles,
  LogOut
} from 'lucide-react';
import { cn } from './lib/utils';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider, useCart } from './contexts/CartContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';
import CartDrawer from './components/CartDrawer';
import { ShoppingCart } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import ChatInterface from './pages/ChatInterface';
import Deals from './pages/Deals';
import QualityStory from './pages/QualityStory';
import Profile from './pages/Profile';
import Locator from './pages/Locator';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';

type Page = 'home' | 'menu' | 'concierge' | 'deals' | 'quality' | 'profile' | 'locator';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, userProfile, loading, logout } = useAuth();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-yellow-400 font-mono text-xs tracking-widest">INITIALIZING NEURAL LINK...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'home', label: 'HOME', icon: Zap },
    { id: 'concierge', label: 'AI CONCIERGE', icon: Bot },
    { id: 'menu', label: 'MENU', icon: Utensils },
    { id: 'deals', label: 'DEALS', icon: Tag },
    { id: 'quality', label: 'QUALITY', icon: ShieldCheck },
    { id: 'profile', label: 'PROFILE', icon: UserIcon },
    { id: 'locator', label: 'LOCATOR', icon: MapPin },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home onNavigate={setCurrentPage} />;
      case 'menu': return <Menu />;
      case 'concierge': return <ChatInterface />;
      case 'deals': return <Deals />;
      case 'quality': return <QualityStory />;
      case 'profile': return <Profile />;
      case 'locator': return <Locator />;
      default: return <Home onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white font-sans selection:bg-[#FFC72C] selection:text-black overflow-x-hidden">
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
        <Route path="/checkout" element={user ? <Checkout /> : <Navigate to="/login" />} />
        <Route path="/" element={
          user ? (
            <>
              {/* Background Effects */}
              <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#DA291C]/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#FFC72C]/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/carbon-fibre.png")' }} />
              </div>

              {/* Header */}
              <header className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
                scrolled ? "glass py-3 border-b border-white/5" : "bg-transparent"
              )}>
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <button 
                    onClick={() => setCurrentPage('home')}
                    className="flex items-center gap-2 group"
                  >
                    <div className="w-10 h-10 bg-[#DA291C] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(218,41,28,0.4)] group-hover:scale-110 transition-transform">
                      <span className="text-2xl font-black text-white italic">M</span>
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-xl font-black tracking-tighter leading-none neon-gold">MAC</span>
                      <span className="text-[8px] font-mono tracking-widest text-white/40 uppercase">SECTOR 7 HUB</span>
                    </div>
                  </button>

                  {/* Desktop Nav */}
                  <nav className="hidden lg:flex items-center gap-1 glass p-1 rounded-2xl border-white/5">
                    {navItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setCurrentPage(item.id as Page)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-bold tracking-widest transition-all flex items-center gap-2",
                          currentPage === item.id 
                            ? "bg-white/10 text-[#FFC72C] shadow-inner" 
                            : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        <item.icon className="w-3 h-3" />
                        {item.label}
                      </button>
                    ))}
                  </nav>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => setCurrentPage('profile')}
                      className="hidden sm:flex items-center gap-3 glass px-4 py-2 rounded-xl border-white/5 hover:border-white/20 transition-all group"
                    >
                      <div className="text-right">
                        <p className="text-[10px] font-bold neon-gold uppercase">{userProfile?.displayName || 'CITIZEN'}</p>
                        <p className="text-[8px] font-mono text-white/40">ELITE STATUS</p>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-[#FFC72C] transition-colors overflow-hidden">
                        {userProfile?.photoURL ? (
                          <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4 group-hover:text-black transition-colors" />
                        )}
                      </div>
                    </button>

                    <button 
                      onClick={() => logout()}
                      className="hidden sm:flex p-3 glass rounded-xl border-white/5 hover:border-red-500/50 transition-all text-white/40 hover:text-red-500"
                      title="LOGOUT"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>

                    <button 
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className="lg:hidden p-3 glass rounded-xl border-white/5 hover:border-white/20 transition-all"
                    >
                      {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </header>

              {/* Mobile Menu Overlay */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, x: '100%' }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: '100%' }}
                    className="fixed inset-0 z-40 glass backdrop-blur-2xl lg:hidden flex flex-col p-8 pt-24"
                  >
                    <div className="space-y-4">
                      {navItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentPage(item.id as Page);
                            setIsMenuOpen(false);
                          }}
                          className={cn(
                            "w-full p-6 rounded-2xl flex items-center justify-between group transition-all border",
                            currentPage === item.id 
                              ? "bg-[#DA291C] border-[#DA291C] text-white shadow-[0_0_20px_rgba(218,41,28,0.3)]" 
                              : "bg-white/5 border-white/10 text-white/40"
                          )}
                        >
                          <div className="flex items-center gap-4">
                            <item.icon className="w-6 h-6" />
                            <span className="text-xl font-black tracking-tighter">{item.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 opacity-40 group-hover:translate-x-1 transition-transform" />
                        </button>
                      ))}
                      
                      <button
                        onClick={() => logout()}
                        className="w-full p-6 rounded-2xl flex items-center justify-between group transition-all border bg-red-600/10 border-red-600/20 text-red-500"
                      >
                        <div className="flex items-center gap-4">
                          <LogOut className="w-6 h-6" />
                          <span className="text-xl font-black tracking-tighter">LOGOUT</span>
                        </div>
                      </button>
                    </div>

                    <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                          {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold uppercase">{userProfile?.displayName || 'CITIZEN'}</p>
                          <p className="text-[10px] font-mono text-[#FFC72C]">ELITE STATUS</p>
                        </div>
                      </div>
                      <Sparkles className="w-6 h-6 neon-gold" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Content */}
              <main className="pt-24 min-h-screen relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full"
                  >
                    {renderPage()}
                  </motion.div>
                </AnimatePresence>
              </main>

              {/* Floating Cart Icon */}
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(true)}
                className="fixed bottom-8 right-8 z-[55] w-16 h-16 glass rounded-2xl border-[#FFC72C]/30 shadow-[0_0_30px_rgba(255,199,44,0.2)] flex items-center justify-center group"
              >
                <ShoppingCart className="w-7 h-7 text-white/60 group-hover:neon-gold transition-colors" />
                {totalItems > 0 && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-[#FFC72C] text-black text-[10px] font-black rounded-lg flex items-center justify-center shadow-[0_0_10px_rgba(255,199,44,0.5)]"
                  >
                    {totalItems}
                  </motion.div>
                )}
              </motion.button>

              {/* Cart Drawer */}
              <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

              {/* Footer Credit */}
              <footer className="py-12 px-6 border-t border-white/5 relative z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white/40" />
                    </div>
                    <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
                      MAC OS V4.2.0 // SECTOR 7 HUB // <span className="neon-gold">@THE_ME4AJ.KHAN</span>
                    </p>
                  </div>
                  
                  <div className="flex gap-6">
                    {['PRIVACY', 'TERMS', 'SECURITY', 'NEURAL_LINK'].map(link => (
                      <button key={link} className="text-[10px] font-mono text-white/20 hover:text-white transition-colors uppercase tracking-widest">
                        {link}
                      </button>
                    ))}
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <Navigate to="/login" />
          )
        } />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
            <Toaster position="top-center" richColors />
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
