import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../models/novena_model.dart';
import 'novena_prayer_screen.dart';
import 'novena_tracker_screen.dart'; // for provider

class NovenaDetailScreen extends ConsumerWidget {
  final NovenaDefinition novena;

  const NovenaDetailScreen({super.key, required this.novena});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final progressMap = ref.watch(novenaProgressProvider);
    final progress = progressMap[novena.id];
    final daysCompleted = progress?.completedDays.length ?? 0;
    final currentDay = daysCompleted + 1;
    final isStarted = progress != null;

    final color = novena.color;
    final secondaryColor = novena.colorSecondary ?? color;

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          // App Bar / Header
          SliverAppBar(
            expandedHeight: 200,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            flexibleSpace: FlexibleSpaceBar(
              background: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      color.withValues(alpha: 0.3),
                      secondaryColor.withValues(alpha: 0.1),
                      AppTheme.sacredNavy950,
                    ],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: color.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: color.withValues(alpha: 0.5),
                          ),
                        ),
                        child: Icon(LucideIcons.flame, size: 40, color: color),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        novena.patron,
                        style: GoogleFonts.inter(
                          color: Colors.white70,
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              title: Text(
                novena.name,
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              centerTitle: true,
            ),
            leading: IconButton(
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
              onPressed: () => Navigator.pop(context),
            ),
          ),

          // Info Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    novena.description,
                    style: GoogleFonts.inter(
                      fontSize: 15,
                      color: Colors.white.withValues(alpha: 0.8),
                      height: 1.5,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  if (!isStarted)
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: () {
                          ref
                              .read(novenaProgressProvider.notifier)
                              .startNovena(novena.id);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: color,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                        ),
                        child: Text(
                          'Start This Novena',
                          style: GoogleFonts.inter(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Days List
          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final dayNum = index + 1;
                final isCompleted = dayNum <= daysCompleted;
                final isCurrent = dayNum == currentDay && isStarted;
                final isLocked = dayNum > currentDay;

                return GestureDetector(
                  onTap: () {
                    if (isLocked) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Complete previous days first!'),
                        ),
                      );
                      return;
                    }
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => NovenaPrayerScreen(
                          novena: novena,
                          dayNumber: dayNum,
                        ),
                      ),
                    );
                  },
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 20,
                    ),
                    decoration: BoxDecoration(
                      color: isCurrent
                          ? color.withValues(alpha: 0.1)
                          : AppTheme.darkCard,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: isCurrent
                            ? color
                            : isCompleted
                            ? color.withValues(alpha: 0.3)
                            : Colors.white10,
                      ),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: isCompleted
                                ? color
                                : (isCurrent
                                      ? color.withValues(alpha: 0.2)
                                      : Colors.white10),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: isCompleted
                                ? const Icon(
                                    LucideIcons.check,
                                    size: 16,
                                    color: Colors.white,
                                  )
                                : Text(
                                    '$dayNum',
                                    style: GoogleFonts.inter(
                                      fontWeight: FontWeight.bold,
                                      color: isCurrent ? color : Colors.white38,
                                    ),
                                  ),
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Day $dayNum',
                                style: GoogleFonts.merriweather(
                                  fontWeight: FontWeight.bold,
                                  color: isLocked
                                      ? Colors.white38
                                      : Colors.white,
                                ),
                              ),
                              if (isCurrent) ...[
                                const SizedBox(height: 4),
                                Text(
                                  'PRAY TODAY',
                                  style: GoogleFonts.inter(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: color,
                                    letterSpacing: 1,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        ),
                        Icon(
                          isLocked
                              ? LucideIcons.lock
                              : LucideIcons.chevronRight,
                          color: isLocked ? Colors.white12 : Colors.white54,
                          size: 20,
                        ),
                      ],
                    ),
                  ),
                );
              }, childCount: 9),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 40)),
        ],
      ),
    );
  }
}
