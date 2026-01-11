import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class LibraryScreen extends ConsumerWidget {
  const LibraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // 1. Premium App Bar
          SliverAppBar(
            expandedHeight: 140.0,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: const SizedBox(), // Hide default back button
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              expandedTitleScale: 1.2,
              title: Text(
                'Catholic Hub',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                    ),
                  ),
                  // Texture overlay
                  Opacity(
                    opacity: 0.1,
                    child: Image.network(
                      'https://www.transparenttextures.com/patterns/cubes.png', // Or local asset
                      repeat: ImageRepeat.repeat,
                      errorBuilder: (_, __, ___) => const SizedBox(),
                    ),
                  ),
                  Positioned(
                    right: -40,
                    top: -40,
                    child: Icon(
                      LucideIcons.church,
                      size: 200,
                      color: Colors.white.withValues(alpha: 0.05),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // 2. Spiritual Growth Section
          _buildSectionHeader('Spiritual Growth', LucideIcons.trendingUp, Colors.green),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid.count(
              crossAxisCount: 2,
              mainAxisSpacing: 12,
              crossAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                _PremiumTile(
                  title: 'Achievements',
                  subtitle: 'Track progress',
                  icon: LucideIcons.trophy,
                  color: Colors.amber,
                  onTap: () => context.push('/achievements'),
                ),
                _PremiumTile(
                  title: 'Challenges',
                  subtitle: 'Daily tasks',
                  icon: LucideIcons.checkCircle,
                  color: Colors.blue,
                  onTap: () => context.push('/challenges'),
                ),
                _PremiumTile(
                  title: 'Leaderboard',
                  subtitle: 'Community rank',
                  icon: LucideIcons.barChart2,
                  color: Colors.purple,
                  onTap: () => context.push('/leaderboard'),
                ),
                _PremiumTile(
                  title: 'Fasting',
                  subtitle: 'Church rules',
                  icon: LucideIcons.utensilsCrossed,
                  color: Colors.teal,
                  onTap: () => context.push('/fasting'),
                ),
                _PremiumTile(
                  title: 'Certificates',
                  subtitle: 'Earned awards',
                  icon: LucideIcons.award,
                  color: Colors.pink,
                  onTap: () => context.push('/certificates'),
                ),
                _PremiumTile(
                  title: 'Sacraments',
                  subtitle: 'My records',
                  icon: LucideIcons.scroll,
                  color: Colors.cyan,
                  onTap: () => context.push('/sacraments'),
                ),
                _PremiumTile(
                  title: 'Year in Review',
                  subtitle: 'Annual stats',
                  icon: LucideIcons.calendarClock,
                  color: Colors.deepPurple,
                  onTap: () => context.push('/year-in-review'),
                ),
                _PremiumTile(
                  title: 'My Journey',
                  subtitle: 'Spiritual timeline',
                  icon: LucideIcons.map,
                  color: Colors.indigo,
                  onTap: () => context.push('/journey'),
                ),
              ].animate(interval: 50.ms).fadeIn().slideY(begin: 0.2, end: 0),
            ),
          ),

          // 3. Community Section
          _buildSectionHeader('Community', LucideIcons.users, Colors.blue),
          SliverToBoxAdapter(
            child: SizedBox(
              height: 160,
              child: ListView(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                physics: const BouncingScrollPhysics(),
                children: [
                  _LargePremiumTile(
                    title: 'Prayer Groups',
                    subtitle: 'Join a circle',
                    icon: LucideIcons.users,
                    color: Colors.indigo,
                    width: 200,
                    onTap: () => context.push('/groups'),
                    image: 'https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80',
                  ),
                  const SizedBox(width: 12),
                  _LargePremiumTile(
                    title: 'Memorials',
                    subtitle: 'Remembering',
                    icon: LucideIcons.heart,
                    color: Colors.pink,
                    width: 160,
                    onTap: () => context.push('/memorials'),
                    image: 'https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?auto=format&fit=crop&q=80',
                  ),
                  const SizedBox(width: 12),
                  _LargePremiumTile(
                    title: 'Catholic News',
                    subtitle: 'Latest updates',
                    icon: LucideIcons.newspaper,
                    color: Colors.red,
                    width: 160,
                    onTap: () => context.push('/news'),
                    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80',
                  ),
                  const SizedBox(width: 12),
                  _LargePremiumTile(
                    title: 'Testimonies',
                    subtitle: 'Impact stories',
                    icon: LucideIcons.quote,
                    color: Colors.amber,
                    width: 180,
                    onTap: () => context.push('/testimonies'),
                    image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&q=80',
                  ),
                ].animate(interval: 100.ms).fadeIn().slideX(begin: 0.2, end: 0),
              ),
            ),
          ),

          // 4. Prayer Tools
          _buildSectionHeader('Prayer Tools', LucideIcons.hand, Colors.orange),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid.count(
              crossAxisCount: 4,
              mainAxisSpacing: 16,
              crossAxisSpacing: 12,
              childAspectRatio: 0.75, // Tall for icon + text
              children: [
                _ToolIcon(title: 'Prayers', icon: LucideIcons.bookOpen, color: Colors.blue, onTap: () => context.push('/prayers')),
                _ToolIcon(title: 'Rosary', icon: LucideIcons.circleDot, color: Colors.pink, onTap: () => context.push('/rosary')),
                _ToolIcon(title: 'Bible', icon: LucideIcons.book, color: Colors.brown, onTap: () => context.push('/bible')),
                _ToolIcon(title: 'Novena', icon: LucideIcons.flame, color: Colors.orange, onTap: () => context.push('/novenas')),
                _ToolIcon(title: 'Stations', icon: LucideIcons.cross, color: Colors.red, onTap: () => context.push('/stations')),
                _ToolIcon(title: 'Confession', icon: LucideIcons.userCheck, color: Colors.purple, onTap: () => context.push('/confession')),
                _ToolIcon(title: 'Examen', icon: LucideIcons.search, color: Colors.indigo, onTap: () => context.push('/examen')),
                _ToolIcon(title: 'Calendar', icon: LucideIcons.calendar, color: Colors.green, onTap: () => context.push('/calendar')),
                _ToolIcon(title: 'Chaplets', icon: LucideIcons.gem, color: Colors.deepPurple, onTap: () => context.push('/chaplets')),
                _ToolIcon(title: 'Hymns', icon: LucideIcons.music, color: Colors.indigo, onTap: () => context.push('/hymns')),
                _ToolIcon(title: 'Pilgrims', icon: LucideIcons.plane, color: Colors.blue, onTap: () => context.push('/pilgrimages')),
                _ToolIcon(title: 'Glossary', icon: LucideIcons.type, color: Colors.brown, onTap: () => context.push('/glossary')),
                _ToolIcon(title: 'Chant', icon: LucideIcons.music, color: Colors.deepOrange, onTap: () => context.push('/chant')),
              ].animate(interval: 30.ms).fadeIn().scale(),
            ),
          ),

          // 5. Reference Library
          _buildSectionHeader('Reference Library', LucideIcons.library, Colors.brown),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _ReferenceCard(
                  title: 'Catechism of the Catholic Church',
                  subtitle: 'The full text of the Catechism',
                  icon: LucideIcons.book,
                  color: Colors.amber.shade800,
                  onTap: () => context.push('/catechism'),
                ),
                const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Code of Canon Law',
                  subtitle: 'Ecclesiastical laws',
                  icon: LucideIcons.gavel,
                  color: Colors.purple.shade700,
                  onTap: () => context.push('/canon_law'),
                ),
                const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Papal Encyclicals',
                  subtitle: 'Letters from the Popes',
                  icon: LucideIcons.scroll,
                  color: Colors.teal.shade700,
                  onTap: () => context.push('/encyclicals'),
                ),
                const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Vatican II Documents',
                  subtitle: 'Constitutions, Decrees & Declarations',
                  icon: LucideIcons.landmark,
                  color: Colors.blueGrey.shade700,
                  onTap: () => context.push('/vatican-ii'),
                ),
                 const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Summa Theologica',
                  subtitle: 'St. Thomas Aquinas',
                  icon: LucideIcons.scale,
                  color: Colors.brown.shade700,
                  onTap: () => context.push('/summa'),
                ),
                 const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Church Hierarchy',
                  subtitle: 'Structure of the Church',
                  icon: LucideIcons.network,
                  color: Colors.indigo.shade700,
                  onTap: () => context.push('/hierarchy'),
                ),
                 const SizedBox(height: 12),
                _ReferenceCard(
                  title: 'Church History',
                  subtitle: '2,000 years of faith',
                  icon: LucideIcons.hourglass,
                  color: Colors.deepOrange.shade700,
                  onTap: () => context.push('/history'),
                ),
              ].animate(interval: 50.ms).fadeIn().slideX(begin: 0.1, end: 0)),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title, IconData icon, Color color) {
    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(16, 32, 16, 16),
      sliver: SliverToBoxAdapter(
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: color.withValues(alpha: 0.2)),
              ),
              child: Icon(icon, color: color, size: 18),
            ),
            const SizedBox(width: 12),
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
      ),
    );
  }
}

