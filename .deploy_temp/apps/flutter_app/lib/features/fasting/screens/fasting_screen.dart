import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:intl/intl.dart';

class FastingDay {
  final DateTime date;
  final String name;
  final String type; // 'fast', 'abstinence', 'both'
  final String description;

  const FastingDay({
    required this.date,
    required this.name,
    required this.type,
    required this.description,
  });
}

class FastingScreen extends ConsumerStatefulWidget {
  const FastingScreen({super.key});

  @override
  ConsumerState<FastingScreen> createState() => _FastingScreenState();
}

class _FastingScreenState extends ConsumerState<FastingScreen> {
  int _year = DateTime.now().year;
  List<FastingDay> _upcomingDays = [];

  @override
  void initState() {
    super.initState();
    _calculateDays();
  }

  void _calculateDays() {
    final easter = _calculateEaster(_year);
    final ashWednesday = easter.subtract(const Duration(days: 46));
    final goodFriday = easter.subtract(const Duration(days: 2));

    final List<FastingDay> days = [
      FastingDay(
        date: ashWednesday,
        name: 'Ash Wednesday',
        type: 'both',
        description: 'Fast and abstinence. Marks the beginning of Lent.',
      ),
      FastingDay(
        date: goodFriday,
        name: 'Good Friday',
        type: 'both',
        description: 'Fast and abstinence. Commemorates the Crucifixion.',
      ),
    ];

    // Add all Fridays of Lent
    // First Friday is Ash Wednesday + 2 (Friday after Ash Wed) NO, Ash Wed is Wed, next Fri is +2
    // Wait, let's find the first Friday after Ash Wednesday
    // Ash Wed is Wednesday. Thursday (+1), Friday (+2).
    DateTime currentDate = ashWednesday.add(const Duration(days: 2));

    while (currentDate.isBefore(easter)) {
      // Don't duplicate Good Friday
      if (!DateUtils.isSameDay(currentDate, goodFriday)) {
        days.add(
          FastingDay(
            date: currentDate,
            name: 'Friday of Lent',
            type: 'abstinence',
            description:
                'Abstinence from meat required for those 14 and older.',
          ),
        );
      }
      currentDate = currentDate.add(const Duration(days: 7));
    }

    days.sort((a, b) => a.date.compareTo(b.date));
    setState(() => _upcomingDays = days);
  }

  // Anonymous Gregorian algorithm for Easter
  DateTime _calculateEaster(int year) {
    final a = year % 19;
    final b = year ~/ 100;
    final c = year % 100;
    final d = b ~/ 4;
    final e = b % 4;
    final f = (b + 8) ~/ 25;
    final g = (b - f + 1) ~/ 3;
    final h = (19 * a + b - d - g + 15) % 30;
    final i = c ~/ 4;
    final k = c % 4;
    final l = (32 + 2 * e + 2 * i - h - k) % 7;
    final m = (a + 11 * h + 22 * l) ~/ 451;
    final month = (h + l - 7 * m + 114) ~/ 31;
    final day = ((h + l - 7 * m + 114) % 31) + 1;
    return DateTime(year, month, day);
  }

  void _changeYear(int delta) {
    setState(() {
      _year += delta;
      _calculateDays();
    });
  }

  @override
  Widget build(BuildContext context) {
    final today = DateTime.now();
    // Normalize today to remove time
    final todayNormalized = DateTime(today.year, today.month, today.day);

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Fasting & Abstinence',
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1E293B),
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Rules Cards
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: _buildRuleCard(
                    'Fasting',
                    LucideIcons.alertCircle,
                    Colors.purple,
                    [
                      'Who: Adults 18-59',
                      'What: One full meal',
                      'When: Ash Wed & Good Fri',
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildRuleCard(
                    'Abstinence',
                    LucideIcons.utensilsCrossed,
                    Colors.red,
                    [
                      'Who: Ages 14+',
                      'What: No meat',
                      'When: All Lent Fridays',
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),

            // Year Selector
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    onPressed: () => _changeYear(-1),
                    icon: const Icon(LucideIcons.chevronLeft),
                  ),
                  const SizedBox(width: 16),
                  Text(
                    '$_year',
                    style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(width: 16),
                  IconButton(
                    onPressed: () => _changeYear(1),
                    icon: const Icon(LucideIcons.chevronRight),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Days List
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _upcomingDays.length,
              separatorBuilder: (context, index) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final day = _upcomingDays[index];
                // Check if past, today, or future
                final dateNormalized = DateTime(
                  day.date.year,
                  day.date.month,
                  day.date.day,
                );
                final isPast = dateNormalized.isBefore(todayNormalized);
                final isToday = DateUtils.isSameDay(day.date, today);

                Color typeColor;
                Color typeBg;
                String typeLabel;

                switch (day.type) {
                  case 'both':
                    typeColor = Colors.red.shade700;
                    typeBg = Colors.red.shade50;
                    typeLabel = 'Fast & Abstain';
                    break;
                  case 'fast':
                    typeColor = Colors.purple.shade700;
                    typeBg = Colors.purple.shade50;
                    typeLabel = 'Fast Only';
                    break;
                  default:
                    typeColor = Colors.orange.shade700;
                    typeBg = Colors.orange.shade50;
                    typeLabel = 'Abstain Only';
                }

                return Opacity(
                  opacity: isPast ? 0.6 : 1.0,
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isToday
                            ? Colors.purple.shade300
                            : Colors.grey.shade100,
                        width: isToday ? 2 : 1,
                      ),
                      boxShadow: [
                        if (isToday)
                          BoxShadow(
                            color: Colors.purple.withValues(alpha: 0.1),
                            blurRadius: 8,
                            offset: const Offset(0, 2),
                          ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 50,
                          height: 50,
                          decoration: BoxDecoration(
                            color: typeBg,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text(
                                DateFormat(
                                  'MMM',
                                ).format(day.date).toUpperCase(),
                                style: GoogleFonts.inter(
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                  color: typeColor,
                                ),
                              ),
                              Text(
                                '${day.date.day}',
                                style: GoogleFonts.inter(
                                  fontSize: 18,
                                  fontWeight: FontWeight.bold,
                                  color: typeColor,
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
                              Row(
                                children: [
                                  Text(
                                    day.name,
                                    style: GoogleFonts.inter(
                                      fontWeight: FontWeight.bold,
                                      color: const Color(0xFF1E293B),
                                    ),
                                  ),
                                  if (isToday)
                                    Container(
                                      margin: const EdgeInsets.only(left: 8),
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 6,
                                        vertical: 2,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.purple.shade100,
                                        borderRadius: BorderRadius.circular(4),
                                      ),
                                      child: Text(
                                        'TODAY',
                                        style: GoogleFonts.inter(
                                          fontSize: 10,
                                          fontWeight: FontWeight.bold,
                                          color: Colors.purple.shade700,
                                        ),
                                      ),
                                    ),
                                ],
                              ),
                              Text(
                                DateFormat('EEEE').format(day.date),
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 10,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: typeBg,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            typeLabel,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: typeColor,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRuleCard(
    String title,
    IconData icon,
    MaterialColor color,
    List<String> rules,
  ) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1E293B),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...rules.map(
            (rule) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('• ', style: TextStyle(color: color.shade300)),
                  Expanded(
                    child: Text(
                      rule,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: const Color(0xFF475569),
                        height: 1.3,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
