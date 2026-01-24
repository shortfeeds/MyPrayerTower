import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import 'prayer_groups_list_screen.dart'; // Will use components from here or integrate
import '../../prayer_partners/screens/prayer_partners_list_screen.dart'; // For Partners tab

class CommunityDashboardScreen extends ConsumerStatefulWidget {
  final int initialIndex;
  const CommunityDashboardScreen({super.key, this.initialIndex = 0});

  @override
  ConsumerState<CommunityDashboardScreen> createState() =>
      _CommunityDashboardScreenState();
}

class _CommunityDashboardScreenState
    extends ConsumerState<CommunityDashboardScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(
      length: 3,
      vsync: this,
      initialIndex: widget.initialIndex,
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              title: Text(
                'Community',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              backgroundColor: AppTheme.sacredNavy900,
              centerTitle: false,
              floating: true,
              pinned: true,
              bottom: TabBar(
                controller: _tabController,
                indicatorColor: AppTheme.gold500,
                labelColor: AppTheme.gold500,
                unselectedLabelColor: Colors.grey,
                indicatorWeight: 3,
                tabs: const [
                  Tab(text: 'My Groups'),
                  Tab(text: 'Discover'),
                  Tab(text: 'Partners'),
                ],
              ),
              actions: [
                IconButton(
                  icon: const Icon(LucideIcons.plus, color: AppTheme.gold500),
                  onPressed: () {
                    // Navigate to create group if index 0 or 1, invite partner if 2
                    if (_tabController.index == 2) {
                      // partner invite
                    } else {
                      // group create
                      // context.push('/groups/create');
                    }
                  },
                ),
              ],
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: const [
            PrayerGroupsListScreen(), // Reuse existing for now, will enhance
            _DiscoverGroupsTab(), // New implementation from old PrayerGroupsScreen
            PrayerPartnersListScreen(), // Reuse existing
          ],
        ),
      ),
    );
  }
}

class _DiscoverGroupsTab extends StatelessWidget {
  const _DiscoverGroupsTab();

  @override
  Widget build(BuildContext context) {
    // Mock data for discover tab
    // Ideally this comes from a provider
    return CustomScrollView(
      slivers: [
        SliverToBoxAdapter(
          child: Container(
            margin: const EdgeInsets.all(16),
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [
                  Color(0xFF312E81),
                  Color(0xFF581C87),
                ], // Indigo to Purple
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Join together in prayer',
                  style: GoogleFonts.merriweather(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Find a circle that resonates with your spiritual journey.',
                  style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
                ),
              ],
            ),
          ),
        ),

        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          sliver: SliverList(
            delegate: SliverChildListDelegate(const [
              _DiscoverCard(
                title: 'St. Michael Parish Group',
                description: 'Prayer intentions from our parish community',
                members: 156,
                prayers: 1234,
                lastActive: '15 min ago',
                isPrivate: false,
              ),
              _DiscoverCard(
                title: 'Divine Mercy Devotion',
                description: 'Daily 3pm Divine Mercy prayers for the world',
                members: 342,
                prayers: 8976,
                lastActive: '5 min ago',
                isPrivate: false,
              ),
              _DiscoverCard(
                title: 'Bible Study Warriors',
                description:
                    'Supporting each other through prayer and scripture',
                members: 24,
                prayers: 567,
                lastActive: '1 hr ago',
                isPrivate: true,
              ),
              _DiscoverCard(
                title: 'Rosary Crusade',
                description: 'Daily Rosary for peace',
                members: 1205,
                prayers: 45000,
                lastActive: 'Now',
                isPrivate: false,
              ),
              SizedBox(height: 80),
            ]),
          ),
        ),
      ],
    );
  }
}

class _DiscoverCard extends StatelessWidget {
  final String title;
  final String description;
  final int members;
  final int prayers;
  final String lastActive;
  final bool isPrivate;

  const _DiscoverCard({
    required this.title,
    required this.description,
    required this.members,
    required this.prayers,
    required this.lastActive,
    required this.isPrivate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.sacredNavy700),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  title,
                  style: GoogleFonts.merriweather(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
              ),
              if (isPrivate)
                const Icon(LucideIcons.lock, size: 14, color: Colors.grey)
              else
                const Icon(
                  LucideIcons.globe,
                  size: 14,
                  color: Colors.greenAccent,
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            description,
            style: GoogleFonts.inter(color: Colors.white70, fontSize: 13),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Icon(LucideIcons.users, size: 14, color: AppTheme.gold500),
              const SizedBox(width: 4),
              Text(
                '$members',
                style: GoogleFonts.inter(color: Colors.white54, fontSize: 12),
              ),
              const SizedBox(width: 16),
              const Icon(
                LucideIcons.heartHandshake,
                size: 14,
                color: AppTheme.gold500,
              ),
              const SizedBox(width: 4),
              Text(
                '$prayers',
                style: GoogleFonts.inter(color: Colors.white54, fontSize: 12),
              ),
              const Spacer(),
              Text(
                lastActive,
                style: GoogleFonts.inter(color: Colors.white30, fontSize: 10),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
