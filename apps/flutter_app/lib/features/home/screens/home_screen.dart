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
import '../widgets/live_stats_bar.dart';
// import '../widgets/verse_of_the_day.dart'; // Replaced
import '../widgets/home_banners.dart';
import '../widgets/quick_access_bar.dart';
import '../widgets/trending_prayers.dart';

import '../widgets/prayer_wall_preview.dart';
import '../widgets/premium_feature_card.dart';
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

          // 2. Live Stats Bar
          const SliverToBoxAdapter(child: LiveStatsBar()),

          // Top Ad Banner
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.fromLTRB(20, 16, 20, 0),
              child: SmartAdBanner(page: 'home', position: 'top'),
            ),
          ),

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

          // 4. Featured Banners (Carousel) - Replaces Verse of the Day
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.only(top: 24),
              child: FadeInSlideUp(
                delay: Duration(milliseconds: 100),
                child: HomeBannerCarousel(),
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

          // Smart Ad Banner
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20),
              child: SmartAdBanner(page: 'home', position: 'bottom'),
            ),
          ),

          const SliverToBoxAdapter(
            child: SizedBox(height: 140),
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

  Widget _buildCategorizedFeatures(BuildContext context) {
    return Column(
      children: [
        _buildSectionHeader('Prayer & Devotion', LucideIcons.flame),
        _buildGrid(context, _getPrayerFeatures()),
        const SizedBox(height: 24),
        _buildSectionHeader('Sacred Knowledge', LucideIcons.bookOpen),
        _buildGrid(context, _getKnowledgeFeatures()),
        const SizedBox(height: 24),
        _buildSectionHeader('Sacraments & Liturgy', LucideIcons.church),
        _buildGrid(context, _getLiturgyFeatures()),
        const SizedBox(height: 24),
        _buildSectionHeader('Community & Growth', LucideIcons.heartHandshake),
        _buildGrid(context, _getCommunityFeatures()),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, size: 16, color: AppTheme.gold500),
          ),
          const SizedBox(width: 10),
          Text(
            title,
            style: GoogleFonts.merriweather(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGrid(BuildContext context, List<_FeatureItem> features) {
    return GridView.builder(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
        maxCrossAxisExtent: 200,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        childAspectRatio: 1.3,
      ),
      itemCount: features.length,
      itemBuilder: (context, index) {
        final feature = features[index];
        return PremiumFeatureCard(
          icon: feature.icon,
          title: feature.title,
          subtitle: feature.subtitle,
          color: feature.color,
          onTap: () => context.push(feature.route),
        );
      },
    );
  }

  List<_FeatureItem> _getPrayerFeatures() {
    return [
      _FeatureItem(
        LucideIcons.flame,
        'Candles',
        'Light a Candle',
        AppTheme.gold500,
        '/candles',
      ),
      _FeatureItem(
        LucideIcons.sparkles,
        'Prayers',
        'Daily Prayers',
        Colors.blue.shade400,
        '/prayers',
      ),
      _FeatureItem(
        LucideIcons.circleDot,
        'Rosary',
        'Holy Rosary',
        Colors.red.shade400,
        '/rosary',
      ),
      _FeatureItem(
        LucideIcons.footprints,
        'Stations',
        'Way of Cross',
        Colors.purple.shade400,
        '/stations-of-the-cross',
      ),
      _FeatureItem(
        LucideIcons.focus,
        'Focus Mode',
        'Distraction Free',
        Colors.indigo.shade400,
        '/focus-mode',
      ),
      _FeatureItem(
        LucideIcons.clock,
        'Divine Office',
        'Liturgy of Hours',
        Colors.orange.shade600,
        '/divine-office',
      ),
      _FeatureItem(
        LucideIcons.circle,
        'Chaplets',
        'Divine Mercy',
        Colors.teal.shade500,
        '/chaplets',
      ),
      _FeatureItem(
        LucideIcons.calendar,
        'Novenas',
        'Tracker',
        Colors.cyan.shade600,
        '/novena-tracker',
      ),
      _FeatureItem(
        LucideIcons.search,
        'Examen',
        'Daily Reflect',
        Colors.blueGrey,
        '/examen',
      ),
      _FeatureItem(
        LucideIcons.utensilsCrossed,
        'Fasting',
        'Sacrifice',
        Colors.grey.shade500,
        '/fasting',
      ),
    ];
  }

  List<_FeatureItem> _getKnowledgeFeatures() {
    return [
      _FeatureItem(
        LucideIcons.bookOpen,
        'Readings',
        'Daily Mass',
        Colors.green.shade600,
        '/readings',
      ),
      _FeatureItem(
        LucideIcons.book,
        'Bible',
        'Holy Bible',
        Colors.brown.shade400,
        '/bible',
      ),
      _FeatureItem(
        LucideIcons.user,
        'Saints',
        'Holy Lives',
        Colors.orange.shade500,
        '/saints',
      ),
      _FeatureItem(
        LucideIcons.school,
        'Catechism',
        'CCC',
        Colors.yellow.shade800,
        '/catechism',
      ),
      _FeatureItem(
        LucideIcons.library,
        'Library',
        'Catholic Texts',
        Colors.blueGrey.shade600,
        '/library',
      ),
      _FeatureItem(
        LucideIcons.bookOpen,
        'Summa',
        'Aquinas',
        Colors.deepOrange.shade700,
        '/summa',
      ),
      _FeatureItem(
        LucideIcons.landmark,
        'Vatican II',
        'Council Docs',
        Colors.indigoAccent.shade700,
        '/vatican-ii',
      ),
      _FeatureItem(
        LucideIcons.fileText,
        'Encyclicals',
        'Papal Docs',
        Colors.amber.shade700,
        '/encyclicals',
      ),
      _FeatureItem(
        LucideIcons.scale,
        'Canon Law',
        'Church Law',
        Colors.red.shade700,
        '/canon_law',
      ),
      _FeatureItem(
        LucideIcons.hourglass,
        'History',
        'Church Hist',
        Colors.brown.shade300,
        '/history',
      ),
      _FeatureItem(
        LucideIcons.type,
        'Glossary',
        'Terms',
        Colors.teal.shade700,
        '/glossary',
      ),
    ];
  }

  List<_FeatureItem> _getLiturgyFeatures() {
    return [
      _FeatureItem(
        LucideIcons.messageCircle,
        'Confession',
        'Reconciliation',
        Colors.purple.shade700,
        '/confession',
      ),
      _FeatureItem(
        LucideIcons.video,
        'Live Mass',
        'Stream',
        Colors.redAccent.shade400,
        '/live-mass',
      ),
      _FeatureItem(
        LucideIcons.droplet,
        'Sacraments',
        'Records',
        Colors.blue.shade500,
        '/sacraments',
      ),
      _FeatureItem(
        LucideIcons.scroll,
        'Mass Offering',
        'Offer Mass',
        AppTheme.gold600,
        '/mass-offering',
      ),
      _FeatureItem(
        LucideIcons.church,
        'Directory',
        'All Churches',
        Colors.brown.shade500,
        '/churches',
      ),
      _FeatureItem(
        LucideIcons.calendarDays,
        'Calendar',
        'Liturgical',
        Colors.green.shade700,
        '/calendar',
      ),
      _FeatureItem(
        LucideIcons.map,
        'Pilgrimages',
        'Sacred Places',
        Colors.deepOrange.shade600,
        '/pilgrimages',
      ),
      _FeatureItem(
        LucideIcons.mic2,
        'Chant',
        'Gregorian',
        Colors.indigo.shade800,
        '/chant',
      ),
      _FeatureItem(
        LucideIcons.music,
        'Hymns',
        'Sacred Music',
        Colors.teal.shade600,
        '/hymns',
      ),
    ];
  }

  List<_FeatureItem> _getCommunityFeatures() {
    return [
      _FeatureItem(
        LucideIcons.heartHandshake,
        'Prayer Wall',
        'Community',
        Colors.pink.shade400,
        '/prayer-wall',
      ),
      _FeatureItem(
        LucideIcons.users,
        'Partners',
        'Find Pray-ers',
        Colors.blueAccent.shade400,
        '/prayer-partners',
      ),
      _FeatureItem(
        LucideIcons.users,
        'Groups',
        'Prayer Groups',
        Colors.indigo.shade500,
        '/groups',
      ),
      _FeatureItem(
        LucideIcons.pencil,
        'Journal',
        'Private Notes',
        Colors.brown.shade400,
        '/prayer-journal',
      ),
      _FeatureItem(
        LucideIcons.gift,
        'Contribute',
        'Support Us',
        AppTheme.gold500,
        '/donate',
      ),
      _FeatureItem(
        LucideIcons.trophy,
        'Challenges',
        'Grow Faith',
        Colors.orange.shade500,
        '/challenges',
      ),
      _FeatureItem(
        LucideIcons.medal,
        'Achievements',
        'Badges',
        AppTheme.gold400,
        '/achievements',
      ),
      _FeatureItem(
        LucideIcons.flower2,
        'Bouquets',
        'Spiritual Gifts',
        Colors.purple.shade400,
        '/bouquets',
      ),
      _FeatureItem(
        LucideIcons.flower,
        'Memorials',
        'Remembering',
        Colors.grey.shade600,
        '/memorials',
      ),
      _FeatureItem(
        LucideIcons.newspaper,
        'News',
        'Catholic News',
        Colors.blueGrey.shade500,
        '/news',
      ),
      _FeatureItem(
        LucideIcons.award,
        'Certificates',
        'Sacramental',
        AppTheme.gold300,
        '/certificates',
      ),
      _FeatureItem(
        LucideIcons.network,
        'Hierarchy',
        'Church Struct',
        Colors.purple.shade900,
        '/hierarchy',
      ),
    ];
  }
}

class _FeatureItem {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final String route;

  _FeatureItem(this.icon, this.title, this.subtitle, this.color, this.route);
}
