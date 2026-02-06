import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class HomeFeaturesGrid extends StatelessWidget {
  const HomeFeaturesGrid({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        // Calculate responsive columns
        // Minimum width per item ~80px
        final double availableWidth = constraints.maxWidth;
        final int crossAxisCount = (availableWidth / 85).floor().clamp(
          3,
          8,
        ); // Min 3, Max 8 cols
        const double spacing = 12.0;
        final double totalSpacing = spacing * (crossAxisCount - 1);
        final double itemWidth =
            (availableWidth - totalSpacing) / crossAxisCount;

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildCategory(
              context,
              'Sacred Prayer',
              const [
                _FeatureItem(
                  'Prayers',
                  LucideIcons.heart,
                  '/prayers',
                  Colors.pink,
                ),
                _FeatureItem(
                  'Rosary',
                  LucideIcons.circleDot,
                  '/rosary',
                  Colors.pinkAccent,
                ),
                _FeatureItem(
                  'Light Candle',
                  LucideIcons.flame,
                  '/candles',
                  Colors.amber,
                ),
                _FeatureItem(
                  'Mass Offer',
                  LucideIcons.scroll,
                  '/mass-offering',
                  AppTheme.gold500,
                ),
                _FeatureItem(
                  'Novenas',
                  LucideIcons.calendar,
                  '/novenas',
                  Colors.purple,
                ),
                _FeatureItem(
                  'Stations',
                  LucideIcons.footprints,
                  '/stations',
                  Colors.brown,
                ),
                _FeatureItem(
                  'Chaplets',
                  LucideIcons.user,
                  '/chaplets',
                  Colors.indigo,
                ),
                _FeatureItem(
                  'Divine Office',
                  LucideIcons.clock,
                  '/divine-office',
                  Colors.blueGrey,
                ),
                _FeatureItem(
                  'Live Mass',
                  LucideIcons.tv,
                  '/live-mass',
                  Colors.red,
                ),
                _FeatureItem(
                  'Bouquets',
                  LucideIcons.flower,
                  '/bouquets',
                  Colors.orange,
                ),
              ],
              itemWidth,
              spacing,
            ),
            const SizedBox(height: 24),
            _buildCategory(
              context,
              'Faith & Wisdom',
              const [
                _FeatureItem(
                  'Readings',
                  LucideIcons.bookOpen,
                  '/readings',
                  Colors.green,
                ),
                _FeatureItem('Bible', LucideIcons.book, '/bible', Colors.brown),
                _FeatureItem(
                  'Study Plans',
                  LucideIcons.calendarRange,
                  '/reading-plans',
                  Colors.teal,
                ),
                _FeatureItem(
                  'Catechism',
                  LucideIcons.graduationCap,
                  '/catechism',
                  Colors.blue,
                ),
                _FeatureItem(
                  'Saints',
                  LucideIcons.users,
                  '/saints',
                  Colors.orange,
                ),
                _FeatureItem(
                  'Canon Law',
                  LucideIcons.scale,
                  '/canon_law',
                  Colors.blueGrey,
                ),
                _FeatureItem(
                  'Encyclicals',
                  LucideIcons.fileText,
                  '/encyclicals',
                  Colors.deepPurple,
                ),
                _FeatureItem(
                  'Summa',
                  LucideIcons.library,
                  '/summa',
                  Color(0xFFFF8F00),
                ),
                _FeatureItem(
                  'Vatican II',
                  LucideIcons.landmark,
                  '/vatican-ii',
                  Colors.grey,
                ),
                _FeatureItem(
                  'History',
                  LucideIcons.hourglass,
                  '/history',
                  Color(0xFF8D6E63),
                ),
                _FeatureItem(
                  'Hierarchy',
                  LucideIcons.network,
                  '/hierarchy',
                  Colors.cyan,
                ),
                _FeatureItem(
                  'Glossary',
                  LucideIcons.search,
                  '/glossary',
                  Colors.blue,
                ),
              ],
              itemWidth,
              spacing,
            ),
            const SizedBox(height: 24),
            _buildCategory(
              context,
              'Community & Praise',
              const [
                _FeatureItem(
                  'Prayer Wall',
                  LucideIcons.heartHandshake,
                  '/prayer-wall',
                  Colors.pink,
                ),
                _FeatureItem(
                  'Groups',
                  LucideIcons.users,
                  '/groups',
                  Colors.indigo,
                ),
                _FeatureItem(
                  'Partners',
                  LucideIcons.userPlus,
                  '/prayer-partners',
                  Colors.teal,
                ),
                _FeatureItem(
                  'Memorials',
                  LucideIcons.flower,
                  '/memorials',
                  Colors.purple,
                ),
                _FeatureItem(
                  'Churches',
                  LucideIcons.church,
                  '/churches',
                  Colors.brown,
                ),
                _FeatureItem(
                  'Pilgrimages',
                  LucideIcons.map,
                  '/pilgrimages',
                  Colors.green,
                ),
                _FeatureItem(
                  'News',
                  LucideIcons.newspaper,
                  '/news',
                  Colors.blue,
                ),
                _FeatureItem(
                  'Hymns',
                  LucideIcons.music,
                  '/hymns',
                  Colors.deepOrange,
                ),
                _FeatureItem('Chant', LucideIcons.mic, '/chant', Colors.brown),
                _FeatureItem(
                  'Testimonies',
                  LucideIcons.messageCircle,
                  '/testimonies',
                  Colors.orange,
                ),
              ],
              itemWidth,
              spacing,
            ),
            const SizedBox(height: 24),
            _buildCategory(
              context,
              'Sacraments & Records',
              const [
                _FeatureItem(
                  'Confession',
                  LucideIcons.key,
                  '/confession',
                  Colors.purple,
                ),
                _FeatureItem(
                  'Sacraments',
                  LucideIcons.droplets,
                  '/sacraments',
                  Colors.blue,
                ),
                _FeatureItem(
                  'Certificates',
                  LucideIcons.award,
                  '/certificates',
                  AppTheme.gold500,
                ),
                _FeatureItem(
                  'Examen',
                  LucideIcons.search,
                  '/examen',
                  Colors.teal,
                ),
              ],
              itemWidth,
              spacing,
            ),
            const SizedBox(height: 24),
            _buildCategory(
              context,
              'Tools & Growth',
              const [
                _FeatureItem(
                  'Calendar',
                  LucideIcons.calendarCheck,
                  '/calendar',
                  Colors.red,
                ),
                _FeatureItem(
                  'Journal',
                  LucideIcons.penTool,
                  '/prayer-journal',
                  Colors.brown,
                ),
                _FeatureItem(
                  'Focus Mode',
                  LucideIcons.focus,
                  '/focus-mode',
                  Colors.indigo,
                ),
                _FeatureItem(
                  'Tracking',
                  LucideIcons.barChart,
                  '/year-in-review',
                  Colors.green,
                ),
                _FeatureItem(
                  'Challenges',
                  LucideIcons.trophy,
                  '/challenges',
                  Colors.amber,
                ),
                _FeatureItem(
                  'Achievements',
                  LucideIcons.medal,
                  '/achievements',
                  Colors.orangeAccent,
                ),
              ],
              itemWidth,
              spacing,
            ),
          ],
        );
      },
    );
  }

  Widget _buildCategory(
    BuildContext context,
    String title,
    List<_FeatureItem> items,
    double itemWidth,
    double spacing,
  ) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            title,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        Wrap(
          spacing: spacing,
          runSpacing: spacing,
          alignment: WrapAlignment.center,
          children: items
              .map((item) => _buildFeatureCard(context, item, itemWidth))
              .toList(),
        ),
      ],
    );
  }

  Widget _buildFeatureCard(
    BuildContext context,
    _FeatureItem item,
    double width,
  ) {
    return InkWell(
      onTap: () => context.push(item.route),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        // Dynamic responsive width
        width: width,
        constraints: const BoxConstraints(minHeight: 80),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: item.color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: item.color.withValues(alpha: 0.2)),
              ),
              child: Icon(item.icon, color: item.color, size: 24),
            ),
            const SizedBox(height: 8),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                item.label,
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: Colors.white70,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _FeatureItem {
  final String label;
  final IconData icon;
  final String route;
  final Color color;

  const _FeatureItem(this.label, this.icon, this.route, this.color);
}
