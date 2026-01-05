import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../core/providers/scaffold_key_provider.dart';

/// A reusable hamburger menu button that opens the global app drawer.
/// Use this in any screen's AppBar to provide consistent navigation.
class AppBarMenuButton extends ConsumerWidget {
  final Color? iconColor;
  final double? iconSize;
  final bool showBackground;

  const AppBarMenuButton({
    super.key,
    this.iconColor,
    this.iconSize,
    this.showBackground = true,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final icon = Icon(
      LucideIcons.menu,
      color: iconColor ?? Colors.white,
      size: iconSize ?? 20,
    );

    if (showBackground) {
      return Padding(
        padding: const EdgeInsets.all(8.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.12),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
          ),
          child: IconButton(
            icon: icon,
            onPressed: () => ref.openDrawer(),
            tooltip: 'Menu',
          ),
        ),
      );
    }

    return IconButton(
      icon: icon,
      onPressed: () => ref.openDrawer(),
      tooltip: 'Menu',
    );
  }
}

/// A simplified version without background styling
class SimpleMenuButton extends ConsumerWidget {
  final Color? iconColor;

  const SimpleMenuButton({super.key, this.iconColor});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return IconButton(
      icon: Icon(LucideIcons.menu, color: iconColor ?? Colors.white),
      onPressed: () => ref.openDrawer(),
      tooltip: 'Menu',
    );
  }
}
