import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../widgets/visual_rosary_beads.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../auth/providers/auth_provider.dart';
import '../../ads/services/ad_service.dart';

class RosaryScreen extends ConsumerStatefulWidget {
  const RosaryScreen({super.key});

  @override
  ConsumerState<RosaryScreen> createState() => _RosaryScreenState();
}

class _RosaryScreenState extends ConsumerState<RosaryScreen> {
  int _selectedMystery = -1;

  final List<_Mystery> _mysteries = [
    _Mystery(
      name: 'Joyful Mysteries',
      days: 'Monday & Saturday',
      icon: '🌅',
      color: const Color(0xFF10b981),
      items: [
        'The Annunciation',
        'The Visitation',
        'The Nativity',
        'The Presentation',
        'Finding in the Temple',
      ],
    ),
    _Mystery(
      name: 'Sorrowful Mysteries',
      days: 'Tuesday & Friday',
      icon: '✝️',
      color: const Color(0xFFef4444),
      items: [
        'Agony in the Garden',
        'Scourging at the Pillar',
        'Crowning with Thorns',
        'Carrying of the Cross',
        'The Crucifixion',
      ],
    ),
    _Mystery(
      name: 'Glorious Mysteries',
      days: 'Wednesday & Sunday',
      icon: '👑',
      color: const Color(0xFFd4af37),
      items: [
        'The Resurrection',
        'The Ascension',
        'Descent of the Holy Spirit',
        'Assumption of Mary',
        'Coronation of Mary',
      ],
    ),
    _Mystery(
      name: 'Luminous Mysteries',
      days: 'Thursday',
      icon: '✨',
      color: const Color(0xFF0ea5e9),
      items: [
        'Baptism of Jesus',
        'Wedding at Cana',
        'Proclamation of the Kingdom',
        'The Transfiguration',
        'Institution of the Eucharist',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: const Text('Rosary Guide'),
      ),
      body: _selectedMystery == -1
          ? _buildMysterySelection()
          : _buildMysteryDetail(_mysteries[_selectedMystery]),
    );
  }

  Widget _buildMysterySelection() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Text('📿', style: TextStyle(fontSize: 48)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Holy Rosary',
                        style: Theme.of(context).textTheme.headlineSmall
                            ?.copyWith(color: Colors.white),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Select a mystery to begin praying',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.sacredNavy900.withValues(alpha: 0.9),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          Text(
            'Choose Your Mysteries',
            style: Theme.of(context).textTheme.headlineSmall,
          ),

          const SizedBox(height: 16),

