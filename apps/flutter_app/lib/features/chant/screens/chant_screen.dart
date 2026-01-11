import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class ChantScreen extends StatelessWidget {
  const ChantScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Gregorian Chant',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  Image.network(
                    'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop',
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, AppTheme.deepSpace],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildNowPlayingCard(),
                const SizedBox(height: 24),
                Text(
                  'Popular Chants',
                  style: GoogleFonts.merriweather(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                _buildChantItem(
                  title: 'Salve Regina',
                  duration: '3:45',
                  isPlaying: true,
                ).animate(delay: 100.ms).fadeIn().slideX(),
                _buildChantItem(
                  title: 'Pange Lingua',
                  duration: '4:20',
                  isPlaying: false,
                ).animate(delay: 200.ms).fadeIn().slideX(),
                _buildChantItem(
                  title: 'Missa De Angelis',
                  duration: '12:10',
                  isPlaying: false,
                ).animate(delay: 300.ms).fadeIn().slideX(),
                _buildChantItem(
                  title: 'Kyrie Eleison',
                  duration: '2:30',
                  isPlaying: false,
                ).animate(delay: 400.ms).fadeIn().slideX(),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNowPlayingCard() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(LucideIcons.music, size: 48, color: AppTheme.gold500),
          const SizedBox(height: 16),
          Text(
            'Salve Regina',
            style: GoogleFonts.merriweather(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            'Solemn Tone',
            style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.skipBack, color: Colors.white),
                onPressed: () {},
              ),
              const SizedBox(width: 16),
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.gold500,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.gold500.withValues(alpha: 0.4),
                      blurRadius: 16,
                    ),
                  ],
                ),
                child: const Icon(LucideIcons.play, color: Colors.black),
              ),
              const SizedBox(width: 16),
              IconButton(
                icon: const Icon(LucideIcons.skipForward, color: Colors.white),
                onPressed: () {},
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChantItem({
    required String title,
    required String duration,
    required bool isPlaying,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isPlaying
            ? AppTheme.gold500.withValues(alpha: 0.1)
            : Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isPlaying
              ? AppTheme.gold500.withValues(alpha: 0.3)
              : Colors.white.withValues(alpha: 0.05),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isPlaying ? LucideIcons.volume2 : LucideIcons.playCircle,
            color: isPlaying ? AppTheme.gold500 : Colors.white54,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Text(
              title,
              style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: isPlaying ? FontWeight.bold : FontWeight.w500,
                color: isPlaying ? Colors.white : Colors.white70,
              ),
            ),
          ),
          Text(
            duration,
            style: GoogleFonts.inter(fontSize: 14, color: Colors.white38),
          ),
        ],
      ),
    );
  }
}
