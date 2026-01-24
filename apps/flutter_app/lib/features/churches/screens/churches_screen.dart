import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'dart:ui';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../repositories/churches_repository.dart';
import '../models/church_model.dart';
import '../../ads/widgets/native_ad_widget.dart';

class ChurchesScreen extends ConsumerStatefulWidget {
  const ChurchesScreen({super.key});

  @override
  ConsumerState<ChurchesScreen> createState() => _ChurchesScreenState();
}

class _ChurchesScreenState extends ConsumerState<ChurchesScreen> {
  final _searchController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  String _searchQuery = '';
  List<Church> _churches = [];
  bool _isLoading = false;
  int _currentPage = 1;
  bool _hasMore = true;

  @override
  void initState() {
    super.initState();
    _loadChurches();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadChurches({bool refresh = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      if (refresh) {
        _currentPage = 1;
        _churches = [];
        _hasMore = true;
      }
    });

    try {
      final newChurches = await ref
          .read(churchesRepositoryProvider)
          .getChurches(
            query: _searchQuery.isEmpty ? null : _searchQuery,
            page: _currentPage,
          );

      if (mounted) {
        setState(() {
          if (refresh) {
            _churches = newChurches;
          } else {
            _churches.addAll(newChurches);
          }
          _hasMore = newChurches.length >= 20;
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
    await _loadChurches();
  }

  void _onSearchChanged(String query) {
    setState(() => _searchQuery = query);
    _loadChurches(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [_buildAppBar(), _buildSearchHeader(), _buildChurchList()],
      ),
    );
  }

  Widget _buildAppBar() {
    return SliverAppBar(
      expandedHeight: 180,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            // Abstract Background
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppTheme.sacredNavy950, AppTheme.royalPurple900],
                ),
              ),
            ),
            // Pattern Overlay
            const Opacity(
              opacity: 0.1,
              child: Center(
                child: Icon(
                  LucideIcons.church,
                  size: 200,
                  color: AppTheme.gold500,
                ),
              ),
            ),
            // Content
            Positioned(
              bottom: 60,
              left: 0,
              right: 0,
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    child: Text(
                      '8,600+ LOCATIONS',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold500,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Find Your Sanctuary',
                    style: GoogleFonts.merriweather(
                      fontSize: 24,
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
    );
  }

  Widget _buildSearchHeader() {
    return SliverToBoxAdapter(
      child: Transform.translate(
        offset: const Offset(0, -24),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: BackdropFilter(
              filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: 0.2),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.2),
                      blurRadius: 15,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  style: const TextStyle(color: Colors.white),
                  decoration: InputDecoration(
                    hintText: 'Search by name, city, or zip...',
                    hintStyle: const TextStyle(color: Colors.white38),
                    icon: const Icon(
                      LucideIcons.search,
                      color: AppTheme.gold500,
                    ),
                    border: InputBorder.none,
                    suffixIcon: _searchQuery.isNotEmpty
                        ? IconButton(
                            icon: const Icon(
                              LucideIcons.x,
                              color: Colors.white38,
                              size: 18,
                            ),
                            onPressed: () {
                              _searchController.clear();
                              _onSearchChanged('');
                            },
                          )
                        : null,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildChurchList() {
    if (_churches.isEmpty && !_isLoading) {
      return SliverFillRemaining(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(LucideIcons.searchX, size: 48, color: Colors.white24),
              const SizedBox(height: 16),
              Text(
                'No churches found',
                style: GoogleFonts.inter(color: Colors.white38),
              ),
            ],
          ),
        ),
      );
    }

    return SliverPadding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 100),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate((context, index) {
          if (index == _churches.length) {
            return _isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(20),
                      child: CircularProgressIndicator(color: AppTheme.gold500),
                    ),
                  )
                : const SizedBox.shrink();
          }

          // Inject Ad every 10 items
          if (index > 0 && index % 10 == 0) {
            return const Padding(
              padding: EdgeInsets.only(bottom: 16),
              child: NativeAdListItem(),
            );
          }

          final church = _churches[index];
          return Padding(
            padding: const EdgeInsets.only(bottom: 16),
            child: _PremiumChurchCard(
              church: church,
              onTap: () =>
                  context.push('/churches/${church.id}', extra: church),
            ),
          );
        }, childCount: _churches.length + 1),
      ),
    );
  }
}

class _PremiumChurchCard extends StatelessWidget {
  final Church church;
  final VoidCallback onTap;

  const _PremiumChurchCard({required this.church, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      onTap: onTap,
      padding: EdgeInsets.zero,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Image / Header
          SizedBox(
            height: 140,
            width: double.infinity,
            child: Stack(
              fit: StackFit.expand,
              children: [
                if (church.primaryImageUrl != null)
                  Image.network(
                    church.primaryImageUrl!,
                    fit: BoxFit.cover,
                    errorBuilder: (_, __, ___) => _buildPlaceholder(),
                  )
                else
                  _buildPlaceholder(),

                // Gradient Overlay
                Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black54],
                    ),
                  ),
                ),

                // Badges
                Positioned(
                  top: 12,
                  right: 12,
                  child: Row(
                    children: [
                      if (church.isVerified)
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: const Color(
                              0xFF059669,
                            ).withValues(alpha: 0.9),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Row(
                            children: [
                              Icon(
                                LucideIcons.shieldCheck,
                                size: 10,
                                color: Colors.white,
                              ),
                              SizedBox(width: 4),
                              Text(
                                'VERIFIED',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                ),

                // Type Badge
                Positioned(
                  bottom: 12,
                  left: 12,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 10,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: Colors.white24),
                    ),
                    child: Text(
                      church.type,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  church.name,
                  style: GoogleFonts.merriweather(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Icon(
                      LucideIcons.mapPin,
                      size: 14,
                      color: Colors.white60,
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Text(
                        '${church.city}, ${church.state}',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: Colors.white70,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                // Mass Time Preview
                if (church.massSchedule != null)
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Row(
                      children: [
                        const Icon(
                          LucideIcons.clock,
                          size: 12,
                          color: AppTheme.gold500,
                        ),
                        const SizedBox(width: 6),
                        Expanded(
                          child: Text(
                            _formatNextMass(church.massSchedule!),
                            style: const TextStyle(
                              color: Colors.white70,
                              fontSize: 11,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      color: AppTheme.sacredNavy800,
      child: Center(
        child: Icon(
          LucideIcons.church,
          size: 40,
          color: Colors.white.withValues(alpha: 0.2),
        ),
      ),
    );
  }

  String _formatNextMass(Map<String, dynamic> schedule) {
    // Simplified logic for demo
    if (schedule.containsKey('Sunday')) return 'Sunday: ${schedule['Sunday']}';
    if (schedule.containsKey('Daily')) return 'Daily: ${schedule['Daily']}';
    return 'Check schedule';
  }
}
