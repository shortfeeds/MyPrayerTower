import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Heart } from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-950 text-gray-300 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            </div>

            <div className="container mx-auto px-4 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-900/20">
                                <span className="text-white font-serif font-bold text-2xl">M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-serif font-bold text-white leading-none">MyPrayerTower</span>
                                <span className="text-xs text-gold-400 uppercase tracking-widest mt-1">Catholic Services</span>
                            </div>
                        </div>
                        <p className="text-gray-400 text-base mb-8 max-w-sm leading-relaxed">
                            The #1 All-in-One Catholic Services App worldwide. Connect with faith, find churches, join prayer warriors, and deepen your spiritual journey.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                                <a key={i} href="#" className="p-3 bg-primary-900/50 hover:bg-gold-500 hover:text-white rounded-xl transition-all duration-300 hover:-translate-y-1 border border-primary-800 hover:border-gold-400">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div>
                        <h3 className="font-serif font-semibold text-white text-lg mb-6 border-b border-gold-500/30 pb-2 inline-block">Features</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/churches" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Church Finder</Link></li>
                            <li><Link href="/prayer-wall" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Prayer Wall</Link></li>
                            <li><Link href="/prayers" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Prayer Library</Link></li>
                            <li><Link href="/saints" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Daily Saints</Link></li>
                            <li><Link href="/readings" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Daily Readings</Link></li>
                        </ul>
                    </div>

                    {/* For Churches */}
                    <div>
                        <h3 className="font-serif font-semibold text-white text-lg mb-6 border-b border-gold-500/30 pb-2 inline-block">For Churches</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/claim" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Claim Your Church</Link></li>
                            <li><Link href="/church-dashboard" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Church Dashboard</Link></li>
                            <li><Link href="/pricing" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Pricing Plans</Link></li>
                            <li><Link href="/features" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Features Overview</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="font-serif font-semibold text-white text-lg mb-6 border-b border-gold-500/30 pb-2 inline-block">Company</h3>
                        <ul className="space-y-4 text-sm">
                            <li><Link href="/about" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Contact Support</Link></li>
                            <li><Link href="/careers" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Careers</Link></li>
                            <li><Link href="/press" className="hover:text-gold-400 transition-colors flex items-center gap-2"><span className="w-1 h-1 bg-gold-500 rounded-full opacity-0 hover:opacity-100 transition-opacity"></span>Press & Media</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Legal & Bottom */}
                <div className="border-t border-primary-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
                        <Link href="/privacy" className="hover:text-gold-400 transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-gold-400 transition-colors">Terms of Service</Link>
                        <Link href="/cookies" className="hover:text-gold-400 transition-colors">Cookie Policy</Link>
                        <Link href="/guidelines" className="hover:text-gold-400 transition-colors">Community Guidelines</Link>
                    </div>

                    <p className="text-sm text-gray-500 text-center md:text-right">
                        © {currentYear} MyPrayerTower. Made with <Heart className="w-3 h-3 text-red-500 inline mx-1 fill-current" /> by Antigravity.
                    </p>
                </div>
            </div>
        </footer>
    );
}
