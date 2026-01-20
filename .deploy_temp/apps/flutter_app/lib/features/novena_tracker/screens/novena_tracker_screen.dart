import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';
import '../data/novenas_data.dart';
import '../models/novena_model.dart';

/// Provider for active novena progress
final novenaProgressProvider =
    StateNotifierProvider<NovenaProgressNotifier, Map<String, NovenaProgress>>((
      ref,
    ) {
      return NovenaProgressNotifier();
    });

class NovenaProgressNotifier
    extends StateNotifier<Map<String, NovenaProgress>> {
  static const _boxName = 'novena_progress';

  NovenaProgressNotifier() : super({}) {
    _loadFromHive();
  }

  Future<void> _loadFromHive() async {
    final box = await Hive.openBox<Map>(_boxName);
    final Map<String, NovenaProgress> loaded = {};
    for (final key in box.keys) {
      final data = box.get(key);
      if (data != null) {
        loaded[key.toString()] = NovenaProgress(
          novenaId: data['novenaId'] ?? key.toString(),
          currentDay: data['currentDay'] ?? 1,
          startDate:
              DateTime.tryParse(data['startDate'] ?? '') ?? DateTime.now(),
          completedDays:
              (data['completedDays'] as List<dynamic>?)
                  ?.map((e) => DateTime.tryParse(e.toString()))
                  .whereType<DateTime>()
                  .toList() ??
              [],
          reminderEnabled: data['reminderEnabled'] ?? false,
          isCompleted: data['isCompleted'] ?? false,
        );
      }
    }
    state = loaded;
  }

  Future<void> _saveToHive(String id, NovenaProgress progress) async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.put(id, {
      'novenaId': progress.novenaId,
      'currentDay': progress.currentDay,
      'startDate': progress.startDate.toIso8601String(),
      'completedDays': progress.completedDays
          .map((d) => d.toIso8601String())
          .toList(),
      'reminderEnabled': progress.reminderEnabled,
      'isCompleted': progress.isCompleted,
    });
  }

  Future<void> startNovena(String novenaId) async {
    final progress = NovenaProgress(
      novenaId: novenaId,
      startDate: DateTime.now(),
    );
    state = {...state, novenaId: progress};
    await _saveToHive(novenaId, progress);
  }

  Future<void> markDayComplete(String novenaId) async {
    final current = state[novenaId];
    if (current == null) return;

    final updated = NovenaProgress(
      novenaId: novenaId,
      currentDay: current.currentDay + 1,
      startDate: current.startDate,
      completedDays: [...current.completedDays, DateTime.now()],
      reminderEnabled: current.reminderEnabled,
      isCompleted: current.completedDays.length >= 8,
    );
    state = {...state, novenaId: updated};
    await _saveToHive(novenaId, updated);
  }

  Future<void> cancelNovena(String novenaId) async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.delete(novenaId);
    state = Map.from(state)..remove(novenaId);
  }

  NovenaProgress? getProgress(String novenaId) => state[novenaId];
}

/// Novena Tracker Screen
class NovenaTrackerScreen extends ConsumerWidget {
  const NovenaTrackerScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progressMap = ref.watch(novenaProgressProvider);
    final activeNovenas = progressMap.values
        .where((p) => !p.isCompleted)
        .toList();

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Novena Tracker',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          // Header
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(20),
              margin: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    AppTheme.royalPurple900.withValues(alpha: 0.6),
                    AppTheme.sacredNavy900.withValues(alpha: 0.8),
                  ],
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  const Icon(
                    LucideIcons.flame,
                    size: 48,
                    color: AppTheme.gold400,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    '9 Days of Prayer',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Choose a novena and commit to 9 consecutive days of prayer.',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.white70,
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          ),

          // Active Novenas
          if (activeNovenas.isNotEmpty) ...[
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 8),
                child: Text(
                  'ACTIVE NOVENAS',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textMuted,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final progress = activeNovenas[index];
                  final definition = allNovenas.firstWhere(
                    (n) => n.id == progress.novenaId,
                    orElse: () => allNovenas.first,
                  );
                  return _ActiveNovenaCard(
                    definition: definition,
                    progress: progress,
                    onMarkComplete: () {
                      ref
                          .read(novenaProgressProvider.notifier)
                          .markDayComplete(progress.novenaId);
                    },
                  );
                }, childCount: activeNovenas.length),
              ),
            ),
          ],

          // All Novenas
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
              child: Row(
                children: [
                  Text(
                    'ALL NOVENAS (${allNovenas.length})',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: AppTheme.textMuted,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final novena = allNovenas[index];
                final isActive = progressMap.containsKey(novena.id);
                return _NovenaListTile(
                  novena: novena,
                  isActive: isActive,
                  onStart: () {
                    ref
                        .read(novenaProgressProvider.notifier)
                        .startNovena(novena.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Started ${novena.name}! Day 1/9'),
                      ),
                    );
                  },
                );
              }, childCount: allNovenas.length),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }
}

