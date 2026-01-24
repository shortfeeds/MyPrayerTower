import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../providers/chant_provider.dart';
import '../models/chant_model.dart';
import 'chant_player_screen.dart'; // Will be created next

class ChantLibraryScreen extends ConsumerWidget {
  const ChantLibraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final chantState = ref.watch(chantProvider);
    final playlist = chantState.playlist;

    // Group by category
    final Map<String, List<Chant>> categories = {};
    for (var chant in playlist) {
      if (!categories.containsKey(chant.category)) {
        categories[chant.category] = [];
      }
      categories[chant.category]!.add(chant);
    }

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            foregroundColor: Colors.white,
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Gregorian Chant',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.white,
                  shadows: const [Shadow(color: Colors.black45, blurRadius: 4)],
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl:
                        'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop',
                    fit: BoxFit.cover,
                    placeholder: (context, url) =>
                        Container(color: AppTheme.sacredNavy900),
                    errorWidget: (context, url, error) =>
                        Container(color: AppTheme.sacredNavy900),
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.black26, AppTheme.deepSpace],
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 60,
                    left: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'DAILY FEATURED',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.black,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Salve Regina',
                          style: GoogleFonts.merriweather(
                            fontSize: 28,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Categories Horizontal Scroll
          SliverToBoxAdapter(
            child: SizedBox(
              height: 140,
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.all(16),
                children: categories.keys.map((category) {
                  return _CategoryCard(category: category);
                }).toList(),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 120),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final chant = playlist[index];
                final isPlaying = chantState.currentChant?.id == chant.id;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _ChantTile(
                    chant: chant,
                    isPlaying: isPlaying,
                    onTap: () {
                      ref.read(chantProvider.notifier).playChant(chant);
                      _openPlayer(context);
                    },
                  ),
                );
              }, childCount: playlist.length),
            ),
          ),
        ],
      ),
      floatingActionButton: chantState.currentChant != null
          ? FloatingActionButton.extended(
              onPressed: () => _openPlayer(context),
              backgroundColor: AppTheme.sacredNavy800,
              foregroundColor: AppTheme.gold500,
              icon: Icon(
                chantState.isPlaying
                    ? LucideIcons.barChart2
                    : LucideIcons.music,
              ),
              label: const Text('Now Playing'),
            )
          : null,
    );
  }

  void _openPlayer(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const ChantPlayerScreen(),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String category;
  const _CategoryCard({required this.category});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 140,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(12),
        image: const DecorationImage(
          image: NetworkImage(
            'https://images.unsplash.com/photo-1507643179173-39db74c23f28?q=80&w=1000&auto=format&fit=crop',
          ), // Abstract elegant bg
          fit: BoxFit.cover,
          opacity: 0.4,
        ),
        border: Border.all(color: Colors.white10),
      ),
      child: Center(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            category,
            textAlign: TextAlign.center,
            style: GoogleFonts.merriweather(
              fontWeight: FontWeight.bold,
              color: Colors.white,
              fontSize: 14,
            ),
          ),
        ),
      ),
    );
  }
}

class _ChantTile extends StatelessWidget {
  final Chant chant;
  final bool isPlaying;
  final VoidCallback onTap;

  const _ChantTile({
    required this.chant,
    required this.isPlaying,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        height: 80,
        decoration: BoxDecoration(
          color: isPlaying
              ? AppTheme.gold500.withValues(alpha: 0.1)
              : AppTheme.sacredNavy800,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isPlaying
                ? AppTheme.gold500.withValues(alpha: 0.5)
                : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: const BorderRadius.horizontal(
                left: Radius.circular(12),
              ),
              child: CachedNetworkImage(
                imageUrl: chant.coverUrl,
                width: 80,
                height: 80,
                fit: BoxFit.cover,
              ),
            ),
            Expanded(
              child: Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      chant.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.merriweather(
                        color: isPlaying ? AppTheme.gold500 : Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 16,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      chant.category,
                      style: GoogleFonts.inter(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.only(right: 16),
              child: isPlaying
                  ? const Icon(LucideIcons.barChart2, color: AppTheme.gold500)
                  : const Icon(LucideIcons.playCircle, color: Colors.white30),
            ),
          ],
        ),
      ),
    );
  }
}
