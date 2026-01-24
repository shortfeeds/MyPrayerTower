import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
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
      isCompleted:
          current.completedDays.length >= 8, // 0-indexed count vs day 9
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
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Novena Tracker',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                  shadows: const [Shadow(color: Colors.black45, blurRadius: 4)],
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.sacredNavy900, AppTheme.deepSpace],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
              ),
            ),
          ),

          // Search & Filter
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _buildSearchBar(),
                  const SizedBox(height: 16),
                  _buildCategoryTabs(),
                ],
              ),
            ),
          ),

          // Active Novenas Section
          if (activeNovenas.isNotEmpty &&
              _searchQuery.isEmpty &&
              _selectedCategory == 'All') ...[
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                child: Text(
                  'ACTIVE PRAYERS',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white54,
                    letterSpacing: 2,
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
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _ActiveNovenaCard(
                      definition: definition,
                      progress: progress,
                      onMarkComplete: () {
                        ref
                            .read(novenaProgressProvider.notifier)
                            .markDayComplete(progress.novenaId);
                      },
                    ),
                  );
                }, childCount: activeNovenas.length),
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],

          // Available Novenas Grid
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Text(
                'AVAILABLE NOVENAS (${filteredNovenas.length})',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  color: Colors.white54,
                  letterSpacing: 2,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.85,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              delegate: SliverChildBuilderDelegate((context, index) {
                final novena = filteredNovenas[index];
                final isActive = progressMap.containsKey(novena.id);
                return _NovenaGridCard(
                  novena: novena,
                  isActive: isActive,
                  onStart: () {
                    ref
                        .read(novenaProgressProvider.notifier)
                        .startNovena(novena.id);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(
                        content: Text('Started ${novena.name}! Day 1/9'),
                        backgroundColor: novena.color,
                      ),
                    );
                  },
                ).animate(delay: (50 * index).ms).fadeIn().slideY(begin: 0.1);
              }, childCount: filteredNovenas.length),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildSearchBar() {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: _searchController,
        style: GoogleFonts.inter(color: Colors.white),
        decoration: InputDecoration(
          hintText: 'Search for intercession...',
          hintStyle: GoogleFonts.inter(color: Colors.white30),
          prefixIcon: const Icon(LucideIcons.search, color: Colors.white30),
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 14,
          ),
          suffixIcon: _searchQuery.isNotEmpty
              ? IconButton(
                  icon: const Icon(
                    LucideIcons.x,
                    size: 16,
                    color: Colors.white30,
                  ),
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
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat;
          return Padding(
            padding: const EdgeInsets.only(right: 8),
            child: ChoiceChip(
              label: Text(cat),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) setState(() => _selectedCategory = cat);
              },
              selectedColor: AppTheme.gold500,
              backgroundColor: Colors.white.withValues(alpha: 0.05),
              labelStyle: GoogleFonts.inter(
                color: isSelected ? Colors.black : Colors.white70,
                fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
                side: BorderSide(
                  color: isSelected ? AppTheme.gold500 : Colors.white12,
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }
}

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

    return PremiumGlassCard(
      padding: EdgeInsets.zero,
      color: definition.color.withValues(alpha: 0.1),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: definition.color.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(
                    LucideIcons.flame,
                    color: definition.color,
                    size: 24,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        definition.name,
                        style: GoogleFonts.merriweather(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Day ${daysCompleted + 1} of 9',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.gold400,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Progress Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: List.generate(9, (index) {
                final isCompleted = index < daysCompleted;
                final isCurrent = index == daysCompleted;
                return Expanded(
                  child: Container(
                    height: 4,
                    margin: const EdgeInsets.symmetric(horizontal: 2),
                    decoration: BoxDecoration(
                      color: isCompleted
                          ? definition.color
                          : (isCurrent
                                ? definition.color.withValues(alpha: 0.5)
                                : Colors.white10),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                );
              }),
            ),
          ),

          const SizedBox(height: 16),

          // Action Button
          InkWell(
            onTap: () {
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
            child: Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 16),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: Colors.white10)),
              ),
              child: Center(
                child: Text(
                  'CONTINUE PRAYER',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _NovenaGridCard extends StatelessWidget {
  final NovenaDefinition novena;
  final bool isActive;
  final VoidCallback onStart;

  const _NovenaGridCard({
    required this.novena,
    required this.isActive,
    required this.onStart,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: isActive ? null : onStart,
      child: PremiumGlassCard(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: novena.color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(LucideIcons.sparkles, color: novena.color, size: 28),
            ),
            const SizedBox(height: 16),
            Text(
              novena.name,
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.merriweather(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              novena.patronOf,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.inter(fontSize: 11, color: Colors.white54),
            ),
            const Spacer(),
            if (isActive)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.gold500,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text(
                  'ACTIVE',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.black,
                  ),
                ),
              )
            else
              Text(
                'Start Novena',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: novena.color,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
