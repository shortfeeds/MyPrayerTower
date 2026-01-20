import 'package:flutter/material.dart';

import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class GreetingHeader extends StatelessWidget {
  const GreetingHeader({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  }

  IconData _getGreetingIcon() {
    final hour = DateTime.now().hour;
    if (hour < 6 || hour >= 21) return LucideIcons.moon;
    return LucideIcons.sun;
  }

  Color _getGreetingColor() {
    final hour = DateTime.now().hour;
    if (hour < 12) return AppTheme.accentAmber;
    if (hour < 17) return AppTheme.accentAmber;
    if (hour < 21) return Colors.purple;
    return AppTheme.info;
  }

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(_getGreetingIcon(), size: 16, color: _getGreetingColor()),
                const SizedBox(width: 6),
                Text(
                  _getGreeting(),
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.info.withValues(alpha: 0.8),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              'Welcome Back!',
              style: Theme.of(
                context,
              ).textTheme.headlineMedium?.copyWith(color: Colors.white),
            ),
          ],
        ),

        // Streak Badge & Profile & Menu
        Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: AppTheme.accentAmber,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                children: [
                  const Icon(LucideIcons.flame, size: 18, color: Colors.white),
                  const SizedBox(width: 6),
                  Text(
                    '7',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 12),
            Container(
              decoration: BoxDecoration(
                color: Colors.white.withValues(
                  alpha: 0.2,
                ), // Adjusted for consistency
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(LucideIcons.menu, color: Colors.white),
                onPressed: () => Scaffold.of(context).openDrawer(),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
