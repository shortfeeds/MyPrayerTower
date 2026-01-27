import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import 'confession_companion_screen.dart';
import '../widgets/examination_stepper.dart';

class ConfessionScreen extends ConsumerStatefulWidget {
  const ConfessionScreen({super.key});

  @override
  ConsumerState<ConfessionScreen> createState() => _ConfessionScreenState();
}

class _ConfessionScreenState extends ConsumerState<ConfessionScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        title: Text(
          'Reconciliation',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft),
          onPressed: () => Navigator.pop(context),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.gold500,
          labelColor: AppTheme.gold500,
          unselectedLabelColor: AppTheme.textMuted,
          labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w600),
          tabs: const [
            Tab(text: 'Examination'),
            Tab(text: 'The Rite'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(
              horizontal: 24.0,
              vertical: 16.0,
            ),
            child: ExaminationOfConscienceWidget(
              onComplete: () {
                _tabController.animateTo(1);
              },
            ),
          ),
          const _RiteLaunchpadTab(),
        ],
      ),
    );
  }
}

class _RiteLaunchpadTab extends StatelessWidget {
  const _RiteLaunchpadTab();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [AppTheme.royalPurple900, AppTheme.sacredNavy900],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: AppTheme.gold500.withValues(alpha: 0.3),
              ),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.3),
                  blurRadius: 20,
                  offset: const Offset(0, 10),
                ),
              ],
            ),
            child: Column(
              children: [
                const Icon(
                  LucideIcons.doorOpen,
                  size: 64,
                  color: AppTheme.gold500,
                ),
                const SizedBox(height: 24),
                Text(
                  'Enter the Confessional',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 16),
                Text(
                  'Start the interactive companion mode to guide you step-by-step through the sacrament, including your marked sins and Act of Contrition.',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    color: Colors.white70,
                    height: 1.5,
                  ),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 32),
                ShinyButton(
                  label: 'Start Companion Mode',
                  icon: LucideIcons.arrowRight,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => const ConfessionCompanionScreen(),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),
          Text(
            'Common Prayers',
            style: GoogleFonts.merriweather(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 16),
          const _PrayerCard(
            title: 'Act of Contrition',
            content:
                'O my God, I am heartily sorry for having offended Thee...',
          ),
          const _PrayerCard(
            title: 'Prayer Before Confession',
            content: 'Come, Holy Spirit, enlighten my mind...',
          ),
        ],
      ),
    );
  }
}

class _PrayerCard extends StatelessWidget {
  final String title;
  final String content;

  const _PrayerCard({required this.title, required this.content});

  @override
  Widget build(BuildContext context) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.book, size: 16, color: AppTheme.gold500),
              const SizedBox(width: 12),
              Text(
                title,
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            content,
            style: GoogleFonts.inter(
              color: Colors.white70,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}
