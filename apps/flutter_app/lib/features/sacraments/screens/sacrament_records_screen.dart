import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../providers/sacraments_provider.dart';
import '../models/sacrament_record_model.dart';
import 'sacrament_detail_screen.dart'; // Will be created next

class SacramentRecordsScreen extends ConsumerWidget {
  const SacramentRecordsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(sacramentsProvider);
    final records = state.records;

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 140.0,
            floating: true,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Sacrament Records',
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
                child: Center(
                  child: Icon(
                    LucideIcons.scroll,
                    size: 80,
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildSummaryCard(state),
                const SizedBox(height: 32),
                Text(
                  'Your Journey',
                  style: GoogleFonts.merriweather(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 16),
                ...records.asMap().entries.map((entry) {
                  final index = entry.key;
                  final record = entry.value;
                  final isLast = index == records.length - 1;
                  return _buildTimelineItem(
                    context,
                    record,
                    isLast: isLast,
                    index: index,
                  ).animate(delay: (100 * index).ms).fadeIn().slideX();
                }),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(SacramentsState state) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(24),
      child: Row(
        children: [
          SizedBox(
            width: 80,
            height: 80,
            child: Stack(
              alignment: Alignment.center,
              children: [
                CircularProgressIndicator(
                  value: state.progress,
                  backgroundColor: Colors.white10,
                  color: AppTheme.gold500,
                  strokeWidth: 8,
                ),
                Text(
                  '${(state.progress * 100).toInt()}%',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    fontSize: 16,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 24),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Sacramental Life',
                  style: GoogleFonts.merriweather(
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '${state.completedCount} of ${state.records.length} Completed',
                  style: GoogleFonts.inter(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem(
    BuildContext context,
    SacramentRecord record, {
    required bool isLast,
    required int index,
  }) {
    return IntrinsicHeight(
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Line & Dot
          SizedBox(
            width: 40,
            child: Column(
              children: [
                Container(
                  width: 24,
                  height: 24,
                  decoration: BoxDecoration(
                    color: record.isCompleted
                        ? record.color
                        : Colors.white.withValues(alpha: 0.1),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: record.isCompleted ? Colors.white : Colors.white24,
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: Icon(
                      record.isCompleted
                          ? LucideIcons.check
                          : LucideIcons.circle,
                      size: 14,
                      color: record.isCompleted
                          ? Colors.white
                          : Colors.transparent,
                    ),
                  ),
                ),
                if (!isLast)
                  Expanded(
                    child: Container(
                      width: 2,
                      color: record.isCompleted
                          ? record.color.withValues(alpha: 0.5)
                          : Colors.white10,
                    ),
                  ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          // Content Card
          Expanded(
            child: Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) =>
                          SacramentDetailScreen(record: record),
                    ),
                  );
                },
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.sacredNavy800,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: record.isCompleted
                          ? record.color.withValues(alpha: 0.3)
                          : Colors.transparent,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: record.color.withValues(alpha: 0.1),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          record.icon,
                          color: record.isCompleted
                              ? record.color
                              : Colors.white24,
                          size: 20,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              record.name,
                              style: GoogleFonts.merriweather(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: record.isCompleted
                                    ? Colors.white
                                    : Colors.white60,
                              ),
                            ),
                            if (record.isCompleted && record.date != null)
                              Text(
                                '${record.date!.year}', // Simple date logic
                                style: GoogleFonts.inter(
                                  color: record.color,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              )
                            else if (!record.isCompleted)
                              Text(
                                'Tap to prepare',
                                style: GoogleFonts.inter(
                                  color: Colors.white38,
                                  fontSize: 12,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                          ],
                        ),
                      ),
                      const Icon(
                        LucideIcons.chevronRight,
                        color: Colors.white24,
                        size: 20,
                      ),
                    ],
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
