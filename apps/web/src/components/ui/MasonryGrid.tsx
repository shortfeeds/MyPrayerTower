import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MasonryGridProps {
    children: ReactNode[];
    className?: string;
    columns?: {
        default: number;
        sm?: number;
        md?: number;
        lg?: number;
        xl?: number;
    };
    gap?: number;
}

export function MasonryGrid({
    children,
    className,
    columns = { default: 1, md: 2, lg: 3 },
    gap = 24
}: MasonryGridProps) {
    // We'll use CSS columns for simplicity and performance
    // The columns will be handled by Tailwind classes in the implementation

    return (
        <div
            className={cn(
                "w-full",
                // Column count breakpoints
                "columns-1",
                columns.md && `md:columns-${columns.md}`,
                columns.lg && `lg:columns-${columns.lg}`,
                columns.xl && `xl:columns-${columns.xl}`,
                // Gap
                gap === 16 && "gap-4",
                gap === 20 && "gap-5",
                gap === 24 && "gap-6",
                gap === 32 && "gap-8",
                className
            )}
        >
            {children.map((child, i) => (
                <div key={i} className="break-inside-avoid mb-6">
                    {child}
                </div>
            ))}
        </div>
    );
}
