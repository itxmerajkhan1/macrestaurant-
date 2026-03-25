import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, ShieldCheck, Sparkles, Zap, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';
import { MENU_JSON } from '../constants';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

const OPENING_LINES = [
  "Welcome to the future of flavor, **{name}**. I'm **Mac**, your AI Concierge. Ready to calibrate your taste buds? ⚡",
  "Neural link established. I'm **Mac**, your guide through the neon menu. What's your command, **{name}**? 🍟",
  "The kitchen is online and I'm **Mac**, your digital dining assistant. What are we craving today, **{name}**? 🍔",
  "Greetings from Sector 7, **{name}**! I'm **Mac**. Let's find you the perfect cyberpunk meal. ⚡",
  "System check: Optimal. I'm **Mac**, your AI Concierge. What's on your mind, **{name}**? 🍦",
  "Welcome back, **{name}**! I'm **Mac**, and I've got the freshest data on our menu. Ready to order? ⚡",
  "Hello, **{name}**! I'm **Mac**, your personal flavor architect. Let's build something delicious. 🍟",
  "The neon is bright and the fries are hot! I'm **Mac**, your AI guide. What's for dinner, **{name}**? 🍔",
  "Neural pathways clear. I'm **Mac**, your concierge. How can I assist your appetite, **{name}**? ⚡",
  "Welcome to the MAC experience, **{name}**. I'm your AI Concierge. Let's make it a meal! 🍟"
];

export default function ChatInterface() {
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userHistory, setUserHistory] = useState<string[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Wait Rule: Guard protected page
  if (authLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#FFC72C] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // JSON Guard: Fallback for userProfile
  const profile = userProfile || {
    displayName: 'CITIZEN',
    dietaryFlags: { vegan: false, halal: false, vegetarian: false, glutenFree: false, noBeef: false }
  };

  useEffect(() => {
    if (profile && messages.length === 0) {
      const name = profile.displayName.split(' ')[0].toUpperCase();
      const line = OPENING_LINES[Math.floor(Math.random() * OPENING_LINES.length)].replace('{name}', name);
      setMessages([{ role: 'assistant', content: line }]);
    }
  }, [profile, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleDietaryFlag = async (flag: keyof typeof profile.dietaryFlags) => {
    if (!profile) return;
    const newFlags = {
      ...profile.dietaryFlags,
      [flag]: !profile.dietaryFlags[flag]
    };
    try {
      await updateUserProfile({ dietaryFlags: newFlags });
      toast.success(`${flag.toUpperCase()} PROTOCOL UPDATED`);
    } catch (error) {
      console.error("Failed to update dietary flags:", error);
      toast.error('FAILED TO UPDATE PROTOCOL');
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading || !profile) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
      
      const activeFlags = Object.entries(profile.dietaryFlags)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      const systemInstruction = `
        You are "Mac", a futuristic AI Concierge for a high-end McDonald's platform. 
        Tone: Cyberpunk, minimalist, efficient, yet warm. 
        Creator: The_me4aj.khan.
        User Name: ${profile.displayName}.
        
        RULES:
        - Suggest 1-3 items from MENU_JSON.
        - Include name, 1-sentence description, and price.
        - IF total order is < $10, ALWAYS suggest "Make it a Meal?" with Fries and Drink.
        - IF time is 05:00-10:30, ONLY suggest Breakfast items first.
        - Respect dietary flags: ${activeFlags.join(', ')}.
        - Style: Use bolding for item names. Use emojis sparingly but effectively (⚡, 🍟, 🍔).
        - Response < 80 words.
        - End with a call-to-action.

        CONTEXT:
        - MENU: ${JSON.stringify(MENU_JSON)}
        - TIME: ${currentTime}
        - HISTORY: ${JSON.stringify(userHistory)}
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.concat(userMessage).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: { systemInstruction, temperature: 0.8 }
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.text || "Connection lost in the neon fog. Try again. ⚡"
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      const suggestedItems = MENU_JSON.filter(item => 
        assistantMessage.content.toLowerCase().includes(item.name.toLowerCase())
      );
      if (suggestedItems.length > 0) {
        setUserHistory(prev => [...suggestedItems.map(i => i.name), ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "System glitch. Re-routing... ⚡" }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!userProfile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="h-full flex flex-col p-4 md:p-8"
    >
      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col md:flex-row glass rounded-3xl overflow-hidden border-white/5">
        {/* Sidebar - Settings */}
        <aside className="w-full md:w-64 bg-white/5 border-r border-white/10 p-6 overflow-y-auto hidden md:block">
          <div className="space-y-8">
            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> DIETARY PROTOCOLS
              </h2>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'halal', label: 'HALAL' },
                  { id: 'vegan', label: 'VEGAN' },
                  { id: 'noBeef', label: 'NO BEEF' },
                  { id: 'glutenFree', label: 'GLUTEN FREE' }
                ].map(flag => (
                  <button
                    key={flag.id}
                    onClick={() => toggleDietaryFlag(flag.id as any)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-tighter transition-all border text-left",
                      userProfile.dietaryFlags[flag.id as keyof typeof userProfile.dietaryFlags] 
                        ? "bg-[#DA291C] border-[#DA291C] text-white shadow-[0_0_10px_rgba(218,41,28,0.3)]" 
                        : "bg-white/5 border-white/10 text-white/40 hover:border-white/20"
                    )}
                  >
                    {flag.label}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" /> RECENT NEURAL INPUTS
              </h2>
              <div className="space-y-2">
                {userHistory.length > 0 ? (
                  userHistory.map((item, i) => (
                    <div key={i} className="text-[10px] p-2 glass rounded border-white/5 text-white/60 font-mono">
                      {item}
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-white/20 italic font-mono">NO HISTORY DETECTED</p>
                )}
              </div>
            </section>
          </div>
        </aside>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col relative bg-white/5">
          {/* Mobile Settings Toggle */}
          <div className="md:hidden p-4 border-b border-white/10 flex gap-2 overflow-x-auto scrollbar-hide">
             {[
                { id: 'halal', label: 'HALAL' },
                { id: 'vegan', label: 'VEGAN' },
                { id: 'noBeef', label: 'NO BEEF' },
                { id: 'glutenFree', label: 'GLUTEN FREE' }
              ].map(flag => (
                <button
                  key={flag.id}
                  onClick={() => toggleDietaryFlag(flag.id as any)}
                  className={cn(
                    "whitespace-nowrap px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter transition-all border",
                    userProfile.dietaryFlags[flag.id as keyof typeof userProfile.dietaryFlags] ? "bg-[#DA291C] border-[#DA291C] text-white" : "bg-white/5 border-white/10 text-white/40"
                  )}
                >
                  {flag.label}
                </button>
              ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}
              >
                <div className={cn(
                  "max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm leading-relaxed",
                  msg.role === 'user' 
                    ? "bg-[#DA291C] text-white rounded-tr-none shadow-[0_0_15px_rgba(218,41,28,0.2)]" 
                    : "glass rounded-tl-none border-white/10"
                )}>
                  <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-strong:neon-gold">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center text-white/40 text-[10px] font-mono">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-[#FFC72C] rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-[#FFC72C] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-[#FFC72C] rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                PROCESSING NEURAL INPUT...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-6 bg-white/5 border-t border-white/10">
            <div className="flex gap-4 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="TYPE YOUR COMMAND..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-sm font-mono focus:outline-none focus:border-[#FFC72C]/50 transition-all placeholder:text-white/20"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-[#FFC72C] text-black p-4 rounded-xl shadow-[0_0_20px_rgba(255,199,44,0.3)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
