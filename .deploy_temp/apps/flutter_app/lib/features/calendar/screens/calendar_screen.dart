import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/liturgical_calendar_repository.dart';

class CalendarScreen extends ConsumerWidget {
  const CalendarScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final todayAsync = ref.watch(todayLiturgicalDayProvider);
    final upcomingAsync = ref.watch(upcomingFeastsProvider);
    final now = DateTime.now();
    final today = DateFormat('MMMM d, y').format(now);
    final dayName = DateFormat('EEEE').format(now);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Liturgical Calendar',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      body: CustomScrollView(
        slivers: [
          // Today's Day Card - Real Data
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: todayAsync.when(
                data: (liturgicalDay) =>
                    _buildTodayCard(context, dayName, today, liturgicalDay),
                loading: () => _buildTodayCardLoading(dayName, today),
                error: (e, s) => _buildTodayCard(context, dayName, today, null),
              ),
            ),
          ),

          // Upcoming Feasts - Real Data
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverToBoxAdapter(
              child: Text(
                'Upcoming Feasts',
                style: GoogleFonts.merriweather(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ),
          ),

          upcomingAsync.when(
            data: (feasts) {
              if (feasts.isEmpty) {
                return const SliverToBoxAdapter(
                  child: Center(
                    child: Padding(
                      padding: EdgeInsets.all(32),
                      child: Text(
                        'No upcoming feasts found',
                        style: TextStyle(color: Colors.white54),
                      ),
                    ),
                  ),
                );
              }
              return SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                sliver: SliverList(
                  delegate: SliverChildBuilderDelegate((context, index) {
                    final feast = feasts[index];
                    return _CalendarItem(
                      day: DateFormat('d').format(feast.date),
                      month: DateFormat('MMM').format(feast.date).toUpperCase(),
                      title: feast.name,
                      grade: feast.grade,
                      color: Color(LiturgicalDay.getColorValue(feast.color)),
                    );
                  }, childCount: feasts.length),
                ),
              );
            },
            loading: () => const SliverToBoxAdapter(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (e, s) => SliverToBoxAdapter(
              child: Center(
                child: Text(
                  'Error loading feasts: $e',
                  style: const TextStyle(color: Colors.red),
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildTodayCard(
    BuildContext context,
    String dayName,
    String today,
    LiturgicalDay? liturgicalDay,
  ) {
    final colorValue = liturgicalDay != null
        ? LiturgicalDay.getColorValue(liturgicalDay.color)
        : LiturgicalDay.getColorValue('GREEN');
    final seasonName = liturgicalDay?.season ?? 'Ordinary Time';
    final dayTitle = liturgicalDay?.name ?? 'Weekday';

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(colorValue).withValues(alpha: 0.3),
            AppTheme.sacredNavy900,
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: Color(colorValue).withValues(alpha: 0.5),
          width: 2,
        ),
      ),
      child: Column(
        children: [
          Text(
            dayName.toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 14,
              letterSpacing: 2,
              color: Colors.white70,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            today,
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Color(colorValue),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Color(colorValue).withValues(alpha: 0.4),
                  blurRadius: 12,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: Text(
              seasonName,
              style: GoogleFonts.inter(
                color: colorValue == 0xFFFFFFFF ? Colors.black : Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          const SizedBox(height: 24),
          Text(
            dayTitle,
            textAlign: TextAlign.center,
            style: GoogleFonts.merriweather(
              fontSize: 18,
              color: Colors.white,
              fontStyle: FontStyle.italic,
            ),
          ),
          if (liturgicalDay?.grade.isNotEmpty ?? false) ...[
            const SizedBox(height: 8),
            Text(
              liturgicalDay!.grade,
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white54),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildTodayCardLoading(String dayName, String today) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E3A5F), Color(0xFF0F172A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        children: [
          Text(
            dayName.toUpperCase(),
            style: const TextStyle(
              fontSize: 14,
              letterSpacing: 2,
              color: Colors.white70,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            today,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 24),
          const CircularProgressIndicator(color: Colors.white54),
          const SizedBox(height: 24),
          const Text(
            'Loading liturgical data...',
            style: TextStyle(color: Colors.white54),
          ),
        ],
      ),
    );
  }
}

class _CalendarItem extends StatelessWidget {
  final String day;
  final String month;
  final String title;
  final String grade;
  final Color color;

  const _CalendarItem({
    required this.day,
    required this.month,
    required this.title,
    required this.grade,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(12),
          border: Border(left: BorderSide(color: color, width: 4)),
        ),
        child: Row(
          children: [
            Container(
              width: 50,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Column(
                children: [
                  Text(
                    day,
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    month,
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: Colors.white54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  if (grade.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      grade,
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        color: color,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const Icon(LucideIcons.chevronRight, size: 18, color: Colors.white38),
          ],
        ),
      ),
    );
  }
}
