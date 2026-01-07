import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../core/theme/app_theme.dart';
import '../core/providers/scaffold_key_provider.dart';
import '../core/services/config_service.dart';
import 'app_drawer.dart';

class MainScaffold extends ConsumerWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scaffoldKey = ref.watch(scaffoldKeyProvider);
    final router = GoRouter.of(context);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;

        // Check if we can go back in the navigation stack
        if (router.canPop()) {
          router.pop();
        } else {
          // At root - show exit confirmation
          final shouldExit = await showDialog<bool>(
            context: context,
            builder: (context) => AlertDialog(
              backgroundColor: AppTheme.sacredNavy900,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(16),
              ),
              title: Text(
                'Exit App?',
                style: GoogleFonts.merriweather(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              content: Text(
                'Are you sure you want to exit MyPrayerTower?',
                style: GoogleFonts.inter(color: AppTheme.textSecondary),
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.of(context).pop(false),
                  child: Text(
                    'Cancel',
                    style: GoogleFonts.inter(color: AppTheme.textSecondary),
                  ),
                ),
                ElevatedButton(
                  onPressed: () => Navigator.of(context).pop(true),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold500,
                  ),
                  child: Text(
                    'Exit',
                    style: GoogleFonts.inter(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          );

          if (shouldExit == true && context.mounted) {
            // Exit the app by popping the system navigator
            Navigator.of(context).pop();
          }
        }
      },
      child: Scaffold(
        key: scaffoldKey,
        body: child,
        drawer: const AppDrawer(),
        extendBody: false,
        resizeToAvoidBottomInset: true,
        bottomNavigationBar: const _PremiumBottomNavBar(),
      ),
    );
  }
}

class _PremiumBottomNavBar extends ConsumerWidget {
  const _PremiumBottomNavBar();

  List<_NavItem> _getVisibleItems(Map<String, bool> flags) {
    return [
      const _NavItem(
        path: '/',
        icon: LucideIcons.home,
        activeIcon: LucideIcons.home,
        label: 'Home',
      ),
      const _NavItem(
        path: '/bible',
        icon: LucideIcons.bookOpen,
        activeIcon: LucideIcons.bookOpen,
        label: 'Bible',
      ),
      if (isFeatureEnabled(flags, 'rosary_enabled'))
        const _NavItem(
          path: '/rosary',
          icon: LucideIcons.layoutGrid,
          activeIcon: LucideIcons.layoutGrid,
          label: 'Rosary',
        ),
      if (isFeatureEnabled(flags, 'prayer_wall_enabled'))
        const _NavItem(
          path: '/prayer-wall',
          icon: LucideIcons.heartHandshake,
          activeIcon: LucideIcons.heartHandshake,
          label: 'Wall',
        ),
      if (isFeatureEnabled(flags, 'candles_enabled'))
        const _NavItem(
          path: '/offerings',
          icon: LucideIcons.sparkles,
          activeIcon: LucideIcons.sparkles,
          label: 'Offerings',
        ),
    ];
  }

  int _getSelectedIndex(BuildContext context, List<_NavItem> items) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < items.length; i++) {
      if (location == items[i].path) {
        return i;
      }
    }
    return 0;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flags = ref.watch(featureFlagsProvider);
    final items = _getVisibleItems(flags);
    final selectedIndex = _getSelectedIndex(context, items);

    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppTheme.sacredNavy900.withValues(alpha: 0.98),
            AppTheme.sacredNavy950,
          ],
        ),
        border: Border(
          top: BorderSide(
            color: AppTheme.gold500.withValues(alpha: 0.3),
            width: 1,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.4),
            blurRadius: 10,
            offset: const Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        child: Container(
          height: 80, // Increased height for better visibility
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(items.length, (index) {
              final item = items[index];
              final isActive = selectedIndex == index;

              return Expanded(
                child: _PremiumNavButton(
                  icon: isActive ? item.activeIcon : item.icon,
                  label: item.label,
                  isActive: isActive,
                  onTap: () => context.go(item.path),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _PremiumNavButton extends StatefulWidget {
  final IconData icon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _PremiumNavButton({
    required this.icon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  State<_PremiumNavButton> createState() => _PremiumNavButtonState();
}

class _PremiumNavButtonState extends State<_PremiumNavButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.9,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeInOut));
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _controller.forward(),
      onTapUp: (_) {
        _controller.reverse();
        widget.onTap();
      },
      onTapCancel: () => _controller.reverse(),
      behavior: HitTestBehavior.opaque,
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(scale: _scaleAnimation.value, child: child);
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: EdgeInsets.symmetric(
            horizontal: widget.isActive ? 12 : 8,
            vertical: 12, // Increased padding
          ),
          decoration: widget.isActive
              ? BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.gold500.withValues(alpha: 0.25),
                      AppTheme.gold400.withValues(alpha: 0.15),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(24), // Larger radius
                  border: Border.all(
                    color: AppTheme.gold500.withValues(alpha: 0.3),
                    width: 1,
                  ),
                )
              : null,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              AnimatedScale(
                scale: widget.isActive ? 1.1 : 1.0,
                duration: const Duration(milliseconds: 200),
                child: Icon(
                  widget.icon,
                  color: widget.isActive
                      ? AppTheme.gold500
                      : Colors.white.withValues(alpha: 0.6),
                  size: 26, // Increased icon size
                ),
              ),
              const SizedBox(height: 4),
              // Always show label for all items
              Text(
                widget.label,
                style: GoogleFonts.inter(
                  fontSize: 11, // Increased font size
                  fontWeight: widget.isActive
                      ? FontWeight.bold
                      : FontWeight.w500,
                  color: widget.isActive
                      ? AppTheme.gold500
                      : Colors.white.withValues(alpha: 0.6),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final String path;
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItem({
    required this.path,
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
