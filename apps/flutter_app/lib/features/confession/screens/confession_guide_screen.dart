import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';
import '../data/ten_commandments.dart';
import '../../ads/services/ad_service.dart';

/// Provider for tracking checked items
final confessionChecksProvider =
    StateNotifierProvider<ConfessionChecksNotifier, Map<String, bool>>((ref) {
      return ConfessionChecksNotifier();
    });

class ConfessionChecksNotifier extends StateNotifier<Map<String, bool>> {
  static const _boxName = 'confession_checks';

  ConfessionChecksNotifier() : super({}) {
    _loadFromHive();
  }

  Future<void> _loadFromHive() async {
    final box = await Hive.openBox<bool>(_boxName);
    final Map<String, bool> loaded = {};
    for (final key in box.keys) {
      loaded[key.toString()] = box.get(key) ?? false;
    }
    state = loaded;
  }

  Future<void> toggle(String key) async {
    final box = await Hive.openBox<bool>(_boxName);
    final current = state[key] ?? false;
    await box.put(key, !current);
    state = {...state, key: !current};
  }

  Future<void> clearAll() async {
    final box = await Hive.openBox<bool>(_boxName);
    await box.clear();
    state = {};
  }

  int get checkedCount => state.values.where((v) => v).length;
}

/// Confession Guide Screen - Examination of Conscience
class ConfessionGuideScreen extends ConsumerStatefulWidget {
  const ConfessionGuideScreen({super.key});

  @override
  ConsumerState<ConfessionGuideScreen> createState() =>
      _ConfessionGuideScreenState();
}

class _ConfessionGuideScreenState extends ConsumerState<ConfessionGuideScreen> {
  int _expandedIndex = -1;

  @override
  Widget build(BuildContext context) {
    final checks = ref.watch(confessionChecksProvider);
    final notifier = ref.read(confessionChecksProvider.notifier);

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Examination of Conscience',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        actions: [
          TextButton.icon(
            onPressed: () => _showClearDialog(notifier),
            icon: const Icon(LucideIcons.trash2, size: 16, color: Colors.red),
            label: Text(
              'Clear All',
              style: GoogleFonts.inter(color: Colors.red, fontSize: 12),
            ),
          ),
        ],
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
                border: Border.all(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                ),
              ),
              child: Column(
                children: [
                  const Icon(
                    LucideIcons.heartHandshake,
                    size: 48,
                    color: AppTheme.gold400,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'Prepare for Confession',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Examine your conscience by reflecting on each commandment. '
                    'Check any sins you need to confess.',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.white70,
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black26,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      '${notifier.checkedCount} items marked',
                      style: GoogleFonts.inter(
                        color: AppTheme.gold400,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Commandments List
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final item = tenCommandmentsExamination[index];
                final isExpanded = _expandedIndex == index;

                return _CommandmentCard(
                  item: item,
                  isExpanded: isExpanded,
                  checks: checks,
                  onToggleExpand: () {
                    setState(() {
                      _expandedIndex = isExpanded ? -1 : index;
                    });
                  },
                  onToggleQuestion: (key) => notifier.toggle(key),
                );
              }, childCount: tenCommandmentsExamination.length),
            ),
          ),

          // Bottom padding
          const SliverToBoxAdapter(child: SizedBox(height: 120)),
        ],
      ),
    );
  }

  void _showClearDialog(ConfessionChecksNotifier notifier) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.darkCard,
        title: Text(
          'Clear All Checks?',
          style: GoogleFonts.playfairDisplay(color: Colors.white),
        ),
        content: Text(
          'This will reset your examination. Use this after confession.',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Cancel',
              style: GoogleFonts.inter(color: Colors.white54),
            ),
          ),
          TextButton(
            onPressed: () {
              notifier.clearAll();
              Navigator.pop(context);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All checks cleared')),
              );

              // Show Interstitial Ad upon completion
              ref
                  .read(adServiceProvider)
                  .loadInterstitialAd(
                    onAdLoaded: (ad) => ad.show(),
                    onAdFailed: (_) {},
                  );
            },
            child: Text('Clear', style: GoogleFonts.inter(color: Colors.red)),
          ),
        ],
      ),
    );
  }
}

/// Individual Commandment Card Widget
class _CommandmentCard extends StatelessWidget {
  final ExaminationItem item;
  final bool isExpanded;
  final Map<String, bool> checks;
  final VoidCallback onToggleExpand;
  final Function(String) onToggleQuestion;

  const _CommandmentCard({
    required this.item,
    required this.isExpanded,
    required this.checks,
    required this.onToggleExpand,
    required this.onToggleQuestion,
  });

  @override
  Widget build(BuildContext context) {
    final checkedInThis = item.questions
        .where((q) => checks['${item.commandmentNumber}-$q'] == true)
        .length;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isExpanded
              ? AppTheme.gold500.withValues(alpha: 0.5)
              : Colors.white.withValues(alpha: 0.1),
        ),
      ),
      child: Column(
        children: [
          // Header (always visible)
          InkWell(
            onTap: onToggleExpand,
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Number badge
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(
                      color: checkedInThis > 0
                          ? Colors.red.withValues(alpha: 0.2)
                          : AppTheme.gold500.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: checkedInThis > 0
                            ? Colors.red.withValues(alpha: 0.5)
                            : AppTheme.gold500.withValues(alpha: 0.5),
                      ),
                    ),
                    child: Center(
                      child: Text(
                        '${item.commandmentNumber}',
                        style: GoogleFonts.playfairDisplay(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: checkedInThis > 0
                              ? Colors.red
                              : AppTheme.gold400,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),

                  // Commandment text
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          item.commandment,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                            height: 1.3,
                          ),
                        ),
                        if (checkedInThis > 0)
                          Padding(
                            padding: const EdgeInsets.only(top: 4),
                            child: Text(
                              '$checkedInThis item${checkedInThis > 1 ? 's' : ''} marked',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: Colors.red.shade300,
                              ),
                            ),
                          ),
                      ],
                    ),
                  ),

                  // Expand icon
                  Icon(
                    isExpanded
                        ? LucideIcons.chevronUp
                        : LucideIcons.chevronDown,
                    color: Colors.white54,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),

          // Questions (expanded)
          if (isExpanded) ...[
            Divider(color: Colors.white.withValues(alpha: 0.1), height: 1),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    item.description,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.textMuted,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 12),
                  ...item.questions.map((question) {
                    final key = '${item.commandmentNumber}-$question';
                    final isChecked = checks[key] ?? false;

                    return InkWell(
                      onTap: () => onToggleQuestion(key),
                      child: Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              width: 22,
                              height: 22,
                              decoration: BoxDecoration(
                                color: isChecked
                                    ? Colors.red
                                    : Colors.transparent,
                                borderRadius: BorderRadius.circular(6),
                                border: Border.all(
                                  color: isChecked
                                      ? Colors.red
                                      : Colors.white38,
                                  width: 2,
                                ),
                              ),
                              child: isChecked
                                  ? const Icon(
                                      LucideIcons.check,
                                      size: 14,
                                      color: Colors.white,
                                    )
                                  : null,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                question,
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  color: isChecked
                                      ? Colors.red.shade200
                                      : Colors.white70,
                                  decoration: isChecked
                                      ? TextDecoration.lineThrough
                                      : null,
                                  height: 1.4,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
        ],
      ),
    );
  }
}
