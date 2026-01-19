import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../providers/prayer_partner_provider.dart';
import '../models/prayer_partner_model.dart';

class PrayerPartnersListScreen extends ConsumerWidget {
  const PrayerPartnersListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final partnersAsync = ref.watch(prayerPartnersProvider);
    final requestsAsync = ref.watch(pendingPartnerRequestsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Prayer Partners')),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Navigate to invite screen
          context.push('/prayer-partners/invite');
        },
        label: const Text('Add Partner'),
        icon: const Icon(Icons.person_add),
      ),
      body: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(prayerPartnersProvider);
          ref.invalidate(pendingPartnerRequestsProvider);
        },
        child: CustomScrollView(
          slivers: [
            // Pending Requests Section
            requestsAsync.when(
              data: (requests) {
                if (requests.isEmpty) {
                  return const SliverToBoxAdapter(child: SizedBox.shrink());
                }
                return SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    if (index == 0) {
                      return const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text(
                          'Partner Requests',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      );
                    }
                    final req = requests[index - 1];
                    return _RequestTile(request: req);
                  }, childCount: requests.length + 1),
                );
              },
              loading: () =>
                  const SliverToBoxAdapter(child: LinearProgressIndicator()),
              error: (err, _) => SliverToBoxAdapter(child: Text('Error: $err')),
            ),

            // Partners List Section
            partnersAsync.when(
              data: (partners) {
                if (partners.isEmpty) {
                  return const SliverFillRemaining(
                    child: Center(
                      child: Text('No prayer partners yet. Invite someone!'),
                    ),
                  );
                }
                return SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    if (index == 0) {
                      return const Padding(
                        padding: EdgeInsets.all(16.0),
                        child: Text(
                          'Your Partners',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      );
                    }
                    final partner = partners[index - 1];
                    return _PartnerTile(partner: partner);
                  }, childCount: partners.length + 1),
                );
              },
              loading: () => const SliverFillRemaining(
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (err, _) => SliverFillRemaining(
                child: Center(child: Text('Error: $err')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _RequestTile extends ConsumerWidget {
  final PartnerRequest request;
  const _RequestTile({required this.request});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: ListTile(
        leading: CircleAvatar(
          backgroundImage: request.requester.avatarUrl != null
              ? NetworkImage(request.requester.avatarUrl!)
              : null,
          child: request.requester.avatarUrl == null
              ? Text(request.requester.firstName?[0] ?? '?')
              : null,
        ),
        title: Text(
          '${request.requester.firstName} ${request.requester.lastName}',
        ),
        subtitle: Text('Sent ${DateFormat.yMMMd().format(request.createdAt)}'),
        trailing: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            IconButton(
              icon: const Icon(Icons.check, color: Colors.green),
              onPressed: () {
                ref
                    .read(prayerPartnerControllerProvider.notifier)
                    .respondToRequest(request.id, true);
              },
            ),
            IconButton(
              icon: const Icon(Icons.close, color: Colors.red),
              onPressed: () {
                ref
                    .read(prayerPartnerControllerProvider.notifier)
                    .respondToRequest(request.id, false);
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _PartnerTile extends ConsumerWidget {
  final PrayerPartner partner;
  const _PartnerTile({required this.partner});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return ListTile(
      leading: CircleAvatar(
        backgroundImage: partner.partner.avatarUrl != null
            ? NetworkImage(partner.partner.avatarUrl!)
            : null,
        child: partner.partner.avatarUrl == null
            ? Text(partner.partner.firstName?[0] ?? '?')
            : null,
      ),
      title: Text('${partner.partner.firstName} ${partner.partner.lastName}'),
      subtitle: Text(
        'Partner since ${DateFormat.yMMMd().format(partner.since)}',
      ),
      trailing: PopupMenuButton(
        itemBuilder: (context) => [
          const PopupMenuItem(
            value: 'remove',
            child: Text('Remove Partner', style: TextStyle(color: Colors.red)),
          ),
        ],
        onSelected: (value) {
          if (value == 'remove') {
            // Confirm dialog could go here
            ref
                .read(prayerPartnerControllerProvider.notifier)
                .removePartner(partner.id);
          }
        },
      ),
      onTap: () {
        // Navigate to details
      },
    );
  }
}
