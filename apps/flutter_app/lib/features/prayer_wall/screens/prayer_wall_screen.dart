import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../models/prayer_request_model.dart';
import '../repositories/prayer_wall_repository.dart';
import '../widgets/prayer_request_card.dart';
import '../../auth/providers/auth_provider.dart';
import '../../ads/widgets/native_ad_widget.dart';
import '../../ads/services/ad_service.dart';
import '../../../core/widgets/sacred_pause_overlay.dart';
import '../../../core/constants/sacred_copy.dart';

class PrayerWallScreen extends ConsumerStatefulWidget {
  const PrayerWallScreen({super.key});

  @override
  ConsumerState<PrayerWallScreen> createState() => _PrayerWallScreenState();
}

class _PrayerWallScreenState extends ConsumerState<PrayerWallScreen> {
  String _selectedCategory = 'All';
  int _page = 1;
  final int _limit = 10;
  bool _isLoadingMore = false;
  List<PrayerRequest> _prayers = [];
  bool _hasMore = true;
  bool _isInitialLoading = true;

  @override
  void initState() {
    super.initState();
    _loadPrayers();
  }

  Future<void> _loadPrayers({bool refresh = false}) async {
    if (refresh) {
      setState(() {
        _page = 1;
        _prayers = [];
        _hasMore = true;
        _isInitialLoading = true;
      });
    }

    try {
      final newPrayers = await ref
          .read(prayerWallRepositoryProvider)
          .getRequests(
            category: _selectedCategory == 'All' ? null : _selectedCategory,
            page: _page,
            limit: _limit,
          );

      if (mounted) {
        setState(() {
          if (refresh) {
            _prayers = newPrayers;
          } else {
            _prayers.addAll(newPrayers);
          }
          _hasMore = newPrayers.length >= _limit;
          _isLoadingMore = false;
          _isInitialLoading = false;
        });
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoadingMore = false;
          _isInitialLoading = false;
        });
      }
    }
  }

  void _loadMore() {
    if (_isLoadingMore || !_hasMore) return;
    setState(() {
      _isLoadingMore = true;
      _page++;
    });
    _loadPrayers();
  }

  void _onCategorySelected(String category) {
    if (_selectedCategory == category) return;
    setState(() {
      _selectedCategory = category;
    });
    _loadPrayers(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy50,
      body: CustomScrollView(
        physics: const BouncingScrollPhysics(),
        slivers: [
          _buildAppBar(),
          _buildHeroSection(),
          _buildCategoryFilter(),
          _buildPrayerList(),
          if (_hasMore && !_isInitialLoading)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Center(
                  child: _isLoadingMore
                      ? const CircularProgressIndicator()
                      : OutlinedButton(
                          onPressed: _loadMore,
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: Colors.grey.shade300),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 32,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(99),
                            ),
                          ),
                          child: Text(
                            'Load More Prayers',
                            style: GoogleFonts.inter(
                              fontWeight: FontWeight.w600,
                              color: AppTheme.sacredNavy900,
                            ),
                          ),
                        ),
                ),
              ),
            ),
          const SliverPadding(padding: EdgeInsets.only(bottom: 150)),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 130),
        child: FloatingActionButton.extended(
          onPressed: () => _showAddRequestDialog(context),
          backgroundColor: AppTheme.gold500,
          foregroundColor: AppTheme.sacredNavy900,
          elevation: 4,
          icon: const Icon(LucideIcons.plus),
          label: Text(
            SacredCopy.prayerWall.submitIntention,
            style: GoogleFonts.inter(fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }

  SliverAppBar _buildAppBar() {
    return SliverAppBar(
      backgroundColor: AppTheme.sacredNavy950,
      title: Text(
        SacredCopy.prayerWall.heroTitle,
        style: GoogleFonts.merriweather(
          fontWeight: FontWeight.bold,
          color: Colors.white,
        ),
      ),
      pinned: true,
      leading: const AppBarMenuButton(
        iconColor: Colors.white,
        showBackground: false,
      ),
    );
  }

  SliverToBoxAdapter _buildHeroSection() {
    return SliverToBoxAdapter(
      child: Container(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
        decoration: const BoxDecoration(
          color: AppTheme.sacredNavy950,
          border: Border(bottom: BorderSide(color: AppTheme.sacredNavy800)),
        ),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(99),
                border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    LucideIcons.heart,
                    size: 14,
                    color: Colors.white70,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'United in Community Prayer',
                    style: GoogleFonts.inter(
                      color: Colors.white,
                      fontWeight: FontWeight.w500,
                      fontSize: 13,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Text(
              SacredCopy.prayerWall.submitIntention,
              textAlign: TextAlign.center,
              style: GoogleFonts.merriweather(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                height: 1.2,
              ),
            ),
            const SizedBox(height: 16),
            Text(
              SacredCopy.prayerWall.heroSubtitle,
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(
                fontSize: 16,
                color: AppTheme.textSecondary,
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }

  SliverToBoxAdapter _buildCategoryFilter() {
    final categories = [
      'All',
      'Health',
      'Family',
      'Work',
      'Relationships',
      'Grief',
      'Thanksgiving',
      'Spiritual',
      'World',
      'Other',
    ];

    return SliverToBoxAdapter(
      child: Container(
        height: 60,
        margin: const EdgeInsets.only(top: 24, bottom: 8),
        child: ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          scrollDirection: Axis.horizontal,
          itemCount: categories.length,
          separatorBuilder: (_, __) => const SizedBox(width: 8),
          itemBuilder: (context, index) {
            final category = categories[index];
            final isSelected = _selectedCategory == category;

            return Center(
              child: InkWell(
                onTap: () => _onCategorySelected(category),
                borderRadius: BorderRadius.circular(99),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    color: isSelected ? AppTheme.sacredNavy900 : Colors.white,
                    borderRadius: BorderRadius.circular(99),
                    border: Border.all(
                      color: isSelected
                          ? AppTheme.sacredNavy900
                          : Colors.grey.shade300,
                    ),
                    boxShadow: isSelected
                        ? []
                        : [
                            BoxShadow(
                              color: Colors.black.withValues(alpha: 0.05),
                              blurRadius: 4,
                              offset: const Offset(0, 2),
                            ),
                          ],
                  ),
                  child: Text(
                    category,
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w600,
                      color: isSelected ? Colors.white : Colors.grey.shade700,
                      fontSize: 13,
                    ),
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  SliverPadding _buildPrayerList() {
    if (_isInitialLoading) {
      return const SliverPadding(
        padding: EdgeInsets.all(24),
        sliver: SliverToBoxAdapter(
          child: Center(child: CircularProgressIndicator()),
        ),
      );
    }

    if (_prayers.isEmpty) {
      return SliverPadding(
        padding: const EdgeInsets.all(24),
        sliver: SliverToBoxAdapter(
          child: Column(
            children: [
              const Icon(LucideIcons.heart, size: 48, color: Colors.grey),
              const SizedBox(height: 16),
              Text(
                'No prayers found in this category.',
                style: GoogleFonts.inter(color: Colors.grey.shade600),
              ),
            ],
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.all(16),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate((context, index) {
          // Calculate actual data index
          final int itemIndex = index - (index ~/ 6);

          // Show Ad every 6th item (indices 5, 11, 17...)
          if ((index + 1) % 6 == 0) {
            return const NativeAdListItem();
          }

          if (itemIndex >= _prayers.length) return null;

          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: PrayerRequestCard(request: _prayers[itemIndex]),
          );
        }, childCount: _prayers.length + (_prayers.length ~/ 5)),
      ),
    );
  }

  void _showAddRequestDialog(BuildContext context) {
    final controller = TextEditingController();
    final nameController = TextEditingController();
    bool isAnonymous = false;
    final categories = [
      'HEALTH',
      'FAMILY',
      'WORK',
      'RELATIONSHIPS',
      'GRIEF',
      'THANKSGIVING',
      'SPIRITUAL',
      'WORLD',
      'OTHER',
    ];
    String selectedCategory = categories.first;

    final user = ref.read(authProvider).value;
    if (user != null) {
      nameController.text = user.name;
    }

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          title: Text(
            'New Prayer Request',
            style: GoogleFonts.merriweather(
              fontWeight: FontWeight.bold,
              color: AppTheme.sacredNavy900,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!isAnonymous) ...[
                  TextField(
                    controller: nameController,
                    style: const TextStyle(color: AppTheme.sacredNavy900),
                    decoration: InputDecoration(
                      labelText: 'Your Name',
                      labelStyle: TextStyle(color: Colors.grey.shade700),
                      filled: true,
                      fillColor: Colors.grey.shade50,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
                TextField(
                  controller: controller,
                  maxLines: 4,
                  style: const TextStyle(color: AppTheme.sacredNavy900),
                  decoration: InputDecoration(
                    labelText: 'How can we pray for you?',
                    labelStyle: TextStyle(color: Colors.grey.shade700),
                    alignLabelWithHint: true,
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: selectedCategory,
                  style: const TextStyle(
                    color: AppTheme.sacredNavy900,
                    fontSize: 16,
                  ),
                  dropdownColor: Colors.white,
                  decoration: InputDecoration(
                    labelText: 'Category',
                    labelStyle: TextStyle(color: Colors.grey.shade700),
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  items: categories
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setDialogState(() => selectedCategory = v!),
                ),
                const SizedBox(height: 12),
                CheckboxListTile(
                  value: isAnonymous,
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppTheme.gold500,
                  title: Text(
                    'Post Anonymously',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppTheme.sacredNavy900,
                    ),
                  ),
                  controlAffinity: ListTileControlAffinity.leading,
                  onChanged: (v) => setDialogState(() => isAnonymous = v!),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'Cancel',
                style: TextStyle(color: Colors.grey.shade600),
              ),
            ),
            ElevatedButton(
              onPressed: () async {
                if (controller.text.trim().isEmpty) return;
                Navigator.pop(context);

                ScaffoldMessenger.of(
                  context,
                ).showSnackBar(const SnackBar(content: Text('Submitting...')));

                final success = await ref
                    .read(prayerWallRepositoryProvider)
                    .submitRequest(
                      intention: controller.text,
                      category: selectedCategory,
                      isAnonymous: isAnonymous,
                      userName: nameController.text,
                      userId: user?.id,
                    );

                if (success == true && context.mounted) {
                  // Trigger Sacred Pause
                  await SacredPauseOverlay.show(
                    context,
                    message: SacredCopy.system.processing,
                    subtitle: SacredCopy.prayerComplete.primary,
                  );

                  if (context.mounted) {
                    _loadPrayers(refresh: true);
                  }

                  // Show Interstitial Ad AFTER pause
                  if (context.mounted) {
                    ref
                        .read(adServiceProvider)
                        .loadInterstitialAd(
                          onAdLoaded: (ad) => ad.show(),
                          onAdFailed: (error) =>
                              debugPrint('Ad failed: $error'),
                        );
                  }
                } else if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Error submitting request.'),
                      backgroundColor: Colors.red,
                    ),
                  );
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.sacredNavy900,
                foregroundColor: Colors.white,
              ),
              child: Text(SacredCopy.prayerWall.submitIntention),
            ),
          ],
        ),
      ),
    );
  }
}
