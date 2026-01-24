import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../models/prayer_model.dart';
import '../repositories/prayers_repository.dart';

class PrayerListScreen extends ConsumerStatefulWidget {
  final String categoryId;
  final String categoryName;

  const PrayerListScreen({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  @override
  ConsumerState<PrayerListScreen> createState() => _PrayerListScreenState();
}

class _PrayerListScreenState extends ConsumerState<PrayerListScreen> {
  final ScrollController _scrollController = ScrollController();
  List<Prayer> _prayers = [];
  bool _isLoading = false;
  int _currentPage = 1;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadPrayers();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadPrayers({bool refresh = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      if (refresh) {
        _currentPage = 1;
        _prayers = [];
        _hasMore = true;
      }
    });

    try {
      final newPrayers = await ref
          .read(prayersRepositoryProvider)
          .getPrayers(category: widget.categoryId, page: _currentPage);

      if (mounted) {
        setState(() {
          if (refresh) {
            _prayers = newPrayers;
          } else {
            _prayers.addAll(newPrayers);
          }
          _hasMore = newPrayers.length >= 20;
          _isLoading = false;
        });
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _loadMore() async {
    if (!_hasMore || _isLoading) return;
    _currentPage++;
    await _loadPrayers();
  }

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          SliverAppBar(
            pinned: true,
            backgroundColor: AppTheme.sacredNavy950,
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            expandedHeight: 120,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                widget.categoryName,
                style: GoogleFonts.playfairDisplay(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
              centerTitle: true,
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.sacredNavy950, AppTheme.royalPurple900],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),
          ),

          if (_prayers.isEmpty && !_isLoading)
            SliverFillRemaining(
              child: Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(
                      LucideIcons.bookOpen,
                      size: 48,
                      color: Colors.white24,
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'No prayers found',
                      style: GoogleFonts.inter(color: Colors.white38),
                    ),
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  if (index == _prayers.length) {
                    return _isLoading
                        ? const Center(
                            child: Padding(
                              padding: EdgeInsets.all(20),
                              child: CircularProgressIndicator(
                                color: AppTheme.gold500,
                              ),
                            ),
                          )
                        : const SizedBox.shrink();
                  }

                  final prayer = _prayers[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _PrayerCard(
                      prayer: prayer,
                      onTap: () =>
                          context.push('/prayer/${prayer.id}', extra: prayer),
                    ),
                  );
                }, childCount: _prayers.length + 1),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _PrayerCard extends StatelessWidget {
  final Prayer prayer;
  final VoidCallback onTap;

  const _PrayerCard({required this.prayer, required this.onTap});

  IconData _getIcon() {
    final cat = prayer.category.toLowerCase();
    if (cat.contains('morning')) return LucideIcons.sun;
    if (cat.contains('evening')) return LucideIcons.moon;
    if (cat.contains('marian')) return LucideIcons.star;
    if (cat.contains('healing')) return LucideIcons.heart;
    if (cat.contains('family')) return LucideIcons.users;
    if (cat.contains('saints')) return LucideIcons.user;
    return LucideIcons.bookOpen;
  }

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      onTap: onTap,
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(_getIcon(), color: AppTheme.gold500, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  prayer.title,
                  style: GoogleFonts.merriweather(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  prayer.content,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: Colors.white60,
                    height: 1.5,
                  ),
                ),
              ],
            ),
          ),
          const Icon(LucideIcons.chevronRight, color: Colors.white24, size: 16),
        ],
      ),
    );
  }
}
