import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';

/// Reading Plan Model
class ReadingPlan {
  final String id;
  final String name;
  final String description;
  final int totalDays;
  final IconData icon;
  final Color color;
  final String difficulty; // Beginner, Intermediate, Advanced

  const ReadingPlan({
    required this.id,
    required this.name,
    required this.description,
    required this.totalDays,
    required this.icon,
    required this.color,
    this.difficulty = 'Intermediate',
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
    difficulty: 'Advanced',
  ),
  ReadingPlan(
    id: 'catechism-year',
    name: 'Catechism in a Year',
    description: 'Study the Catechism of the Catholic Church over 365 days.',
    totalDays: 365,
    icon: LucideIcons.graduationCap,
    color: Colors.purple,
    difficulty: 'Advanced',
  ),
  ReadingPlan(
    id: 'gospels-90',
    name: 'Gospels in 90 Days',
    description: 'An immersive journey through Matthew, Mark, Luke, and John.',
    totalDays: 90,
    icon: LucideIcons.cross,
    color: Colors.red,
    difficulty: 'Intermediate',
  ),
  ReadingPlan(
    id: 'psalms-30',
    name: 'Psalms in 30 Days',
    description: 'Pray through all 150 Psalms in one month (5 per day).',
    totalDays: 30,
    icon: LucideIcons.music,
    color: Colors.amber,
    difficulty: 'Beginner',
  ),
  ReadingPlan(
    id: 'advent',
    name: 'Advent Preparation',
    description: '25 days of scripture and reflection leading to Christmas.',
    totalDays: 25,
    icon: LucideIcons.gift,
    color: Colors.green,
    difficulty: 'Beginner',
  ),
  ReadingPlan(
    id: 'lent',
    name: 'Lenten Journey',
    description: '40 days of scripture for spiritual renewal during Lent.',
    totalDays: 40,
    icon: LucideIcons.sunrise,
    color: Colors.deepPurple,
    difficulty: 'Intermediate',
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
      backgroundColor: const Color(0xFF0F172A), // Slate 900
      body: CustomScrollView(
        slivers: [
          // Premium Hero Header
          SliverAppBar(
            pinned: true,
            expandedHeight: 200,
            backgroundColor: AppTheme.sacredNavy900,
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [
                          AppTheme.sacredNavy900,
                          AppTheme.sacredNavy800,
                        ],
                      ),
                    ),
                  ),
                  Positioned(
                    right: -50,
                    top: -20,
                    child: Icon(
                      LucideIcons.bookOpen,
                      size: 250,
                      color: Colors.white.withValues(alpha: 0.03),
                    ),
                  ),
                  Positioned(
                    bottom: 24,
                    left: 20,
                    right: 20,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 6,
                          ),
                          decoration: BoxDecoration(
                            color: AppTheme.gold500.withValues(alpha: 0.2),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                              color: AppTheme.gold500.withValues(alpha: 0.3),
                            ),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                LucideIcons.flame,
                                size: 14,
                                color: AppTheme.gold500,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                '3 Day Streak!',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                  color: AppTheme.gold500,
                                ),
                              ),
                            ],
                          ),
                        ).animate().fadeIn().slideX(begin: -0.2),
                        const SizedBox(height: 12),
                        Text(
                          'Study Plans',
                          style: GoogleFonts.merriweather(
                            fontSize: 32,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ).animate().fadeIn().slideY(begin: 0.2),
                        const SizedBox(height: 4),
                        Text(
                          'Deepen your faith through structured daily reading.',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            color: Colors.white70,
                          ),
                        ).animate().fadeIn().slideY(begin: 0.2, delay: 100.ms),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Active Plans Section
          if (activePlans.isNotEmpty) ...[
            SliverPadding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
              sliver: SliverToBoxAdapter(
                child: Text(
                  'IN PROGRESS',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: Colors.white54,
                    letterSpacing: 1.5,
                  ),
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) =>
                      Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: _ActivePlanCard(
                          plan: activePlans[index],
                          currentDay: progress[activePlans[index].id] ?? 0,
                          onMarkComplete: () {
                            ref
                                .read(planProgressProvider.notifier)
                                .markDayComplete(activePlans[index].id);
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Day Complete! Great job.'),
                                backgroundColor: Colors.green,
                                behavior: SnackBarBehavior.floating,
                              ),
                            );
                          },
                        ),
                      ).animate().fadeIn().slideX(
                        begin: 0.1,
                        delay: (index * 100).ms,
                      ),
                  childCount: activePlans.length,
                ),
              ),
            ),
          ],

          // Available Plans Header
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(20, 24, 20, 8),
            sliver: SliverToBoxAdapter(
              child: Text(
                'BROWSE LIBRARY',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Colors.white54,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ),

          // Available Plans Grid
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverGrid(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                mainAxisSpacing: 16,
                crossAxisSpacing: 16,
                childAspectRatio: 0.75, // Taller cards
              ),
              delegate: SliverChildBuilderDelegate(
                (context, index) => _AvailablePlanCard(
                  plan: inactivePlans[index],
                  onStart: () {
                    ref
                        .read(planProgressProvider.notifier)
                        .startPlan(inactivePlans[index].id);
                  },
                ).animate().scale(delay: (index * 50).ms),
                childCount: inactivePlans.length,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }
}

