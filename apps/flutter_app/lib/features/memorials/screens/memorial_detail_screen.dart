import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/memorial_model.dart';
import '../repositories/memorial_repository.dart';
import '../widgets/offering_dialog.dart';
import '../widgets/upgrade_memorial_sheet.dart';

class MemorialDetailScreen extends ConsumerStatefulWidget {
  final String memorialId;
  final Memorial? initialMemorial;

  const MemorialDetailScreen({
    super.key,
    required this.memorialId,
    this.initialMemorial,
  });

  @override
  ConsumerState<MemorialDetailScreen> createState() =>
      _MemorialDetailScreenState();
}

class _MemorialDetailScreenState extends ConsumerState<MemorialDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  Memorial? _memorial;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _memorial = widget.initialMemorial;
    _loadMemorial();
  }

  Future<void> _loadMemorial() async {
    final memorial = await ref
        .read(memorialRepositoryProvider)
        .getMemorialById(widget.memorialId);
    if (mounted) {
      setState(() {
        _memorial = memorial;
        _isLoading = false;
      });
    }
  }

  void _showUpgradeSheet() async {
    // ScaffoldMessenger.of(context).showSnackBar(
    //   const SnackBar(content: Text('Upgrade feature coming next')),
    // );
    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => UpgradeMemorialSheet(memorial: _memorial!),
    );
    // Refresh after returning
    _loadMemorial();
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading && _memorial == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final memorial = _memorial!;
    final isPremium = memorial.tier == 'PREMIUM';

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              expandedHeight: 300,
              pinned: true,
              backgroundColor: isPremium
                  ? const Color(0xFF78350F)
                  : const Color(0xFF0F172A),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  fit: StackFit.expand,
                  children: [
                    if (memorial.photoUrl != null)
                      CachedNetworkImage(
                        imageUrl: memorial.photoUrl!,
                        fit: BoxFit.cover,
                        color: Colors.black.withValues(alpha: 0.3),
                        colorBlendMode: BlendMode.darken,
                      )
                    else
                      Container(color: Colors.grey.shade800),

                    // Gradient Overlay
                    Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                            Colors.transparent,
                            isPremium
                                ? const Color(0xFF78350F).withValues(alpha: 0.8)
                                : const Color(
                                    0xFF0F172A,
                                  ).withValues(alpha: 0.8),
                          ],
                        ),
                      ),
                    ),

                    // Content
                    Positioned(
                      bottom: 20,
                      left: 20,
                      right: 20,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (isPremium)
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              margin: const EdgeInsets.only(bottom: 8),
                              decoration: BoxDecoration(
                                gradient: const LinearGradient(
                                  colors: [Colors.amber, Colors.orange],
                                ),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(
                                    LucideIcons.sparkles,
                                    size: 12,
                                    color: Colors.white,
                                  ),
                                  const SizedBox(width: 4),
                                  Text(
                                    'FEATURED',
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          Text(
                            '${memorial.firstName} ${memorial.lastName}',
                            style: GoogleFonts.merriweather(
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                              shadows: [
                                const Shadow(
                                  color: Colors.black45,
                                  blurRadius: 10,
                                ),
                              ],
                            ),
                          ),
                          if (memorial.birthDate != null ||
                              memorial.deathDate != null)
                            Text(
                              '${memorial.birthDate?.year ?? '?'} — ${memorial.deathDate?.year ?? '?'}',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: Colors.white70,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              actions: [
                IconButton(
                  onPressed: () {},
                  icon: const Icon(LucideIcons.share2),
                ),
                IconButton(
                  onPressed: _showUpgradeSheet,
                  icon: const Icon(LucideIcons.crown, color: Colors.amber),
                ),
              ],
            ),

            // Stats Sliver
            SliverToBoxAdapter(
              child: Container(
                color: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _StatItem(
                      icon: LucideIcons.flame,
                      count: memorial.totalCandles,
                      label: 'Candles',
                      color: Colors.amber,
                    ),
                    _StatItem(
                      icon: LucideIcons.cross,
                      count: memorial.totalMasses,
                      label: 'Masses',
                      color: Colors.blue,
                    ),
                    _StatItem(
                      icon: LucideIcons.flower,
                      count: memorial.totalFlowers,
                      label: 'Flowers',
                      color: Colors.pink,
                    ),
                    _StatItem(
                      icon: LucideIcons.heart,
                      count: memorial.totalPrayers,
                      label: 'Prayers',
                      color: Colors.purple,
                    ),
                  ],
                ),
              ),
            ),

            SliverPersistentHeader(
              delegate: _SliverAppBarDelegate(
                TabBar(
                  controller: _tabController,
                  labelColor: const Color(0xFF0F172A),
                  unselectedLabelColor: Colors.grey,
                  indicatorColor: Colors.amber,
                  tabs: const [
                    Tab(text: 'Bio'),
                    Tab(text: 'Tributes'),
                    Tab(text: 'Review'),
                  ],
                ),
              ),
              pinned: true,
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            // Bio Tab
            SingleChildScrollView(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (memorial.shortBio != null)
                    Container(
                      padding: const EdgeInsets.all(16),
                      margin: const EdgeInsets.only(bottom: 20),
                      decoration: BoxDecoration(
                        color: Colors.amber.shade50,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.amber.shade100),
                      ),
                      child: Text(
                        '"${memorial.shortBio}"',
                        style: GoogleFonts.merriweather(
                          fontStyle: FontStyle.italic,
                          color: Colors.brown,
                          fontSize: 16,
                        ),
                      ),
                    ),
                  Text(
                    memorial.biography ?? 'No biography available.',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      height: 1.6,
                      color: Colors.blueGrey.shade800,
                    ),
                  ),
                ],
              ),
            ),

            // Tributes Tab (Offerings)
            memorial.offerings.isEmpty
                ? const Center(child: Text('No tributes yet.'))
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
                    itemCount: memorial.offerings.length,
                    itemBuilder: (context, index) {
                      final off = memorial.offerings[index];
                      return ListTile(
                        leading: Text(
                          off.type == 'CANDLE_SMALL' ? '🕯️' : '🌹',
                          style: const TextStyle(fontSize: 24),
                        ),
                        title: Text(off.guestName ?? 'Anonymous'),
                        subtitle: Text(off.message ?? 'Sent a tribute'),
                        trailing: Text('${off.amount.toInt()}'),
                      );
                    },
                  ),

            // Gustbook Tab (Placeholder for now)
            const Center(child: Text('Guestbook')),
          ],
        ),
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 100),
        child: FloatingActionButton.extended(
          onPressed: () async {
            final result = await showDialog(
              context: context,
              builder: (_) => OfferingDialog(memorialId: widget.memorialId),
            );
            if (result == true) {
              _loadMemorial();
            }
          },
          label: const Text('Send Tribute'),
          icon: const Icon(LucideIcons.gift),
          backgroundColor: Colors.amber.shade700,
        ),
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final IconData icon;
  final int count;
  final String label;
  final Color color;

  const _StatItem({
    required this.icon,
    required this.count,
    required this.label,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: color),
        const SizedBox(height: 4),
        Text(
          '$count',
          style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        Text(label, style: GoogleFonts.inter(fontSize: 10, color: Colors.grey)),
      ],
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar _tabBar;

  _SliverAppBarDelegate(this._tabBar);

  @override
  double get minExtent => _tabBar.preferredSize.height;
  @override
  double get maxExtent => _tabBar.preferredSize.height;

  @override
  Widget build(
    BuildContext context,
    double shrinkOffset,
    bool overlapsContent,
  ) {
    return Container(color: Colors.white, child: _tabBar);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}
