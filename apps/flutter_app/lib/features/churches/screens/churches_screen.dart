import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../widgets/church_card.dart';
import '../providers/churches_provider.dart';

class ChurchesScreen extends ConsumerStatefulWidget {
  const ChurchesScreen({super.key});

  @override
  ConsumerState<ChurchesScreen> createState() => _ChurchesScreenState();
}

class _ChurchesScreenState extends ConsumerState<ChurchesScreen> {
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final churchesAsync = ref.watch(churchesProvider(_searchQuery));

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // App Bar
          SliverAppBar(
            floating: true,
            snap: true,
            title: Text(
              'Find Churches',
              style: Theme.of(context).textTheme.headlineSmall,
            ),
            backgroundColor: AppTheme.darkBg,
            // GLOBAL MENU: Added leading for root screen
            leading: IconButton(
              icon: const Icon(LucideIcons.menu),
              onPressed: () => Scaffold.of(context).openDrawer(),
            ),
            actions: [
              IconButton(
                icon: const Icon(LucideIcons.map),
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Map view coming soon!')),
                  );
                },
              ),
            ],
          ),

          // Search Bar
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
              child: TextField(
                controller: _searchController,
                onChanged: (value) {
                  setState(() => _searchQuery = value);
                },
                decoration: InputDecoration(
                  hintText: 'Search by name or city...',
                  prefixIcon: const Icon(LucideIcons.search, size: 20),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(LucideIcons.x, size: 18),
                          onPressed: () {
                            _searchController.clear();
                            setState(() => _searchQuery = '');
                          },
                        )
                      : null,
                ),
              ),
            ),
          ),

          // Stats Row
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.church,
                    size: 16,
                    color: AppTheme.accentGold,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '10,000+ churches worldwide',
                    style: Theme.of(
                      context,
                    ).textTheme.bodySmall?.copyWith(color: AppTheme.textMuted),
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // Church List
          churchesAsync.when(
            data: (churches) {
              if (churches.isEmpty) {
                return SliverFillRemaining(
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.searchX,
                          size: 64,
                          color: AppTheme.textMuted,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No churches found',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(color: AppTheme.textMuted),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Try a different search term',
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(color: AppTheme.textMuted),
                        ),
                      ],
                    ),
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final church = churches[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: ChurchCard(
                        id: church.id,
                        name: church.name,
                        city: church.city,
                        country: church.country ?? '',
                        type: church.type,
                        isVerified: church.isVerified,
                        viewCount: 1200,
                        onTap: () => context.push('/churches/${church.id}'),
                      ),
                    );
                  }, childCount: churches.length),
                ),
              );
            },
            loading: () => const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (error, stack) => SliverFillRemaining(
              child: Center(child: Text('Error: $error')),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 24)),
        ],
      ),
    );
  }
}