// -----------------------------------------------------------------------------
// PREMIUM COMPONENTS
// -----------------------------------------------------------------------------

class _PremiumTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _PremiumTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(16),
      onTap: onTap,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: GoogleFonts.outfit(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                ),
              ),
              Text(
                subtitle,
                style: GoogleFonts.inter(
                  fontSize: 11,
                  color: Colors.white70,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _LargePremiumTile extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final double width;
  final String? image;
  final VoidCallback onTap;

  const _LargePremiumTile({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.width,
    this.image,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      margin: const EdgeInsets.only(right: 12),
      child: PremiumGlassCard(
        padding: EdgeInsets.zero,
        onTap: onTap,
        child: Stack(
          fit: StackFit.expand,
          children: [
            if (image != null)
              ShaderMask(
                shaderCallback: (bounds) {
                  return LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.transparent,
                      Colors.black.withValues(alpha: 0.8),
                    ],
                  ).createShader(bounds);
                },
                blendMode: BlendMode.darken,
                child: CachedNetworkImage(
                  imageUrl: image!,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(color: AppTheme.sacredNavy800),
                  errorWidget: (context, url, error) => Container(color: AppTheme.sacredNavy800),
                ),
              )
            else
               Container(color: AppTheme.sacredNavy800),

             // Content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.2),
                      shape: BoxShape.circle,
                      border: Border.all(color: color.withValues(alpha: 0.3)),
                    ),
                    child: Icon(icon, color: color, size: 20),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    title,
                    style: GoogleFonts.merriweather(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ToolIcon extends StatelessWidget {
  final String title;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ToolIcon({
    required this.title,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: AppTheme.sacredNavy800,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(
                color: color.withValues(alpha: 0.3),
              ),
              boxShadow: [
                BoxShadow(
                  color: color.withValues(alpha: 0.1),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 8),
          Text(
            title,
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: Colors.white70,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _ReferenceCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final VoidCallback onTap;

  const _ReferenceCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      onTap: onTap,
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: color.withValues(alpha: 0.2)),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.outfit(
                    fontWeight: FontWeight.w600,
                    fontSize: 15,
                    color: Colors.white,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white60),
                ),
              ],
            ),
          ),
          Icon(
            LucideIcons.chevronRight,
            size: 16,
            color: Colors.white.withValues(alpha: 0.3),
          ),
        ],
      ),
    );
  }
}