          // Mystery Cards
          ...List.generate(_mysteries.length, (index) {
            final mystery = _mysteries[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: GestureDetector(
                onTap: () => setState(() => _selectedMystery = index),
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.darkCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: mystery.color.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 56,
                        height: 56,
                        decoration: BoxDecoration(
                          color: AppTheme.gold500.withValues(alpha: 0.3),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Center(
                          child: Text(
                            mystery.icon,
                            style: const TextStyle(fontSize: 28),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mystery.name,
                              style: Theme.of(context).textTheme.titleMedium
                                  ?.copyWith(fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              mystery.days,
                              style: Theme.of(context).textTheme.bodySmall
                                  ?.copyWith(color: mystery.color),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        LucideIcons.chevronRight,
                        color: AppTheme.textMuted,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  Widget _buildMysteryDetail(_Mystery mystery) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Back button
          TextButton.icon(
            onPressed: () => setState(() => _selectedMystery = -1),
            icon: const Icon(LucideIcons.arrowLeft, size: 18),
            label: const Text('Back to Mysteries'),
          ),

          const SizedBox(height: 16),

          // Header
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [mystery.color.withValues(alpha: 0.8), mystery.color],
              ),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(mystery.icon, style: const TextStyle(fontSize: 40)),
                const SizedBox(height: 16),
                Text(
                  mystery.name,
                  style: Theme.of(
                    context,
                  ).textTheme.headlineMedium?.copyWith(color: Colors.white),
                ),
                Text(
                  'Interactive Prayer Guide',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Interactive Prayer Mode
          _buildInteractivePrayer(mystery),

          const SizedBox(height: 24),

          Text(
            'The Five Mysteries',
            style: Theme.of(context).textTheme.headlineSmall,
          ),

          const SizedBox(height: 16),

          // Mystery items list (existing)
          ...List.generate(
            mystery.items.length,
            (index) => Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.darkCard,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: mystery.color.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Center(
                      child: Text(
                        '${index + 1}',
                        style: TextStyle(
                          color: mystery.color,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Text(
                      mystery.items[index],
                      style: Theme.of(context).textTheme.titleSmall,
                    ),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 100),
        ],
      ),
    );
  }

  // New Interactive Mode State
  int _currentBeadIndex = 0;
  final int _totalBeads = 53; // Simplified 5 decades

  Widget _buildInteractivePrayer(_Mystery mystery) {
    // Current prayer logic
    String prayerName = 'Apostles Creed';
    if (_currentBeadIndex == 0) {
      prayerName = 'Sign of the Cross';
    } else if (_currentBeadIndex == 1) {
      prayerName = 'Apostles Creed';
    } else if (_currentBeadIndex < 5) {
      prayerName = 'Our Father';
    } else if ((_currentBeadIndex - 5) % 11 == 0) {
      prayerName = 'Glory Be';
    } else if ((_currentBeadIndex - 5) % 11 == 1) {
      prayerName = 'Our Father';
    } else {
      prayerName = 'Hail Mary';
    }

    double progress = _currentBeadIndex / _totalBeads;

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: mystery.color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Step ${_currentBeadIndex + 1}',
                style: GoogleFonts.inter(color: AppTheme.textSecondary),
              ),
              Icon(LucideIcons.activity, size: 16, color: mystery.color),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            prayerName,
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            'Tap to advance bead',
            style: GoogleFonts.inter(fontSize: 12, color: Colors.grey),
          ),
          const SizedBox(height: 24),

          // Progress Bar
          LinearProgressIndicator(
            value: progress,
            backgroundColor: Colors.black26,
            valueColor: AlwaysStoppedAnimation(mystery.color),
            minHeight: 12,
            borderRadius: BorderRadius.circular(6),
          ),

          const SizedBox(height: 16),

          // Visual Rosary Beads
          VisualRosaryBeads(
            currentBead: _currentBeadIndex,
            totalBeads: _totalBeads,
            activeColor: mystery.color,
          ),

          const SizedBox(height: 24),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              IconButton(
                onPressed: _currentBeadIndex > 0
                    ? () => setState(() => _currentBeadIndex--)
                    : null,
                icon: const Icon(LucideIcons.chevronLeft),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black26,
                  foregroundColor: Colors.white,
                ),
              ),
              FloatingActionButton(
                onPressed: () {
                  if (_currentBeadIndex < _totalBeads) {
                    // Check if current step is Glory Be (End of decade)
                    // Logic: 0-4 (Intro), 5-15 (Decade 1), 16-26 (Decade 2)...
                    // Glory Be is at index: 5, 16, 27, 38, 49
                    bool isGloryBe = (_currentBeadIndex - 5) % 11 == 0;

                    if (isGloryBe && _currentBeadIndex >= 5) {
                      ref
                          .read(adServiceProvider)
                          .loadInterstitialAd(
                            onAdLoaded: (ad) => ad.show(),
                            onAdFailed: (_) {},
                          );
                    }

                    setState(() => _currentBeadIndex++);
                  } else {
                    // Complete
                    _finishRosary();
                  }
                },
                backgroundColor: mystery.color,
                child: const Icon(LucideIcons.check),
              ),
              IconButton(
                onPressed: () {
                  // Reset
                  setState(() => _currentBeadIndex = 0);
                },
                icon: const Icon(LucideIcons.refreshCw),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.black26,
                  foregroundColor: Colors.white,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Future<void> _finishRosary() async {
    // Determine if user is logged in
    final authState = ref.read(authProvider);
    if (authState.value == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please login to track streaks')),
      );
      return;
    }

    // Update streak
    await ref.read(authProvider.notifier).updateStreak();

    if (!mounted) return;

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Rosary Completed! Streak updated 🔥'),
        backgroundColor: AppTheme.gold500,
      ),
    );
    setState(() {
      _selectedMystery = -1;
      _currentBeadIndex = 0;
    });
  }
}

class _Mystery {
  final String name;
  final String days;
  final String icon;
  final Color color;
  final List<String> items;

  _Mystery({
    required this.name,
    required this.days,
    required this.icon,
    required this.color,
    required this.items,
  });
}
