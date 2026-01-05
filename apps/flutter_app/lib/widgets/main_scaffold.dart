import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../core/theme/app_theme.dart';
import '../core/providers/scaffold_key_provider.dart';
import 'app_drawer.dart';

class MainScaffold extends ConsumerWidget {
  final Widget child;

  const MainScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final scaffoldKey = ref.watch(scaffoldKeyProvider);

    return Scaffold(
      key: scaffoldKey,
      body: child,
      drawer: const AppDrawer(),
      extendBody: true,
      bottomNavigationBar: const _PremiumBottomNavBar(),
    );
  }
}

class _PremiumBottomNavBar extends StatelessWidget {
  const _PremiumBottomNavBar();

  static const List<_NavItem> _items = [
    _NavItem(
      path: '/',
      icon: LucideIcons.home,
      activeIcon: LucideIcons.home,
      label: 'Home',
    ),
    _NavItem(
      path: '/prayers',
      icon: LucideIcons.bookOpen,
      activeIcon: LucideIcons.bookOpen,
      label: 'Prayers',
    ),
    _NavItem(
      path: '/saints',
      icon: LucideIcons.star,
      activeIcon: LucideIcons.star,
      label: 'Saints',
    ),
    _NavItem(
      path: '/prayer-wall',
      icon: LucideIcons.heart,
      activeIcon: LucideIcons.heart,
      label: 'Wall',
    ),
    _NavItem(
      path: '/candles',
      icon: LucideIcons.flame,
      activeIcon: LucideIcons.flame,
      label: 'Candles',
    ),
  ];

  int _getSelectedIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    for (int i = 0; i < _items.length; i++) {
      if (location == _items[i].path) {
        return i;
      }
    }
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final selectedIndex = _getSelectedIndex(context);

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 24),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(28),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            height: 72,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppTheme.sacredNavy900.withValues(alpha: 0.95),
                  AppTheme.sacredNavy950.withValues(alpha: 0.98),
                ],
              ),
              borderRadius: BorderRadius.circular(28),
              border: Border.all(
                color: AppTheme.gold500.withValues(alpha: 0.2),
                width: 1,
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.4),
                  blurRadius: 25,
                  offset: const Offset(0, 10),
                ),
                BoxShadow(
                  color: AppTheme.gold500.withValues(alpha: 0.1),
                  blurRadius: 20,
                  spreadRadius: -5,
                ),
              ],
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: List.generate(_items.length, (index) {
                final item = _items[index];
                final isActive = selectedIndex == index;

                return Expanded(
                  flex: isActive ? 2 : 1,
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
            horizontal: widget.isActive ? 8 : 4, // Reduced padding
            vertical: 8,
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
                  borderRadius: BorderRadius.circular(20),
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
                scale: widget.isActive ? 1.15 : 1.0,
                duration: const Duration(milliseconds: 200),
                child: Icon(
                  widget.icon,
                  color: widget.isActive
                      ? AppTheme.gold500
                      : Colors.white.withValues(alpha: 0.5),
                  size: 22,
                ),
              ),
              const SizedBox(height: 4),
              if (widget.isActive) ...[
                // Only show label if active to save space
                Flexible(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Text(
                      widget.label,
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold500,
                      ),
                    ),
                  ),
                ),
              ],
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
