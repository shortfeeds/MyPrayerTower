import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../providers/testimonies_provider.dart';
import '../models/testimony_model.dart';
import 'share_story_screen.dart'; // Will be created next

class TestimoniesScreen extends ConsumerWidget {
  const TestimoniesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(testimoniesProvider);
    final testimonies = state.filteredTestimonies;

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 24),
        child: FloatingActionButton.extended(
          backgroundColor: AppTheme.gold500,
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (context) => const ShareStoryScreen()),
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
      ),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 140.0,
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
                  shadows: const [Shadow(color: Colors.black45, blurRadius: 4)],
                ),
              ),
              background: Container(
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [AppTheme.sacredNavy900, AppTheme.deepSpace],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                ),
                child: Center(
                  child: Icon(
                    LucideIcons.messageCircle,
                    size: 80,
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),
            ),
          ),

          // Categories
          SliverToBoxAdapter(
            child: SizedBox(
              height: 60,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 12,
                ),
                itemCount: state.categories.length,
                separatorBuilder: (_, __) => const SizedBox(width: 8),
                itemBuilder: (context, index) {
                  final category = state.categories[index];
                  final isSelected = category == state.selectedCategory;
                  return ChoiceChip(
                    label: Text(category),
                    selected: isSelected,
                    onSelected: (selected) {
                      if (selected) {
                        ref
                            .read(testimoniesProvider.notifier)
                            .selectCategory(category);
                      }
                    },
                    selectedColor: AppTheme.gold500,
                    backgroundColor: AppTheme.sacredNavy800,
                    labelStyle: TextStyle(
                      color: isSelected ? Colors.black : Colors.white70,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected ? AppTheme.gold500 : Colors.white12,
                      ),
                    ),
                  );
                },
              ),
            ),
          ),

          if (testimonies.isEmpty)
            SliverFillRemaining(
              child: Center(
                child: Text(
                  'No stories found in this category.',
                  style: GoogleFonts.inter(color: Colors.white54),
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.all(16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate((context, index) {
                  final testimony = testimonies[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 16),
                    child: _TestimonyCard(
                      testimony: testimony,
                    ).animate(delay: (100 * index).ms).fadeIn().slideX(),
                  );
                }, childCount: testimonies.length),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
    );
  }
}

class _TestimonyCard extends ConsumerWidget {
  final Testimony testimony;

  const _TestimonyCard({required this.testimony});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      color: testimony.isFeatured
          ? AppTheme.gold500.withValues(alpha: 0.05)
          : null,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 20,
                backgroundColor: testimony.isFeatured
                    ? AppTheme.gold500
                    : Colors.white.withValues(alpha: 0.1),
                backgroundImage: testimony.avatarUrl != null
                    ? CachedNetworkImageProvider(testimony.avatarUrl!)
                    : null,
                child: testimony.avatarUrl == null
                    ? Text(
                        testimony.author[0],
                        style: GoogleFonts.merriweather(
                          fontWeight: FontWeight.bold,
                          color: testimony.isFeatured
                              ? Colors.black
                              : Colors.white,
                        ),
                      )
                    : null,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      testimony.author,
                      style: GoogleFonts.outfit(
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                        fontSize: 16,
                      ),
                    ),
                    Text(
                      testimony.location,
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: Colors.white54,
                      ),
                    ),
                  ],
                ),
              ),
              if (testimony.isFeatured)
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
          Stack(
            children: [
              Positioned(
                left: 0,
                top: 0,
                child: Icon(
                  LucideIcons.quote,
                  size: 24,
                  color: testimony.isFeatured
                      ? AppTheme.gold500.withValues(alpha: 0.5)
                      : Colors.white12,
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(left: 32, top: 4),
                child: Text(
                  testimony.content,
                  style: GoogleFonts.merriweather(
                    fontSize: 15,
                    height: 1.6,
                    fontStyle: FontStyle.italic,
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white10),
          const SizedBox(height: 8),
          Row(
            children: [
              _ReactionButton(
                icon: LucideIcons.heart,
                label: 'Amen',
                count: testimony.amenCount,
                isActive: testimony.isLiked,
                onTap: () {
                  ref
                      .read(testimoniesProvider.notifier)
                      .toggleAmen(testimony.id);
                },
              ),
              const Spacer(),
              _InfoTag(icon: LucideIcons.tag, label: testimony.category),
              const SizedBox(width: 12),
              _InfoTag(
                icon: LucideIcons.clock,
                label: _formatDate(testimony.date),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatDate(DateTime date) {
    final diff = DateTime.now().difference(date);
    if (diff.inDays > 30) {
      return '${(diff.inDays / 30).floor()}mo ago';
    } else if (diff.inDays > 0) {
      return '${diff.inDays}d ago';
    } else {
      return 'Today';
    }
  }
}

class _ReactionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final int count;
  final bool isActive;
  final VoidCallback onTap;

  const _ReactionButton({
    required this.icon,
    required this.label,
    required this.count,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.gold500.withValues(alpha: 0.2)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isActive ? AppTheme.gold500 : Colors.white10,
          ),
        ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 16,
              color: isActive ? AppTheme.gold500 : Colors.white54,
            ),
            const SizedBox(width: 6),
            Text(
              '$count $label',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                color: isActive ? AppTheme.gold500 : Colors.white54,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _InfoTag extends StatelessWidget {
  final IconData icon;
  final String label;

  const _InfoTag({required this.icon, required this.label});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 12, color: Colors.white38),
        const SizedBox(width: 4),
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 12, color: Colors.white38),
        ),
      ],
    );
  }
}
