import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class TestimoniesScreen extends StatelessWidget {
  const TestimoniesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: AppTheme.gold500,
        onPressed: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Testimony submission coming soon!')),
          );
        },
        icon: const Icon(LucideIcons.penTool, color: Colors.black),
        label: Text(
          'Share Story',
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
      ),
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
                'Community Voices',
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
                Text(
                  'Stories of Faith',
                  style: GoogleFonts.merriweather(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ).animate().fadeIn().slideY(begin: 0.1, end: 0),
                const SizedBox(height: 8),
                Text(
                  'How MyPrayerTower is touching lives.',
                  style: GoogleFonts.inter(fontSize: 16, color: Colors.white70),
                ).animate().fadeIn().slideY(begin: 0.1, end: 0),
                const SizedBox(height: 24),

                _buildTestimonyCard(
                  author: 'Maria S.',
                  location: 'New York, USA',
                  text:
                      'Lighting a candle for my grandmother brought me so much peace during a difficult time. The app makes me feel connected to the Church.',
                  date: '2 days ago',
                ).animate(delay: 100.ms).fadeIn().slideX(),
                const SizedBox(height: 16),
                _buildTestimonyCard(
                  author: 'John D.',
                  location: 'London, UK',
                  text:
                      'The daily readings and rosary have become my morning ritual. Thank you for this beautiful app!',
                  date: '1 week ago',
                ).animate(delay: 200.ms).fadeIn().slideX(),
                const SizedBox(height: 16),
                _buildTestimonyCard(
                  author: 'Fr. Michael',
                  location: 'Rome, Italy',
                  text:
                      'A wonderful tool for evangelization. I recommend it to all my parishioners.',
                  date: '2 weeks ago',
                  isFeatured: true,
                ).animate(delay: 300.ms).fadeIn().slideX(),
                const SizedBox(height: 16),
                _buildTestimonyCard(
                  author: 'Sarah Jenkins',
                  location: 'Sydney, Australia',
                  text:
                      'I love the prayer groups feature. It helps us stay united in prayer even when we are apart.',
                  date: '1 month ago',
                ).animate(delay: 400.ms).fadeIn().slideX(),

                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTestimonyCard({
    required String author,
    required String location,
    required String text,
    required String date,
    bool isFeatured = false,
  }) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      color: isFeatured ? AppTheme.gold500.withValues(alpha: 0.1) : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: isFeatured
                      ? AppTheme.gold500
                      : Colors.white.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: Text(
                    author[0],
                    style: GoogleFonts.merriweather(
                      fontWeight: FontWeight.bold,
                      color: isFeatured ? Colors.black : Colors.white,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    author,
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  Text(
                    location,
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                    ),
                  ),
                ],
              ),
              const Spacer(),
              if (isFeatured)
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    'Featured',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          Icon(
            LucideIcons.quote,
            size: 24,
            color: isFeatured ? AppTheme.gold500 : Colors.white24,
          ),
          const SizedBox(height: 8),
          Text(
            text,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              height: 1.5,
              fontStyle: FontStyle.italic,
              color: Colors.white.withValues(alpha: 0.9),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            date,
            style: GoogleFonts.inter(fontSize: 12, color: Colors.white38),
          ),
        ],
      ),
    );
  }
}
