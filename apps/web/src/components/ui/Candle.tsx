
import { cn } from '@/lib/utils';

interface CandleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function Candle({ className, size = 'md' }: CandleProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-16 h-16',
    };

    const flameSizes = {
        sm: 'w-2 h-3',
        md: 'w-3 h-5',
        lg: 'w-6 h-10',
    };

    return (
        <div className={cn("relative flex items-end justify-center", sizeClasses[size], className)}>
            {/* Candle Body */}
            {/* <div className="w-full h-3/4 bg-amber-100/20 rounded-b-lg backdrop-blur-sm shadow-inner" /> */}

            {/* Flame Glow */}
            <div className={cn(
                "absolute -top-1 rounded-full bg-orange-500/30 blur-xl animate-pulse-soft",
                size === 'lg' ? 'w-24 h-24' : 'w-12 h-12'
            )} />

            {/* The Flame */}
            <div className={cn(
                "relative rounded-full rounded-t-[50%] bg-gradient-to-t from-orange-600 via-amber-400 to-yellow-100 shadow-[0_0_20px_rgba(255,165,0,0.5)] origin-bottom animate-flicker",
                flameSizes[size]
            )}>
                {/* Inner Blue Core */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-[30%] bg-blue-400/50 blur-[1px] rounded-full" />
            </div>

            <style jsx>{`
                @keyframes flicker {
                    0% { transform: scale(1) rotate(0deg); opacity: 0.9; }
                    25% { transform: scale(1.1, 0.9) rotate(-2deg); opacity: 1; }
                    50% { transform: scale(0.95, 1.05) rotate(2deg); opacity: 0.8; }
                    75% { transform: scale(1.05, 0.95) rotate(-1deg); opacity: 1; }
                    100% { transform: scale(1) rotate(0deg); opacity: 0.9; }
                }
                .animate-flicker {
                    animation: flicker 3s infinite ease-in-out alternate;
                }
            `}</style>
        </div>
    );
}
