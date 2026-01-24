import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/prayer_group_provider.dart';
import '../models/prayer_group_model.dart';
import 'dart:ui'; // For ImageFilter

class GroupDetailScreen extends ConsumerStatefulWidget {
  final String groupId;
  const GroupDetailScreen({super.key, required this.groupId});

  @override
  ConsumerState<GroupDetailScreen> createState() => _GroupDetailScreenState();
}

class _GroupDetailScreenState extends ConsumerState<GroupDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  final _prayerController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _prayerController.dispose();
    super.dispose();
  }

  void _showInviteDialog() {
    final emailController = TextEditingController();
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy800,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Invite Member',
          style: GoogleFonts.merriweather(color: Colors.white),
        ),
        content: TextField(
          controller: emailController,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            labelText: 'Email Address',
            labelStyle: TextStyle(color: Colors.white70),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.white30),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: AppTheme.gold500),
            ),
          ),
          keyboardType: TextInputType.emailAddress,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          FilledButton(
            onPressed: () {
              if (emailController.text.isNotEmpty) {
                ref
                    .read(prayerGroupControllerProvider.notifier)
                    .inviteToGroup(widget.groupId, emailController.text.trim());
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Invitation sent!')),
                );
              }
            },
            style: FilledButton.styleFrom(
              backgroundColor: AppTheme.gold500,
              foregroundColor: Colors.black,
            ),
            child: const Text('Invite'),
          ),
        ],
      ),
    );
  }

  void _showAddPrayerDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy800,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Text(
          'Add Group Prayer',
          style: GoogleFonts.merriweather(color: Colors.white),
        ),
        content: TextField(
          controller: _prayerController,
          style: const TextStyle(color: Colors.white),
          decoration: const InputDecoration(
            labelText: 'Prayer Request',
            labelStyle: TextStyle(color: Colors.white70),
            hintText: 'Share your intention...',
            hintStyle: TextStyle(color: Colors.white30),
            enabledBorder: OutlineInputBorder(
              borderSide: BorderSide(color: Colors.white30),
            ),
            focusedBorder: OutlineInputBorder(
              borderSide: BorderSide(color: AppTheme.gold500),
            ),
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text(
              'Cancel',
              style: TextStyle(color: Colors.white70),
            ),
          ),
          FilledButton(
            onPressed: () {
              if (_prayerController.text.isNotEmpty) {
                ref
                    .read(prayerGroupControllerProvider.notifier)
                    .addPrayer(widget.groupId, _prayerController.text.trim());
                _prayerController.clear();
                Navigator.pop(context);
              }
            },
            style: FilledButton.styleFrom(
              backgroundColor: AppTheme.gold500,
              foregroundColor: Colors.black,
            ),
            child: const Text('Post'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final groupAsync = ref.watch(groupDetailProvider(widget.groupId));

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: groupAsync.when(
        data: (group) {
          return NestedScrollView(
            headerSliverBuilder: (context, innerBoxIsScrolled) {
              return [
                SliverAppBar(
                  expandedHeight: 200,
                  pinned: true,
                  backgroundColor: AppTheme.sacredNavy900,
                  foregroundColor: Colors.white,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Stack(
                      fit: StackFit.expand,
                      children: [
                        // Gradient Background
                        Container(
                          decoration: const BoxDecoration(
                            gradient: LinearGradient(
                              colors: [Color(0xFF1E1B4B), Color(0xFF4338CA)],
                              begin: Alignment.topCenter,
                              end: Alignment.bottomCenter,
                            ),
                          ),
                        ),
                        // Pattern or Texture (Optional)
                        Center(
                          child: Icon(
                            LucideIcons.users,
                            size: 100,
                            color: Colors.white.withValues(alpha: 0.05),
                          ),
                        ),
                        // Content Overlay
                        Positioned(
                          bottom: 60,
                          left: 16,
                          right: 16,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                group.name,
                                style: GoogleFonts.merriweather(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  shadows: const [
                                    Shadow(
                                      color: Colors.black45,
                                      blurRadius: 8,
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 4),
                              if (group.description != null)
                                Text(
                                  group.description!,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.inter(
                                    color: Colors.white70,
                                    fontSize: 13,
                                  ),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  bottom: TabBar(
                    controller: _tabController,
                    indicatorColor: AppTheme.gold500,
                    labelColor: AppTheme.gold500,
                    unselectedLabelColor: Colors.white60,
                    indicatorWeight: 3,
                    tabs: const [
                      Tab(text: 'Prayer Wall'),
                      Tab(text: 'Members'),
                    ],
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(LucideIcons.userPlus),
                      onPressed: _showInviteDialog,
                    ),
                  ],
                ),
              ];
            },
            body: TabBarView(
              controller: _tabController,
              children: [
                _PrayersTab(group: group, onAddPrayer: _showAddPrayerDialog),
                _MembersTab(group: group),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(
          child: Text(
            'Error: $err',
            style: const TextStyle(color: Colors.white),
          ),
        ),
      ),
    );
  }
}

class _PrayersTab extends StatelessWidget {
  final PrayerGroup group;
  final VoidCallback onAddPrayer;

  const _PrayersTab({required this.group, required this.onAddPrayer});

  @override
  Widget build(BuildContext context) {
    final prayers = group.prayers ?? [];

    if (prayers.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              LucideIcons.messageSquare,
              size: 64,
              color: Colors.white10,
            ),
            const SizedBox(height: 16),
            Text(
              'No prayers yet',
              style: GoogleFonts.merriweather(
                color: Colors.white54,
                fontSize: 18,
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onAddPrayer,
              icon: const Icon(LucideIcons.plus),
              label: const Text('Add First Prayer'),
              style: FilledButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                foregroundColor: Colors.black,
              ),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.transparent,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 80), // Avoid navbar
        child: FloatingActionButton.extended(
          onPressed: onAddPrayer,
          backgroundColor: AppTheme.gold500,
          foregroundColor: Colors.black,
          icon: const Icon(LucideIcons.plus),
          label: const Text('Post Prayer'),
        ),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
        itemCount: prayers.length,
        itemBuilder: (context, index) {
          final prayer = prayers[index];
          return Container(
            margin: const EdgeInsets.only(bottom: 16),
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
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: AppTheme.gold500,
                      backgroundImage: prayer.user?.avatarUrl != null
                          ? NetworkImage(prayer.user!.avatarUrl!)
                          : null,
                      child: prayer.user?.avatarUrl == null
                          ? Text(
                              prayer.user?.firstName?[0] ?? '?',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: Colors.black,
                              ),
                            )
                          : null,
                    ),
                    const SizedBox(width: 12),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '${prayer.user?.firstName} ${prayer.user?.lastName ?? ""}',
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          DateFormat.yMMMd().format(prayer.createdAt),
                          style: GoogleFonts.inter(
                            color: Colors.white38,
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Text(
                  prayer.content,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontSize: 15,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 12),
                const Divider(color: Colors.white10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    const Icon(
                      LucideIcons.heart,
                      size: 16,
                      color: Colors.white38,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Praying',
                      style: GoogleFonts.inter(
                        color: Colors.white38,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _MembersTab extends StatelessWidget {
  final PrayerGroup group;
  const _MembersTab({required this.group});

  @override
  Widget build(BuildContext context) {
    final members = group.members ?? [];
    if (members.isEmpty) {
      return const Center(
        child: Text('No members yet', style: TextStyle(color: Colors.white)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: members.length,
      itemBuilder: (context, index) {
        final member = members[index];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: AppTheme.sacredNavy800,
            borderRadius: BorderRadius.circular(12),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: AppTheme.sacredNavy700,
              backgroundImage: member.user?.avatarUrl != null
                  ? NetworkImage(member.user!.avatarUrl!)
                  : null,
              child: member.user?.avatarUrl == null
                  ? Text(
                      member.user?.firstName?[0] ?? '?',
                      style: const TextStyle(color: Colors.white),
                    )
                  : null,
            ),
            title: Text(
              '${member.user?.firstName} ${member.user?.lastName ?? ""}',
              style: GoogleFonts.inter(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
            subtitle: Text(
              member.role,
              style: GoogleFonts.inter(color: AppTheme.gold500, fontSize: 12),
            ),
            trailing: const Icon(
              LucideIcons.moreVertical,
              color: Colors.white30,
              size: 18,
            ),
          ),
        );
      },
    );
  }
}
