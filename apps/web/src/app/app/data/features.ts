import React from 'react';
import {
  Sparkles, Flame, Heart, Book, Church, Star,
  Gift, Calendar, BookOpen, Users, Compass, Video,
  Music, Newspaper, Mic2, MapPin, ListChecks, History,
  Award, HelpCircle, Shield, Plus, Bell, Settings, User,
  CheckCircle, Wallet, Globe, GraduationCap, Scale,
  Library, Music2, Mail, Send, Trophy, Clock, LifeBuoy,
  HeartHandshake, UserCheck, ShoppingCart, Mountain,
  Feather, Zap, Target, PenTool, LayoutGrid, Lock, 
  Infinity, Scroll, Briefcase
} from 'lucide-react';

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  badge?: string;
  isPremium?: boolean;
  category: Category;
}

export type Category =
  | 'prayer' | 'offerings' | 'memorials' | 'knowledge'
  | 'church' | 'community' | 'media' | 'account';

export const ALL_FEATURES: Feature[] = [
  // ── 1. PRAYER & DEVOTION ──────────────────────────────────────────────────
  { title: 'Prayer Wall',       description: 'Post & pray for global intentions',  icon: Heart,         href: '/prayer-wall',         color: 'bg-indigo-500/10 text-indigo-400',   category: 'prayer' },
  { title: 'Prayer Library',    description: '4,000+ sacred Catholic prayers',      icon: Library,       href: '/prayers',             color: 'bg-blue-500/10 text-blue-400',       category: 'prayer' },
  { title: 'Holy Rosary',       description: 'Guided mysteries with audio',          icon: Music,         href: '/rosary',              color: 'bg-amber-500/10 text-amber-400',     category: 'prayer' },
  { title: 'Divine Mercy',      description: 'Chaplet of Mercy devotion',            icon: HeartHandshake,href: '/prayers/divine-mercy',      color: 'bg-red-500/10 text-red-400',         category: 'prayer' },
  { title: 'Novenas',           description: '9-day consecration cycles',            icon: Clock,         href: '/novenas',             color: 'bg-orange-500/10 text-orange-400',   category: 'prayer' },
  { title: 'Novena Tracker',    description: 'Track your prayer commitments',        icon: CheckCircle,   href: '/novena-tracker',      color: 'bg-emerald-500/10 text-emerald-400', category: 'prayer' },
  { title: 'Catholic Chaplets', description: 'Devotional bead prayers',              icon: Infinity,      href: '/chaplets',            color: 'bg-violet-500/10 text-violet-400',   category: 'prayer' },
  { title: 'Way of the Cross',  description: 'Fourteen sacred stations',             icon: Mountain,      href: '/stations',            color: 'bg-stone-500/10 text-stone-400',     category: 'prayer' },
  { title: 'Daily Readings',    description: 'Today\'s Mass scripture',              icon: BookOpen,      href: '/readings',            color: 'bg-yellow-500/10 text-yellow-500',   badge: 'DAILY', category: 'prayer' },
  { title: 'Daily Examen',      description: 'Ignatian evening reflection',          icon: PenTool,       href: '/examen',              color: 'bg-cyan-500/10 text-cyan-400',       category: 'prayer' },
  { title: 'Confession Guide',  description: 'Prepare for the sacrament',            icon: Shield,        href: '/confession',          color: 'bg-purple-500/10 text-purple-400',   category: 'prayer' },
  { title: 'Divine Office',     description: 'Liturgy of the Hours',                 icon: Book,          href: '/divine-office',       color: 'bg-blue-500/10 text-blue-500',        category: 'prayer' },
  { title: 'Focus Mode',        description: 'Distraction-free sacred prayer',       icon: Target,        href: '/focus-mode',          color: 'bg-slate-500/10 text-slate-400',     category: 'prayer' },
  { title: 'Liturgical Calendar',description:'Feasts, seasons & solemnities',        icon: Calendar,      href: '/calendar',            color: 'bg-rose-500/10 text-rose-400',       badge: 'TODAY', category: 'prayer' },
  { title: 'Fasting Guide',     description: 'Catholic fasting rules & tips',        icon: Zap,           href: '/fasting',             color: 'bg-amber-500/10 text-amber-500',    category: 'prayer' },

  // ── 2. SPIRITUAL OFFERINGS ────────────────────────────────────────────────
  { title: 'Light a Candle',     description: 'Place your intention before God',     icon: Flame,         href: '/candles',             color: 'bg-amber-500/10 text-amber-500',      badge: 'From $1',   isPremium: true, category: 'offerings' },
  { title: 'Request a Mass',     description: 'Have a Holy Mass offered for you',    icon: Church,        href: '/mass-offerings',      color: 'bg-blue-500/10 text-blue-400',       badge: 'Popular',   isPremium: true, category: 'offerings' },
  { title: 'Spiritual Bouquets', description: 'Send a sacred gift to loved ones',    icon: Gift,          href: '/bouquets',            color: 'bg-pink-500/10 text-pink-400',       isPremium: true,    category: 'offerings' },
  { title: 'Charity Campaigns',  description: 'Support urgent Catholic causes',      icon: LifeBuoy,      href: '/campaigns',           color: 'bg-teal-500/10 text-teal-400',       category: 'offerings' },
  { title: 'Contributions',      description: 'Support our global ministry',         icon: Wallet,        href: '/contributions',       color: 'bg-emerald-500/10 text-emerald-400', isPremium: true,    category: 'offerings' },

  // ── 3. REMEMBRANCE & MEMORIALS ───────────────────────────────────────────
  { title: 'Eternal Memorials',  description: 'Digital tribute for departed souls',  icon: Heart,         href: '/memorials',           color: 'bg-rose-500/10 text-rose-400',        badge: 'NEW',       isPremium: true, category: 'memorials' },
  { title: 'Create Memorial',    description: 'Set up a lasting tribute page',       icon: Plus,          href: '/memorials/create',    color: 'bg-gray-500/10 text-gray-400',       isPremium: true,    category: 'memorials' },
  { title: 'Remembrance Bell',   description: 'Virtual bell for anniversaries',      icon: Bell,          href: '/memorials/bell',       color: 'bg-indigo-500/10 text-indigo-400',   category: 'memorials' },
  { title: 'Anniversaries',      description: 'Remember sacred milestones',          icon: History,       href: '/anniversaries',       color: 'bg-sky-500/10 text-sky-400',         category: 'memorials' },

  // ── 4. FAITH KNOWLEDGE ───────────────────────────────────────────────────
  { title: 'Holy Bible',         description: 'Full Catholic scripture reader',      icon: Book,          href: '/bible',               color: 'bg-stone-500/10 text-stone-400',     category: 'knowledge' },
  { title: 'Catechism (CCC)',    description: 'Official Church teachings',            icon: Scroll,        href: '/catechism',           color: 'bg-amber-500/10 text-amber-500',      category: 'knowledge' },
  { title: 'Saints Database',    description: 'Lives of 300+ holy ones',             icon: Star,          href: '/saints',              color: 'bg-yellow-500/10 text-yellow-500',   badge: 'TODAY', category: 'knowledge' },
  { title: 'Summa Theologica',   description: 'St. Thomas Aquinas masterwork',       icon: Feather,       href: '/summa',               color: 'bg-gray-500/10 text-gray-400',       category: 'knowledge' },
  { title: 'Papal Encyclicals',  description: 'Vatican letters & documents',         icon: Mail,          href: '/encyclicals',         color: 'bg-blue-500/10 text-blue-500',       category: 'knowledge' },
  { title: 'Vatican II Docs',    description: 'All conciliar documents',             icon: Briefcase,     href: '/vatican-ii',          color: 'bg-slate-500/10 text-slate-400',     category: 'knowledge' },
  { title: 'Canon Law',          description: 'Codex Iuris Canonici',                icon: Scale,         href: '/canon-law',           color: 'bg-emerald-500/10 text-emerald-400',  category: 'knowledge' },
  { title: 'Catholic Glossary',  description: 'A–Z of faith terms',                  icon: ListChecks,    href: '/glossary',            color: 'bg-neutral-500/10 text-neutral-400', category: 'knowledge' },
  { title: 'Church History',     description: '2,000 years of grace',                icon: History,       href: '/history',             color: 'bg-orange-500/10 text-orange-400',    category: 'knowledge' },
  { title: 'Church Hierarchy',   description: 'Visual structure of the Church',      icon: LayoutGrid,    href: '/hierarchy',           color: 'bg-indigo-500/10 text-indigo-400',    category: 'knowledge' },
  { title: 'The Sacraments',     description: 'Guide to all 7 sacraments',           icon: Sparkles,      href: '/sacraments',          color: 'bg-purple-500/10 text-purple-400',   category: 'knowledge' },
  { title: 'Gregorian Chant',    description: 'Sacred audio library',                icon: Music2,        href: '/chant',               color: 'bg-slate-500/10 text-slate-400',     category: 'knowledge' },
  { title: 'Catholic Hymns',     description: 'Treasury of worship music',           icon: Mic2,          href: '/hymns',               color: 'bg-emerald-500/10 text-emerald-400', category: 'knowledge' },
  { title: 'Faith Blog',         description: 'Daily reflections & news',            icon: Newspaper,     href: '/blog',                color: 'bg-blue-500/10 text-blue-400',       category: 'knowledge' },
  { title: 'Master Guides',      description: 'Deep-dive faith tutorials',           icon: GraduationCap, href: '/guides',              color: 'bg-cyan-500/10 text-cyan-400',       category: 'knowledge' },
  { title: 'Catholic Life',      description: 'Living your faith daily',             icon: Heart,         href: '/catholic-life',       color: 'bg-pink-500/10 text-pink-400',       category: 'knowledge' },
  { title: 'How-To Guides',      description: 'Step-by-step devotions',              icon: HelpCircle,    href: '/how-to',              color: 'bg-indigo-500/10 text-indigo-400',   category: 'knowledge' },
  { title: 'Church Architecture', description: 'Sacred geometry & meaning',           icon: Church,        href: '#coming-soon',         color: 'bg-stone-500/10 text-stone-400',     category: 'knowledge' },

  // ── 5. CHURCH & PARISH ───────────────────────────────────────────────────
  { title: 'Church Finder',      description: 'Mass times & directions near you',    icon: MapPin,        href: '/churches',            color: 'bg-emerald-500/10 text-emerald-500',  badge: 'GPS', category: 'church' },
  { title: 'Nearby Mass',        description: 'Closest liturgies right now',         icon: Clock,         href: '/mass-times',          color: 'bg-cyan-500/10 text-cyan-400',        badge: 'LIVE', category: 'church' },
  { title: 'Dioceses',           description: 'World diocesan directory',            icon: Globe,         href: '/dioceses',            color: 'bg-blue-500/10 text-blue-400',        category: 'church' },
  { title: 'Claim a Parish',     description: 'For parish administrators',           icon: UserCheck,     href: '/claim',               color: 'bg-gray-500/10 text-gray-400',       category: 'church' },
  { title: 'Church Dashboard',   description: 'Manage your parish listing',          icon: LayoutGrid,    href: '/church-dashboard',    color: 'bg-indigo-500/10 text-indigo-400',   category: 'church' },
  { title: 'Live Stream Mass',   description: 'Watch Mass online right now',         icon: Video,         href: '/live-mass',           color: 'bg-red-500/10 text-red-500',         badge: 'LIVE', category: 'church' },
  { title: 'Pilgrimages',        description: 'Holy sites, shrines & travel',        icon: Compass,       href: '/pilgrimages',         color: 'bg-teal-500/10 text-teal-400',        category: 'church' },

  // ── 6. COMMUNITY ─────────────────────────────────────────────────────────
  { title: 'Prayer Groups',      description: 'Join themed prayer circles',          icon: Users,         href: '/community/groups',    color: 'bg-indigo-500/10 text-indigo-400',    category: 'community' },
  { title: 'Prayer Partners',    description: 'Paired devotion accountability',      icon: HeartHandshake,href: '/prayer-partners',     color: 'bg-pink-500/10 text-pink-400',        category: 'community' },
  { title: 'Challenges',         description: 'Spiritual 30-day marathons',          icon: Trophy,        href: '/challenges',          color: 'bg-amber-500/10 text-amber-500',     badge: 'NEW', category: 'community' },
  { title: 'Leaderboard',        description: 'Community faith rankings',            icon: Award,         href: '/leaderboard',         color: 'bg-yellow-500/10 text-yellow-500',   category: 'community' },
  { title: 'Achievements',       description: 'Unlock badges as you grow',           icon: Sparkles,      href: '/achievements',        color: 'bg-purple-500/10 text-purple-400',   category: 'community' },
  { title: 'Testimonies',        description: 'Share your faith story',              icon: Mic2,          href: '/testimonies',         color: 'bg-teal-500/10 text-teal-400',        category: 'community' },
  { title: 'Faith Quiz',         description: 'Test your Catholic knowledge',        icon: GraduationCap, href: '/quiz',                color: 'bg-blue-500/10 text-blue-400',       badge: 'FUN', category: 'community' },
  { title: 'Telegram Bot',       description: 'Prayers on Telegram',                 icon: Send,          href: '/bot',                 color: 'bg-sky-400/20 text-sky-400',           category: 'community' },

  // ── 7. MEDIA & NEWS ───────────────────────────────────────────────────────
  { title: 'Watch & Pray',       description: 'Faith YouTube treasury',              icon: Video,         href: '/watch',               color: 'bg-red-500/10 text-red-500',          category: 'media' },
  { title: 'Catholic News',      description: 'Vatican & global Catholic news',      icon: Newspaper,     href: '/news',                color: 'bg-slate-500/10 text-slate-400',     category: 'media' },
  { title: 'Podcasts',           description: 'Faith on the airwaves',               icon: Mic2,          href: '/podcasts',            color: 'bg-purple-500/10 text-purple-400',    category: 'media' },
  { title: 'Reading Plans',      description: 'Bible & Saint journey plans',         icon: BookOpen,      href: '/reading-plans',       color: 'bg-emerald-500/10 text-emerald-500',  category: 'media' },
  { title: 'Faith Challenges',   description: 'Spiritual 30-day marathons',          icon: Trophy,        href: '/challenges',          color: 'bg-amber-500/10 text-amber-500',     badge: 'NEW', category: 'media' },
  { title: 'Master Library',     description: 'Comprehensive faith assets',          icon: Library,       href: '/library',             color: 'bg-blue-500/10 text-blue-400',       category: 'media' },

  // ── 8. MY SANCTUARY & TOOLS ────────────────────────────────────────────────
  { title: 'My Journey',         description: 'Spiritual corner & prayer streaks',   icon: Compass,       href: '/journey',             color: 'bg-gold-500/10 text-[#d4af37]',      badge: 'YOU', category: 'account' },
  { title: 'User Profile',       description: 'Stats & sacrament history',           icon: User,          href: '/profile',             color: 'bg-blue-500/10 text-blue-400',        category: 'account' },
  { title: 'Spiritual Journal',  description: 'Private encrypted reflections',       icon: PenTool,       href: '/journal',             color: 'bg-amber-500/10 text-amber-500',      category: 'account' },
  { title: 'Order History',      description: 'Past masses, candles & gifts',        icon: ShoppingCart,  href: '/orders',              color: 'bg-emerald-500/10 text-emerald-500',  category: 'account' },
  { title: 'Reminders',          description: 'Custom prayer notifications',         icon: Bell,          href: '/dashboard/reminders', color: 'bg-rose-500/10 text-rose-400',     category: 'account' },
  { title: 'Sacramental Life',   description: 'Track your received sacraments',      icon: Sparkles,      href: '/dashboard/sacraments',color: 'bg-indigo-500/10 text-indigo-400',    category: 'account' },
  { title: 'Billing & Sub',      description: 'Manage premium features',             icon: Wallet,        href: '/dashboard/billing',   color: 'bg-teal-500/10 text-teal-400',       category: 'account' },
  { title: 'App Settings',       description: 'Privacy, language & preferences',     icon: Settings,      href: '/settings',            color: 'bg-slate-500/10 text-slate-400',     category: 'account' },
  { title: 'Logout/Account',     description: 'Securely sign out',                   icon: Lock,          href: '/api/auth/logout',     color: 'bg-red-500/10 text-red-400',          category: 'account' },
];

