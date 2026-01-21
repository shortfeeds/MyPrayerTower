import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
            // Small delay to allow dialog to close properly and prevent black screen
            await Future.delayed(const Duration(milliseconds: 150));
            // Exit the app by closing the system navigator
            await SystemNavigator.pop();
          }
        }
      },
      child: Scaffold(
        key: scaffoldKey,
        drawer: const AppDrawer(),
        extendBody: true, // Allow content to flow behind floating nav
        resizeToAvoidBottomInset: false, // Don't push nav up on keyboard
        body: Stack(
          fit: StackFit.expand,
          children: [
            // Main Content
            child,

            // Floating Navigation Bar with safe area for system nav
            Positioned(
              left: 16,
              right: 16,
              bottom: 24 + MediaQuery.of(context).viewPadding.bottom,
              child: const _PremiumFloatingNavBar(),
            ),
          ],
        ),
      ),
    );
  }
}

class _PremiumFloatingNavBar extends ConsumerWidget {
  const _PremiumFloatingNavBar();

  List<_NavItem> _getVisibleItems(Map<String, bool> flags) {
    return [
      const _NavItem(
        path: '/',
        icon: LucideIcons.home,
        activeIcon: LucideIcons.home,
        label: 'Home',
      ),
      const _NavItem(
        path: '/prayers',
        icon: LucideIcons.bookOpen,
        activeIcon: LucideIcons.bookOpenCheck,
        label: 'Pray',
      ),
      const _NavItem(
        path: '/offerings',
        icon: LucideIcons.gift,
        activeIcon: LucideIcons.gift,
        label: 'Offer',
      ),
      if (isFeatureEnabled(flags, 'prayer_wall_enabled'))
        const _NavItem(
          path: '/prayer-wall',
          icon: LucideIcons.heartHandshake,
          activeIcon: LucideIcons.heartHandshake,
          label: 'Prayer Wall',
        ),
      const _NavItem(
        path: '/memorials',
        icon: LucideIcons.scroll,
        activeIcon: LucideIcons.scrollText,
        label: 'Memorials',
      ),
    ];
  }

  int _getSelectedIndex(BuildContext context, List<_NavItem> items) {
    final location = GoRouterState.of(context).uri.path;
    int bestMatchIndex = 0;
    int longestMatchLength = 0;

    for (int i = 0; i < items.length; i++) {
      final itemPath = items[i].path;
      if (itemPath == '/' && location == '/') {
        return i;
      }
      if (itemPath != '/' && location.startsWith(itemPath)) {
        if (itemPath.length > longestMatchLength) {
          longestMatchLength = itemPath.length;
          bestMatchIndex = i;
        }
      }
    }
    return bestMatchIndex;
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final flags = ref.watch(featureFlagsProvider);
    final items = _getVisibleItems(flags);
    final selectedIndex = _getSelectedIndex(context, items);

    return ClipRRect(
      borderRadius: BorderRadius.circular(32),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
        child: Container(
          height: 70,
          decoration: AppTheme.floatingNavDecoration,
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
        child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOutCubic,
              padding: EdgeInsets.symmetric(
                horizontal: widget.isActive ? 20 : 0,
                vertical: 6,
              ),
              decoration: widget.isActive
                  ? BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [
                          Color(0xFFFFD700), // Bright Gold
                          Color(0xFFF59E0B), // Amber 500
                        ],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFFFD700).withValues(alpha: 0.4),
                          blurRadius: 12,
                          spreadRadius: 1,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    )
                  : BoxDecoration(
                      color: Colors.transparent,
                      borderRadius: BorderRadius.circular(20),
                    ),
              child: Icon(
                widget.icon,
                color: widget.isActive
                    ? const Color(0xFF1E1B4B) // Sacred Navy for contrast
                    : Colors.white.withValues(alpha: 0.5),
                size: 24,
              ),
            ),
            const SizedBox(height: 4),
            AnimatedDefaultTextStyle(
              duration: const Duration(milliseconds: 200),
              style: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: widget.isActive ? FontWeight.bold : FontWeight.w500,
                color: widget.isActive
                    ? const Color(0xFFFFD700) // Gold text for active
                    : Colors.white.withValues(alpha: 0.5),
                letterSpacing: 0.3,
              ),
              child: Text(widget.label),
            ),
          ],
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
