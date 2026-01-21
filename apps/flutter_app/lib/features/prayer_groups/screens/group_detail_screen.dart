import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../providers/prayer_group_provider.dart';
import '../models/prayer_group_model.dart';

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
        scrollable: true,
        title: const Text('Invite Member'),
        content: TextField(
          controller: emailController,
          decoration: const InputDecoration(labelText: 'Email Address'),
          keyboardType: TextInputType.emailAddress,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
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
        scrollable: true,
        title: const Text('Add Group Prayer'),
        content: TextField(
          controller: _prayerController,
          decoration: const InputDecoration(
            labelText: 'Prayer Request',
            hintText: 'Share your intention...',
          ),
          maxLines: 3,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () {
              if (_prayerController.text.isNotEmpty) {
                ref
                    .read(prayerGroupControllerProvider.notifier)
                    .addPrayer(widget.groupId, _prayerController.text.trim());
                _prayerController.clear();
                Navigator.pop(context);
              }
            },
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
      appBar: AppBar(
        title: const Text('Group Details'),
        actions: [
          IconButton(
            icon: const Icon(Icons.person_add),
            onPressed: _showInviteDialog,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Prayers'),
            Tab(text: 'Members'),
          ],
        ),
      ),
      body: groupAsync.when(
        data: (group) {
          return TabBarView(
            controller: _tabController,
            children: [
              _PrayersTab(group: group, onAddPrayer: _showAddPrayerDialog),
              _MembersTab(group: group),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, _) => Center(child: Text('Error: $err')),
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
            const Text('No prayers yet'),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: onAddPrayer,
              icon: const Icon(Icons.add),
              label: const Text('Add First Prayer'),
            ),
          ],
        ),
      );
    }

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        onPressed: onAddPrayer,
        child: const Icon(Icons.add),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: prayers.length,
        itemBuilder: (context, index) {
          final prayer = prayers[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      CircleAvatar(
                        radius: 12,
                        backgroundImage: prayer.user?.avatarUrl != null
                            ? NetworkImage(prayer.user!.avatarUrl!)
                            : null,
                        child: prayer.user?.avatarUrl == null
                            ? Text(
                                prayer.user?.firstName?[0] ?? '?',
                                style: const TextStyle(fontSize: 10),
                              )
                            : null,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '${prayer.user?.firstName}',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const Spacer(),
                      Text(
                        DateFormat.MMMd().format(prayer.createdAt),
                        style: TextStyle(color: Colors.grey[600], fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(prayer.content),
                ],
              ),
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
    if (members.isEmpty) return const Center(child: Text('No members yet'));

    return ListView.builder(
      itemCount: members.length,
      itemBuilder: (context, index) {
        final member = members[index];
        return ListTile(
          leading: CircleAvatar(
            backgroundImage: member.user?.avatarUrl != null
                ? NetworkImage(member.user!.avatarUrl!)
                : null,
            child: member.user?.avatarUrl == null
                ? Text(member.user?.firstName?[0] ?? '?')
                : null,
          ),
          title: Text('${member.user?.firstName} ${member.user?.lastName}'),
          subtitle: Text(member.role),
        );
      },
    );
  }
}
