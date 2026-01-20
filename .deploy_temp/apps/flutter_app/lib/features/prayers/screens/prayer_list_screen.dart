import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../ads/widgets/smart_ad_banner.dart';
import '../providers/prayers_provider.dart';

class PrayerListScreen extends ConsumerWidget {
  final String categoryId;
  final String categoryName;

  const PrayerListScreen({
    super.key,
    required this.categoryId,
    required this.categoryName,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prayersAsync = ref.watch(prayersProvider(categoryId));

    return Scaffold(
      appBar: AppBar(
        title: Text(categoryName),
        backgroundColor: AppTheme.darkBg,
      ),
      body: prayersAsync.when(
        data: (prayers) {
          if (prayers.isEmpty) {
            return const Center(
              child: Text('No prayers found in this category'),
            );
          }
          return Column(
            children: [
              Expanded(
                child: ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: prayers.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final prayer = prayers[index];
                    return Card(
                      color: AppTheme.darkCard,
                      child: ListTile(
                        title: Text(
                          prayer.title,
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        subtitle: Text(
                          prayer.content,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(color: AppTheme.textMuted),
                        ),
                        trailing: const Icon(LucideIcons.chevronRight),
                        onTap: () => context.push('/prayer/${prayer.id}'),
                      ),
                    );
                  },
                ),
              ),
              const SmartAdBanner(page: 'prayer_list', position: 'bottom'),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, s) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
