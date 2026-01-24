import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

/// Prayer Journal Entry Model
class JournalEntry {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;
  final String type; // gratitude, petition, reflection, answered
  final String? mood; // joyful, anxious, peaceful, sad, hopeful

  JournalEntry({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
    required this.type,
    this.mood,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'content': content,
    'createdAt': createdAt.toIso8601String(),
    'type': type,
    'mood': mood,
  };

  factory JournalEntry.fromJson(Map<String, dynamic> json) => JournalEntry(
    id: json['id'],
    title: json['title'],
    content: json['content'],
    createdAt: DateTime.parse(json['createdAt']),
    type: json['type'],
    mood: json['mood'],
  );
}

/// Provider for journal entries
final journalEntriesProvider =
    StateNotifierProvider<JournalNotifier, List<JournalEntry>>((ref) {
      return JournalNotifier();
    });

class JournalNotifier extends StateNotifier<List<JournalEntry>> {
  static const _boxName = 'prayer_journal';

  JournalNotifier() : super([]) {
    _loadEntries();
  }

  Future<void> _loadEntries() async {
    final box = await Hive.openBox<Map>(_boxName);
    final entries = box.values
        .map((e) => JournalEntry.fromJson(Map<String, dynamic>.from(e)))
        .toList();
    entries.sort((a, b) => b.createdAt.compareTo(a.createdAt));
    state = entries;
  }

  Future<void> addEntry(JournalEntry entry) async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.put(entry.id, entry.toJson());
    state = [entry, ...state];
  }

  Future<void> deleteEntry(String id) async {
    final box = await Hive.openBox<Map>(_boxName);
    await box.delete(id);
    state = state.where((e) => e.id != id).toList();
  }
}

/// Prayer Journal Screen
class PrayerJournalScreen extends ConsumerStatefulWidget {
  const PrayerJournalScreen({super.key});

  @override
  ConsumerState<PrayerJournalScreen> createState() =>
      _PrayerJournalScreenState();
}

class _PrayerJournalScreenState extends ConsumerState<PrayerJournalScreen> {
  String _searchQuery = '';
  String _selectedFilter = 'all'; // all, gratitude, petition, etc.

