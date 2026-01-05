import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';

class QuickActions extends StatelessWidget {
  const QuickActions({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        _QuickActionButton(
          icon: LucideIcons.heart,
          label: 'Rosary',
          onTap: () => context.push('/rosary'),
        ),
        _QuickActionButton(
          emoji: '🛐',
          label: 'Confession',
          onTap: () => context.push('/confession'),
        ),
        _QuickActionButton(
          icon: LucideIcons.mapPin,
          label: 'Mass',
          onTap: () => context.push('/churches'),
        ),
        _QuickActionButton(
          icon: LucideIcons.user,
          label: 'Saints',
          onTap: () => context.push('/saints'),
        ),
      ],
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData? icon;
  final String? emoji;
  final String label;
  final VoidCallback onTap;

  const _QuickActionButton({
    this.icon,
    this.emoji,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final width = (MediaQuery.of(context).size.width - 60) / 4;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: width,
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(16),
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (icon != null)
              Icon(icon, color: Colors.white, size: 24)
            else if (emoji != null)
              Text(emoji!, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 6),
            Text(
              label,
              style: Theme.of(context).textTheme.labelSmall?.copyWith(
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }
}
