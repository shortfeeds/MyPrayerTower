import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../../../core/theme/app_theme.dart';

/// Reading Plan Model
class ReadingPlan {
  final String id;
  final String name;
  final String description;
  final int totalDays;
  final IconData icon;
  final Color color;

  const ReadingPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.totalDays,
    required this.icon,
    required this.color,
  });
}

/// Available reading plans
const List<ReadingPlan> availablePlans = [
  ReadingPlan(
    id: 'bible-year',
    name: 'Bible in a Year',
    description:
        'Read through the entire Bible in 365 days with daily Old Testament, New Testament, and Psalms readings.',
    totalDays: 365,
    icon: LucideIcons.bookOpen,
    color: Colors.blue,
  ),
  ReadingPlan(
    id: 'catechism-year',
    name: 'Catechism in a Year',
    description: 'Study the Catechism of the Catholic Church over 365 days.',
    totalDays: 365,
    icon: LucideIcons.graduationCap,
    color: Colors.purple,
  ),
  ReadingPlan(
    id: 'gospels-90',
    name: 'Gospels in 90 Days',
    description: 'An immersive journey through Matthew, Mark, Luke, and John.',
    totalDays: 90,
    icon: LucideIcons.cross,
    color: Colors.red,
  ),
  ReadingPlan(
    id: 'psalms-30',
    name: 'Psalms in 30 Days',
    description: 'Pray through all 150 Psalms in one month (5 per day).',
    totalDays: 30,
    icon: LucideIcons.music,
    color: Colors.amber,
  ),
  ReadingPlan(
    id: 'advent',
    name: 'Advent Preparation',
    description: '25 days of scripture and reflection leading to Christmas.',
    totalDays: 25,
    icon: LucideIcons.gift,
    color: Colors.green,
  ),
  ReadingPlan(
    id: 'lent',
    name: 'Lenten Journey',
    description: '40 days of scripture for spiritual renewal during Lent.',
    totalDays: 40,
    icon: LucideIcons.sunrise,
    color: Colors.deepPurple,
  ),
];

/// Provider for plan progress
final planProgressProvider =
    StateNotifierProvider<PlanProgressNotifier, Map<String, int>>((ref) {
      return PlanProgressNotifier();
    });

class PlanProgressNotifier extends StateNotifier<Map<String, int>> {
  static const _boxName = 'reading_plans';

  PlanProgressNotifier() : super({}) {
    _load();
  }

  Future<void> _load() async {
    final box = await Hive.openBox<int>(_boxName);
    final Map<String, int> loaded = {};
    for (final key in box.keys) {
      loaded[key.toString()] = box.get(key) ?? 0;
    }
    state = loaded;
  }

  Future<void> startPlan(String planId) async {
    final box = await Hive.openBox<int>(_boxName);
    await box.put(planId, 1);
    state = {...state, planId: 1};
  }

  Future<void> markDayComplete(String planId) async {
    final box = await Hive.openBox<int>(_boxName);
    final current = state[planId] ?? 0;
    await box.put(planId, current + 1);
    state = {...state, planId: current + 1};
  }

  Future<void> resetPlan(String planId) async {
    final box = await Hive.openBox<int>(_boxName);
    await box.delete(planId);
    state = Map.from(state)..remove(planId);
  }

  int getProgress(String planId) => state[planId] ?? 0;
}

/// Reading Plans Screen
class ReadingPlansScreen extends ConsumerWidget {
  const ReadingPlansScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progress = ref.watch(planProgressProvider);
    final activePlans = availablePlans
        .where((p) => progress.containsKey(p.id))
        .toList();
    final inactivePlans = availablePlans
        .where((p) => !progress.containsKey(p.id))
        .toList();

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Reading Plans',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
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
                  LucideIcons.bookOpen,
                  size: 48,
                  color: AppTheme.gold400,
                ),
                const SizedBox(height: 12),
                Text(
                  'Grow in Scripture',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Choose a reading plan and commit to daily Scripture study.',
                  style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Active Plans
          if (activePlans.isNotEmpty) ...[
            Text(
              'ACTIVE PLANS',
              style: GoogleFonts.inter(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppTheme.textMuted,
                letterSpacing: 1.5,
              ),
            ),
            const SizedBox(height: 12),
            ...activePlans.map(
              (plan) => _PlanCard(
                plan: plan,
                currentDay: progress[plan.id] ?? 0,
                isActive: true,
                onAction: () {
                  ref
                      .read(planProgressProvider.notifier)
                      .markDayComplete(plan.id);
                },
              ),
            ),
            const SizedBox(height: 24),
          ],

          // Available Plans
          Text(
            'AVAILABLE PLANS',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppTheme.textMuted,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          ...inactivePlans.map(
            (plan) => _PlanCard(
              plan: plan,
              currentDay: 0,
              isActive: false,
              onAction: () {
                ref.read(planProgressProvider.notifier).startPlan(plan.id);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Started ${plan.name}!')),
                );
              },
            ),
          ),

          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  final ReadingPlan plan;
  final int currentDay;
  final bool isActive;
  final VoidCallback onAction;

  const _PlanCard({
    required this.plan,
    required this.currentDay,
    required this.isActive,
    required this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    final progress = currentDay / plan.totalDays;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive ? plan.color.withValues(alpha: 0.5) : Colors.white12,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: plan.color.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(plan.icon, color: plan.color, size: 22),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      plan.name,
                      style: GoogleFonts.playfairDisplay(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    Text(
                      '${plan.totalDays} days',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: AppTheme.textMuted,
                      ),
                    ),
                  ],
                ),
              ),
              if (isActive)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: plan.color.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Day $currentDay',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: plan.color,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            plan.description,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: Colors.white70,
              height: 1.4,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          if (isActive) ...[
            const SizedBox(height: 12),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.white12,
                valueColor: AlwaysStoppedAnimation<Color>(plan.color),
                minHeight: 6,
              ),
            ),
            const SizedBox(height: 12),
          ] else
            const SizedBox(height: 12),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: onAction,
              style: ElevatedButton.styleFrom(
                backgroundColor: isActive ? plan.color : AppTheme.darkCard,
                foregroundColor: isActive ? Colors.white : plan.color,
                side: isActive ? null : BorderSide(color: plan.color),
                padding: const EdgeInsets.symmetric(vertical: 12),
              ),
              child: Text(isActive ? 'Mark Day Complete' : 'Start Plan'),
            ),
          ),
        ],
      ),
    );
  }
}
