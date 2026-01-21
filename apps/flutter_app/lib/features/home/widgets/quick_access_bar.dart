import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Quick access bar with horizontal scrolling action buttons
class QuickAccessBar extends StatelessWidget {
  const QuickAccessBar({super.key});

  static final List<_QuickAction> _actions = [
    const _QuickAction(
      icon: LucideIcons.heart,
      label: 'Pray Now',
      route: '/prayers',
      gradient: LinearGradient(colors: [Color(0xFFEC4899), Color(0xFFF43F5E)]),
    ),
    const _QuickAction(
      icon: LucideIcons.flame,
      label: 'Light Candle',
      route: '/candles',
      gradient: LinearGradient(colors: [Color(0xFFF59E0B), Color(0xFFEF4444)]),
    ),
    const _QuickAction(
      icon: LucideIcons.mapPin,
      label: 'Mass Finder',
      route: '/churches',
      gradient: LinearGradient(colors: [Color(0xFF8B5CF6), Color(0xFFA855F7)]),
    ),
    const _QuickAction(
      icon: LucideIcons.scroll,
      label: 'Mass Offer',
      route: '/mass-offering',
      gradient: LinearGradient(colors: [AppTheme.gold400, AppTheme.gold500]),
    ),
    const _QuickAction(
      icon: LucideIcons.heartHandshake,
      label: 'Prayer Wall',
      route: '/prayer-wall',
      gradient: LinearGradient(colors: [Color(0xFFEC4899), Color(0xFFDB2777)]),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 90,
      child: Center(
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: List.generate(_actions.length, (index) {
              final action = _actions[index];
              return Padding(
                padding: EdgeInsets.only(
                  right: index < _actions.length - 1 ? 12 : 0,
                ),
                child: _QuickActionButton(action: action),
              );
            }),
          ),
        ),
      ),
    );
  }
}

class _QuickAction {
  final IconData icon;
  final String label;
  final String route;
  final LinearGradient gradient;

  const _QuickAction({
    required this.icon,
    required this.label,
    required this.route,
    required this.gradient,
  });
}

class _QuickActionButton extends StatefulWidget {
  final _QuickAction action;

  const _QuickActionButton({required this.action});

  @override
  State<_QuickActionButton> createState() => _QuickActionButtonState();
}

class _QuickActionButtonState extends State<_QuickActionButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 100),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.92,
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
        context.push(widget.action.route);
      },
      onTapCancel: () => _controller.reverse(),
      child: AnimatedBuilder(
        animation: _scaleAnimation,
        builder: (context, child) {
          return Transform.scale(scale: _scaleAnimation.value, child: child);
        },
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                gradient: widget.action.gradient,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: widget.action.gradient.colors.first.withValues(
                      alpha: 0.4,
                    ),
                    blurRadius: 12,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Icon(widget.action.icon, color: Colors.white, size: 24),
            ),
            const SizedBox(height: 8),
            Text(
              widget.action.label,
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w500,
                color: Colors.white70,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
