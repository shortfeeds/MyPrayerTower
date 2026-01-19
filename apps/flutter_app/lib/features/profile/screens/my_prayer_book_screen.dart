import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/sacred_shimmer.dart';
import '../../../core/services/favorites_service.dart';
import '../../prayers/repositories/prayers_repository.dart';
import '../../prayers/models/prayer_model.dart';
import '../../../core/widgets/premium_glass_card.dart';

class MyPrayerBookScreen extends ConsumerWidget {
  const MyPrayerBookScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // 1. Watch Favorites
    final favoriteIds = ref.watch(favoritesProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'My Prayer Book',
          style: GoogleFonts.playfairDisplay(color: Colors.white),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: const BackButton(color: Colors.white),
      ),
      body: favoriteIds.isEmpty
          ? _buildEmptyState()
          : FutureBuilder<List<Prayer>>(
              future: ref
                  .read(prayersRepositoryProvider)
                  .getPrayersByIds(favoriteIds.toList()),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: SacredShimmer.rectangular(height: 100),
                  );
                }
                if (snapshot.hasError) {
                  return Center(
                    child: Text('Error loading favorites: ${snapshot.error}'),
                  );
                }
                final prayers = snapshot.data ?? [];

                if (prayers.isEmpty) return _buildEmptyState();

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: prayers.length,
                  itemBuilder: (context, index) {
                    final prayer = prayers[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: PremiumGlassCard(
                        onTap: () => context.push('/prayer/${prayer.id}'),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(10),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500.withValues(
                                    alpha: 0.1,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: const Icon(
                                  LucideIcons.bookOpen,
                                  color: AppTheme.gold500,
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      prayer.title,
                                      style: GoogleFonts.playfairDisplay(
                                        color: Colors.white,
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      prayer.categoryLabel ?? prayer.category,
                                      style: GoogleFonts.inter(
                                        color: Colors.white60,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const Icon(
                                LucideIcons.chevronRight,
                                color: Colors.white30,
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  },
                );
              },
            ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            LucideIcons.heartOff,
            size: 64,
            color: Colors.white.withValues(alpha: 0.2),
          ),
          const SizedBox(height: 16),
          Text(
            'Your Prayer Book is empty',
            style: GoogleFonts.playfairDisplay(
              color: Colors.white,
              fontSize: 18,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Mark prayers as favorites to see them here.',
            style: GoogleFonts.inter(color: Colors.white54),
          ),
        ],
      ),
    );
  }
}