class _ActivePlanCard extends StatelessWidget {
  final ReadingPlan plan;
  final int currentDay;
  final VoidCallback onMarkComplete;

  const _ActivePlanCard({
    required this.plan,
    required this.currentDay,
    required this.onMarkComplete,
  });

  @override
  Widget build(BuildContext context) {
    final double percent = (currentDay / plan.totalDays).clamp(0.0, 1.0);

    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            AppTheme.sacredNavy800,
            Color(0xFF1E293B), // Slate 800
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
        boxShadow: const [
          BoxShadow(
            color: Colors.black26, // equivalent to .withValues(alpha: 0.2)
            blurRadius: 10,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: () {
            // Future: Navigate to detail view
          },
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                // Progress Circle
                SizedBox(
                  width: 60,
                  height: 60,
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      CircularProgressIndicator(
                        value: percent,
                        strokeWidth: 6,
                        backgroundColor: Colors.white10,
                        valueColor: AlwaysStoppedAnimation<Color>(plan.color),
                      ),
                      Center(
                        child: Text(
                          '${(percent * 100).toInt()}%',
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.name,
                        style: GoogleFonts.merriweather(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Day $currentDay of ${plan.totalDays}',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 8),
                      // Action Button
                      SizedBox(
                        height: 32,
                        child: ElevatedButton(
                          onPressed: onMarkComplete,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: plan.color,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            elevation: 0,
                            textStyle: GoogleFonts.inter(
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          child: const Text('Complete Day'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _AvailablePlanCard extends StatelessWidget {
  final ReadingPlan plan;
  final VoidCallback onStart;

  const _AvailablePlanCard({required this.plan, required this.onStart});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B), // Slate 800
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Icon Header
          Container(
            height: 80,
            width: double.infinity,
            decoration: BoxDecoration(
              color: plan.color.withValues(alpha: 0.1),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(20),
              ),
            ),
            child: Center(
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: plan.color.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Icon(plan.icon, size: 32, color: plan.color),
              ),
            ),
          ),

          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    plan.name,
                    style: GoogleFonts.merriweather(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${plan.totalDays} Days • ${plan.difficulty}',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: Colors.white54,
                    ),
                  ),
                  const Spacer(),
                  SizedBox(
                    width: double.infinity,
                    child: OutlinedButton(
                      onPressed: onStart,
                      style: OutlinedButton.styleFrom(
                        foregroundColor: plan.color,
                        side: BorderSide(
                          color: plan.color.withValues(alpha: 0.5),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 0),
                      ),
                      child: const Text('Start Plan'),
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
