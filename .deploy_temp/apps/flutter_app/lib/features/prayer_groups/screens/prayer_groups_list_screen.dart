import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/prayer_group_provider.dart';
import '../models/prayer_group_model.dart';

class PrayerGroupsListScreen extends ConsumerWidget {
  const PrayerGroupsListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final groupsAsync = ref.watch(userGroupsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('My Prayer Groups')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          context.push('/groups/create');
        },
        label: const Text('Create Group'),
        icon: const Icon(Icons.add),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(userGroupsProvider);
        },
        child: groupsAsync.when(
          data: (groups) {
            if (groups.isEmpty) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.group_off, size: 64, color: Colors.grey),
                    const SizedBox(height: 16),
                    const Text(
                      'No groups yet',
                      style: TextStyle(fontSize: 18, color: Colors.grey),
                    ),
                    const SizedBox(height: 8),
                    FilledButton(
                      onPressed: () {
                        context.push('/groups/create');
                      },
                      child: const Text('Create a Family Group'),
                    ),
                  ],
                ),
              );
            }
            return ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: groups.length,
              itemBuilder: (context, index) {
                final group = groups[index];
                return _GroupCard(group: group);
              },
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (err, stack) => Center(child: Text('Error: $err')),
        ),
      ),
    );
  }
}

class _GroupCard extends StatelessWidget {
  final PrayerGroup group;

  const _GroupCard({required this.group});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          context.push('/groups/${group.id}');
        },
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                    const Chip(
                      label: Text('Private', style: TextStyle(fontSize: 10)),
                      visualDensity: VisualDensity.compact,
                    ),
                ],
              ),
              if (group.description != null) ...[
                const SizedBox(height: 8),
                Text(
                  group.description!,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(color: Colors.grey[600]),
                ),
              ],
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.people, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('${group.counts?.members ?? 0} members'),
                    ],
                  ),
                  Row(
                    children: [
                      const Icon(Icons.church, size: 16, color: Colors.grey),
                      const SizedBox(width: 4),
                      Text('${group.counts?.prayers ?? 0} prayers'),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
