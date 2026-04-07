'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Icon set (Lucide 0.312 stable exports) ────────────────
import {
  Search, Sparkles, Flame, Heart, Book, Church, Star,
  Gift, Calendar, BookOpen, Users, Compass, Video,
  Music, Newspaper, Mic2, MapPin, ListChecks, History,
  Award, HelpCircle, Shield, Plus, Bell, Settings, User,
  CheckCircle, Wallet, Globe, GraduationCap, Scale,
  Library, Music2, Mail, Send, Trophy, Clock, LifeBuoy,
  HeartHandshake, UserCheck, ShoppingCart, Mountain,
  Feather, Zap, Target, PenTool, LayoutGrid, Smartphone,
  Lock, Activity, Scroll, Info, Anchor, Infinity,
  Briefcase, PhoneCall, BarChart2, Camera, ChevronRight, X
} from 'lucide-react';

import { FEATURES, CATEGORIES, REVENUE_CARDS, type Feature, type Category } from './data/features';
import { AD_SLOTS } from '@/lib/adSlots';
import { GoogleAdUnit } from '@/components/ads/GoogleAdUnit';
import { trackHubAction } from '@/lib/analytics';

// ─── Revenue Banners (Emotional pitching) ─────────────────────────────
// Features moved to ./data/features.ts

// ─── AdMob Component ─────────────────────────────
function NativeAdSlot({ id }: { id: string }) {
  // Use production ID from AD_SLOTS
  const adUnitId = AD_SLOTS.app.native; 

  return (
    <div className="my-6 mx-4 rounded-2xl border border-white/5 bg-white/3 overflow-hidden shadow-inner">
      <div className="relative z-0">
        <div className="absolute top-2 left-2 z-10 px-1.5 py-0.5 bg-black/40 backdrop-blur-md text-white text-[8px] font-black uppercase rounded shadow-lg">
          Sponsored
        </div>
        <GoogleAdUnit 
          slot={adUnitId} 
          format="fluid" 
          responsive={true}
          style={{ minHeight: '120px' }}
        />
      </div>
    </div>
  );
}

// ─── Greeting / Header Components ─────────────────────────────
function AppBar({ onSearch }: { onSearch: () => void }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0612]/90 backdrop-blur-xl border-b border-white/5 pt-safe">
      <div className="flex items-center justify-between px-4 h-16">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <span className="text-[#0a0612] font-black text-lg font-serif">M</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none tracking-tight">MyPrayerTower</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onSearch} className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 active:scale-90 transition-transform">
            <Search className="w-5 h-5 text-white/70" />
          </button>
          <Link href="/settings/notifications" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 active:scale-90 transition-transform">
            <Bell className="w-5 h-5 text-white/70" />
          </Link>
        </div>
      </div>
    </header>
  );
}

function HeroSlider() {
  const [idx, setIdx] = useState(0);
  const slides = [
    { title: 'Request a Holy Mass', sub: 'Blessed for your family', cta: 'Offer Now', href: '/mass-offerings', img: '✝️', grad: 'from-blue-600/20 to-indigo-900/40' },
    { title: 'Eternal Memorial Page', sub: 'Remember them forever', cta: 'Create', href: '/memorials/create', img: '🕊️', grad: 'from-rose-600/20 to-purple-900/40' },
    { title: 'Light a Blessed Candle', sub: "Bring God's light to heart", cta: 'Light', href: '/candles', img: '🕯️', grad: 'from-amber-500/20 to-orange-900/40' },
  ];

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="px-4 mb-8">
      <Link href={slides[idx].href} className={`block relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${slides[idx].grad} p-6 active:scale-[0.98] transition-all`}>
        <div className="relative z-10 flex justify-between items-center">
          <div className="max-w-[70%]">
            <h2 className="text-white font-black text-lg leading-tight mb-1">{slides[idx].title}</h2>
            <p className="text-white/60 text-sm mb-4 leading-snug">{slides[idx].sub}</p>
            <span className="inline-flex items-center gap-2 text-[#d4af37] text-xs font-black uppercase tracking-widest bg-[#d4af37]/10 px-3 py-2 rounded-full border border-[#d4af37]/20">
              {slides[idx].cta} <ChevronRight className="w-3 h-3" />
            </span>
          </div>
          <span className="text-5xl opacity-40">{slides[idx].img}</span>
        </div>
      </Link>
    </div>
  );
}

