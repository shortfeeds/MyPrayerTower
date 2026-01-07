import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../auth/providers/auth_provider.dart';

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
              ],
            ),
          ),

          const SizedBox(height: 24),

          Text(
            'The Five Mysteries',
            style: Theme.of(context).textTheme.headlineSmall,
          ),

          const SizedBox(height: 16),

          // Mystery items
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

          const SizedBox(height: 24),

          // Start button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () async {
                // Determine if user is logged in
                final authState = ref.read(authProvider);
                if (authState.value == null) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Please login to track streaks'),
                    ),
                  );
                  return;
                }

                // Update streak
                await ref.read(authProvider.notifier).updateStreak();

                if (!mounted) return;

                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Prayer recorded! Streak updated 🔥'),
                    backgroundColor: AppTheme.gold500,
                  ),
                );
                // Optionally go back
                setState(() => _selectedMystery = -1);
              },
              icon: const Icon(LucideIcons.check, size: 18),
              label: const Text('Mark as Prayed'),
              style: ElevatedButton.styleFrom(
                backgroundColor: mystery.color,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
            ),
          ),

          const SizedBox(height: 100),
        ],
      ),
    );
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
