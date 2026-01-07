import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/animations/premium_animations.dart';
import '../../../core/theme/app_theme.dart';
import '../../ads/widgets/smart_ad_banner.dart';

import '../widgets/daily_reading_card.dart';
import '../widgets/saint_of_day_card.dart';
import '../widgets/live_stats_bar.dart';
import '../widgets/verse_of_the_day.dart';
import '../widgets/quick_access_bar.dart';
import '../widgets/trending_prayers.dart';

import '../widgets/prayer_wall_preview.dart';
import '../widgets/premium_feature_card.dart';
import '../widgets/premium_home_header.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // 1. Immersive Header (Pinned)
          const PremiumHomeHeader(),

          // 2. Live Stats Bar
          const SliverToBoxAdapter(child: LiveStatsBar()),

          // 3. Quick Access Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 0, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    "Quick Actions",
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

          // 4. Verse of the Day
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 28, 20, 0),
              child: FadeInSlideUp(
                delay: Duration(milliseconds: 100),
                child: VerseOfTheDayCard(),
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
                        "Today's Highlights",
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
                      children: const [
                        SizedBox(width: 300, child: DailyReadingCard()),
                        SizedBox(width: 16),
                        SizedBox(width: 300, child: SaintOfDayCard()),
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

          // 8. Explore Grid (Premium Cards)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: AppTheme.gold500.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          LucideIcons.compass,
                          size: 16,
                          color: AppTheme.gold500,
                        ),
                      ),
                      const SizedBox(width: 10),
                      Text(
                        'Explore',
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Feature Grid
                  _buildFeatureGrid(context),
                ],
              ),
            ),
          ),

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

          // Smart Ad Banner
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: SmartAdBanner(page: 'home', position: 'bottom'),
            ),
          ),

          const SliverToBoxAdapter(
            child: SizedBox(height: 120),
          ), // Bottom padding for nav bar
        ],
      ),
    );
  }

  Widget _buildMassOfferingBanner(BuildContext context) {
    return Container(
      width: double.infinity,
      decoration: BoxDecoration(
        gradient: AppTheme.goldGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppTheme.gold500.withValues(alpha: 0.25),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => context.push('/mass-offering'),
          borderRadius: BorderRadius.circular(20),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.25),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(
                    LucideIcons.scroll,
                    color: AppTheme.sacredNavy900,
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
                          color: AppTheme.sacredNavy900,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Pray for your loved ones',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: AppTheme.sacredNavy900.withValues(alpha: 0.8),
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.sacredNavy900.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    LucideIcons.arrowRight,
                    color: AppTheme.sacredNavy900,
                    size: 20,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFeatureGrid(BuildContext context) {
    return Column(
      children: [
        // Row 1: Primary features - Large cards
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.flame,
                title: 'Candles',
                subtitle: 'Light a Candle',
                color: AppTheme.gold500,
                onTap: () => context.push('/candles'),
                isLarge: true,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.heart,
                title: 'Prayer Wall',
                subtitle: 'Community Requests',
                color: const Color(0xFFF43F5E),
                onTap: () => context.push('/prayer-wall'),
                isLarge: true,
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 2
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.bookOpen,
                title: 'Prayers',
                subtitle: 'Daily & Common',
                color: AppTheme.success,
                onTap: () => context.push('/prayers'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.book,
                title: 'Catechism',
                subtitle: 'Learn Faith',
                color: const Color(0xFF06B6D4),
                onTap: () => context.push('/catechism'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 3
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.cross,
                title: 'Stations',
                subtitle: 'Way of Cross',
                color: const Color(0xFFB91C1C),
                onTap: () => context.push('/stations'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.search,
                title: 'Examen',
                subtitle: 'Reflection',
                color: const Color(0xFF6366F1),
                onTap: () => context.push('/examen'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 4
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.calendarDays,
                title: 'Novenas',
                subtitle: '9 Days Prayer',
                color: const Color(0xFF14B8A6),
                onTap: () => context.push('/novenas'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.book,
                title: 'Bible',
                subtitle: 'Holy Scripture',
                color: const Color(0xFF78350F),
                onTap: () => context.push('/bible'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 5
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.library,
                title: 'Library',
                subtitle: 'Documents',
                color: const Color(0xFFD97706),
                onTap: () => context.push('/library'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.calendar,
                title: 'Calendar',
                subtitle: 'Liturgical Year',
                color: const Color(0xFF9333EA),
                onTap: () => context.push('/calendar'),
              ),
            ),
          ],
        ),
        const SizedBox(height: 12),
        // Row 6: Gamification (Challenges only - Quiz removed)
        PremiumFeatureCard(
          icon: LucideIcons.trophy,
          title: 'Challenges',
          subtitle: 'Earn Rewards & Badges',
          color: const Color(0xFFF97316),
          onTap: () => context.push('/challenges'),
          isLarge: true,
        ),
        const SizedBox(height: 12),
        // Row 7
        Row(
          children: [
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.gift,
                title: 'Donate',
                subtitle: 'Support Us',
                color: AppTheme.gold500,
                onTap: () => context.push('/donate'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: PremiumFeatureCard(
                icon: LucideIcons.gift,
                title: 'Bouquets',
                subtitle: 'Spiritual Gifts',
                color: const Color(0xFF7C3AED),
                onTap: () => context.push('/bouquets'),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
