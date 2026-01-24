import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/novena_model.dart';
import 'novena_tracker_screen.dart';
import '../../tracking/providers/progress_provider.dart';
import '../../../core/widgets/sacred_pause_overlay.dart';

/// Screen to display the full prayer for a specific day of the novena
class NovenaPrayerScreen extends ConsumerWidget {
  final NovenaDefinition novena;
  final int dayNumber; // 1-indexed

  const NovenaPrayerScreen({
    super.key,
    required this.novena,
    required this.dayNumber,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final dayIndex = dayNumber - 1;
    final dailyPrayer = (dayIndex >= 0 && dayIndex < novena.dailyPrayers.length)
        ? novena.dailyPrayers[dayIndex]
        : 'Prayer for Day $dayNumber';

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Column(
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: const Icon(
                        LucideIcons.arrowLeft,
                        color: Colors.white,
                      ),
                    ),
                    Expanded(
                      child: Column(
                        children: [
                          Text(
                            novena.name,
                            style: GoogleFonts.merriweather(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 4),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.amber.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'Day $dayNumber of 9',
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: Colors.amber.shade300,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 48), // Balance the back button
                  ],
                ),
              ),

              // Scrollable Prayer Content
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 16),

                      // Opening Prayer Section
                      _buildPrayerSection(
                        title: 'Opening Prayer',
                        icon: LucideIcons.sunMedium,
                        content: novena.openingPrayer,
                        color: Colors.amber,
                      ),

                      const SizedBox(height: 32),

                      // Daily Prayer Section
                      _buildPrayerSection(
                        title: 'Day $dayNumber Prayer',
                        icon: LucideIcons.flame,
                        content: dailyPrayer,
                        color: Colors.orange,
                        isHighlighted: true,
                      ),

                      const SizedBox(height: 32),

                      // Closing Prayer Section
                      _buildPrayerSection(
                        title: 'Closing Prayer',
                        icon: LucideIcons.moon,
                        content: novena.closingPrayer,
                        color: Colors.blue,
                      ),

                      const SizedBox(height: 40),

                      // Mark Complete Button
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton.icon(
                          onPressed: () async {
                            // Update Novena Progress
                            ref
                                .read(novenaProgressProvider.notifier)
                                .markDayComplete(novena.id);

                            // Update Global Spiritual Progress
                            ref.read(progressProvider.notifier).addPrayer();

                            // Trigger Sacred Pause
                            await SacredPauseOverlay.show(
                              context,
                              message: 'Preserving your devotion...',
                              subtitle:
                                  'Day $dayNumber of ${novena.name} offered.',
                              icon: LucideIcons.flame,
                            );

                            if (context.mounted) {
                              Navigator.pop(context);
                            }
                          },
                          icon: const Icon(LucideIcons.checkCircle),
                          label: Text(
                            'Mark Day $dayNumber Complete',
                            style: GoogleFonts.inter(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.amber.shade600,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 120), // Bottom padding for footer
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPrayerSection({
    required String title,
    required IconData icon,
    required String content,
    required Color color,
    bool isHighlighted = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isHighlighted
            ? color.withValues(alpha: 0.15)
            : Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: isHighlighted ? color.withValues(alpha: 0.4) : Colors.white12,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: GoogleFonts.merriweather(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            content,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              color: Colors.white.withValues(alpha: 0.9),
              height: 1.8,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}