/// Active Novena Progress Card
class _ActiveNovenaCard extends StatelessWidget {
  final NovenaDefinition definition;
  final NovenaProgress progress;
  final VoidCallback onMarkComplete;

  const _ActiveNovenaCard({
    required this.definition,
    required this.progress,
    required this.onMarkComplete,
  });

  @override
  Widget build(BuildContext context) {
    final daysCompleted = progress.completedDays.length;
    final canMarkToday = progress.canMarkToday && daysCompleted < 9;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.amber.withValues(alpha: 0.1), AppTheme.darkCard],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  LucideIcons.flame,
                  color: Colors.amber,
                  size: 20,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      definition.name,
                      style: GoogleFonts.playfairDisplay(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      'Day ${daysCompleted + 1} of 9',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.amber,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Progress dots
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: List.generate(9, (i) {
              final isCompleted = i < daysCompleted;
              final isCurrent = i == daysCompleted;
              return Container(
                width: 28,
                height: 28,
                decoration: BoxDecoration(
                  color: isCompleted
                      ? Colors.amber
                      : (isCurrent
                            ? Colors.amber.withValues(alpha: 0.3)
                            : Colors.white10),
                  shape: BoxShape.circle,
                  border: isCurrent
                      ? Border.all(color: Colors.amber, width: 2)
                      : null,
                ),
                child: Center(
                  child: isCompleted
                      ? const Icon(
                          LucideIcons.check,
                          size: 14,
                          color: Colors.black,
                        )
                      : Text(
                          '${i + 1}',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: isCurrent ? Colors.amber : Colors.white38,
                          ),
                        ),
                ),
              );
            }),
          ),
          const SizedBox(height: 16),

          // Mark Complete Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: canMarkToday ? onMarkComplete : null,
              icon: Icon(
                canMarkToday ? LucideIcons.checkCircle : LucideIcons.clock,
                size: 18,
              ),
              label: Text(
                canMarkToday
                    ? 'Mark Day ${daysCompleted + 1} Complete'
                    : 'Come back tomorrow',
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.amber,
                foregroundColor: Colors.black,
                disabledBackgroundColor: Colors.grey.shade800,
                disabledForegroundColor: Colors.grey,
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

/// Novena List Tile
class _NovenaListTile extends StatelessWidget {
  final NovenaDefinition novena;
  final bool isActive;
  final VoidCallback onStart;

  const _NovenaListTile({
    required this.novena,
    required this.isActive,
    required this.onStart,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: isActive
            ? Border.all(color: Colors.amber.withValues(alpha: 0.5))
            : null,
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AppTheme.gold500.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: const Icon(
            LucideIcons.sparkles,
            color: AppTheme.gold400,
            size: 20,
          ),
        ),
        title: Text(
          novena.name,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: Colors.white,
            fontSize: 14,
          ),
        ),
        subtitle: Text(
          novena.patronOf,
          style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
        ),
        trailing: isActive
            ? Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.amber.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'ACTIVE',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.amber,
                  ),
                ),
              )
            : IconButton(
                icon: const Icon(LucideIcons.play, color: AppTheme.gold400),
                onPressed: onStart,
              ),
      ),
    );
  }
}
