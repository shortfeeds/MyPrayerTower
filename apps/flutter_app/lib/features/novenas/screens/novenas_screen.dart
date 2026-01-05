import 'package:flutter/material.dart';

import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class NovenasScreen extends StatelessWidget {
  const NovenasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Novenas'),
        backgroundColor: AppTheme.darkBg,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _NovenaCard(
            title: 'Divine Mercy Novena',
            daysCompleted: 3,
            totalDays: 9,
            imageColor: Colors.redAccent,
            onTap: () {},
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Novena to St. Jude',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.green,
            onTap: () {},
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: '54 Day Rosary Novena',
            daysCompleted: 12,
            totalDays: 54,
            imageColor: Colors.blueAccent,
            onTap: () {},
          ),
        ],
      ),
    );
  }
}

class _NovenaCard extends StatelessWidget {
  final String title;
  final int daysCompleted;
  final int totalDays;
  final Color imageColor;
  final VoidCallback onTap;

  const _NovenaCard({
    required this.title,
    required this.daysCompleted,
    required this.totalDays,
    required this.imageColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final progress = daysCompleted / totalDays;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: daysCompleted > 0
                ? AppTheme.accentGold.withValues(alpha: 0.3)
                : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: imageColor.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Icon(LucideIcons.flame, color: imageColor, size: 28),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: Colors.black26,
                            valueColor: AlwaysStoppedAnimation(
                              daysCompleted == totalDays
                                  ? AppTheme.success
                                  : AppTheme.accentGold,
                            ),
                            minHeight: 6,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Day $daysCompleted/$totalDays',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.textMuted,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              LucideIcons.chevronRight,
              color: AppTheme.textMuted,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
