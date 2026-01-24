import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../providers/prayer_partner_provider.dart';
import '../models/prayer_partner_model.dart';

class PrayerPartnersListScreen extends ConsumerWidget {
  const PrayerPartnersListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final partnersAsync = ref.watch(prayerPartnersProvider);
    final requestsAsync = ref.watch(pendingPartnerRequestsProvider);

    return RefreshIndicator(
      onRefresh: () async {
        ref.invalidate(prayerPartnersProvider);
        ref.invalidate(pendingPartnerRequestsProvider);
      },
      child: CustomScrollView(
        key: const PageStorageKey('prayer_partners'),
        slivers: [
          SliverOverlapInjector(
            handle: NestedScrollView.sliverOverlapAbsorberHandleFor(context),
          ),

          // Pending Requests Section
          requestsAsync.when(
            data: (requests) {
              if (requests.isEmpty) {
                return const SliverToBoxAdapter(child: SizedBox.shrink());
              }
              return SliverPadding(
                padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    if (index == 0) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          children: [
                            const Icon(
                              LucideIcons.inbox,
                              size: 18,
                              color: AppTheme.gold500,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Requests',
                              style: GoogleFonts.merriweather(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const Spacer(),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.redAccent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                '${requests.length}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      );
                    }
                    final req = requests[index - 1];
                    return _RequestTile(request: req);
                  }, childCount: requests.length + 1),
                ),
              );
            },
            loading: () => const SliverToBoxAdapter(
              child: LinearProgressIndicator(color: AppTheme.gold500),
            ),
            error: (err, _) => SliverToBoxAdapter(
              child: Text(
                'Error: $err',
                style: const TextStyle(color: Colors.red),
              ),
            ),
          ),

          // Partners List Section
          partnersAsync.when(
            data: (partners) {
              if (partners.isEmpty) {
                return SliverFillRemaining(
                  hasScrollBody: false,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          LucideIcons.users,
                          size: 64,
                          color: Colors.white.withValues(alpha: 0.2),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No prayer partners yet',
                          style: GoogleFonts.merriweather(
                            fontSize: 18,
                            color: Colors.white70,
                          ),
                        ),
                        const SizedBox(height: 8),
                        FilledButton.icon(
                          onPressed: () =>
                              context.push('/prayer-partners/invite'),
                          icon: const Icon(LucideIcons.userPlus),
                          label: const Text('Invite a Friend'),
                          style: FilledButton.styleFrom(
                            backgroundColor: AppTheme.gold500,
                            foregroundColor: Colors.black,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    if (index == 0) {
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 12),
                        child: Row(
                          children: [
                            const Icon(
                              LucideIcons.heartHandshake,
                              size: 18,
                              color: AppTheme.gold500,
                            ),
                            const SizedBox(width: 8),
                            Text(
                              'Your Circle',
                              style: GoogleFonts.merriweather(
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      );
                    }
                    final partner = partners[index - 1];
                    return _PartnerTile(partner: partner);
                  }, childCount: partners.length + 1),
                ),
              );
            },
            loading: () => const SliverFillRemaining(
              child: Center(
                child: CircularProgressIndicator(color: AppTheme.gold500),
              ),
            ),
            error: (err, _) => SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Text(
                    'Error: $err',
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: Colors.red),
                  ),
                ),
              ),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }
}

class _RequestTile extends ConsumerWidget {
  final PartnerRequest request;
  const _RequestTile({required this.request});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.5)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          CircleAvatar(
            radius: 24,
            backgroundColor: AppTheme.sacredNavy700,
            backgroundImage: request.requester.avatarUrl != null
                ? NetworkImage(request.requester.avatarUrl!)
                : null,
            child: request.requester.avatarUrl == null
                ? Text(
                    request.requester.firstName?[0] ?? '?',
                    style: const TextStyle(color: Colors.white),
                  )
                : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${request.requester.firstName} ${request.requester.lastName}',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
                Text(
                  'Sent ${DateFormat.yMMMd().format(request.createdAt)}',
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white54),
                ),
              ],
            ),
          ),
          Column(
            children: [
              IconButton.filled(
                style: IconButton.styleFrom(backgroundColor: Colors.green),
                icon: const Icon(LucideIcons.check, size: 18),
                onPressed: () {
                  ref
                      .read(prayerPartnerControllerProvider.notifier)
                      .respondToRequest(request.id, true);
                },
              ),
              const SizedBox(height: 8),
              IconButton.filled(
                style: IconButton.styleFrom(backgroundColor: Colors.redAccent),
                icon: const Icon(LucideIcons.x, size: 18),
                onPressed: () {
                  ref
                      .read(prayerPartnerControllerProvider.notifier)
                      .respondToRequest(request.id, false);
                },
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _PartnerTile extends ConsumerWidget {
  final PrayerPartner partner;
  const _PartnerTile({required this.partner});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.sacredNavy700),
      ),
      child: Column(
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 28,
                backgroundColor: AppTheme.sacredNavy700,
                backgroundImage: partner.partner.avatarUrl != null
                    ? NetworkImage(partner.partner.avatarUrl!)
                    : null,
                child: partner.partner.avatarUrl == null
                    ? Text(
                        partner.partner.firstName?[0] ?? '?',
                        style: const TextStyle(
                          fontSize: 20,
                          color: Colors.white,
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${partner.partner.firstName} ${partner.partner.lastName}',
                      style: GoogleFonts.merriweather(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      'Partner since ${DateFormat.yMMMd().format(partner.since)}',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.white54,
                      ),
                    ),
                  ],
                ),
              ),
              PopupMenuButton(
                icon: const Icon(
                  LucideIcons.moreVertical,
                  color: Colors.white54,
                ),
                color: AppTheme.sacredNavy900,
                itemBuilder: (context) => [
                  const PopupMenuItem(
                    value: 'remove',
                    child: Text(
                      'Remove Partner',
                      style: TextStyle(color: Colors.redAccent),
                    ),
                  ),
                ],
                onSelected: (value) {
                  if (value == 'remove') {
                    ref
                        .read(prayerPartnerControllerProvider.notifier)
                        .removePartner(partner.id);
                  }
                },
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white10),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _ActionButton(
                icon: LucideIcons.messageCircle,
                label: 'Message',
                onTap: () {},
              ),
              _ActionButton(
                icon: LucideIcons.sparkles,
                label: 'Pray',
                onTap: () {},
                isPrimary: true,
              ),
              _ActionButton(
                icon: LucideIcons.calendar,
                label: 'History',
                onTap: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isPrimary;

  const _ActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        child: Column(
          children: [
            Icon(
              icon,
              size: 20,
              color: isPrimary ? AppTheme.gold500 : Colors.white70,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: isPrimary ? AppTheme.gold500 : Colors.white70,
                fontWeight: isPrimary ? FontWeight.bold : FontWeight.normal,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
