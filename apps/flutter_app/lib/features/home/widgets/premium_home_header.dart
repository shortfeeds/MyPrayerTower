import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';

class PremiumHomeHeader extends ConsumerWidget {
  const PremiumHomeHeader({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final streak = authState.value?.streakCount ?? 0;

    return SliverAppBar(
      expandedHeight: 260.0,
      floating: false,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      elevation: 0,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Gradient Background with more depth
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFF0F172A), // Slate 900
                    Color(0xFF1E1B4B), // Indigo 950
                    Color(0xFF0F172A), // Fade back
                  ],
                  stops: [0.0, 0.5, 1.0],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),

            // Decorative elements (multiple glowing orbs)
            Positioned(
              top: -50,
              right: -50,
              child: Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      AppTheme.gold500.withValues(alpha: 0.15),
                      AppTheme.gold500.withValues(alpha: 0.0),
                    ],
                  ),
                ),
              ),
            ),
            Positioned(
              bottom: 20,
              left: -30,
              child: Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: RadialGradient(
                    colors: [
                      Colors.purple.withValues(alpha: 0.1),
                      Colors.purple.withValues(alpha: 0.0),
                    ],
                  ),
                ),
              ),
            ),

            // Content
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Date badge with glow effect
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 14,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.white.withValues(alpha: 0.15),
                            Colors.white.withValues(alpha: 0.08),
                          ],
                        ),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(
                          color: Colors.white.withValues(alpha: 0.15),
                        ),
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.gold500.withValues(alpha: 0.1),
                            blurRadius: 10,
                            spreadRadius: -2,
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(4),
                            decoration: BoxDecoration(
                              color: AppTheme.gold400.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Icon(
                              LucideIcons.calendar,
                              size: 14,
                              color: AppTheme.gold400,
                            ),
                          ),
                          const SizedBox(width: 10),
                          Flexible(
                            child: Text(
                              _getFormattedDate(),
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                                color: Colors.white.withValues(alpha: 0.9),
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                    // Greeting with better typography
                    Text(
                      _getGreeting(),
                      style: GoogleFonts.merriweather(
                        fontSize: 32,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        letterSpacing: -0.5,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'May His grace be with you.',
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        color: Colors.white.withValues(alpha: 0.7),
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
      // Fixed hamburger menu button
      leading: const AppBarMenuButton(
        iconColor: Colors.white,
        showBackground: true,
      ),
      actions: [
        // Streak Counter
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: GestureDetector(
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: AppTheme.sacredNavy900,
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
                              style: GoogleFonts.inter(
                                fontSize: 36,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.gold500,
                              ),
                            ),
                            Text(
                              'Days',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                color: Colors.white70,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Keep praying daily to grow your streak!',
                        textAlign: TextAlign.center,
                        style: GoogleFonts.inter(color: Colors.white70),
                      ),
                    ],
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Close'),
                    ),
                  ],
                ),
              );
            },
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.gold500,
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.gold500.withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.flame,
                    size: 16,
                    color: AppTheme.sacredNavy900,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '$streak',
                    style: GoogleFonts.inter(
                      color: AppTheme.sacredNavy900,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        // Profile Avatar
        Padding(
          padding: const EdgeInsets.only(right: 16.0),
          child: GestureDetector(
            onTap: () => context.push('/login'),
            child: const CircleAvatar(
              radius: 18,
              backgroundColor: AppTheme.sacredNavy800,
              child: Icon(LucideIcons.user, size: 18, color: Colors.white),
            ),
          ),
        ),
      ],
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
