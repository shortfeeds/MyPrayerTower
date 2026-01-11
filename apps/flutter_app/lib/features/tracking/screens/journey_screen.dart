import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';

class JourneyScreen extends StatelessWidget {
  const JourneyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'My Spiritual Journey',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildTimelineItem(
                  year: '2025',
                  title: 'Pilgrimage to Lourdes',
                  description: 'Visited the Grotto of Massabielle.',
                  icon: LucideIcons.plane,
                  color: Colors.blue,
                  isLast: false,
                ).animate(delay: 100.ms).fadeIn().slideX(),
                _buildTimelineItem(
                  year: '2024',
                  title: 'Confirmation Sponsor',
                  description: 'Sponsored Michael for his Confirmation.',
                  icon: LucideIcons.users,
                  color: Colors.purple,
                  isLast: false,
                ).animate(delay: 200.ms).fadeIn().slideX(),
                _buildTimelineItem(
                  year: '2023',
                  title: 'Joined MyPrayerTower',
                  description: 'Started tracking daily prayers.',
                  icon: LucideIcons.smartphone,
                  color: Colors.amber,
                  isLast: false,
                ).animate(delay: 300.ms).fadeIn().slideX(),
                _buildTimelineItem(
                  year: '2015',
                  title: 'Marriage',
                  description: 'Sacrament of Holy Matrimony.',
                  icon: LucideIcons.heart,
                  color: Colors.red,
                  isLast: false,
                ).animate(delay: 400.ms).fadeIn().slideX(),
                _buildTimelineItem(
                  year: '2008',
                  title: 'First Communion',
                  description: 'Received the Body of Christ.',
                  icon: LucideIcons.cookie,
                  color: Colors.white,
                  isLast: false,
                ).animate(delay: 500.ms).fadeIn().slideX(),
                _buildTimelineItem(
                  year: '2000',
                  title: 'Baptism',
                  description: 'Entered the Catholic Church.',
                  icon: LucideIcons.droplets,
                  color: Colors.cyan,
                  isLast: true,
                ).animate(delay: 600.ms).fadeIn().slideX(),

                const SizedBox(height: 50),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required String year,
    required String title,
    required String description,
    required IconData icon,
    required Color color,
    required bool isLast,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Line
          Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppTheme.sacredNavy800,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: color.withValues(alpha: 0.5),
                    width: 2,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: color.withValues(alpha: 0.2),
                      blurRadius: 10,
                    ),
                  ],
                ),
                child: Center(
                  child: Text(
                    year,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
              if (!isLast)
                Expanded(
                  child: Container(
                    width: 2,
                    color: color.withValues(alpha: 0.2),
                  ),
                ),
            ],
          ),
          const SizedBox(width: 16),

          // Content
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: PremiumGlassCard(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            title,
                            style: GoogleFonts.merriweather(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            description,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(icon, color: color, size: 24),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
