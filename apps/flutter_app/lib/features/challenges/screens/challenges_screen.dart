import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../tracking/providers/progress_provider.dart';

/// Challenges & Leaderboard screen for gamification
class ChallengesScreen extends ConsumerStatefulWidget {
  const ChallengesScreen({super.key});

  @override
  ConsumerState<ChallengesScreen> createState() => _ChallengesScreenState();
}

class _ChallengesScreenState extends ConsumerState<ChallengesScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  String _selectedCategory = 'All';

  final List<String> _categories = ['All', 'Personal', 'Global', 'Seasonal'];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  final List<_Challenge> _activeChallenges = [
    _Challenge(
      id: '1',
      title: 'Daily Rosary',
      description: 'Pray the Rosary every day for 7 days',
      icon: LucideIcons.circleDot,
      progress: 0,
      total: 7,
      reward: 100,
      daysLeft: 7,
      category: 'Personal',
    ),
    _Challenge(
      id: '2',
      title: 'Scripture Reader',
      description: 'Read 3 Bible chapters this week',
      icon: LucideIcons.bookOpen,
      progress: 0,
      total: 3,
      reward: 50,
      daysLeft: 7,
      category: 'Personal',
    ),
    _Challenge(
      id: '3',
      title: 'Lenten Spirit',
      description: 'Complete 40 days of consistent prayer',
      icon: LucideIcons.flame,
      progress: 12,
      total: 40,
      reward: 500,
      daysLeft: 28,
      category: 'Seasonal',
    ),
    _Challenge(
      id: '4',
      title: 'Global Intercession',
      description: '50,000 users praying for Peace',
      icon: LucideIcons.globe,
      progress: 34200,
      total: 50000,
      reward: 200,
      daysLeft: 5,
      category: 'Global',
    ),
  ];

  final List<_Badge> _badges = [
    _Badge(icon: LucideIcons.heart, name: 'First Prayer', earned: true),
    _Badge(icon: LucideIcons.circleDot, name: 'Rosary Master', earned: false),
    _Badge(icon: LucideIcons.flame, name: '7 Day Streak', earned: true),
    _Badge(icon: LucideIcons.book, name: 'Bible Reader', earned: false),
    _Badge(icon: LucideIcons.church, name: 'Mass Goer', earned: false),
    _Badge(icon: LucideIcons.award, name: 'Light Bearer', earned: false),
  ];

  @override
  Widget build(BuildContext context) {
    final progressState = ref.watch(progressProvider);

    return PremiumScaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 180.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Spiritual Challenges',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Colors.white,
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Text(
                        'YOUR SPIRITUAL PROGRESS',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: Colors.white60,
                          letterSpacing: 2,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        '${progressState.totalPrayers} Prayers Offered',
                        style: GoogleFonts.merriweather(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.gold500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
          SliverPersistentHeader(
            pinned: true,
            delegate: _SliverAppBarDelegate(
              TabBar(
                controller: _tabController,
                indicatorColor: AppTheme.gold500,
                labelColor: AppTheme.gold500,
                unselectedLabelColor: Colors.white38,
                indicatorWeight: 3,
                tabs: const [
                  Tab(text: 'ACTIVE'),
                  Tab(text: 'BADGES'),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.all(20),
            sliver: SliverFillRemaining(
              child: TabBarView(
                controller: _tabController,
                children: [_buildActiveChallenges(), _buildBadges()],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActiveChallenges() {
    final filteredChallenges = _selectedCategory == 'All'
        ? _activeChallenges
        : _activeChallenges
              .where((c) => c.category == _selectedCategory)
              .toList();

    return Column(
      children: [
        // Category Filter
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Row(
            children: _categories.map((cat) {
              final isSelected = _selectedCategory == cat;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: FilterChip(
                  label: Text(cat),
                  selected: isSelected,
                  onSelected: (val) {
                    setState(() => _selectedCategory = cat);
                  },
                  backgroundColor: AppTheme.sacredNavy900,
                  selectedColor: AppTheme.gold500.withValues(alpha: 0.3),
                  labelStyle: GoogleFonts.inter(
                    fontSize: 12,
                    color: isSelected ? AppTheme.gold500 : Colors.white60,
                    fontWeight: isSelected
                        ? FontWeight.bold
                        : FontWeight.normal,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                    side: BorderSide(
                      color: isSelected ? AppTheme.gold500 : Colors.white12,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),
        const SizedBox(height: 16),
        // Challenge List
        Expanded(
          child: ListView.builder(
            itemCount: filteredChallenges.length,
            itemBuilder: (context, index) {
              final challenge = filteredChallenges[index];
              return _buildChallengeCard(challenge)
                  .animate()
                  .fadeIn(delay: (index * 100).ms)
                  .slideX(begin: 0.1, end: 0);
            },
          ),
        ),
      ],
    );
  }

  Widget _buildChallengeCard(_Challenge challenge) {
    final progress = challenge.progress / challenge.total;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: PremiumGlassCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    challenge.icon,
                    color: AppTheme.gold500,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        challenge.title,
                        style: GoogleFonts.merriweather(
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontSize: 16,
                        ),
                      ),
                      Text(
                        challenge.description,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white60,
                        ),
                      ),
                    ],
                  ),
                ),
                _buildRewardBadge(challenge.reward),
              ],
            ),
            const SizedBox(height: 16),
            Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      '${challenge.progress} / ${challenge.total}',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white70,
                      ),
                    ),
                    Text(
                      '${challenge.daysLeft}d left',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: Colors.white38,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    backgroundColor: Colors.white.withValues(alpha: 0.05),
                    valueColor: AlwaysStoppedAnimation(
                      progress >= 1.0 ? Colors.greenAccent : AppTheme.gold500,
                    ),
                    minHeight: 6,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRewardBadge(int amount) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: AppTheme.gold500.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(LucideIcons.sparkles, size: 12, color: AppTheme.gold500),
          const SizedBox(width: 4),
          Text(
            '+$amount',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: AppTheme.gold500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadges() {
    return GridView.builder(
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.2,
      ),
      itemCount: _badges.length,
      itemBuilder: (context, index) {
        final badge = _badges[index];
        return PremiumGlassCard(
          padding: const EdgeInsets.all(12),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                badge.icon,
                size: 32,
                color: badge.earned ? AppTheme.gold500 : Colors.white10,
              ),
              const SizedBox(height: 12),
              Text(
                badge.name,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: badge.earned ? Colors.white : Colors.white24,
                ),
                textAlign: TextAlign.center,
              ),
              if (!badge.earned)
                const Icon(LucideIcons.lock, size: 14, color: Colors.white10),
            ],
          ),
        );
      },
    );
  }
}

class _SliverAppBarDelegate extends SliverPersistentHeaderDelegate {
  _SliverAppBarDelegate(this._tabBar);

  final TabBar _tabBar;

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
    return Container(color: AppTheme.sacredNavy950, child: _tabBar);
  }

  @override
  bool shouldRebuild(_SliverAppBarDelegate oldDelegate) {
    return false;
  }
}

class _Challenge {
  final String id;
  final String title;
  final String description;
  final IconData icon;
  final int progress;
  final int total;
  final int reward;
  final int daysLeft;
  final String category;

  _Challenge({
    required this.id,
    required this.title,
    required this.description,
    required this.icon,
    required this.progress,
    required this.total,
    required this.reward,
    required this.daysLeft,
    required this.category,
  });
}

class _Badge {
  final IconData icon;
  final String name;
  final bool earned;

  _Badge({required this.icon, required this.name, required this.earned});
}
