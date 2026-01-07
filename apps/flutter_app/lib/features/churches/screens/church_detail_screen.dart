import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/church_detail_provider.dart';

class ChurchDetailScreen extends ConsumerWidget {
  final String churchId;

  const ChurchDetailScreen({super.key, required this.churchId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final churchAsync = ref.watch(churchDetailProvider(churchId));

    return Scaffold(
      body: churchAsync.when(
        data: (church) => CustomScrollView(
          slivers: [
            // Hero Image
            SliverAppBar(
              backgroundColor: AppTheme.darkSurface,
              // GLOBAL MENU: Added action for detail screen
              actions: [
                IconButton(
                  icon: const Icon(LucideIcons.menu),
                  onPressed: () => Scaffold.of(context).openDrawer(),
                ),
              ],
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (church.primaryImageUrl != null)
                      Image.network(
                        church.primaryImageUrl!,
                        fit: BoxFit.cover,
                        errorBuilder: (_, __, ___) => Container(
                          color: AppTheme.primaryDark,
                          child: const Center(
                            child: Icon(
                              LucideIcons.church,
                              size: 80,
                              color: Colors.white54,
                            ),
                          ),
                        ),
                      )
                    else
                      Container(
                        decoration: const BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              AppTheme.primaryBlue,
                              AppTheme.primaryDark,
                            ],
                          ),
                        ),
                        child: Center(
                          child: Icon(
                            LucideIcons.church,
                            size: 80,
                            color: Colors.white.withValues(alpha: 0.5),
                          ),
                        ),
                      ),

                    // Gradient overlay for text readability
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            Colors.black.withValues(alpha: 0.7),
                          ],
                          stops: const [0.6, 1.0],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Church Info
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Name and verified badge
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            church.name,
                            style: Theme.of(context).textTheme.headlineMedium,
                          ),
                        ),
                        if (church.isVerified)
                          Container(
                            margin: const EdgeInsets.only(left: 8),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppTheme.info.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  LucideIcons.badgeCheck,
                                  size: 14,
                                  color: AppTheme.info,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  'Verified',
                                  style: Theme.of(context).textTheme.labelSmall
                                      ?.copyWith(color: AppTheme.info),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),

                    const SizedBox(height: 8),

                    // Location
                    Row(
                      children: [
                        const Icon(
                          LucideIcons.mapPin,
                          size: 16,
                          color: AppTheme.textMuted,
                        ),
                        const SizedBox(width: 6),
                        Text(
                          '${church.city}, ${church.country ?? ''}',
                          style: Theme.of(context).textTheme.bodyMedium
                              ?.copyWith(color: AppTheme.textMuted),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Action Buttons
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton.icon(
                            onPressed: () async {
                              final query = Uri.encodeComponent(
                                '${church.name}, ${church.city}, ${church.country ?? ''}',
                              );
                              final googleUrl = Uri.parse(
                                'https://www.google.com/maps/search/?api=1&query=$query',
                              );

                              if (await canLaunchUrl(googleUrl)) {
                                await launchUrl(
                                  googleUrl,
                                  mode: LaunchMode.externalApplication,
                                );
                              } else {
                                if (context.mounted) {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(
                                      content: Text('Could not launch maps'),
                                    ),
                                  );
                                }
                              }
                            },
                            icon: const Icon(LucideIcons.navigation, size: 18),
                            label: const Text('Directions'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.primaryBlue,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                  content: Text('Following enabled!'),
                                ),
                              );
                            },
                            icon: const Icon(LucideIcons.heart, size: 18),
                            label: const Text('Follow'),
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Schedules
                    _ScheduleSection(
                      title: 'Mass Schedule',
                      schedule: church.massSchedule,
                      icon: LucideIcons.calendar,
                    ),

                    _ScheduleSection(
                      title: 'Confession Schedule',
                      schedule: church.confessionSchedule,
                      icon: LucideIcons.userCheck,
                    ),

                    // Contact Section - Show only if data available
                    if (church.phone != null || church.website != null) ...[
                      Text(
                        'Contact',
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                      const SizedBox(height: 12),

                      if (church.phone != null)
                        _ContactItem(
                          icon: LucideIcons.phone,
                          label: church.phone!,
                        ),

                      // if (church.email != null)
                      // _ContactItem(
                      //   icon: LucideIcons.mail,
                      //   label: church.email!,
                      // ),
                      if (church.website != null)
                        _ContactItem(
                          icon: LucideIcons.globe,
                          label: church.website!,
                        ),
                    ],

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                LucideIcons.alertTriangle,
                size: 48,
                color: AppTheme.error,
              ),
              const SizedBox(height: 16),
              Text(
                'Failed to load church details',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              TextButton(
                onPressed: () => ref.refresh(churchDetailProvider(churchId)),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// class _MassScheduleItem extends StatelessWidget { ... }

class _ContactItem extends StatelessWidget {
  final IconData icon;
  final String label;

  const _ContactItem({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          Icon(icon, size: 18, color: AppTheme.textMuted),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              label,
              style: Theme.of(
                context,
              ).textTheme.bodyMedium?.copyWith(color: AppTheme.info),
            ),
          ),
        ],
      ),
    );
  }
}

class _ScheduleSection extends StatelessWidget {
  final String title;
  final Map<String, dynamic>? schedule;
  final IconData icon;

  const _ScheduleSection({
    required this.title,
    required this.schedule,
    required this.icon,
  });

  @override
  Widget build(BuildContext context) {
    if (schedule == null || schedule!.isEmpty) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: AppTheme.accentGold),
              const SizedBox(width: 8),
              Text(title, style: Theme.of(context).textTheme.titleLarge),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.darkCard,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: AppTheme.darkBorder),
            ),
            child: Column(
              children: schedule!.entries.map((entry) {
                // key = Day (e.g. "Sunday"), value = List of times or String
                final day = entry.key;
                final times = entry.value;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        width: 100,
                        child: Text(
                          day,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textMuted,
                          ),
                        ),
                      ),
                      Expanded(
                        child: Text(
                          times is List ? times.join(', ') : times.toString(),
                          style: const TextStyle(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
