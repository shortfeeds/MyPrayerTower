import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/saints_repository.dart';
import '../models/saint_model.dart';

final saintsSearchProvider = StateProvider<String>((ref) => '');

final saintsProvider = FutureProvider.autoDispose.family<List<Saint>, String>((
  ref,
  query,
) async {
  final repository = ref.watch(saintsRepositoryProvider);
  return repository.searchSaints(query);
});

class SaintsScreen extends ConsumerWidget {
  const SaintsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final searchQuery = ref.watch(saintsSearchProvider);
    final saintsAsync = ref.watch(saintsProvider(searchQuery));

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: const Text('Saints'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        // GLOBAL MENU: Use global scaffold key
        leading: IconButton(
          icon: const Icon(LucideIcons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (value) =>
                  ref.read(saintsSearchProvider.notifier).state = value,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search saints...',
                hintStyle: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                ),
                prefixIcon: const Icon(
                  LucideIcons.search,
                  color: Colors.white54,
                ),
                filled: true,
                fillColor: Colors.white.withValues(alpha: 0.1),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // List
          Expanded(
            child: saintsAsync.when(
              data: (saints) {
                if (saints.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.searchX,
                          size: 64,
                          color: Colors.white24,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No saints found',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.5),
                          ),
                        ),
                      ],
                    ),
                  );
                }
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemCount: saints.length,
                  itemBuilder: (context, index) {
                    final saint = saints[index];
                    return Card(
                      color: AppTheme.sacredNavy800,
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: ListTile(
                        contentPadding: const EdgeInsets.all(12),
                        leading: ClipOval(
                          child: Container(
                            width: 50,
                            height: 50,
                            color: AppTheme.primaryBlue,
                            child: saint.imageUrl != null
                                ? CachedNetworkImage(
                                    imageUrl: saint.imageUrl!,
                                    fit: BoxFit.cover,
                                    placeholder: (context, url) =>
                                        Container(color: AppTheme.primaryBlue),
                                    errorWidget: (context, url, error) =>
                                        const Icon(
                                          LucideIcons.user,
                                          color: Colors.white,
                                        ),
                                  )
                                : const Icon(
                                    LucideIcons.user,
                                    color: Colors.white,
                                  ),
                          ),
                        ),
                        title: Text(
                          saint.name,
                          style: const TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                        subtitle: Text(
                          saint.title ?? 'Patron Saint',
                          style: TextStyle(
                            color: Colors.white.withValues(alpha: 0.7),
                          ),
                        ),
                        trailing: const Icon(
                          LucideIcons.chevronRight,
                          color: Colors.white24,
                        ),
                        onTap: () => context.push('/saints/${saint.id}'),
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
          ),
        ],
      ),
    );
  }
}
