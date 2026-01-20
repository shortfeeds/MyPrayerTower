import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';

class PrayerGroupsScreen extends ConsumerStatefulWidget {
  const PrayerGroupsScreen({super.key});

  @override
  ConsumerState<PrayerGroupsScreen> createState() => _PrayerGroupsScreenState();
}

class _PrayerGroupsScreenState extends ConsumerState<PrayerGroupsScreen> {
  final List<PrayerGroup> _groups = mockGroups;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: const Text('Prayer Groups'),
            backgroundColor: Colors.indigo,
            foregroundColor: Colors.white,
            actions: [
              IconButton(onPressed: () {}, icon: const Icon(Icons.add)),
            ],
          ),

          // Header Stats
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.indigo, Colors.purple],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Join together in prayer',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Create private circles and pray together with loved ones',
                    style: Theme.of(
                      context,
                    ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
                  ),
                  const SizedBox(height: 24),

                  // Stats Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatItem(
                        value: _groups.length.toString(),
                        label: 'Groups',
                      ),
                      _StatItem(
                        value: _groups
                            .fold<int>(0, (sum, g) => sum + g.memberCount)
                            .toString(),
                        label: 'Members',
                      ),
                      _StatItem(
                        value: _groups
                            .fold<int>(0, (sum, g) => sum + g.prayerCount)
                            .toString(),
                        label: 'Prayers',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Pending Invites
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.1),
                  border: Border.all(
                    color: Colors.amber.withValues(alpha: 0.3),
                  ),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.amber.withValues(alpha: 0.2),
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.person_add, color: Colors.amber),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            '2 Pending Invitations',
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.amber,
                            ),
                          ),
                          Text(
                            'Join prayer groups your friends created',
                            style: TextStyle(
                              color: Colors.amber.shade800,
                              fontSize: 12,
                            ),
                          ),
                        ],
                      ),
                    ),
                    TextButton(onPressed: () {}, child: const Text('View')),
                  ],
                ),
              ),
            ),
          ),

          // Groups List
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final group = _groups[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _GroupCard(group: group),
                );
              }, childCount: _groups.length),
            ),
          ),
        ],
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  final PrayerGroup group;

  const _GroupCard({required this.group});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  group.name,
                  style: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              if (group.isPrivate)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.grey.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.lock, size: 12, color: Colors.grey),
                      SizedBox(width: 4),
                      Text(
                        'Private',
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.green.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.public, size: 12, color: Colors.green),
                      SizedBox(width: 4),
                      Text(
                        'Public',
                        style: TextStyle(fontSize: 12, color: Colors.green),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            group.description,
            style: TextStyle(
              color: Theme.of(context).textTheme.bodySmall?.color,
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _GroupStat(icon: Icons.group, label: '${group.memberCount}'),
              const SizedBox(width: 16),
              _GroupStat(icon: Icons.favorite, label: '${group.prayerCount}'),
              const Spacer(),
              Text(
                group.lastActivity,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _GroupStat extends StatelessWidget {
  final IconData icon;
  final String label;

  const _GroupStat({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 16, color: Colors.grey),
        const SizedBox(width: 4),
        Text(
          label,
          style: const TextStyle(
            color: Colors.grey,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;

  const _StatItem({required this.value, required this.label});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }
}

class PrayerGroup {
  final String id;
  final String name;
  final String description;
  final int memberCount;
  final int prayerCount;
  final bool isPrivate;
  final bool isOwner;
  final String lastActivity;

  const PrayerGroup({
    required this.id,
    required this.name,
    required this.description,
    required this.memberCount,
    required this.prayerCount,
    required this.isPrivate,
    required this.isOwner,
    required this.lastActivity,
  });
}

const mockGroups = [
  PrayerGroup(
    id: '1',
    name: 'Family Prayer Circle',
    description: 'Our family prayer group for daily intentions',
    memberCount: 8,
    prayerCount: 234,
    isPrivate: true,
    isOwner: true,
    lastActivity: '2 hours ago',
  ),
  PrayerGroup(
    id: '2',
    name: 'St. Michael Parish Group',
    description: 'Prayer intentions from our parish community',
    memberCount: 156,
    prayerCount: 1234,
    isPrivate: false,
    isOwner: false,
    lastActivity: '15 min ago',
  ),
  PrayerGroup(
    id: '3',
    name: 'Bible Study Prayer Warriors',
    description: 'Supporting each other through prayer and scripture',
    memberCount: 24,
    prayerCount: 567,
    isPrivate: true,
    isOwner: false,
    lastActivity: '1 hour ago',
  ),
  PrayerGroup(
    id: '4',
    name: 'Divine Mercy Devotion',
    description: 'Daily 3pm Divine Mercy prayers for the world',
    memberCount: 342,
    prayerCount: 8976,
    isPrivate: false,
    isOwner: false,
    lastActivity: '5 min ago',
  ),
  PrayerGroup(
    id: '5',
    name: 'Marian Prayer Group',
    description: 'Devoted to Our Lady through the Holy Rosary',
    memberCount: 89,
    prayerCount: 2345,
    isPrivate: false,
    isOwner: false,
    lastActivity: '30 min ago',
  ),
  PrayerGroup(
    id: '6',
    name: 'Young Adults Faith Circle',
    description: 'Catholic young adults praying together',
    memberCount: 67,
    prayerCount: 890,
    isPrivate: false,
    isOwner: false,
    lastActivity: '1 hour ago',
  ),
  PrayerGroup(
    id: '7',
    name: 'Mothers Prayer Network',
    description: 'Mothers united in prayer for our children',
    memberCount: 234,
    prayerCount: 4567,
    isPrivate: false,
    isOwner: false,
    lastActivity: '20 min ago',
  ),
  PrayerGroup(
    id: '8',
    name: 'Sacred Heart Devotees',
    description: 'First Friday devotions to the Sacred Heart',
    memberCount: 178,
    prayerCount: 3456,
    isPrivate: false,
    isOwner: false,
    lastActivity: '45 min ago',
  ),
  PrayerGroup(
    id: '9',
    name: 'Perpetual Adoration Guild',
    description: 'Committed to Eucharistic adoration hours',
    memberCount: 56,
    prayerCount: 1234,
    isPrivate: true,
    isOwner: false,
    lastActivity: '3 hours ago',
  ),
  PrayerGroup(
    id: '10',
    name: 'Pro-Life Prayer Chain',
    description: 'Praying for the protection of all life',
    memberCount: 445,
    prayerCount: 12345,
    isPrivate: false,
    isOwner: false,
    lastActivity: '10 min ago',
  ),
];
