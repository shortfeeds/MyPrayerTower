import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/animations/premium_animations.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../ads/widgets/smart_ad_banner.dart';

import '../widgets/daily_reading_card.dart';
import '../widgets/saint_of_day_card.dart';
import '../widgets/quick_access_bar.dart';
import '../widgets/trending_prayers.dart';
import '../widgets/home_features_grid.dart'; // Added

import '../widgets/prayer_wall_preview.dart';

import '../widgets/premium_home_header.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PremiumScaffold(
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // 1. Immersive Header (Pinned)
          const PremiumHomeHeader(),

          // 3. Quick Access Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 0, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Sacred Pathways",
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 16),
                  const QuickAccessBar(),
                ],
              ),
            ),
          ),

          // 5. Today's Highlights Section (Reading & Saint)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 28, 20, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Grace for Today",
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      TextButton(
                        onPressed: () => context.push('/readings'),
                        child: Text(
                          'View All',
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: AppTheme.gold500,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    height: 260,
                    child: ListView(
                      scrollDirection: Axis.horizontal,
                      clipBehavior: Clip.none,
                      children: [
                        SizedBox(
                          width: MediaQuery.of(context).size.width * 0.85,
                          child: const DailyReadingCard(),
                        ),
                        const SizedBox(width: 16),
                        SizedBox(
                          width: MediaQuery.of(context).size.width * 0.85,
                          child: const SaintOfDayCard(),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 6. Trending Prayers
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 28, 0, 0),
              child: FadeInSlideUp(
                delay: Duration(milliseconds: 200),
                child: TrendingPrayersWidget(),
              ),
            ),
          ),

          // 7. Mass Offering CTA Banner
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: FadeInSlideUp(
                delay: const Duration(milliseconds: 300),
                child: _buildMassOfferingBanner(context),
              ),
            ),
          ),

          // 8. Explore Grid (Removed for cleaner UI)
          // SliverToBoxAdapter(
          //   child: Padding(
          //     padding: const EdgeInsets.symmetric(horizontal: 20),
          //     child: Column(
          //       crossAxisAlignment: CrossAxisAlignment.start,
          //       children: [
          //         Row(
          //           children: [
          //             Container(
          //               padding: const EdgeInsets.all(6),
          //               decoration: BoxDecoration(
          //                 color: AppTheme.gold500.withValues(alpha: 0.15),
          //                 borderRadius: BorderRadius.circular(8),
          //               ),
          //               child: const Icon(
          //                 LucideIcons.compass,
          //                 size: 16,
          //                 color: AppTheme.gold500,
          //               ),
          //             ),
          //             const SizedBox(width: 10),
          //             Text(
          //               'Explore',
          //               style: GoogleFonts.merriweather(
          //                 fontSize: 18,
          //                 fontWeight: FontWeight.bold,
          //                 color: Colors.white,
          //               ),
          //             ),
          //           ],
          //         ),
          //         const SizedBox(height: 16),
          //         _buildCategorizedFeatures(context),
          //       ],
          //     ),
          //   ),
          // ),

          // 9. Prayer Wall Preview
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: Colors.pink.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(
                              LucideIcons.heart,
                              size: 16,
                              color: Colors.pink,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Text(
                            'Community Prayer',
                            style: GoogleFonts.merriweather(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                      TextButton(
                        onPressed: () => context.push('/prayer-wall'),
                        child: Text(
                          'View All',
                          style: GoogleFonts.inter(
                            color: AppTheme.gold500,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  const PrayerWallPreview(),
                ],
              ),
            ),
          ),

          // 8. Explore Grid (All Features)
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 24),
              child: HomeFeaturesGrid(),
            ),
          ),

          // Smart Ad Banner
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: SmartAdBanner(page: 'home', position: 'bottom'),
            ),
          ),

          const SliverToBoxAdapter(
            child: SizedBox(height: 150),
          ), // Bottom padding for nav bar
        ],
      ),
    );
  }

  Widget _buildMassOfferingBanner(BuildContext context) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(0),
      onTap: () => context.push('/mass-offering'),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
          gradient: LinearGradient(
            colors: [
              AppTheme.gold500.withValues(alpha: 0.2),
              AppTheme.gold600.withValues(alpha: 0.1),
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(
            color: AppTheme.gold500.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.gold500.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: AppTheme.gold500.withValues(alpha: 0.4),
                ),
              ),
              child: const Icon(
                LucideIcons.scroll,
                color: AppTheme.gold400,
                size: 26,
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Offer a Mass',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Pray for your loved ones',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white.withValues(alpha: 0.85),
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(
                LucideIcons.arrowRight,
                color: Colors.white,
                size: 20,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
