import 'dart:ui';
import 'package:flutter/material.dart';

import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

class PremiumFeatureCard extends StatefulWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final Color color;
  final VoidCallback onTap;
  final bool isLarge;

  const PremiumFeatureCard({
    super.key,
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.color,
    required this.onTap,
    this.isLarge = false,
  });

  @override
  State<PremiumFeatureCard> createState() => _PremiumFeatureCardState();
}

class _PremiumFeatureCardState extends State<PremiumFeatureCard>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _glowAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 150),
      vsync: this,
    );
    _scaleAnimation = Tween<double>(
      begin: 1.0,
      end: 0.96,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
    _glowAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOut));
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
      child: AnimatedBuilder(
        animation: _controller,
        builder: (context, child) {
          return Transform.scale(
            scale: _scaleAnimation.value,
            child: Container(
              height: widget.isLarge ? 130 : null,
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(18),
                boxShadow: [
                  BoxShadow(
                    color: widget.color.withValues(
                      alpha: 0.15 + (_glowAnimation.value * 0.15),
                    ),
                    blurRadius: 15 + (_glowAnimation.value * 10),
                    offset: const Offset(0, 4),
                    spreadRadius: _glowAnimation.value * 2,
                  ),
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.2),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(18),
                child: BackdropFilter(
                  filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                  child: Container(
                    padding: EdgeInsets.all(widget.isLarge ? 18 : 16),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppTheme.sacredNavy900.withValues(alpha: 0.8),
                          AppTheme.sacredNavy900.withValues(alpha: 0.6),
                        ],
                      ),
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: widget.color.withValues(
                          alpha: 0.15 + (_glowAnimation.value * 0.1),
                        ),
                        width: 1,
                      ),
                    ),
                    child: LayoutBuilder(
                      builder: (context, constraints) {
                        // If height is constrained (like 92px in the error), forced compact layout
                        // or if it's not large.
                        final bool useCompactLayout =
                            constraints.maxHeight < 125 ||
                            (!widget.isLarge && constraints.maxHeight < 100);

                        // Content for compact layout (Row)
                        if (useCompactLayout) {
                          return Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    begin: Alignment.topLeft,
                                    end: Alignment.bottomRight,
                                    colors: [
                                      widget.color.withValues(alpha: 0.2),
                                      widget.color.withValues(alpha: 0.1),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: widget.color.withValues(alpha: 0.2),
                                    width: 1,
                                  ),
                                ),
                                child: Icon(
                                  widget.icon,
                                  color: widget.color,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Text(
                                      widget.title,
                                      style: GoogleFonts.merriweather(
                                        fontSize: 14,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      widget.subtitle,
                                      style: GoogleFonts.inter(
                                        fontSize: 11,
                                        color: Colors.white.withValues(
                                          alpha: 0.6,
                                        ),
                                        fontWeight: FontWeight.w400,
                                      ),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          );
                        }

                        // Original vertical layout
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                // Icon with gradient background
                                Container(
                                  padding: EdgeInsets.all(
                                    widget.isLarge ? 12 : 10,
                                  ),
                                  decoration: BoxDecoration(
                                    gradient: LinearGradient(
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                      colors: [
                                        widget.color.withValues(alpha: 0.2),
                                        widget.color.withValues(alpha: 0.1),
                                      ],
                                    ),
                                    borderRadius: BorderRadius.circular(14),
                                    border: Border.all(
                                      color: widget.color.withValues(
                                        alpha: 0.2,
                                      ),
                                      width: 1,
                                    ),
                                  ),
                                  child: Icon(
                                    widget.icon,
                                    color: widget.color,
                                    size: widget.isLarge ? 24 : 20,
                                  ),
                                ),
                                if (widget.isLarge)
                                  Container(
                                    padding: const EdgeInsets.all(6),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(
                                        alpha: 0.08,
                                      ),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Icon(
                                      LucideIcons.arrowUpRight,
                                      color: Colors.white.withValues(
                                        alpha: 0.4,
                                      ),
                                      size: 16,
                                    ),
                                  ),
                              ],
                            ),
                            SizedBox(height: widget.isLarge ? 20 : 14),
                            Text(
                              widget.title,
                              style: GoogleFonts.merriweather(
                                fontSize: widget.isLarge ? 17 : 14,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              widget.subtitle,
                              style: GoogleFonts.inter(
                                fontSize: widget.isLarge ? 13 : 12,
                                color: Colors.white.withValues(alpha: 0.6),
                                fontWeight: FontWeight.w400,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ],
                        );
                      },
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
