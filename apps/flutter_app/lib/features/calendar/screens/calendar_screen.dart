import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../repositories/liturgical_calendar_repository.dart';

class CalendarScreen extends ConsumerStatefulWidget {
  const CalendarScreen({super.key});

  @override
  ConsumerState<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends ConsumerState<CalendarScreen> {
  DateTime _focusedMonth = DateTime.now();

  void _nextMonth() {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month + 1);
    });
  }

  void _previousMonth() {
    setState(() {
      _focusedMonth = DateTime(_focusedMonth.year, _focusedMonth.month - 1);
    });
  }

  bool get _isCurrentMonth {
    final now = DateTime.now();
    return _focusedMonth.year == now.year && _focusedMonth.month == now.month;
  }

  @override
  Widget build(BuildContext context) {
    final todayAsync = ref.watch(todayLiturgicalDayProvider);
    // optimized: fetch entire year once, then filter locally would be better,
    // but for now we rely on the repo's efficient caching or standard fetch.
    // However, the current providers are "GetToday" and "GetUpcoming".
    // We need a provider for "GetMonthEvents".
    // Since we don't have that yet, let's just use "Upcoming" for the list if current month,
    // OR ideally we should fetch the year's calendar.
    // Let's modify the usage to fetch the FULL calendar for the year and filter.

    // For this specific turn, to avoid huge refactors of repo, I'll just use the repo's getCalendarForYear directly via a FutureBuilder or a new provider if I could.
    // But since I can't easily add a new provider in this file without editing the repo file again...
    // I will simply filter the "upcoming" list if it's current month, OR show a placeholder for other months.
    // WAIT: Users want "rich". I should probably do it right.
    // I'll assume we can use `ref.watch(upcomingFeastsProvider)` for now, but really we need a year provider.
    // Let's just stick to the UI enhancements requested: Navigation & Details.
    // I will simulate the month view data by just showing the grid for that month.

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
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          if (!_isCurrentMonth)
            IconButton(
              icon: const Icon(LucideIcons.calendar),
              tooltip: 'Jump to Today',
              onPressed: () => setState(() => _focusedMonth = DateTime.now()),
            ),
        ],
      ),
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // Background
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
                // Today's Day Card - Only show if current month (or always show as header?)
                // Let's always show it as a pinned header context
                if (_isCurrentMonth)
                  SliverToBoxAdapter(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: todayAsync.when(
                        data: (liturgicalDay) => _buildTodayCard(
                          context,
                          dayName,
                          today,
                          liturgicalDay,
                        ),
                        loading: () => _buildTodayCardLoading(dayName, today),
                        error: (e, s) =>
                            _buildTodayCard(context, dayName, today, null),
                      ),
                    ),
                  ),

                // Month Grid Title with Navigation
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
                  sliver: SliverToBoxAdapter(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        IconButton(
                          icon: const Icon(
                            LucideIcons.chevronLeft,
                            color: Colors.white70,
                          ),
                          onPressed: _previousMonth,
                        ),
                        Text(
                          DateFormat('MMMM y').format(_focusedMonth),
                          style: GoogleFonts.merriweather(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        IconButton(
                          icon: const Icon(
                            LucideIcons.chevronRight,
                            color: Colors.white70,
                          ),
                          onPressed: _nextMonth,
                        ),
                      ],
                    ),
                  ),
                ),

                // Simple Month Grid
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  sliver: SliverToBoxAdapter(
                    child: _buildSimpleMonthGrid(_focusedMonth),
                  ),
                ),

                // Upcoming Feasts Title
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(24, 32, 24, 16),
                  sliver: SliverToBoxAdapter(
                    child: Text(
                      _isCurrentMonth ? 'Upcoming Feasts' : 'Feasts this Month',
                      style: GoogleFonts.merriweather(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ),

                // Events List
                // Ideally this would filter by the focused month.
                // Since I don't have the full year loaded in provider, I will modify this to use a FutureBuilder
                // that calls repo.getCalendarForYear if needed, or just keep using 'upcoming' if current month.
                // For "richness", let's use a FutureBuilder to get the ACTUAL month data if not current.
                FutureBuilder<List<LiturgicalDay>>(
                  future: _fetchMonthEvents(ref, _focusedMonth),
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return const SliverToBoxAdapter(
                        child: Center(child: CircularProgressIndicator()),
                      );
                    }
                    if (snapshot.hasError) {
                      return const SliverToBoxAdapter(child: SizedBox());
                    }

                    final feasts = snapshot.data ?? [];
                    if (feasts.isEmpty) {
                      return const SliverToBoxAdapter(
                        child: Center(
                          child: Padding(
                            padding: EdgeInsets.all(32),
                            child: Text(
                              'No major feasts found for this month',
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
                          return GestureDetector(
                            onTap: () => _showFeastDetails(context, feast),
                            child: _CalendarItem(
                              day: DateFormat('d').format(feast.date),
                              month: DateFormat(
                                'MMM',
                              ).format(feast.date).toUpperCase(),
                              title: feast.name,
                              grade: feast.grade,
                              color: Color(
                                LiturgicalDay.getColorValue(feast.color),
                              ),
                            ).animate(delay: (index * 50).ms).fadeIn().slideX(),
                          );
                        }, childCount: feasts.length),
                      ),
                    );
                  },
                ),

                const SliverToBoxAdapter(child: SizedBox(height: 150)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Future<List<LiturgicalDay>> _fetchMonthEvents(
    WidgetRef ref,
    DateTime month,
  ) async {
    // If it's the current month, we COULD use the upcoming provider, but that only gives 30 days ahead.
    // Safer to just always fetch the year and filter for this month.
    final repo = ref.read(liturgicalCalendarRepositoryProvider);
    final yearEvents = await repo.getCalendarForYear(month.year);

    return yearEvents
        .where(
          (e) =>
              e.date.month == month.month &&
              (e.grade.contains('SOLEMNITY') ||
                  e.grade.contains('FEAST') ||
                  e.grade.contains('MEMORIAL')),
        )
        .toList();
  }

  void _showFeastDetails(BuildContext context, LiturgicalDay feast) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: BoxDecoration(
          color: AppTheme.sacredNavy900,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(30)),
          border: Border(
            top: BorderSide(
              color: Color(LiturgicalDay.getColorValue(feast.color)),
              width: 2,
            ),
          ),
        ),
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.white24,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: Color(LiturgicalDay.getColorValue(feast.color)),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    feast.grade.isEmpty ? 'FEAST' : feast.grade,
                    style: const TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ),
                const Spacer(),
                Text(
                  DateFormat('MMMM d, y').format(feast.date),
                  style: const TextStyle(color: Colors.white54),
                ),
              ],
            ),
            const SizedBox(height: 24),
            Text(
              feast.name,
              style: GoogleFonts.merriweather(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),
            const Divider(color: Colors.white12),
            const SizedBox(height: 16),
            Text(
              'About this Feast',
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: AppTheme.gold500,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Sample description: This is a significant day in the liturgical calendar. Only by looking to the cross can we truly understand the meaning of this celebration.',
              style: GoogleFonts.inter(
                fontSize: 16,
                color: Colors.white70,
                height: 1.5,
              ),
            ),
            const Spacer(),
            // Assuming ShinyButton is defined elsewhere or is a placeholder
            // For this example, I'll use a simple ElevatedButton as ShinyButton is not provided.
            // If ShinyButton is a custom widget, it needs to be imported or defined.
            ElevatedButton.icon(
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Opening readings...')),
                );
              },
              icon: const Icon(LucideIcons.bookOpen),
              label: const Text('Readings for this Day'),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size(double.infinity, 50),
                backgroundColor: AppTheme.gold500,
                foregroundColor: Colors.black,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  // A simplified 7-column grid for the current month visuals
  Widget _buildSimpleMonthGrid(DateTime monthDate) {
    final daysInMonth = DateUtils.getDaysInMonth(
      monthDate.year,
      monthDate.month,
    );
    final firstDayOfMonth = DateTime(monthDate.year, monthDate.month, 1);
    final startingOffset = firstDayOfMonth.weekday % 7; // Sunday based 0-6

    return PremiumGlassCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Weekday Headers
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: ['S', 'M', 'T', 'W', 'T', 'F', 'S']
                .map(
                  (d) => SizedBox(
                    width: 32,
                    child: Text(
                      d,
                      textAlign: TextAlign.center,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                        color: Colors.white38,
                      ),
                    ),
                  ),
                )
                .toList(),
          ),
          const SizedBox(height: 12),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 7,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
            ),
            itemCount: daysInMonth + startingOffset,
            itemBuilder: (context, index) {
              if (index < startingOffset) return const SizedBox();
              final dayNum = index - startingOffset + 1;

              // Highlight logic
              final now = DateTime.now();
              final isToday =
                  dayNum == now.day &&
                  monthDate.month == now.month &&
                  monthDate.year == now.year;

              return Container(
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: isToday ? AppTheme.gold500 : Colors.transparent,
                  shape: BoxShape.circle,
                  border: isToday ? null : Border.all(color: Colors.white10),
                ),
                child: Text(
                  '$dayNum',
                  style: GoogleFonts.inter(
                    color: isToday ? Colors.black : Colors.white70,
                    fontWeight: isToday ? FontWeight.bold : FontWeight.normal,
                    fontSize: 12,
                  ),
                ),
              );
            },
          ),
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

    return PremiumGlassCard(
      padding: const EdgeInsets.all(0),
      child: Container(
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(20),
          gradient: LinearGradient(
            colors: [
              Color(colorValue).withValues(alpha: 0.2),
              Colors.transparent,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          border: Border.all(
            color: Color(colorValue).withValues(alpha: 0.5),
            width: 1,
          ),
        ),
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  Text(
                    dayName.toUpperCase(),
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      letterSpacing: 3,
                      color: Colors.white54,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    today,
                    style: GoogleFonts.merriweather(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 24),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 6,
                    ),
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
                        color: colorValue == 0xFFFFFFFF
                            ? Colors.black
                            : Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    dayTitle,
                    textAlign: TextAlign.center,
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      color: Colors.white,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  if (liturgicalDay?.grade.isNotEmpty ?? false) ...[
                    const SizedBox(height: 8),
                    Text(
                      liturgicalDay!.grade,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.white54,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Footer strip
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 12),
              decoration: const BoxDecoration(
                color: Colors.black26,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(20),
                  bottomRight: Radius.circular(20),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(
                    LucideIcons.bookOpen,
                    size: 14,
                    color: Colors.white38,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'View Readings',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    ).animate().fadeIn().scale();
  }

  Widget _buildTodayCardLoading(String dayName, String today) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(32),
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
        height: 80, // Fixed height for alignment
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
        ),
        child: Row(
          children: [
            // Date Badge
            Container(
              width: 50,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: color.withValues(alpha: 0.3)),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    day,
                    style: GoogleFonts.inter(
                      fontSize: 18,
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
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    title,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
                  if (grade.isNotEmpty) ...[
                    const SizedBox(height: 4),
                    Text(
                      grade,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
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
            Icon(
              LucideIcons.chevronRight,
              size: 18,
              color: Colors.white.withValues(alpha: 0.2),
            ),
          ],
        ),
      ),
    );
  }
}
