import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class TodaysGraceChallenge extends ConsumerStatefulWidget {
  const TodaysGraceChallenge({super.key});

  @override
  ConsumerState<TodaysGraceChallenge> createState() => _TodaysGraceChallengeState();
}

class _TodaysGraceChallengeState extends ConsumerState<TodaysGraceChallenge> {
  bool _isCompleted = false;
  late final String _todayKey;

  final Map<int, Map<String, dynamic>> _weeklyDevotions = {
    DateTime.monday: {
      'tag': 'MONDAY DEVOTION • HOLY SOULS',
      'title': 'Decade for the Faithful Departed',
      'description': 'Offer one decade of the Rosary for the holy souls in Purgatory awaiting eternal joy.',
      'scripture': '"It is a holy and wholesome thought to pray for the dead." — 2 Maccabees 12:46',
      'actionLabel': 'Pray Decade',
      'route': '/rosary',
      'icon': LucideIcons.flame,
    },
    DateTime.tuesday: {
      'tag': 'TUESDAY DEVOTION • HOLY ANGELS',
      'title': 'Armor of St. Michael',
      'description': 'Recite the St. Michael Prayer for protection over your home, mind, and loved ones.',
      'scripture': '"For He will command His angels concerning you to guard you." — Psalm 91:11',
      'actionLabel': 'Pray St. Michael',
      'route': '/prayers',
      'icon': LucideIcons.shield,
    },
    DateTime.wednesday: {
      'tag': 'WEDNESDAY DEVOTION • ST. JOSEPH',
      'title': 'Trust in St. Joseph',
      'description': 'Entrust your anxieties, employment, and family safety into the loving hands of St. Joseph.',
      'scripture': '"He made him lord over his house and ruler of all his substance." — Psalm 105:21',
      'actionLabel': 'Invoke St. Joseph',
      'route': '/prayers',
      'icon': LucideIcons.hammer,
    },
    DateTime.thursday: {
      'tag': 'THURSDAY DEVOTION • EUCHARIST',
      'title': 'Adoration & Sacred Silence',
      'description': 'Spend 3 mindful minutes resting in the presence of Christ or listening to sacred chant.',
      'scripture': '"Be still, and know that I am God." — Psalm 46:10',
      'actionLabel': 'Enter Silence',
      'route': '/chant',
      'icon': LucideIcons.headphones,
    },
    DateTime.friday: {
      'tag': 'FRIDAY DEVOTION • PASSION & MERCY',
      'title': 'The Hour of Great Mercy',
      'description': 'Pause to pray the Divine Mercy Chaplet, immersing yourself in Christ’s unfathomable mercy.',
      'scripture': '"Jesus, I Trust in You." — St. Faustina Kowalska',
      'actionLabel': 'Divine Mercy',
      'route': '/chaplets',
      'icon': LucideIcons.heartHandshake,
    },
    DateTime.saturday: {
      'tag': 'SATURDAY DEVOTION • BLESSED MOTHER',
      'title': 'Mary, Mother of Grace',
      'description': 'Pray the Memorare or Ave Maria for mothers, peace in families, and spiritual purity.',
      'scripture': '"My soul magnifies the Lord, and my spirit rejoices in God my Savior." — Luke 1:46',
      'actionLabel': 'Honor Mary',
      'route': '/rosary',
      'icon': LucideIcons.sparkles,
    },
    DateTime.sunday: {
      'tag': 'LORD\'S DAY • RESURRECTION',
      'title': 'The Holy Gospel Meditation',
      'description': 'Read today’s Gospel reading and let the Living Word dwell richly in your heart.',
      'scripture': '"He is not here; He has risen, just as He said!" — Matthew 28:6',
      'actionLabel': 'Read Gospel',
      'route': '/readings',
      'icon': LucideIcons.bookOpen,
    },
  };

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _todayKey = 'todays_grace_${now.year}_${now.month}_${now.day}';
    _loadCompletionStatus();
  }

  Future<void> _loadCompletionStatus() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _isCompleted = prefs.getBool(_todayKey) ?? false;
      });
    }
  }

  Future<void> _toggleCompletion() async {
    HapticFeedback.mediumImpact();
    final prefs = await SharedPreferences.getInstance();
    final nextState = !_isCompleted;
    await prefs.setBool(_todayKey, nextState);
    if (mounted) {
      setState(() => _isCompleted = nextState);
      if (nextState) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: AppTheme.sacredNavy900,
            content: Row(
              children: [
                const Icon(LucideIcons.sparkles, color: AppTheme.gold500, size: 20),
                const SizedBox(width: 12),
                Text(
                  'Grace received! May the Lord reward your prayer. 🙏',
                  style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
                ),
              ],
            ),
            duration: const Duration(seconds: 3),
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final weekday = DateTime.now().weekday;
    final devotion = _weeklyDevotions[weekday] ?? _weeklyDevotions[DateTime.sunday]!;

    return PremiumGlassCard(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: _isCompleted
                ? [
                    AppTheme.gold500.withValues(alpha: 0.18),
                    AppTheme.sacredNavy900.withValues(alpha: 0.8),
                  ]
                : [
                    AppTheme.sacredNavy900.withValues(alpha: 0.9),
                    AppTheme.sacredNavy950,
                  ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(
            color: _isCompleted
                ? AppTheme.gold500.withValues(alpha: 0.6)
                : AppTheme.gold500.withValues(alpha: 0.25),
            width: _isCompleted ? 1.5 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Tag & Completion Check
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppTheme.gold500.withValues(alpha: 0.35),
                      width: 0.8,
                    ),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(
                        devotion['icon'] as IconData,
                        size: 13,
                        color: AppTheme.gold400,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        devotion['tag'] as String,
                        style: GoogleFonts.cinzel(
                          color: AppTheme.gold400,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.8,
                        ),
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: _toggleCompletion,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 250),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: _isCompleted
                          ? AppTheme.gold500
                          : Colors.white.withValues(alpha: 0.08),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: _isCompleted ? AppTheme.gold500 : Colors.white24,
                      ),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          _isCompleted ? LucideIcons.check : LucideIcons.circle,
                          color: _isCompleted ? Colors.black : Colors.white60,
                          size: 14,
                        ),
                        const SizedBox(width: 5),
                        Text(
                          _isCompleted ? 'Offered' : 'Mark Done',
                          style: GoogleFonts.inter(
                            color: _isCompleted ? Colors.black : Colors.white70,
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 14),

            // Title
            Text(
              devotion['title'] as String,
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                letterSpacing: 0.2,
              ),
            ),

            const SizedBox(height: 6),

            // Description
            Text(
              devotion['description'] as String,
              style: GoogleFonts.inter(
                fontSize: 13,
                color: Colors.white.withValues(alpha: 0.85),
                height: 1.4,
              ),
            ),

            const SizedBox(height: 10),

            // Scripture Quote
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.06),
                ),
              ),
              child: Text(
                devotion['scripture'] as String,
                style: GoogleFonts.merriweather(
                  fontSize: 11,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.gold300,
                  height: 1.3,
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Action Button
            SizedBox(
              width: double.infinity,
              height: 44,
              child: ElevatedButton.icon(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  context.push(devotion['route'] as String);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: _isCompleted
                      ? AppTheme.gold500.withValues(alpha: 0.2)
                      : AppTheme.gold500,
                  foregroundColor: _isCompleted ? AppTheme.gold400 : Colors.black,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(
                      color: AppTheme.gold500.withValues(alpha: 0.5),
                    ),
                  ),
                ),
                icon: Icon(
                  devotion['icon'] as IconData,
                  size: 16,
                  color: _isCompleted ? AppTheme.gold400 : Colors.black,
                ),
                label: Text(
                  devotion['actionLabel'] as String,
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
