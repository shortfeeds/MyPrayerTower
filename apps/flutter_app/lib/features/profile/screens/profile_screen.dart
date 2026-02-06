import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../auth/providers/auth_provider.dart';
import '../../tracking/providers/progress_provider.dart';
import '../../../core/services/data_reset_service.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.value;
    final progress = ref.watch(progressProvider);

    if (authState.isLoading) {
      return const PremiumScaffold(
        body: Center(child: CircularProgressIndicator(color: AppTheme.gold500)),
      );
    }

    if (user == null) {
      // Guest view with Premium Styling
      return Scaffold(
        backgroundColor: AppTheme.deepSpace,
        body: Center(
          child: PremiumGlassCard(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(LucideIcons.user, size: 64, color: Colors.white70),
                const SizedBox(height: 24),
                Text(
                  'Guest Access',
                  style: GoogleFonts.merriweather(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  'Sign in to sync your prayers and progress.',
                  style: GoogleFonts.inter(color: Colors.white70, fontSize: 14),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                ShinyButton(
                  label: 'Sign In',
                  icon: LucideIcons.logIn,
                  onPressed: () => context.go('/login'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return PremiumScaffold(
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            pinned: true,
            title: Text(
              'My Profile',
              style: GoogleFonts.merriweather(
                fontWeight: FontWeight.bold,
                fontSize: 20,
                color: Colors.white,
              ),
            ),
            backgroundColor: AppTheme.sacredNavy900,
            leading: const SizedBox(),
            actions: [
              IconButton(
                icon: const Icon(
                  LucideIcons.bookOpen,
                  color: AppTheme.gold500,
                  size: 20,
                ),
                onPressed: () => context.push('/my-prayer-book'),
              ),
              IconButton(
                icon: const Icon(LucideIcons.settings, color: Colors.white70),
                onPressed: () => context.push('/settings'),
              ),
            ],
          ),

          // Profile Header (Membership Card)
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: _buildMembershipCard(
                context,
                user,
              ).animate().fadeIn().slideY(begin: 0.2, end: 0),
            ),
          ),

          // Stats
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: PremiumGlassCard(
                padding: const EdgeInsets.symmetric(vertical: 20),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _StatItem(
                      icon: LucideIcons.flame,
                      value: '${progress.dailyStreak}',
                      label: 'Day Streak',
                      color: AppTheme.gold500,
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                    _StatItem(
                      icon: LucideIcons.heart,
                      value: '${progress.totalPrayers}',
                      label: 'Prayers',
                      color: Colors.pink,
                    ),
                    Container(
                      width: 1,
                      height: 40,
                      color: Colors.white.withValues(alpha: 0.1),
                    ),
                    _StatItem(
                      icon: LucideIcons.timer,
                      value: '${progress.focusMinutes}',
                      label: 'Minutes',
                      color: Colors.indigoAccent,
                    ),
                  ],
                ),
              ).animate().fadeIn(delay: 100.ms).slideY(begin: 0.2, end: 0),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Menu Items: Activity
          _buildSectionHeader('Activity'),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  _MenuItem(
                    icon: LucideIcons.heart,
                    title: 'My Prayers',
                    subtitle: 'View your prayer requests',
                    color: Colors.pink,
                    onTap: () => context.push('/my-prayer-book'),
                  ),
                  _MenuItem(
                    icon: LucideIcons.flame,
                    title: 'Candles',
                    subtitle: 'Your virtual candles',
                    color: AppTheme.gold500,
                    onTap: () => context.push('/candles'),
                  ),
                  _MenuItem(
                    icon: LucideIcons.church,
                    title: 'Following',
                    subtitle: 'Churches you follow',
                    color: Colors.indigo,
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.trophy,
                    title: 'Achievements',
                    subtitle: '3 badges earned',
                    color: Colors.amber,
                    onTap: () => context.push('/achievements'),
                  ),
                ].animate(interval: 50.ms).fadeIn().slideX(begin: 0.1, end: 0),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Menu Items: Settings
          _buildSectionHeader('Settings'),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  _MenuItem(
                    icon: LucideIcons.bell,
                    title: 'Notifications',
                    subtitle: 'Prayer reminders & alerts',
                    color: Colors.blue,
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.creditCard,
                    title: 'Subscription',
                    subtitle: 'Manage your plan',
                    color: Colors.green,
                    onTap: () => context.push('/subscription'),
                  ),
                  _MenuItem(
                    icon: LucideIcons.helpCircle,
                    title: 'Help & Support',
                    subtitle: 'FAQs and contact us',
                    color: Colors.purple,
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.logOut,
                    title: 'Log Out',
                    subtitle: '',
                    color: AppTheme.error,
                    isDestructive: true,
                    onTap: () {
                      ref.read(authProvider.notifier).logout();
                      context.go('/login');
                    },
                  ),
                  _MenuItem(
                    icon: LucideIcons.rotateCcw,
                    title: 'Reset Local Data',
                    subtitle: 'Wipe all records for a fresh start',
                    color: Colors.orange,
                    onTap: () => _showResetDataDialog(context, ref),
                  ),
                  _MenuItem(
                    icon: LucideIcons.trash2,
                    title: 'Delete Account',
                    subtitle: 'Permanently remove your data',
                    color: AppTheme.error,
                    isDestructive: true,
                    onTap: () => _showDeleteAccountDialog(context, ref),
                  ),
                ].animate(interval: 50.ms).fadeIn().slideX(begin: 0.1, end: 0),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 150)),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        child: Text(
          title,
          style: GoogleFonts.merriweather(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
    );
  }

  Widget _buildMembershipCard(BuildContext context, dynamic user) {
    bool isPremium = user.subscriptionStatus == 'PREMIUM';

    return Container(
      height: 220,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isPremium
              ? [AppTheme.gold500, AppTheme.gold600, Colors.amber.shade900]
              : [
                  const Color(0xFF1E293B), // Slate 800
                  const Color(0xFF0F172A), // Slate 900
                ],
        ),
        boxShadow: [
          BoxShadow(
            color: isPremium
                ? AppTheme.gold500.withValues(alpha: 0.3)
                : Colors.black.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background Pattern
          Positioned(
            right: -50,
            top: -50,
            child: Icon(
              LucideIcons.crown,
              size: 250,
              color: Colors.white.withValues(alpha: 0.05),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'MEMBER CARD',
                      style: GoogleFonts.inter(
                        color: Colors.white.withValues(alpha: 0.6),
                        letterSpacing: 2,
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    if (isPremium)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: Colors.white.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Text(
                          'PREMIUM',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                  ],
                ),
                const Spacer(),
                Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: Colors.white.withValues(alpha: 0.2),
                      child: Text(
                        user.name?.substring(0, 1).toUpperCase() ?? 'U',
                        style: GoogleFonts.merriweather(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name ?? 'Guest User',
                          style: GoogleFonts.merriweather(
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          user.email ?? '',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.white.withValues(alpha: 0.7),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                if (!isPremium) ...[
                  const SizedBox(height: 20),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () => context.push('/subscription'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold500,
                        foregroundColor: AppTheme.sacredNavy900,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: const Text('Upgrade to Premium'),
                    ),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _showResetDataDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        title: Text(
          'Reset All Data?',
          style: GoogleFonts.merriweather(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Text(
          'This will clear all your locally saved prayers, journals, and progress. It is perfect for starting a "Clean Slate" journey.',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Colors.white)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context);
              await DataResetService.resetAllData();
              if (!context.mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                    'Data reset to nil. Restart app for best effect.',
                  ),
                ),
              );
            },
            child: Text(
              'Reset',
              style: GoogleFonts.inter(
                color: Colors.orange,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context, WidgetRef ref) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        title: Text(
          'Delete Account?',
          style: GoogleFonts.merriweather(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Text(
          'This action cannot be undone. All your prayers, candles, and history will be permanently erased.',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel', style: TextStyle(color: Colors.white)),
          ),
          TextButton(
            onPressed: () async {
              Navigator.pop(context); // Close dialog
              try {
                await ref.read(authProvider.notifier).deleteAccount();
                if (!context.mounted) return;

                context.go('/login');

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Account deleted successfully')),
                );
              } catch (e) {
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error deleting account: $e')),
                  );
                }
              }
            },
            child: Text(
              'Delete',
              style: GoogleFonts.inter(
                color: AppTheme.error,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: color, size: 24),
        const SizedBox(height: 8),
        Text(
          value,
          style: GoogleFonts.merriweather(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            color: Colors.white.withValues(alpha: 0.6),
          ),
        ),
      ],
    );
  }
}

class _MenuItem extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;
  final bool isDestructive;
  final Color color;

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.isDestructive = false,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: PremiumGlassCard(
        padding: const EdgeInsets.all(0),
        onTap: onTap,
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: color.withValues(alpha: 0.3)),
                ),
                child: Icon(
                  icon,
                  size: 22,
                  color: isDestructive ? AppTheme.error : color,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w600,
                        color: isDestructive ? AppTheme.error : Colors.white,
                      ),
                    ),
                    if (subtitle.isNotEmpty)
                      Text(
                        subtitle,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white.withValues(alpha: 0.6),
                        ),
                      ),
                  ],
                ),
              ),
              Icon(
                LucideIcons.chevronRight,
                size: 18,
                color: Colors.white.withValues(alpha: 0.3),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
