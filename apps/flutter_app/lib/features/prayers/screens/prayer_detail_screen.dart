import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/prayers_repository.dart';
import '../models/prayer_model.dart';
import 'package:flutter/services.dart';
import '../../settings/providers/settings_provider.dart';
import '../../../core/services/favorites_service.dart';

class PrayerDetailScreen extends ConsumerWidget {
  final int prayerId;

  const PrayerDetailScreen({super.key, required this.prayerId});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Watch settings
    final settings = ref.watch(settingsProvider);
    final isFavorite = ref.watch(favoritesProvider).contains(prayerId);

    // Ideally we would have a specific provider for this
    final prayerFuture = ref
        .watch(prayersRepositoryProvider)
        .getPrayerById(prayerId);

    return FutureBuilder<Prayer?>(
      future: prayerFuture,
      builder: (context, snapshot) {
        final prayer = snapshot.data;
        final isLoading = snapshot.connectionState == ConnectionState.waiting;

        return Scaffold(
          backgroundColor: AppTheme.sacredNavy950,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.type, color: Colors.white),
                onPressed: () {
                  _showTextSizeSheet(context, ref);
                },
              ),
              // Share Button
              if (prayer != null)
                IconButton(
                  icon: const Icon(LucideIcons.share2, color: Colors.white),
                  onPressed: () {
                    Share.share(
                      '${prayer.title}\n\n${prayer.content}\n\nShared via MyPrayerTower app',
                      subject: prayer.title,
                    );
                  },
                ),
              IconButton(
                icon: Icon(
                  LucideIcons.heart,
                  color: isFavorite ? Colors.redAccent : Colors.white,
                ),
                onPressed: () {
                  ref.read(favoritesProvider.notifier).toggleFavorite(prayerId);
                  // Haptic feedback
                  HapticFeedback.selectionClick();
                },
              ),
            ],
          ),
          body: Builder(
            builder: (context) {
              if (isLoading) {
                return const Center(child: CircularProgressIndicator());
              }
              if (snapshot.hasError) {
                return Center(
                  child: Text(
                    'Error: ${snapshot.error}',
                    style: const TextStyle(color: Colors.white),
                  ),
                );
              }

              if (prayer == null) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        LucideIcons.fileQuestion,
                        size: 48,
                        color: Colors.white54,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Prayer not found',
                        style: GoogleFonts.inter(color: Colors.white70),
                      ),
                    ],
                  ),
                );
              }

              return SingleChildScrollView(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 16,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.gold500.withValues(alpha: 0.15),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: AppTheme.gold500.withValues(alpha: 0.3),
                        ),
                      ),
                      child: Text(
                        prayer.categoryLabel ?? prayer.category,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.gold500,
                        ),
                      ),
                    ),
                    const SizedBox(height: 20),
                    Text(
                      prayer.title,
                      style: GoogleFonts.merriweather(
                        fontSize: 32 * settings.textSizeMultiplier,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Container(width: 40, height: 2, color: AppTheme.gold500),
                    const SizedBox(height: 32),
                    Text(
                      prayer.content,
                      style: GoogleFonts.inter(
                        fontSize: 18 * settings.textSizeMultiplier,
                        color: Colors.white.withValues(alpha: 0.9),
                        height: 1.8,
                      ),
                    ),
                    const SizedBox(height: 120), // Bottom padding for FAB
                  ],
                ),
              );
            },
          ),
          floatingActionButton: prayer != null
              ? FloatingActionButton.extended(
                  onPressed: () {
                    // Trigger interaction feedback
                    HapticFeedback.mediumImpact();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: const Row(
                          children: [
                            Icon(LucideIcons.sparkles, color: Colors.white),
                            SizedBox(width: 12),
                            Text('Prayer completed. Peace be with you.'),
                          ],
                        ),
                        backgroundColor: AppTheme.sacredNavy900,
                        behavior: SnackBarBehavior.floating,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    );
                  },
                  backgroundColor: AppTheme.gold500,
                  icon: const Icon(LucideIcons.check, color: Colors.black),
                  label: Text(
                    'I Prayed This',
                    style: GoogleFonts.inter(
                      color: Colors.black,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                )
              : null,
        );
      },
    );
  }

  void _showTextSizeSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.sacredNavy900,
      builder: (context) => Consumer(
        builder: (context, ref, _) {
          final settings = ref.watch(settingsProvider);
          return Container(
            padding: const EdgeInsets.all(24),
            height: 200,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Text Size',
                  style: GoogleFonts.playfairDisplay(
                    color: Colors.white,
                    fontSize: 20,
                  ),
                ),
                const SizedBox(height: 20),
                SliderTheme(
                  data: SliderTheme.of(context).copyWith(
                    trackHeight: 4,
                    thumbShape: const RoundSliderThumbShape(
                      enabledThumbRadius: 8,
                    ),
                    overlayShape: const RoundSliderOverlayShape(
                      overlayRadius: 16,
                    ),
                  ),
                  child: Slider(
                    value: settings.textSizeMultiplier,
                    min: 0.8,
                    max: 1.4,
                    divisions: 6,
                    activeColor: AppTheme.gold500,
                    inactiveColor: Colors.white.withValues(alpha: 0.1),
                    onChanged: (val) {
                      ref
                          .read(settingsProvider.notifier)
                          .setTextSizeMultiplier(val);
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
