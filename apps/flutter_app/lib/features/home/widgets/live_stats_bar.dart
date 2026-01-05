import 'dart:async';
import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Live stats bar showing real-time prayer community activity
class LiveStatsBar extends ConsumerStatefulWidget {
  const LiveStatsBar({super.key});

  @override
  ConsumerState<LiveStatsBar> createState() => _LiveStatsBarState();
}

class _LiveStatsBarState extends ConsumerState<LiveStatsBar>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;
  final Random _random = Random();

  // Stats with daily increasing logic
  late int _prayersToday;
  late int _candlesLit;
  late int _usersOnline;

  Timer? _updateTimer;

  @override
  void initState() {
    super.initState();
    _initializeStats();

    _pulseController = AnimationController(
      duration: const Duration(milliseconds: 1500),
      vsync: this,
    );
    _pulseAnimation = Tween<double>(begin: 0.4, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
    _pulseController.repeat(reverse: true);

    // Simulate live updates every 5 seconds
    _updateTimer = Timer.periodic(const Duration(seconds: 5), (_) {
      if (mounted) {
        setState(() {
          // Online fluctuates within range
          _usersOnline = _usersOnline + _random.nextInt(201) - 100; // +/- 100
          _usersOnline = _usersOnline.clamp(5000, 15000);

          // Prayers slowly increase
          _prayersToday += _random.nextInt(10) + 1; // +1 to +10

          // Candles occasionally increase
          if (_random.nextInt(3) == 0) {
            _candlesLit += _random.nextInt(3) + 1; // +1 to +3
          }
        });
      }
    });
  }

  void _initializeStats() {
    final now = DateTime.now();
    final dayOfYear = now.difference(DateTime(now.year, 1, 1)).inDays;

    // Online: Random between 5000-15000
    _usersOnline = 5000 + _random.nextInt(10001);

    // Prayers: Base 15000 + daily increase (roughly 500-1000 per day)
    // Starting from 15000 and increasing by ~750 per day on average
    _prayersToday = 15000 + (dayOfYear * 750) + _random.nextInt(500);

    // Candles: Base 20000 + daily increase (roughly 100-300 per day)
    // Starting from 20000 and increasing by ~200 per day on average
    _candlesLit = 20000 + (dayOfYear * 200) + _random.nextInt(100);
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _updateTimer?.cancel();
    super.dispose();
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return number.toString();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.sacredNavy900.withValues(alpha: 0.95),
            AppTheme.sacredNavy950,
          ],
        ),
        border: Border(
          bottom: BorderSide(
            color: AppTheme.gold500.withValues(alpha: 0.15),
            width: 1,
          ),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          // Live indicator
          AnimatedBuilder(
            animation: _pulseAnimation,
            builder: (context, child) {
              return Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.green.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: Colors.green.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.green,
                        boxShadow: [
                          BoxShadow(
                            color: Colors.green.withValues(
                              alpha: _pulseAnimation.value * 0.6,
                            ),
                            blurRadius: 6,
                            spreadRadius: 2,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'LIVE',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.green,
                        letterSpacing: 1,
                      ),
                    ),
                  ],
                ),
              );
            },
          ),

          // Stats
          _StatItem(
            icon: LucideIcons.users,
            value: _formatNumber(_usersOnline),
            label: 'Online',
            color: AppTheme.info,
          ),
          _StatItem(
            icon: LucideIcons.heart,
            value: _formatNumber(_prayersToday),
            label: 'Prayers',
            color: Colors.pink,
          ),
          _StatItem(
            icon: LucideIcons.flame,
            value: _formatNumber(_candlesLit),
            label: 'Candles',
            color: AppTheme.gold500,
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final String value;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.value,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              value,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            Text(
              label,
              style: GoogleFonts.inter(fontSize: 9, color: Colors.white60),
            ),
          ],
        ),
      ],
    );
  }
}