  @override
  Widget build(BuildContext context) {
    final allEntries = ref.watch(journalEntriesProvider);

    // Filtering logic
    final filteredEntries = allEntries.where((entry) {
      final matchesSearch =
          entry.title.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesFilter =
          _selectedFilter == 'all' || entry.type == _selectedFilter;
      return matchesSearch && matchesFilter;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      resizeToAvoidBottomInset: false,
      body: Stack(
        children: [
          // Background Gradient
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppTheme.sacredNavy900, Colors.black],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
            ),
          ),

          SafeArea(
            child: CustomScrollView(
              slivers: [
                // Header
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            IconButton(
                              icon: const Icon(
                                LucideIcons.chevronLeft,
                                color: Colors.white70,
                              ),
                              onPressed: () => Navigator.pop(context),
                            ),
                            Text(
                              'Prayer Journal',
                              style: GoogleFonts.merriweather(
                                fontSize: 24,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(width: 48), // Balance
                          ],
                        ),
                        const SizedBox(height: 24),
                        // Search Bar
                        TextField(
                          onChanged: (val) =>
                              setState(() => _searchQuery = val),
                          style: GoogleFonts.inter(color: Colors.white),
                          decoration: InputDecoration(
                            hintText: 'Search your prayers...',
                            hintStyle: GoogleFonts.inter(color: Colors.white24),
                            prefixIcon: const Icon(
                              LucideIcons.search,
                              color: Colors.white24,
                            ),
                            filled: true,
                            fillColor: Colors.white.withValues(alpha: 0.05),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(16),
                              borderSide: BorderSide.none,
                            ),
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 20,
                              vertical: 16,
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Filter Chips
                        SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _FilterChip(
                                label: 'All',
                                isSelected: _selectedFilter == 'all',
                                onTap: () =>
                                    setState(() => _selectedFilter = 'all'),
                              ),
                              _FilterChip(
                                label: 'Reflections',
                                isSelected: _selectedFilter == 'reflection',
                                onTap: () => setState(
                                  () => _selectedFilter = 'reflection',
                                ),
                              ),
                              _FilterChip(
                                label: 'Gratitude',
                                isSelected: _selectedFilter == 'gratitude',
                                onTap: () => setState(
                                  () => _selectedFilter = 'gratitude',
                                ),
                              ),
                              _FilterChip(
                                label: 'Petitions',
                                isSelected: _selectedFilter == 'petition',
                                onTap: () => setState(
                                  () => _selectedFilter = 'petition',
                                ),
                              ),
                              _FilterChip(
                                label: 'Answered',
                                isSelected: _selectedFilter == 'answered',
                                onTap: () => setState(
                                  () => _selectedFilter = 'answered',
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                // Entries List
                if (filteredEntries.isEmpty)
                  SliverToBoxAdapter(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 48),
                        child: Column(
                          children: [
                            const Icon(
                              LucideIcons.bookOpen,
                              size: 48,
                              color: Colors.white10,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              allEntries.isEmpty
                                  ? 'Start your spiritual journey'
                                  : 'No entries found',
                              style: GoogleFonts.inter(color: Colors.white38),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate((context, index) {
                      final entry = filteredEntries[index];
                      return Padding(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        child:
                            _JournalEntryCard(
                                  entry: entry,
                                  onDelete: () {
                                    ref
                                        .read(journalEntriesProvider.notifier)
                                        .deleteEntry(entry.id);
                                  },
                                )
                                .animate(delay: (index * 50).ms)
                                .fadeIn()
                                .slideY(begin: 0.1),
                      );
                    }, childCount: filteredEntries.length),
                  ),

                const SliverToBoxAdapter(child: SizedBox(height: 100)),
              ],
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showAddEntryDialog(),
        backgroundColor: AppTheme.gold500,
        foregroundColor: Colors.black,
        icon: const Icon(LucideIcons.plus),
        label: const Text('New Entry'),
      ),
    );
  }

  void _showAddEntryDialog() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent, // Transparent for custom UI
      builder: (context) => _NewEntrySheet(
        onSave: (entry) {
          ref.read(journalEntriesProvider.notifier).addEntry(entry);
        },
      ),
    );
  }
}

class _FilterChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _FilterChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected
                ? AppTheme.gold500
                : Colors.white.withValues(alpha: 0.05),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? AppTheme.gold500 : Colors.white12,
            ),
          ),
          child: Text(
            label,
            style: GoogleFonts.inter(
              color: isSelected ? Colors.black : Colors.white70,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }
}

class _JournalEntryCard extends StatelessWidget {
  final JournalEntry entry;
  final VoidCallback onDelete;

  const _JournalEntryCard({required this.entry, required this.onDelete});

  Color get _typeColor {
    switch (entry.type) {
      case 'gratitude':
        return Colors.pinkAccent;
      case 'petition':
        return Colors.blueAccent;
      case 'answered':
        return Colors.amber;
      default:
        return Colors.purpleAccent;
    }
  }

  String get _moodEmoji {
    switch (entry.mood) {
      case 'joyful':
        return '😊';
      case 'peaceful':
        return '😌';
      case 'anxious':
        return '😟';
      case 'sad':
        return '😢';
      case 'hopeful':
        return '🙏';
      default:
        return '✨';
    }
  }

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 10,
                  vertical: 4,
                ),
                decoration: BoxDecoration(
                  color: _typeColor.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: _typeColor.withValues(alpha: 0.3)),
                ),
                child: Text(
                  entry.type.toUpperCase(),
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: _typeColor,
                    letterSpacing: 1,
                  ),
                ),
              ),
              Text(_moodEmoji, style: const TextStyle(fontSize: 18)),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            entry.title,
            style: GoogleFonts.playfairDisplay(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            DateFormat('MMMM d, y • h:mm a').format(entry.createdAt),
            style: GoogleFonts.inter(fontSize: 11, color: Colors.white38),
          ),
          const SizedBox(height: 12),
          Text(
            entry.content,
            style: GoogleFonts.inter(
              color: Colors.white70,
              height: 1.6,
              fontSize: 14,
            ),
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              const Spacer(),
              InkWell(
                onTap: onDelete,
                child: const Padding(
                  padding: EdgeInsets.all(4),
                  child: Icon(
                    LucideIcons.trash2,
                    size: 16,
                    color: Colors.white24,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _NewEntrySheet extends StatefulWidget {
  final Function(JournalEntry) onSave;

  const _NewEntrySheet({required this.onSave});

  @override
  State<_NewEntrySheet> createState() => _NewEntrySheetState();
}

class _NewEntrySheetState extends State<_NewEntrySheet> {
  final _titleController = TextEditingController();
  final _contentController = TextEditingController();
  String _selectedType = 'reflection';
  String _selectedMood = 'peaceful';

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag Handle
          Center(
            child: Container(
              margin: const EdgeInsets.only(top: 12, bottom: 20),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white12,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          Expanded(
            child: ListView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              children: [
                Text(
                  'New Entry',
                  style: GoogleFonts.merriweather(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 24),

                // Type Selector
                Text('CATEGORY', style: _labelStyle),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children:
                        [
                              _buildTypeOption(
                                'Reflection',
                                LucideIcons.edit3,
                                'reflection',
                              ),
                              _buildTypeOption(
                                'Gratitude',
                                LucideIcons.heart,
                                'gratitude',
                              ),
                              _buildTypeOption(
                                'Petition',
                                LucideIcons.hand,
                                'petition',
                              ),
                              _buildTypeOption(
                                'Answered',
                                LucideIcons.sparkles,
                                'answered',
                              ),
                            ]
                            .map(
                              (w) => Padding(
                                padding: const EdgeInsets.only(right: 12),
                                child: w,
                              ),
                            )
                            .toList(),
                  ),
                ),

                const SizedBox(height: 24),

                // Mood Selector
                Text('HOW ARE YOU FEELING?', style: _labelStyle),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children:
                        [
                              _buildMoodOption('😊', 'Joyful', 'joyful'),
                              _buildMoodOption('😌', 'Peaceful', 'peaceful'),
                              _buildMoodOption('🙏', 'Hopeful', 'hopeful'),
                              _buildMoodOption('😟', 'Anxious', 'anxious'),
                              _buildMoodOption('😢', 'Sad', 'sad'),
                            ]
                            .map(
                              (w) => Padding(
                                padding: const EdgeInsets.only(right: 12),
                                child: w,
                              ),
                            )
                            .toList(),
                  ),
                ),

                const SizedBox(height: 24),

                // Title Input
                TextField(
                  controller: _titleController,
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 20,
                    color: Colors.white,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Title your thoughts...',
                    hintStyle: GoogleFonts.playfairDisplay(
                      color: Colors.white24,
                    ),
                    border: InputBorder.none,
                  ),
                ),
                const Divider(color: Colors.white10),

                // Content Input
                TextField(
                  controller: _contentController,
                  maxLines: 8,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    color: Colors.white70,
                    height: 1.6,
                  ),
                  decoration: InputDecoration(
                    hintText: 'Start writing...',
                    hintStyle: GoogleFonts.inter(color: Colors.white24),
                    border: InputBorder.none,
                  ),
                ),
              ],
            ),
          ),

          // Bottom Bar
          Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              border: Border(top: BorderSide(color: Colors.white10)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () => Navigator.pop(context),
                  child: Text(
                    'Cancel',
                    style: GoogleFonts.inter(color: Colors.white54),
                  ),
                ),
                const SizedBox(width: 16),
                ElevatedButton(
                  onPressed: _save,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold500,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24,
                      vertical: 12,
                    ),
                  ),
                  child: const Text('Save Entry'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  void _save() {
    if (_titleController.text.isNotEmpty &&
        _contentController.text.isNotEmpty) {
      final entry = JournalEntry(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        title: _titleController.text,
        content: _contentController.text,
        createdAt: DateTime.now(),
        type: _selectedType,
        mood: _selectedMood,
      );
      widget.onSave(entry);
      Navigator.pop(context);
    }
  }

  Widget _buildTypeOption(String label, IconData icon, String value) {
    final isSelected = _selectedType == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedType = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected
              ? Colors.white
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Colors.transparent : Colors.white12,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: isSelected ? Colors.black : Colors.white70,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                color: isSelected ? Colors.black : Colors.white70,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMoodOption(String emoji, String label, String value) {
    final isSelected = _selectedMood == value;
    return GestureDetector(
      onTap: () => setState(() => _selectedMood = value),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? AppTheme.gold500.withValues(alpha: 0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? AppTheme.gold500 : Colors.transparent,
          ),
        ),
        child: Column(
          children: [
            Text(emoji, style: const TextStyle(fontSize: 24)),
            const SizedBox(height: 4),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 10,
                color: isSelected ? AppTheme.gold500 : Colors.white54,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  static final _labelStyle = GoogleFonts.inter(
    fontSize: 10,
    fontWeight: FontWeight.bold,
    letterSpacing: 1.5,
    color: Colors.white38,
  );
}
