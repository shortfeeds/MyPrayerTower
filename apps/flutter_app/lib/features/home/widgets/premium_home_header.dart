import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui';
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
    final user = ref.watch(authProvider).value;
    final userName = user?.name.split(' ').first ?? 'Pilgrim';

    return SliverAppBar(
      expandedHeight: 280.0,
      collapsedHeight: kToolbarHeight + 10,
      floating: false,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      elevation: 0,
      // Custom Leading for Menu
      leadingWidth: 70,
      leading: Padding(
        padding: const EdgeInsets.only(left: 20.0, top: 12.0, bottom: 12.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: const AppBarMenuButton(
            iconColor: Colors.white,
            showBackground: false,
            size: 20,
          ),
        ),
      ),
      // Profile Action
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 20.0, top: 12.0, bottom: 12.0),
          child: GestureDetector(
            onTap: () {
              if (user != null) {
                context.push('/profile');
              } else {
                context.push('/login');
              }
            },
            child: Container(
              width: 44,
              height: 44,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    AppTheme.gold500,
                    AppTheme.gold500.withValues(alpha: 0.1),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.sacredNavy950,
                ),
                child: ClipOval(
                  child: user?.avatarUrl != null
                      ? Image.network(user!.avatarUrl!, fit: BoxFit.cover)
                      : const Icon(
                          LucideIcons.user,
                          color: Colors.white,
                          size: 20,
                        ),
                ),
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
            // 1. Professional Gradient Background
            const _ProfessionalBackground(),

            // 2. Content Layer
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24.0,
                  vertical: 16.0,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Date Badge
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.gold500.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.gold500.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          const Icon(
                            LucideIcons.calendar,
                            size: 14,
                            color: AppTheme.gold400,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            _getFormattedDate().toUpperCase(),
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.gold100,
                              letterSpacing: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Greeting Block
                    TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0.0, end: 1.0),
                      duration: const Duration(milliseconds: 800),
                      curve: Curves.easeOutCubic,
                      builder: (context, value, child) {
                        return Opacity(
                          opacity: value,
                          child: Transform.translate(
                            offset: Offset(0, 20 * (1 - value)),
                            child: child,
                          ),
                        );
                      },
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            _getGreeting(),
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 28,
                              fontWeight: FontWeight.w400,
                              color: Colors.white.withValues(alpha: 0.9),
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            userName,
                            style: GoogleFonts.playfairDisplay(
                              fontSize: 36,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              letterSpacing: -0.5,
                              height: 1.1,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Welcome Subtitle (Clean & Professional)
                    Text(
                      SacredCopy.welcome.homepage,
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w400,
                        color: Colors.white.withValues(alpha: 0.7),
                        height: 1.5,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
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

class _ProfessionalBackground extends StatelessWidget {
  const _ProfessionalBackground();

  @override
  Widget build(BuildContext context) {
    return Stack(
      fit: StackFit.expand,
      children: [
        // 1. Solid Deep Navy Base
        Container(color: AppTheme.sacredNavy950),

        // 2. Sophisticated Gradient Mesh
        // Top Right Glow (Subtle)
        Positioned(
          top: -200,
          right: -100,
          child: Container(
            width: 500,
            height: 500,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF1E3A8A).withValues(alpha: 0.3), // Dark Blue
                  Colors.transparent,
                ],
                stops: const [0.0, 0.7],
              ),
            ),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
              child: const SizedBox(),
            ),
          ),
        ),

        // Bottom Left Glow (Subtle)
        Positioned(
          bottom: -150,
          left: -100,
          child: Container(
            width: 400,
            height: 400,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: RadialGradient(
                colors: [
                  const Color(0xFF581C87).withValues(alpha: 0.2), // Deep Purple
                  Colors.transparent,
                ],
                stops: const [0.0, 0.7],
              ),
            ),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 60, sigmaY: 60),
              child: const SizedBox(),
            ),
          ),
        ),

        // 3. Noise Texture (Extremely Subtle mostly for removing banding)
        Opacity(
          opacity: 0.03,
          child: Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                  'https://www.transparenttextures.com/patterns/stardust.png',
                ), // Fallback/Placeholder path, realistically use asset or code-gen noise
                repeat: ImageRepeat.repeat,
              ),
            ),
          ),
        ),

        // 4. Vignette for focus
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.3),
                Colors.transparent,
                Colors.black.withValues(alpha: 0.4),
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        ),
      ],
    );
  }
}
