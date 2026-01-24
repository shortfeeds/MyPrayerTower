import Link from 'next/link';
import { MapPin, ArrowRight, Church as ChurchIcon, Star, Globe, Phone, Mail } from 'lucide-react';
import Image from 'next/image';

interface ChurchCardProps {
    church: {
        id: string;
        name: string;
        address: string;
        city: string;
        state?: string | null;
        primaryImageUrl?: string | null;
        denomination: string;
        isVerified: boolean;
        type: string;
        phone?: string | null;
        email?: string | null;
        website?: string | null;
    };
}

export function ChurchCard({ church }: ChurchCardProps) {
    return (
        <div className="group bg-white dark:bg-[#0A0A0A] rounded-2xl overflow-hidden border border-gray-100 dark:border-white/5 hover:border-gold-500/30 hover:shadow-[0_0_40px_-10px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-44 bg-gray-50 dark:bg-sacred-950 overflow-hidden">
                {church.primaryImageUrl ? (
                    <Image
                        src={church.primaryImageUrl}
                        alt={church.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 dark:text-white/10">
                        <ChurchIcon className="w-12 h-12" />
                    </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md text-white text-[9px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                        {church.type.replace('_', ' ')}
                    </span>
                    {church.isVerified && (
                        <div className="bg-gold-500 text-black p-1 rounded-full shadow-lg" title="Verified Parish">
                            <Star className="w-2.5 h-2.5 fill-current" />
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                <div className="mb-3">
                    <span className="text-[10px] font-bold text-gold-600/80 dark:text-gold-500/60 uppercase tracking-widest">{church.denomination}</span>
                </div>

                <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-gold-500 transition-colors duration-300">
                    {church.name}
                </h3>

                <div className="space-y-3 mb-6 flex-1">
                    {/* Location */}
                    <div className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gold-500/50" />
                        <span className="line-clamp-2 leading-relaxed">
                            {church.address}, {church.city}{church.state ? `, ${church.state}` : ''}
                        </span>
                    </div>

                    {/* Contact Info (Data-Rich Listing) */}
                    <div className="pt-3 border-t border-gray-100 dark:border-white/5 space-y-2.5">
                        {church.phone && (
                            <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-gray-400">
                                <Phone className="w-3.5 h-3.5 text-gold-500/50" />
                                <span>{church.phone}</span>
                            </div>
                        )}
                        {church.email && (
                            <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-gray-400">
                                <Mail className="w-3.5 h-3.5 text-gold-500/50" />
                                <span className="truncate">{church.email}</span>
                            </div>
                        )}
                        {church.website && (
                            <div className="flex items-center gap-2.5 text-[13px] text-gray-600 dark:text-gray-400">
                                <Globe className="w-3.5 h-3.5 text-gold-500/50" />
                                <span className="truncate">{church.website.replace(/^https?:\/\//, '')}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Link
                    href={`/churches/${church.id}`}
                    className="group/btn relative overflow-hidden px-4 py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gold-500 dark:hover:bg-gold-500 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-black font-bold text-sm rounded-xl border border-gray-100 dark:border-white/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <span className="relative z-10">Visit Parish</span>
                    <ArrowRight className="w-4 h-4 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
