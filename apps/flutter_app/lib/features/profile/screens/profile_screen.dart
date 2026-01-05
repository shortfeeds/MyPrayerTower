import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

import '../../auth/providers/auth_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final user = authState.value;

    if (authState.isLoading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (user == null) {
      // Guest view
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Guest User',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => context.go('/login'),
                child: const Text('Sign In'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            title: Text(
              'Profile',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            backgroundColor: AppTheme.darkBg,
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.settings),
                onPressed: () {},
              ),
            ],
          ),

          // Profile Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  // Avatar
                  Container(
                    width: 100,
                    height: 100,
                    decoration: const BoxDecoration(
                      gradient: AppTheme.primaryGradient,
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        user.name?.substring(0, 1).toUpperCase() ?? 'U',
                        style: Theme.of(context).textTheme.displaySmall
                            ?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Text(
                    user.name ?? 'User',
                    style: Theme.of(context).textTheme.headlineMedium,
                  ),

                  const SizedBox(height: 4),

                  Text(
                    '${user.subscriptionStatus} Member',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: AppTheme.textMuted),
                  ),

                  const SizedBox(height: 16),

                  // Upgrade Button
                  if (user.subscriptionStatus == 'FREE')
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => context.push('/subscription'),
                        icon: const Icon(LucideIcons.crown, size: 18),
                        label: const Text('Upgrade to Premium'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.accentGold,
                          padding: const EdgeInsets.symmetric(vertical: 14),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Stats
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    const _StatItem(
                      icon: LucideIcons.flame,
                      value: '7',
                      label: 'Day Streak',
                    ),
                    Container(width: 1, height: 40, color: AppTheme.darkBorder),
                    const _StatItem(
                      icon: LucideIcons.heart,
                      value: '127',
                      label: 'Prayers',
                    ),
                    Container(width: 1, height: 40, color: AppTheme.darkBorder),
                    const _StatItem(
                      icon: LucideIcons.award,
                      value: '3',
                      label: 'Badges',
                    ),
                  ],
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Menu Items
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Activity',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 12)),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _MenuItem(
                    icon: LucideIcons.heart,
                    title: 'My Prayers',
                    subtitle: 'View your prayer requests',
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.flame,
                    title: 'Candles',
                    subtitle: 'Your virtual candles',
                    onTap: () => context.push('/candles'),
                  ),
                  _MenuItem(
                    icon: LucideIcons.church,
                    title: 'Following',
                    subtitle: 'Churches you follow',
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.trophy,
                    title: 'Achievements',
                    subtitle: '3 badges earned',
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.barChart2,
                    title: 'Year in Review',
                    subtitle: 'Your 2026 prayer journey',
                    onTap: () {},
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Settings Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'Settings',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 12)),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                children: [
                  _MenuItem(
                    icon: LucideIcons.bell,
                    title: 'Notifications',
                    subtitle: 'Prayer reminders & alerts',
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.creditCard,
                    title: 'Subscription',
                    subtitle: 'Manage your plan',
                    onTap: () => context.push('/subscription'),
                  ),
                  _MenuItem(
                    icon: LucideIcons.helpCircle,
                    title: 'Help & Support',
                    subtitle: 'FAQs and contact us',
                    onTap: () {},
                  ),
                  _MenuItem(
                    icon: LucideIcons.logOut,
                    title: 'Log Out',
                    subtitle: '',
                    isDestructive: true,
                    onTap: () {
                      ref.read(authProvider.notifier).logout();
                      context.go('/login');
                    },
                  ),
                ],
              ),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Icon(icon, color: AppTheme.accentGold, size: 20),
        const SizedBox(height: 4),
        Text(
          value,
          style: Theme.of(
            context,
          ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
        ),
        Text(
          label,
          style: Theme.of(
            context,
          ).textTheme.labelSmall?.copyWith(color: AppTheme.textMuted),
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

  const _MenuItem({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
    this.isDestructive = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isDestructive
                      ? AppTheme.error.withValues(alpha: 0.15)
                      : AppTheme.primaryBlue.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(
                  icon,
                  size: 20,
                  color: isDestructive ? AppTheme.error : AppTheme.info,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      title,
                      style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        color: isDestructive ? AppTheme.error : null,
                      ),
                    ),
                    if (subtitle.isNotEmpty)
                      Text(
                        subtitle,
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.textMuted,
                        ),
                      ),
                  ],
                ),
              ),
              const Icon(
                LucideIcons.chevronRight,
                size: 18,
                color: AppTheme.textMuted,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
