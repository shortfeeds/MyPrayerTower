import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../repositories/prayer_request_repository.dart';
import '../widgets/prayer_request_card.dart';
import '../../auth/providers/auth_provider.dart';

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
    final communityPrayersAsync = ref.watch(approvedPrayerRequestsProvider);
    final user = ref.watch(authProvider).value;
    final userPrayersAsync = ref.watch(userPrayerRequestsProvider(user?.id));

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) {
          return [
            SliverAppBar(
              title: Text(
                'Prayer Wall',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              backgroundColor: AppTheme.sacredNavy950,
              pinned: true,
              floating: true,
              leading: const AppBarMenuButton(
                iconColor: Colors.white,
                showBackground: false,
              ),
              bottom: TabBar(
                controller: _tabController,
                indicatorColor: AppTheme.accentGold,
                labelColor: AppTheme.accentGold,
                unselectedLabelColor: Colors.white60,
                labelStyle: GoogleFonts.inter(fontWeight: FontWeight.bold),
                unselectedLabelStyle: GoogleFonts.inter(),
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
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.heart,
                          size: 48,
                          color: Colors.white24,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No active requests yet',
                          style: GoogleFonts.inter(color: Colors.white54),
                        ),
                        Text(
                          'Be the first to ask for prayer',
                          style: GoogleFonts.inter(color: Colors.white24),
                        ),
                      ],
                    ),
                  );
                }
                // Group requests by category
                final grouped = <String, List<PrayerRequestData>>{};
                for (final req in requests) {
                  final category = req.category ?? 'Other';
                  if (!grouped.containsKey(category)) {
                    grouped[category] = [];
                  }
                  grouped[category]!.add(req);
                }

                // Sort categories
                final sortedCategories = grouped.keys.toList()..sort();

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: sortedCategories.length,
                  itemBuilder: (context, index) {
                    final category = sortedCategories[index];
                    final categoryRequests = grouped[category]!;

                    return Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.symmetric(
                            vertical: 8,
                            horizontal: 4,
                          ),
                          child: Row(
                            children: [
                              Container(
                                width: 4,
                                height: 16,
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500,
                                  borderRadius: BorderRadius.circular(2),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '$category (${categoryRequests.length})',
                                style: GoogleFonts.merriweather(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.gold500,
                                ),
                              ),
                            ],
                          ),
                        ),
                        ...categoryRequests.map(
                          (req) => Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: PrayerRequestCard(
                              request: req,
                              onPray: () {
                                ref
                                    .read(prayerRequestRepositoryProvider)
                                    .prayForRequest(req.id);
                              },
                            ),
                          ),
                        ),
                        const SizedBox(height: 12),
                      ],
                    );
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (err, stack) => Center(
                child: Text(
                  'Error loading prayers',
                  style: GoogleFonts.inter(color: Colors.white),
                ),
              ),
            ),

            // My Prayers Tab
            user == null
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.lock,
                          size: 48,
                          color: Colors.white24,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Sign in to view your prayers',
                          style: GoogleFonts.inter(color: Colors.white54),
                        ),
                      ],
                    ),
                  )
                : userPrayersAsync.when(
                    data: (requests) {
                      if (requests.isEmpty) {
                        return Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(
                                LucideIcons.penTool,
                                size: 48,
                                color: Colors.white24,
                              ),
                              const SizedBox(height: 16),
                              Text(
                                'You haven\'t submitted any requests yet',
                                style: GoogleFonts.inter(color: Colors.white54),
                              ),
                            ],
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
                            child: Opacity(
                              opacity: req.isPending ? 0.7 : 1.0,
                              child: Stack(
                                children: [
                                  PrayerRequestCard(
                                    request: req,
                                    onPray: () {}, // Can't act on own
                                  ),
                                  if (req.isPending)
                                    Positioned(
                                      top: 12,
                                      right: 12,
                                      child: Container(
                                        padding: const EdgeInsets.symmetric(
                                          horizontal: 8,
                                          vertical: 4,
                                        ),
                                        decoration: BoxDecoration(
                                          color: Colors.orange.withValues(
                                            alpha: 0.2,
                                          ),
                                          borderRadius: BorderRadius.circular(
                                            4,
                                          ),
                                          border: Border.all(
                                            color: Colors.orange,
                                          ),
                                        ),
                                        child: Row(
                                          children: [
                                            const Icon(
                                              LucideIcons.clock,
                                              size: 12,
                                              color: Colors.orange,
                                            ),
                                            const SizedBox(width: 4),
                                            Text(
                                              'Pending Moderation',
                                              style: GoogleFonts.inter(
                                                color: Colors.orange,
                                                fontSize: 10,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          );
                        },
                      );
                    },
                    loading: () =>
                        const Center(child: CircularProgressIndicator()),
                    error: (e, _) => Center(child: Text('Error: $e')),
                  ),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddRequestDialog(context),
        backgroundColor: AppTheme.accentGold,
        icon: const Icon(LucideIcons.plus, color: Colors.black),
        label: Text(
          'Request Prayer',
          style: GoogleFonts.inter(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  void _showAddRequestDialog(BuildContext context) {
    final controller = TextEditingController(); // Intention
    final nameController = TextEditingController(); // Name
    bool isAnonymous = false;
    // Categories matching DB
    final categories = [
      'Health',
      'Guidance',
      'Family',
      'Thanksgiving',
      'Souls',
      'Other',
    ];
    String selectedCategory = categories.first;

    // Pre-fill name if logged in
    final user = ref.read(authProvider).value;
    if (user != null) {
      nameController.text = user.name ?? '';
    }

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.sacredNavy800,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          title: Text(
            'Add Prayer Request',
            style: GoogleFonts.merriweather(
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (!isAnonymous) ...[
                  TextField(
                    controller: nameController,
                    decoration: InputDecoration(
                      hintText: 'Your Name',
                      hintStyle: GoogleFonts.inter(color: Colors.white38),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide(
                          color: AppTheme.textSecondary.withValues(alpha: 0.5),
                        ),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(
                          color: AppTheme.accentGold,
                        ),
                      ),
                      filled: true,
                      fillColor: Colors.black12,
                    ),
                    style: GoogleFonts.inter(color: Colors.white),
                  ),
                  const SizedBox(height: 16),
                ],

                TextField(
                  controller: controller,
                  decoration: InputDecoration(
                    hintText: 'What can we pray for?',
                    hintStyle: GoogleFonts.inter(color: Colors.white38),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: const BorderSide(color: AppTheme.accentGold),
                    ),
                    filled: true,
                    fillColor: Colors.black12,
                  ),
                  style: GoogleFonts.inter(color: Colors.white),
                  maxLines: 3,
                ),
                const SizedBox(height: 16),
                DropdownButtonFormField<String>(
                  value: selectedCategory,
                  dropdownColor: AppTheme.sacredNavy800,
                  style: GoogleFonts.inter(color: Colors.white),
                  decoration: InputDecoration(
                    labelText: 'Category',
                    labelStyle: GoogleFonts.inter(color: Colors.white60),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide(
                        color: Colors.white.withValues(alpha: 0.1),
                      ),
                    ),
                  ),
                  items: categories
                      .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                      .toList(),
                  onChanged: (v) => setDialogState(() => selectedCategory = v!),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Checkbox(
                      value: isAnonymous,
                      activeColor: AppTheme.accentGold,
                      checkColor: Colors.black,
                      onChanged: (v) => setDialogState(() => isAnonymous = v!),
                    ),
                    Text(
                      'Post Anonymously',
                      style: GoogleFonts.inter(color: Colors.white70),
                    ),
                  ],
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () async {
                if (controller.text.trim().isEmpty) return;
                if (!isAnonymous && nameController.text.trim().isEmpty) return;

                Navigator.pop(context); // Close input dialog

                // Show loading/success feedback
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Submitting prayer request...'),
                    duration: Duration(seconds: 1),
                  ),
                );

                final user = ref.read(authProvider).value;
                final success = await ref
                    .read(prayerRequestRepositoryProvider)
                    .submitRequest(
                      userName: isAnonymous
                          ? 'Anonymous'
                          : nameController.text.trim(),
                      intention: controller.text,
                      category: selectedCategory,
                      userId: user?.id,
                      isAnonymous: isAnonymous,
                    );

                if (success != null) {
                  // Show Moderation Dialog
                  if (context.mounted) {
                    showDialog(
                      context: context,
                      builder: (context) => AlertDialog(
                        backgroundColor: AppTheme.sacredNavy800,
                        title: const Icon(
                          LucideIcons.checkCircle,
                          color: Colors.green,
                          size: 48,
                        ),
                        content: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'Prayer Request Received',
                              style: GoogleFonts.merriweather(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 18,
                              ),
                              textAlign: TextAlign.center,
                            ),
                            const SizedBox(height: 12),
                            Text(
                              'Your request has been submitted for moderation. It will appear on the wall once approved.',
                              style: GoogleFonts.inter(color: Colors.white70),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                        actions: [
                          TextButton(
                            onPressed: () {
                              Navigator.pop(context);
                              // Refreshes own list if logged in
                              if (user != null) {
                                ref.invalidate(
                                  userPrayerRequestsProvider(user.id),
                                );
                              }
                            },
                            child: const Text('OK'),
                          ),
                        ],
                      ),
                    );
                  }
                } else {
                  if (context.mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text(
                          'Failed to submit request. Please try again.',
                        ),
                        backgroundColor: Colors.red,
                      ),
                    );
                  }
                }
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.accentGold,
                foregroundColor: Colors.black,
              ),
              child: const Text('Submit'),
            ),
          ],
        ),
      ),
    );
  }
}
