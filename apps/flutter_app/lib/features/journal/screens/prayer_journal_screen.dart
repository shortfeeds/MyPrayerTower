import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';

/// Prayer Journal Entry Model
class JournalEntry {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;
  final String type; // gratitude, petition, reflection, answered

  JournalEntry({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
    required this.type,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'content': content,
    'createdAt': createdAt.toIso8601String(),
    'type': type,
  };

  factory JournalEntry.fromJson(Map<String, dynamic> json) => JournalEntry(
    id: json['id'],
    title: json['title'],
    content: json['content'],
    createdAt: DateTime.parse(json['createdAt']),
    type: json['type'],
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
  @override
  Widget build(BuildContext context) {
    final entries = ref.watch(journalEntriesProvider);

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Prayer Journal',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: entries.isEmpty
          ? _buildEmptyState()
          : ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
              itemCount: entries.length,
              itemBuilder: (context, index) {
                return _JournalEntryCard(
                  entry: entries[index],
                  onDelete: () {
                    ref
                        .read(journalEntriesProvider.notifier)
                        .deleteEntry(entries[index].id);
                  },
                );
              },
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

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            LucideIcons.book,
            size: 64,
            color: AppTheme.gold500.withValues(alpha: 0.5),
          ),
          const SizedBox(height: 16),
          Text(
            'Your journal is empty',
            style: GoogleFonts.playfairDisplay(
              fontSize: 20,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Start recording your spiritual journey',
            style: GoogleFonts.inter(color: AppTheme.textMuted),
          ),
        ],
      ),
    );
  }

  void _showAddEntryDialog() {
    final titleController = TextEditingController();
    final contentController = TextEditingController();
    String selectedType = 'reflection';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: AppTheme.darkCard,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) => Padding(
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            MediaQuery.of(context).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'New Journal Entry',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),

              // Type selection
              Wrap(
                spacing: 8,
                children: [
                  _TypeChip(
                    'gratitude',
                    'Gratitude',
                    LucideIcons.heart,
                    selectedType,
                    (t) => setModalState(() => selectedType = t),
                  ),
                  _TypeChip(
                    'petition',
                    'Petition',
                    LucideIcons.hand,
                    selectedType,
                    (t) => setModalState(() => selectedType = t),
                  ),
                  _TypeChip(
                    'reflection',
                    'Reflection',
                    LucideIcons.edit3,
                    selectedType,
                    (t) => setModalState(() => selectedType = t),
                  ),
                  _TypeChip(
                    'answered',
                    'Answered',
                    LucideIcons.sparkles,
                    selectedType,
                    (t) => setModalState(() => selectedType = t),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              TextField(
                controller: titleController,
                style: GoogleFonts.inter(color: Colors.white),
                decoration: InputDecoration(
                  hintText: 'Title',
                  hintStyle: GoogleFonts.inter(color: AppTheme.textMuted),
                  filled: true,
                  fillColor: AppTheme.deepSpace,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 12),

              TextField(
                controller: contentController,
                style: GoogleFonts.inter(color: Colors.white),
                maxLines: 5,
                decoration: InputDecoration(
                  hintText: 'Write your thoughts...',
                  hintStyle: GoogleFonts.inter(color: AppTheme.textMuted),
                  filled: true,
                  fillColor: AppTheme.deepSpace,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
              const SizedBox(height: 16),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    if (titleController.text.isNotEmpty &&
                        contentController.text.isNotEmpty) {
                      ref
                          .read(journalEntriesProvider.notifier)
                          .addEntry(
                            JournalEntry(
                              id: DateTime.now().millisecondsSinceEpoch
                                  .toString(),
                              title: titleController.text,
                              content: contentController.text,
                              createdAt: DateTime.now(),
                              type: selectedType,
                            ),
                          );
                      Navigator.pop(context);
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.gold500,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                  ),
                  child: const Text('Save Entry'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _TypeChip extends StatelessWidget {
  final String type;
  final String label;
  final IconData icon;
  final String selected;
  final Function(String) onTap;

  const _TypeChip(this.type, this.label, this.icon, this.selected, this.onTap);

  @override
  Widget build(BuildContext context) {
    final isSelected = type == selected;
    return ChoiceChip(
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            size: 14,
            color: isSelected ? Colors.black : Colors.white70,
          ),
          const SizedBox(width: 4),
          Text(label),
        ],
      ),
      selected: isSelected,
      onSelected: (_) => onTap(type),
      selectedColor: AppTheme.gold500,
      backgroundColor: AppTheme.deepSpace,
      labelStyle: GoogleFonts.inter(
        color: isSelected ? Colors.black : Colors.white70,
        fontSize: 12,
      ),
    );
  }
}

class _JournalEntryCard extends StatelessWidget {
  final JournalEntry entry;
  final VoidCallback onDelete;

  const _JournalEntryCard({required this.entry, required this.onDelete});

  IconData get _typeIcon {
    switch (entry.type) {
      case 'gratitude':
        return LucideIcons.heart;
      case 'petition':
        return LucideIcons.hand;
      case 'answered':
        return LucideIcons.sparkles;
      default:
        return LucideIcons.edit3;
    }
  }

  Color get _typeColor {
    switch (entry.type) {
      case 'gratitude':
        return Colors.pink;
      case 'petition':
        return Colors.blue;
      case 'answered':
        return Colors.amber;
      default:
        return Colors.purple;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _typeColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _typeColor.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(_typeIcon, color: _typeColor, size: 16),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      entry.title,
                      style: GoogleFonts.playfairDisplay(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      _formatDate(entry.createdAt),
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                icon: const Icon(
                  LucideIcons.trash2,
                  color: Colors.red,
                  size: 18,
                ),
                onPressed: onDelete,
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            entry.content,
            style: GoogleFonts.inter(color: Colors.white70, height: 1.5),
            maxLines: 4,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return '${months[date.month - 1]} ${date.day}, ${date.year}';
  }
}