function SanctuarySkeleton() {
  return (
    <div className="min-h-screen bg-[#0a0612] text-white p-6 pt-24">
      <div className="w-48 h-8 bg-white/5 rounded-2xl mb-8 animate-pulse" />
      <div className="w-full h-48 bg-white/5 rounded-3xl mb-12 animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

// ─── Main Sanctuary Hub ─────────────────────────────
function ComingSoonModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0a0612]/90 backdrop-blur-xl">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gradient-to-br from-[#1a0f2c] to-[#0a0612] border border-[#d4af37]/30 rounded-3xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-[#d4af37]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-8 h-8 text-[#d4af37]" />
            </div>
            <h3 className="text-xl font-serif font-bold text-white mb-2">Sacred Expansion</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">This sanctuary feature is currently being blessed and prepared. It will be available in an upcoming update.</p>
            <button onClick={onClose} className="w-full bg-[#d4af37] text-[#0a0612] font-black py-4 rounded-xl active:scale-95 transition-transform">Understood</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Sanctuary Hub ─────────────────────────────
export default function SanctuaryHub() {
  const [mounted, setMounted] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [activeUsers, setActiveUsers] = useState<number>(2000); // Default before mount
  const [streak, setStreak] = useState(0);
  
  useEffect(() => { 
    setMounted(true); 
    // Generate a random number between 2130 and 2999 for community social proof
    setActiveUsers(Math.floor(Math.random() * 869) + 2130);
    
    if (typeof window !== 'undefined') {
      const savedStreak = localStorage.getItem('prayer_streak');
      if (savedStreak) {
        setStreak(parseInt(savedStreak));
      } else {
        // New user starts at Zero
        setStreak(0);
        localStorage.setItem('prayer_streak', '0');
      }
    }
  }, []);

  // ── Phase 4: Sacred Journey Logic (Dynamic Levels) ─────────────────────
  const journeyStats = useMemo(() => {
    // Basic progression logic
    let level = 1;
    let nextGoal = 7;
    let rank = "Seeker of Light";
    
    if (streak >= 90) { level = 5; nextGoal = 365; rank = "Saintly Guardian"; }
    else if (streak >= 30) { level = 4; nextGoal = 90; rank = "Devout Disciple"; }
    else if (streak >= 14) { level = 3; nextGoal = 30; rank = "Spiritual Warrior"; }
    else if (streak >= 7) { level = 2; nextGoal = 14; rank = "Faithful Soul"; }

    const daysTotal = nextGoal - (level === 1 ? 0 : [0, 0, 7, 14, 30, 90][level]);
    const daysDone = streak - (level === 1 ? 0 : [0, 0, 7, 14, 30, 90][level]);
    const progress = Math.min(Math.floor((daysDone / daysTotal) * 100), 99);
    const remains = nextGoal - streak;

    return { level, nextGoal, rank, progress, remains };
  }, [streak]);

  const filteredFeatures = query.length > 1 
    ? FEATURES.filter(f => f.title.toLowerCase().includes(query.toLowerCase()) || f.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  if (!mounted) return <SanctuarySkeleton />;

  return (
    <div className="min-h-screen bg-[#0a0612] text-white selection:bg-[#d4af37]/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,#1a0f2c_0%,#0a0612_70%)] pointer-events-none" />
      
      <AppBar onSearch={() => setSearching(true)} />

      <main className="pt-24 pb-32 relative overflow-hidden">
        {/* ── Phase 3: Sacred Offerings (Revenue Expansion) ── */}
        {/* ── Phase 4: Sacred Journey (Retention - ENHANCED) ── */}
        <section className="px-6 mb-8 mt-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-gradient-to-br from-[#120821] to-[#0a0612] border border-[#d4af37]/30 rounded-[2rem] p-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] group"
          >
            {/* Animated Background Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(212,175,55,0.15),transparent_70%)]" />
            
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-24 h-24 text-[#d4af37]" />
            </div>
            
            <div className="flex items-center gap-5 mb-8 relative z-10">
              <div className="relative">
                <div className="absolute inset-0 bg-[#d4af37]/40 blur-xl rounded-full scale-110 animate-pulse" />
                <div className="w-14 h-14 bg-gradient-to-br from-[#d4af37]/30 to-[#b8860b]/10 rounded-2xl flex items-center justify-center border border-[#d4af37]/40 shadow-[0_0_20px_rgba(212,175,55,0.3)] relative z-10">
                  <Flame className="w-7 h-7 text-[#d4af37] drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-serif font-black text-2xl leading-tight tracking-tight drop-shadow-md">{streak} Day Streak</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.2em]">Level {journeyStats.level}</span>
                  <div className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">{journeyStats.rank}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-end mb-1">
                <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Next Blessing: {journeyStats.remains} Days</span>
                <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-wider">{journeyStats.progress}% to Lvl {journeyStats.level + 1}</span>
              </div>
              <div className="h-2.5 bg-black/40 rounded-full overflow-hidden border border-white/5 p-[1.5px] shadow-inner">
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: `${journeyStats.progress}%` }} 
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[#d4af37] via-amber-400 to-yellow-500 shadow-[0_0_15px_rgba(212,175,55,0.5)] rounded-full relative overflow-hidden" 
                >
                  {/* Shimmer Effect */}
                  <motion.div 
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg]"
                  />
                </motion.div>
              </div>
              <p className="text-white/30 text-[11px] text-center italic mt-6 font-serif">"The Lord is near to all who call on Him."</p>
            </div>
          </motion.div>
        </section>

        {/* ── Phase 3: Sacred Offerings (Revenue Expansion) ── */}
        <section className="px-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.25em]">Sacred Offerings</h3>
            <div className="h-px flex-1 bg-white/5 ml-4" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/mass-offerings" 
              onClick={() => trackHubAction('offerings_click', 'MassOfferings')}
              className="group flex items-center gap-4 bg-gradient-to-r from-[#1a0f2c] to-[#0a0612] border border-[#d4af37]/20 rounded-2xl p-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                <Church className="w-6 h-6 text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Holy Mass Offering</h4>
                <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Starting from $10</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-[#d4af37] transition-colors" />
            </Link>
            <Link 
              href="/candles" 
              onClick={() => trackHubAction('offerings_click', 'Candles')}
              className="group flex items-center gap-4 bg-gradient-to-r from-[#1a0f2c] to-[#0a0612] border border-amber-500/20 rounded-2xl p-4 active:scale-[0.98] transition-all"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500/20 transition-colors">
                <Flame className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm">Light a Virtual Candle</h4>
                <p className="text-white/40 text-[9px] uppercase tracking-widest mt-0.5">Starting from $1</p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-amber-500 transition-colors" />
            </Link>
          </div>
        </section>

        {/* ── Phase 4: Strategic Ad Placement ── */}
        <section className="px-6 mb-12">
           <div className="bg-white/3 border border-white/5 rounded-2xl p-2 shadow-inner">
              <div className="flex items-center justify-between px-2 mb-2">
                 <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/10">Sponsored Devotion</span>
              </div>
              <NativeAdSlot id="hub-inline-1" />
           </div>
        </section>

        {/* ── Community Sanctuary Bar ── */}
        <div className="px-6 mb-12">
          <div className="flex items-center justify-center gap-3 bg-white/5 w-fit mx-auto px-5 py-2.5 rounded-full border border-white/10 backdrop-blur-md shadow-2xl">
             <div className="flex -space-x-2">
               {['bg-blue-500', 'bg-indigo-500', 'bg-purple-500'].map((color, i) => (
                 <div key={i} className={`w-6 h-6 rounded-full border-2 border-[#0a0612] ${color} shadow-lg`} />
               ))}
             </div>
             <p className="text-white/80 text-[11px] font-semibold tracking-tight">
               <span className="text-[#d4af37] font-black">{activeUsers.toLocaleString()}</span> faithful praying now
             </p>
          </div>
        </div>

        {/* Today's Grace Card */}
        <div className="px-6 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest">Today's Grace</h3>
              <Sparkles className="w-4 h-4 text-[#d4af37]" />
            </div>
            <p className="text-white text-base font-serif italic mb-2">"Wait for the Lord; be strong and take heart and wait for the Lord."</p>
            <p className="text-white/40 text-[10px]">Psalm 27:14 • Morning Devotion</p>
            
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#d4af37] text-[10px] font-black uppercase mb-1">Saint of Day</p>
                <p className="text-white font-bold text-xs uppercase">St. Vincent Ferrer</p>
              </div>
              <div className="text-right">
                <p className="text-[#d4af37] text-[10px] font-black uppercase mb-1">Color</p>
                <p className="text-white font-bold text-xs uppercase">Purple</p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Spiritual Checklist */}
        <div className="px-6 mb-12">
          <h3 className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-center">Spiritual Checklist</h3>
          <div className="flex justify-between items-center bg-white/3 border border-white/5 rounded-2xl p-4">
            {[
              { label: 'Mass', active: true },
              { label: 'Rosary', active: false },
              { label: 'Scripture', active: true },
              { label: 'Charity', active: false },
            ].map((task, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${task.active ? 'bg-[#d4af37] border-[#d4af37] text-[#0a0612]' : 'bg-transparent border-white/10 text-white/20'}`}>
                  {task.active ? <CheckCircle className="w-5 h-5" /> : <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />}
                </div>
                <span className={`text-[8px] font-black uppercase tracking-widest ${task.active ? 'text-white' : 'text-white/20'}`}>{task.label}</span>
              </div>
            ))}
          </div>
        </div>

        <HeroSlider />

        {/* Quick Actions (Round Buttons) */}
        <div className="px-6 mb-12">
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: BookOpen, label: 'Readings', href: '/readings', bg: 'bg-indigo-500/30 border-indigo-500/40 text-indigo-300 shadow-[0_4px_20px_rgba(99,102,241,0.25)]' },
              { icon: Music, label: 'Rosary', href: '/prayers/rosary', bg: 'bg-amber-500/30 border-amber-500/40 text-amber-300 shadow-[0_4px_20px_rgba(245,158,11,0.25)]' },
              { icon: Flame, label: 'Candle', href: '/candles', bg: 'bg-orange-500/30 border-orange-500/40 text-orange-300 shadow-[0_4px_20px_rgba(249,115,22,0.25)]' },
              { icon: Heart, label: 'Prayers', href: '/prayers', bg: 'bg-rose-500/30 border-rose-500/40 text-rose-300 shadow-[0_4px_20px_rgba(244,63,94,0.25)]' },
            ].map((q, i) => (
              <Link key={i} href={q.href} className="flex flex-col items-center gap-2 active:scale-90 transition-transform group">
                <div className={`w-14 h-14 ${q.bg} rounded-2xl flex items-center justify-center border group-hover:scale-105 transition-all duration-300`}>
                  <q.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60 group-hover:text-[#d4af37] transition-colors">{q.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Categorized Features */}
        <div className="px-4 space-y-12">
          {CATEGORIES.map(cat => (
            <section key={cat.id}>
              <div className="flex items-center justify-between mb-5 px-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${cat.color}`}>{cat.label}</h3>
                </div>
                <span className="h-px flex-1 bg-white/5 ml-4" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {FEATURES.filter(f => f.category === cat.id).map(f => (
                  <Link 
                    key={f.title} 
                    href={f.href} 
                    onClick={(e) => {
                      if (f.href === '#coming-soon') {
                        e.preventDefault();
                        setShowComingSoon(true);
                      }
                    }}
                    className="flex flex-col bg-white/[0.12] border border-white/20 hover:border-[#d4af37]/50 rounded-2xl p-5 active:scale-95 transition-all relative overflow-hidden shadow-2xl"
                  >
                    <div className={`w-12 h-12 ${f.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg border border-white/5`}>
                      <f.icon className="w-6 h-6" />
                    </div>
                    {f.badge && <span className="absolute top-2 right-2 text-[9px] font-black bg-[#d4af37] text-[#0a0612] px-2 py-0.5 rounded-full shadow-md z-10">{f.badge}</span>}
                    <h4 className="text-white font-black text-sm leading-tight mb-1.5 tracking-tight">{f.title}</h4>
                    <p className="text-white/60 text-[11px] leading-relaxed line-clamp-2 font-medium">{f.description}</p>
                  </Link>
                ))}
              </div>

              {/* Contextual Revenue CTA after certain categories */}
              {cat.id === 'offerings' && (
                <Link href="/mass-offerings" className="mt-6 block border border-[#d4af37]/30 bg-gradient-to-r from-[#d4af37]/10 to-transparent p-5 rounded-3xl active:scale-[0.98] transition-transform">
                   <div className="flex justify-between items-center">
                     <div>
                       <p className="text-white font-black text-sm mb-1">Request a Holy Mass ✝️</p>
                       <p className="text-white/50 text-[10px]">The greatest prayer we can offer for a soul.</p>
                     </div>
                     <span className="bg-[#d4af37] text-[#0a0612] text-[10px] font-black px-4 py-2 rounded-xl">Book Mass</span>
                   </div>
                </Link>
              )}
              
              {cat.id === 'memorials' && (
                <Link href="/memorials/create" className="mt-6 block border border-rose-500/30 bg-gradient-to-r from-rose-500/10 to-transparent p-5 rounded-3xl active:scale-[0.98] transition-transform">
                   <div className="flex justify-between items-center">
                     <div>
                       <p className="text-white font-black text-sm mb-1">Eternal Memorial Page 🕊️</p>
                       <p className="text-white/50 text-[10px]">Create a lasting tribute for your loved ones.</p>
                     </div>
                     <span className="bg-rose-600 text-white text-[10px] font-black px-4 py-2 rounded-xl">Create Now</span>
                   </div>
                </Link>
              )}

              {/* Strategic Ads */}
              {(cat.id === 'knowledge' || cat.id === 'community') && <NativeAdSlot id={`ad-${cat.id}`} />}
            </section>
          ))}
        </div>

        <footer className="mt-20 px-10 text-center pb-12">
            <div className="w-14 h-14 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Flame className="w-7 h-7 text-[#d4af37]" />
            </div>
            <p className="text-white/80 text-sm font-serif italic mb-3">"Be still, and know that I am God."</p>
            <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.4em]">MyPrayerTower v7.2</p>
        </footer>
      </main>

      {/* Bottom Nav removed (now in root layout) */}

      {/* Search Overlay */}
      <AnimatePresence>
        {searching && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[100] bg-[#0a0612] pt-safe p-6 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 h-14 flex items-center gap-3">
                <Search className="w-5 h-5 text-white/30" />
                <input autoFocus placeholder="Search features..." className="flex-1 bg-transparent text-white outline-none font-medium" value={query} onChange={e => setQuery(e.target.value)} />
              </div>
              <button onClick={() => { setSearching(false); setQuery(''); }} className="w-14 h-14 border border-white/10 rounded-2xl flex items-center justify-center active:scale-90 transition-transform">
                <X className="w-6 h-6 text-white/50" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <p className="text-[#d4af37] text-[10px] font-black uppercase tracking-widest mb-6 px-2">{query.length > 1 ? 'Search Results' : 'Suggested'}</p>
              <div className="grid grid-cols-2 gap-3 pb-20">
                {(query.length > 1 ? filteredFeatures : FEATURES.slice(0, 10)).map(f => (
                  <Link key={f.title} href={f.href} onClick={() => setSearching(false)} className="flex flex-col bg-white/4 border border-white/5 rounded-2xl p-4">
                    <div className={`w-10 h-10 ${f.color} rounded-xl flex items-center justify-center mb-3`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-white font-bold text-xs mb-1">{f.title}</h4>
                    <p className="text-white/30 text-[10px] line-clamp-1">{f.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ComingSoonModal isOpen={showComingSoon} onClose={() => setShowComingSoon(false)} />
    </div>
  );
}
