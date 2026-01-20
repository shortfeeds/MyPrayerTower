import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';

class SacramentRecordsScreen extends StatelessWidget {
  const SacramentRecordsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 120.0,
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
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: AppTheme.primaryGradient,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildSummaryCard().animate().fadeIn().slideY(
                  begin: 0.1,
                  end: 0,
                ),
                const SizedBox(height: 24),
                _buildSectionTitle('My Sacraments'),
                const SizedBox(height: 12),
                _buildSacramentCard(
                  title: 'Baptism',
                  date: '-',
                  church: '-',
                  icon: LucideIcons.droplets,
                  color: Colors.blue,
                  isCompleted: false,
                ).animate(delay: 100.ms).fadeIn().slideX(),
                const SizedBox(height: 12),
                _buildSacramentCard(
                  title: 'First Communion',
                  date: '-',
                  church: '-',
                  icon: LucideIcons.utensils,
                  color: AppTheme.gold500,
                  isCompleted: false,
                ).animate(delay: 200.ms).fadeIn().slideX(),
                const SizedBox(height: 12),
                _buildSacramentCard(
                  title: 'Confirmation',
                  date: '-',
                  church: '-',
                  icon: LucideIcons.flame,
                  color: Colors.red,
                  isCompleted: false,
                ).animate(delay: 300.ms).fadeIn().slideX(),
                const SizedBox(height: 12),
                _buildSacramentCard(
                  title: 'Matrimony',
                  date: '-',
                  church: '-',
                  icon: LucideIcons.heartHandshake,
                  color: Colors.pink,
                  isCompleted: false,
                  onTap: () {},
                ).animate(delay: 400.ms).fadeIn().slideX(),
                const SizedBox(height: 24),
                ShinyButton(
                  label: 'Add Record',
                  icon: LucideIcons.plus,
                  onPressed: () {},
                ).animate(delay: 500.ms).fadeIn(),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryCard() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Sacramental Journey',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '0 of 7 Sacraments Received',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(LucideIcons.scroll, color: AppTheme.gold500),
              ),
            ],
          ),
          const SizedBox(height: 16),
          LinearProgressIndicator(
            value: 0,
            backgroundColor: Colors.white.withValues(alpha: 0.1),
            color: AppTheme.gold500,
            minHeight: 8,
            borderRadius: BorderRadius.circular(4),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Text(
      title,
      style: GoogleFonts.merriweather(
        fontSize: 18,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    );
  }

  Widget _buildSacramentCard({
    required String title,
    required String date,
    required String church,
    required IconData icon,
    required Color color,
    required bool isCompleted,
    VoidCallback? onTap,
  }) {
    return PremiumGlassCard(
      onTap: onTap,
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: isCompleted
                  ? color.withValues(alpha: 0.15)
                  : Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(
                color: isCompleted
                    ? color.withValues(alpha: 0.3)
                    : Colors.white.withValues(alpha: 0.1),
              ),
            ),
            child: Icon(
              icon,
              color: isCompleted ? color : Colors.white24,
              size: 24,
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
                    fontSize: 16,
                    fontWeight: FontWeight.w600,
                    color: isCompleted ? Colors.white : Colors.white60,
                  ),
                ),
                if (isCompleted) ...[
                  const SizedBox(height: 4),
                  Text(
                    'Received: $date',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: AppTheme.gold400,
                    ),
                  ),
                  Text(
                    church,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                    ),
                  ),
                ] else
                  const SizedBox(height: 4),
                if (!isCompleted)
                  Text(
                    'Not Received',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white38,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
              ],
            ),
          ),
          if (isCompleted)
            const Icon(
              LucideIcons.checkCircle,
              color: AppTheme.gold500,
              size: 20,
            )
          else if (onTap != null)
            const Icon(LucideIcons.plus, color: Colors.white, size: 20),
        ],
      ),
    );
  }
}
