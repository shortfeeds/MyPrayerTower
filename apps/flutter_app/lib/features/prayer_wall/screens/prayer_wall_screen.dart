import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/providers/scaffold_key_provider.dart';
import '../providers/prayer_wall_provider.dart';
import '../widgets/prayer_request_card.dart';

class PrayerWallScreen extends ConsumerStatefulWidget {
  const PrayerWallScreen({super.key});

  @override
  ConsumerState<PrayerWallScreen> createState() => _PrayerWallScreenState();
}

class _PrayerWallScreenState extends ConsumerState<PrayerWallScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

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

  @override
  Widget build(BuildContext context) {
    // Watch provider
    final communityPrayersAsync = ref.watch(prayerWallProvider(null));
    // For 'My Prayers', we would filter by user ID in a real app
    // final myPrayersAsync = ref.watch(prayerWallProvider('mine'));

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              title: const Text('Prayer Wall'),
              backgroundColor: AppTheme.sacredNavy950,
              pinned: true,
              floating: true,
              leading: IconButton(
                icon: const Icon(LucideIcons.menu),
                onPressed: () =>
                    ref.read(scaffoldKeyProvider).currentState?.openDrawer(),
              ),
              bottom: TabBar(
                controller: _tabController,
                indicatorColor: AppTheme.accentGold,
                labelColor: AppTheme.accentGold,
                unselectedLabelColor: Colors.white60,
                tabs: const [
                  Tab(text: 'Community'),
                  Tab(text: 'My Prayers'),
                ],
              ),
            ),
          ];
        },
        body: TabBarView(
          controller: _tabController,
          children: [
            // Community Tab
            communityPrayersAsync.when(
              data: (requests) {
                if (requests.isEmpty) {
                  return const Center(
                    child: Text(
                      'No requests yet',
                      style: TextStyle(color: Colors.white54),
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: requests.length,
                  itemBuilder: (context, index) {
                    final req = requests[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: PrayerRequestCard(
                        request: req,
                        onPray: () {
                          ref
                              .read(prayerWallControllerProvider.notifier)
                              .prayForRequest(req.id);
                        },
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(
                child: Text(
                  'Error: $err',
                  style: const TextStyle(color: Colors.white),
                ),
              ),
            ),

            // My Prayers Tab (Placeholder)
            const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(LucideIcons.heart, size: 64, color: Colors.white24),
                  SizedBox(height: 16),
                  Text(
                    'Your prayer requests will appear here',
                    style: TextStyle(color: Colors.white54),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          // Show dialog
          showDialog(
            context: context,
            builder: (context) => AlertDialog(
              backgroundColor: AppTheme.sacredNavy800,
              title: const Text(
                'Add Prayer Request',
                style: TextStyle(color: Colors.white),
              ),
              content: const TextField(
                decoration: InputDecoration(
                  hintText: 'What can we pray for?',
                  hintStyle: TextStyle(color: Colors.white54),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white24),
                  ),
                ),
                style: TextStyle(color: Colors.white),
                maxLines: 3,
              ),
              actions: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
                ElevatedButton(
                  onPressed: () {
                    // TODO: Connect to controller logic
                    Navigator.pop(context);
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.accentGold,
                  ),
                  child: const Text(
                    'Submit',
                    style: TextStyle(color: Colors.black),
                  ),
                ),
              ],
            ),
          );
        },
        backgroundColor: AppTheme.accentGold,
        icon: const Icon(LucideIcons.plus, color: Colors.black),
        label: const Text(
          'Request Prayer',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
      ),
    );
  }
}
