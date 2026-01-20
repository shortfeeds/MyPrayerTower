import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../../../core/theme/app_theme.dart';

/// Premium Offerings screen with beautiful card design and animations
class OfferingsScreen extends StatelessWidget {
  const OfferingsScreen({super.key});

  static const List<_OfferingItem> _offerings = [
    _OfferingItem(
      title: 'Light a Candle',
      subtitle: 'Illuminate your prayers',
      description: 'Light a virtual candle for your intentions.',
      price: 'Free - \$14.99',
      icon: LucideIcons.flame,
      gradient: LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEF4444)]),
      route: '/candles',
      badge: 'POPULAR',
    ),
    _OfferingItem(
      title: 'Single Mass',
      subtitle: 'Personal intention',
      description: 'A single Holy Mass offered for your intention.',
      price: '\$10.00',
      icon: LucideIcons.church,
      gradient: LinearGradient(colors: [AppTheme.gold400, AppTheme.gold500]),
      route: '/mass-offering',
    ),
    _OfferingItem(
      title: 'Novena of Masses',
      subtitle: '9 consecutive days',
      description: '9 consecutive Masses offered for your intention.',
      price: '\$75.00',
      icon: LucideIcons.calendarDays,
      gradient: LinearGradient(colors: [Color(0xFFF43F5E), Color(0xFFEC4899)]),
      route: '/mass-offering',
    ),
    _OfferingItem(
      title: 'Perpetual Enrollment',
      subtitle: 'Forever in prayer',
      description: 'Enrolled forever in daily Masses.',
      price: '\$100.00',
      icon: LucideIcons.infinity,
      gradient: LinearGradient(colors: [Color(0xFF8B5CF6), Color(0xFFA855F7)]),
      route: '/mass-offering',
      badge: 'BEST VALUE',
    ),
    _OfferingItem(
      title: 'Gregorian Masses',
      subtitle: 'For the departed',
      description: '30 consecutive Masses for the deceased.',
      price: '\$200.00',
      icon: LucideIcons.cross,
      gradient: LinearGradient(colors: [Color(0xFF64748B), Color(0xFF475569)]),
      route: '/mass-offering',
    ),
    _OfferingItem(
      title: 'Spiritual Bouquet',
      subtitle: 'Gift of prayer',
      description: 'Send a beautiful bouquet of prayers.',
      price: 'From \$10.00',
      icon: LucideIcons.flower,
      gradient: LinearGradient(colors: [Color(0xFFEC4899), Color(0xFFF472B6)]),
      route: '/bouquets',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // Premium Header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: Colors.transparent,
            leading: const AppBarMenuButton(
              iconColor: Colors.white,
              showBackground: false,
            ),
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      AppTheme.gold500.withValues(alpha: 0.2),
                      AppTheme.sacredNavy950,
                    ],
                  ),
                ),
                child: SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 60, 24, 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                              '✨ Sacred Offerings',
                              style: GoogleFonts.merriweather(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            )
                            .animate()
                            .fadeIn(duration: 500.ms)
                            .slideY(begin: -0.2),
                        const SizedBox(height: 8),
                        Text(
                          'Choose how you wish to offer your devotion',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: AppTheme.textSecondary,
                          ),
                        ).animate(delay: 200.ms).fadeIn().slideY(begin: -0.2),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ),

          // Offerings Grid
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final offering = _offerings[index];
                return _PremiumOfferingCard(offering: offering, index: index);
              }, childCount: _offerings.length),
            ),
          ),

          // Bottom padding for nav bar
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _PremiumOfferingCard extends StatelessWidget {
  final _OfferingItem offering;
  final int index;

  const _PremiumOfferingCard({required this.offering, required this.index});

  @override
  Widget build(BuildContext context) {
    return Container(
          margin: const EdgeInsets.only(bottom: 16),
          child: Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () => context.push(offering.route),
              borderRadius: BorderRadius.circular(20),
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(20),
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.sacredNavy900.withValues(alpha: 0.8),
                      AppTheme.sacredNavy900.withValues(alpha: 0.5),
                    ],
                  ),
                  border: Border.all(
                    color: offering.gradient.colors.first.withValues(
                      alpha: 0.3,
                    ),
                    width: 1,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: offering.gradient.colors.first.withValues(
                        alpha: 0.15,
                      ),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    // Icon Container with Gradient
                    Container(
                      width: 64,
                      height: 64,
                      decoration: BoxDecoration(
                        gradient: offering.gradient,
                        borderRadius: BorderRadius.circular(16),
                        boxShadow: [
                          BoxShadow(
                            color: offering.gradient.colors.first.withValues(
                              alpha: 0.4,
                            ),
                            blurRadius: 12,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Icon(offering.icon, color: Colors.white, size: 28),
                    ),
                    const SizedBox(width: 16),

                    // Content
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  offering.title,
                                  style: GoogleFonts.merriweather(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ),
                              if (offering.badge != null) ...[
                                const SizedBox(width: 6),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 6,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: offering.gradient,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    offering.badge!,
                                    style: GoogleFonts.inter(
                                      fontSize: 8,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ],
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            offering.subtitle,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: offering.gradient.colors.first,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            offering.description,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Price & Arrow
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          offering.price,
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.gold500,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: Colors.white.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            LucideIcons.arrowRight,
                            color: AppTheme.gold500,
                            size: 16,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
        )
        .animate(delay: Duration(milliseconds: 100 * index))
        .fadeIn()
        .slideX(begin: 0.1);
  }
}

class _OfferingItem {
  final String title;
  final String subtitle;
  final String description;
  final String price;
  final IconData icon;
  final LinearGradient gradient;
  final String route;
  final String? badge;

  const _OfferingItem({
    required this.title,
    required this.subtitle,
    required this.description,
    required this.price,
    required this.icon,
    required this.gradient,
    required this.route,
    this.badge,
  });
}
