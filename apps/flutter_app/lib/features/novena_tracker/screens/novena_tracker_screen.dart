import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';
import '../data/novenas_data.dart';
import '../models/novena_model.dart';
import 'novena_prayer_screen.dart';

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
class NovenaTrackerScreen extends ConsumerStatefulWidget {
  const NovenaTrackerScreen({super.key});

  @override
  ConsumerState<NovenaTrackerScreen> createState() =>
      _NovenaTrackerScreenState();
}

class _NovenaTrackerScreenState extends ConsumerState<NovenaTrackerScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  final _categories = ['All', 'Popular', 'Marian', 'Saints', 'Special'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<NovenaDefinition> _getFilteredNovenas() {
    return allNovenas.where((n) {
      final matchesSearch =
          n.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          n.patronOf.toLowerCase().contains(_searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (_selectedCategory == 'All') return true;
      if (_selectedCategory == 'Popular') {
        // First 5 in the list are typically popular
        return allNovenas.indexOf(n) < 5;
      }
      if (_selectedCategory == 'Marian') {
        return n.name.contains('Our Lady') ||
            n.name.contains('Immaculate') ||
            n.name.contains('Assumption') ||
            n.name.contains('Miraculous') ||
            n.name.contains('Mary');
      }
      if (_selectedCategory == 'Saints') {
        return n.name.contains('St.') || n.name.contains('Saint');
      }
      if (_selectedCategory == 'Special') {
        return !n.name.contains('St.') &&
            !n.name.contains('Our Lady') &&
            allNovenas.indexOf(n) >= 5;
      }

      return true;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final progressMap = ref.watch(novenaProgressProvider);
    final activeNovenas = progressMap.values
        .where((p) => !p.isCompleted)
        .toList();
    final filteredNovenas = _getFilteredNovenas();

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
          // Header & Search
          SliverToBoxAdapter(
            child: Column(
              children: [
                _buildHeaderCard(),
                _buildSearchBar(),
                _buildCategoryTabs(),
              ],
            ),
          ),

          // Active Novenas (Only show if no search filter)
          if (activeNovenas.isNotEmpty &&
              _searchQuery.isEmpty &&
              _selectedCategory == 'All') ...[
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

          // Filtered Novenas List
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
              child: Row(
                children: [
                  Text(
                    'AVAILABLE NOVENAS (${filteredNovenas.length})',
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

          if (filteredNovenas.isEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Center(
                  child: Text(
                    'No novenas found.',
                    style: GoogleFonts.inter(color: Colors.grey),
                  ),
                ),
              ),
            ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final novena = filteredNovenas[index];
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
              }, childCount: filteredNovenas.length),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }

  Widget _buildHeaderCard() {
    if (_searchQuery.isNotEmpty) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.all(20),
      margin: const EdgeInsets.fromLTRB(16, 16, 16, 8),
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
          const Icon(LucideIcons.flame, size: 40, color: AppTheme.gold400),
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
            style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: _searchController,
        style: GoogleFonts.inter(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Search novenas...',
          hintStyle: GoogleFonts.inter(color: Colors.grey),
          prefixIcon: const Icon(LucideIcons.search, color: Colors.grey),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
          suffixIcon: _searchQuery.isNotEmpty
              ? IconButton(
                  icon: const Icon(LucideIcons.x, size: 16, color: Colors.grey),
                  onPressed: () {
                    _searchController.clear();
                    setState(() => _searchQuery = '');
                  },
                )
              : null,
        ),
        onChanged: (val) => setState(() => _searchQuery = val),
      ),
    );
  }

  Widget _buildCategoryTabs() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: FilterChip(
              label: Text(cat),
              selected: isSelected,
              onSelected: (selected) {
                setState(() => _selectedCategory = cat);
              },
              backgroundColor: AppTheme.darkCard,
              selectedColor: AppTheme.gold500,
              checkmarkColor: AppTheme.sacredNavy900,
              labelStyle: GoogleFonts.inter(
                color: isSelected ? AppTheme.sacredNavy900 : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                fontSize: 13,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? AppTheme.gold500 : Colors.white10,
                ),
              ),
            ),
          );
        }).toList(),
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
    final color = definition.color;
    // final canMarkToday = progress.canMarkToday && daysCompleted < 9; // Unused in new design

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withValues(alpha: 0.15), AppTheme.darkCard],
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withValues(alpha: 0.3)),
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
                  color: color.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(LucideIcons.flame, color: color, size: 20),
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
                        color: color,
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
                      ? color
                      : (isCurrent
                            ? color.withValues(alpha: 0.3)
                            : Colors.white10),
                  shape: BoxShape.circle,
                  border: isCurrent ? Border.all(color: color, width: 2) : null,
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
                            color: isCurrent ? color : Colors.white38,
                          ),
                        ),
                ),
              );
            }),
          ),
          const SizedBox(height: 16),

          // Pray Now Button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => NovenaPrayerScreen(
                      novena: definition,
                      dayNumber: daysCompleted + 1,
                    ),
                  ),
                );
              },
              icon: const Icon(LucideIcons.bookOpen, size: 18),
              label: Text('Pray Day ${daysCompleted + 1}'),
              style: ElevatedButton.styleFrom(
                backgroundColor: color,
                foregroundColor:
                    Colors.white, // Text color on colorful background
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
            ? Border.all(color: novena.color.withValues(alpha: 0.5))
            : null,
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        leading: Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: novena.color.withValues(alpha: 0.15),
            shape: BoxShape.circle,
          ),
          child: Icon(LucideIcons.sparkles, color: novena.color, size: 20),
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
                  color: novena.color.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'ACTIVE',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: novena.color,
                  ),
                ),
              )
            : IconButton(
                icon: Icon(LucideIcons.play, color: novena.color),
                onPressed: onStart,
              ),
      ),
    );
  }
}
