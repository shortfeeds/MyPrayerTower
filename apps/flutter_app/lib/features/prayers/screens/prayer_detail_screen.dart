import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:flutter/services.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../../core/widgets/sacred_pause_overlay.dart';
import '../../../core/constants/sacred_copy.dart';
import '../repositories/prayers_repository.dart';
import '../models/prayer_model.dart';
import '../../settings/providers/settings_provider.dart';
import '../../tracking/providers/progress_provider.dart';
import '../../../core/services/favorites_service.dart';

class PrayerDetailScreen extends ConsumerStatefulWidget {
  final int prayerId;
  final Prayer? prayerExtra;

  const PrayerDetailScreen({
    super.key,
    required this.prayerId,
    this.prayerExtra,
  });

  @override
  ConsumerState<PrayerDetailScreen> createState() => _PrayerDetailScreenState();
}

class _PrayerDetailScreenState extends ConsumerState<PrayerDetailScreen> {
  late Future<Prayer> _prayerFuture;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _prayerFuture = _loadPrayer();
  }

  Future<Prayer> _loadPrayer() {
    if (widget.prayerExtra != null) {
      return Future.value(widget.prayerExtra);
    }
    return ref.read(prayersRepositoryProvider).getPrayerById(widget.prayerId);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final isFavorite = ref.watch(favoritesProvider).contains(widget.prayerId);

    return PremiumScaffold(
      // padding: EdgeInsets.zero, // Removed invalid param
      body: FutureBuilder<Prayer>(
        future: _prayerFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.gold500),
            );
          }

          if (snapshot.hasError) {
            return Center(
              child: Text(
                'Error: ${snapshot.error}',
                style: const TextStyle(color: Colors.white),
              ),
            );
          }

          if (!snapshot.hasData) {
            return const Center(
              child: Text(
                'Prayer not found',
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          final prayer = snapshot.data!;

          return CustomScrollView(
            controller: _scrollController,
            slivers: [
              _buildAppBar(prayer, isFavorite),
              SliverPadding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 8,
                ),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // Category Badge
                    Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 6,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.gold500.withValues(alpha: 0.15),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(
                            color: AppTheme.gold500.withValues(alpha: 0.3),
                          ),
                        ),
                        child: Text(
                          (prayer.categoryLabel ?? prayer.category)
                              .toUpperCase(),
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            letterSpacing: 1.5,
                            color: AppTheme.gold500,
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 24),

                    // Title
                    Text(
                      prayer.title,
                      style: GoogleFonts.merriweather(
                        fontSize: 28 * settings.textSizeMultiplier,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        height: 1.3,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 32),

                    // Divider
                    Center(
                      child: Container(
                        width: 60,
                        height: 2,
                        color: AppTheme.gold500.withValues(alpha: 0.5),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Content
                    Text(
                      prayer.content,
                      style: GoogleFonts.merriweather(
                        // Changed to Serif for readability
                        fontSize: 18 * settings.textSizeMultiplier,
                        color: Colors.white.withValues(alpha: 0.9),
                        height: 1.8,
                      ),
                    ),

                    const SizedBox(height: 48),

                    // Action Footer
                    Center(child: _buildCompleteButton(prayer)),
                    const SizedBox(height: 100),
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildAppBar(Prayer prayer, bool isFavorite) {
    return SliverAppBar(
      pinned: true,
      expandedHeight: 200,
      backgroundColor: AppTheme.sacredNavy950,
      leading: IconButton(
        icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
        onPressed: () => Navigator.of(context).pop(),
      ),
      actions: [
        IconButton(
          icon: const Icon(LucideIcons.type, color: Colors.white),
          onPressed: () => _showTextSizeSheet(context, ref),
        ),
        IconButton(
          icon: const Icon(LucideIcons.share2, color: Colors.white),
          onPressed: () => Share.share(
            '${prayer.title}\n\n${prayer.content}\n\nShared via MyPrayerTower app',
            subject: prayer.title,
          ),
        ),
        IconButton(
          icon: Icon(
            LucideIcons.heart,
            color: isFavorite ? Colors.redAccent : Colors.white,
            fill: isFavorite
                ? 1.0
                : 0.0, // Lucide doesn't support fill param usually but Flutter Icon does if icon supports
          ),
          onPressed: () {
            ref
                .read(favoritesProvider.notifier)
                .toggleFavorite(widget.prayerId);
            HapticFeedback.selectionClick();
          },
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Abstract Background based on category
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: _getGradientColors(prayer.category),
                ),
              ),
            ),
            // Pattern Overlay
            Opacity(
              opacity: 0.1,
              child: Center(
                child: Icon(
                  _getCategoryIcon(prayer.category),
                  size: 150,
                  color: Colors.white,
                ),
              ),
            ),
            // Gradient Overlay
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, AppTheme.sacredNavy950],
                  stops: [0.0, 1.0],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCompleteButton(Prayer prayer) {
    return ElevatedButton.icon(
      onPressed: () {
        ref.read(progressProvider.notifier).addPrayer();
        HapticFeedback.mediumImpact();
        SacredPauseOverlay.show(
          context,
          message: SacredCopy.system.processing,
          subtitle: SacredCopy.prayerComplete.primary,
          icon: LucideIcons.check,
        );
      },
      icon: const Icon(LucideIcons.check, size: 20),
      label: Text(
        'Mark as Prayed',
        style: GoogleFonts.inter(fontWeight: FontWeight.bold),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppTheme.gold500,
        foregroundColor: Colors.black,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
      ),
    );
  }

  List<Color> _getGradientColors(String category) {
    final cat = category.toLowerCase();
    if (cat.contains('morning')) {
      return [Colors.orange.shade800, AppTheme.sacredNavy950];
    }
    if (cat.contains('evening')) {
      return [Colors.indigo.shade900, AppTheme.sacredNavy950];
    }
    if (cat.contains('marian')) {
      return [Colors.blue.shade700, AppTheme.sacredNavy950];
    }
    if (cat.contains('healing')) {
      return [Colors.purple.shade800, AppTheme.sacredNavy950];
    }
    if (cat.contains('family')) {
      return [Colors.green.shade800, AppTheme.sacredNavy950];
    }
    if (cat.contains('saints')) {
      return [Colors.red.shade800, AppTheme.sacredNavy950];
    }
    return [AppTheme.royalPurple900, AppTheme.sacredNavy950];
  }

  IconData _getCategoryIcon(String category) {
    final cat = category.toLowerCase();
    if (cat.contains('morning')) return LucideIcons.sun;
    if (cat.contains('evening')) return LucideIcons.moon;
    if (cat.contains('marian')) return LucideIcons.star;
    if (cat.contains('healing')) return LucideIcons.heart;
    if (cat.contains('family')) return LucideIcons.users;
    if (cat.contains('saints')) return LucideIcons.user;
    return LucideIcons.bookOpen;
  }

  void _showTextSizeSheet(BuildContext context, WidgetRef ref) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.sacredNavy900,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Consumer(
        builder: (context, ref, _) {
          final settings = ref.watch(settingsProvider);
          return Container(
            padding: const EdgeInsets.all(24),
            height: 250,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 40,
                    height: 4,
                    decoration: BoxDecoration(
                      color: Colors.white24,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                Text(
                  'Text Size',
                  style: GoogleFonts.merriweather(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 30),
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
                const Padding(
                  padding: EdgeInsets.symmetric(horizontal: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Aa',
                        style: TextStyle(color: Colors.white70, fontSize: 14),
                      ),
                      Text(
                        'Aa',
                        style: TextStyle(color: Colors.white70, fontSize: 24),
                      ),
                    ],
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
