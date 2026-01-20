import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/sacred_copy.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';

class PremiumHomeHeader extends ConsumerWidget {
  const PremiumHomeHeader({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Blessed Night';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final streak = authState.value?.streakCount ?? 0;
    final screenWidth = MediaQuery.of(context).size.width;

    return SliverAppBar(
      expandedHeight: 280.0,
      floating: false,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      elevation: 0,
      leadingWidth: 60,
      leading: const Padding(
        padding: EdgeInsets.only(left: 8.0),
        child: AppBarMenuButton(iconColor: Colors.white, showBackground: true),
      ),
      actions: [
        // Streak Badge
        Padding(
          padding: const EdgeInsets.only(right: 12.0),
          child: _buildGlassBadge(
            context,
            icon: LucideIcons.flame,
            label: '$streak Days',
            color: AppTheme.gold500,
            onTap: () => _showStreakDialog(context, streak),
          ),
        ),
        // Profile Avatar
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: GestureDetector(
            onTap: () {
              final user = ref.read(authProvider).value;
              if (user != null) {
                context.push('/profile');
              } else {
                context.push('/login');
              }
            },
            child: Container(
              width: 38,
              height: 38,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.sacredNavy800,
                border: Border.all(
                  color: AppTheme.gold500.withValues(alpha: 0.5),
                  width: 1.5,
                ),
                image: const DecorationImage(
                  image: NetworkImage(
                    'https://i.pravatar.cc/150?img=68',
                  ), // Placeholder avatar
                  fit: BoxFit.cover,
                ),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        stretchModes: const [StretchMode.zoomBackground, StretchMode.fadeTitle],
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Premium Background Image (Darker, more sacred feel)
            Image.network(
              'https://images.unsplash.com/photo-1548625361-ec8f95149833?q=80&w=2070&auto=format&fit=crop', // Cathedral Interior/Altar
              fit: BoxFit.cover,
              errorBuilder: (context, error, stack) =>
                  Container(color: AppTheme.sacredNavy950),
            ),

            // Heavy Gradient Overlay for legibility
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.sacredNavy950.withValues(alpha: 0.8),
                    AppTheme.sacredNavy900.withValues(alpha: 0.5),
                    AppTheme.sacredNavy950,
                  ],
                  stops: const [0.0, 0.5, 1.0],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),

            // Decorative Elements (Subtle)
            Positioned(
              top: -50,
              right: -50,
              child: _buildGlowingOrb(AppTheme.gold500, 300, 0.1),
            ),

            // Content
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24.0,
                  vertical: 24.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Enhanced Date Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(30),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.15),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            LucideIcons.calendarDays,
                            size: 14,
                            color: AppTheme.gold400,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _getFormattedDate().toUpperCase(),
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.white.withValues(alpha: 0.9),
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Elegant Greeting
                    Text(
                      _getGreeting(),
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: -0.5,
                        height: 1.1,
                      ),
                    ),
                    const SizedBox(height: 8),

                    // Welcome Message with improved typography
                    SizedBox(
                      width: screenWidth * 0.8, // Limit width for readability
                      child: Text(
                        SacredCopy.welcome.homepage,
                        style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w300,
                          color: Colors.white.withValues(alpha: 0.9),
                          height: 1.5,
                        ),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGlassBadge(
    BuildContext context, {
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 38,
        padding: const EdgeInsets.symmetric(horizontal: 12),
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy900.withValues(alpha: 0.8),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withValues(alpha: 0.3), width: 1),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color),
            const SizedBox(width: 6),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGlowingOrb(Color color, double size, double opacity) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: RadialGradient(
          colors: [
            color.withValues(alpha: opacity),
            color.withValues(alpha: 0.0),
          ],
          stops: const [0.0, 0.7],
        ),
      ),
    );
  }

  void _showStreakDialog(BuildContext context, int streak) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: Row(
          children: [
            const Icon(LucideIcons.flame, color: AppTheme.gold500),
            const SizedBox(width: 8),
            Text(
              'Prayer Streak',
              style: GoogleFonts.merriweather(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: AppTheme.gold500.withValues(alpha: 0.1),
                border: Border.all(color: AppTheme.gold500, width: 2),
              ),
              child: Column(
                children: [
                  Text(
                    '$streak',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 42,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold500,
                    ),
                  ),
                  Text(
                    'DAYS',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 1.5,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Consistency is key to spiritual growth. Keep going!',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(color: Colors.white70, height: 1.5),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Close',
              style: GoogleFonts.inter(
                color: AppTheme.gold500,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getFormattedDate() {
    final now = DateTime.now();
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    final weekDays = [
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ];
    return '${weekDays[now.weekday - 1]}, ${now.day} ${months[now.month - 1]}';
  }
}