/**
 * PRODUCTION-READY FEATURE REGISTRY
 * Filter out any features that haven't been created yet (placeholders)
 */
export const FEATURES = ALL_FEATURES.filter(f => f.href !== '#coming-soon');

export const CATEGORIES = [
  { id: 'prayer',     label: 'Devotions',  emoji: '🙏', color: 'text-blue-400' },
  { id: 'offerings',  label: 'Offerings',  emoji: '🕯️', color: 'text-amber-500' },
  { id: 'memorials',  label: 'Memorials',  emoji: '🕊️', color: 'text-rose-400' },
  { id: 'knowledge',  label: 'Knowledge',  emoji: '📖', color: 'text-purple-400' },
  { id: 'church',     label: 'Church',     emoji: '⛪', color: 'text-emerald-400' },
  { id: 'community',  label: 'Community',  emoji: '👥', color: 'text-cyan-400' },
  { id: 'media',      label: 'Media',      emoji: '📺', color: 'text-red-400' },
  { id: 'account',    label: 'My Space',   emoji: '✨', color: 'text-[#d4af37]' },
] as const;

export const REVENUE_CARDS = [
  {
    id: 'candles',
    title: 'Light a Candle 🕯️',
    subtitle: 'Place your intention before Our Lady',
    cta: 'Light Now — From $1',
    href: '/candles',
    gradient: 'from-amber-900/40 to-orange-950/20',
    border: 'border-amber-500/30',
  },
  {
    id: 'mass',
    title: 'Request a Holy Mass ✝️',
    subtitle: 'The greatest gift for your loved ones',
    cta: 'Book a Mass — From $10',
    href: '/mass-offerings',
    gradient: 'from-blue-900/40 to-indigo-950/20',
    border: 'border-blue-500/30',
  },
  {
    id: 'memorial',
    title: 'Eternal Memorial 🕊️',
    subtitle: 'Never let their soul be forgotten',
    cta: 'Create Page',
    href: '/memorials/create',
    gradient: 'from-rose-900/40 to-purple-950/20',
    border: 'border-rose-500/30',
  },
];
