import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../providers/prayers_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';

/// Category color configuration matching web app
const Map<String, Map<String, Color>> categoryColors = {
  'marian': {
    'bg': Color(0xFFDBEAFE),
    'text': Color(0xFF1D4ED8),
    'accent': Color(0xFF3B82F6),
  },
  'saints': {
    'bg': Color(0xFFF3E8FF),
    'text': Color(0xFF7C3AED),
    'accent': Color(0xFF8B5CF6),
  },
  'novenas': {
    'bg': Color(0xFFFEF3C7),
    'text': Color(0xFFB45309),
    'accent': Color(0xFFF59E0B),
  },
  'healing': {
    'bg': Color(0xFFD1FAE5),
    'text': Color(0xFF047857),
    'accent': Color(0xFF10B981),
  },
  'litanies': {
    'bg': Color(0xFFFFE4E6),
    'text': Color(0xFFBE123C),
    'accent': Color(0xFFF43F5E),
  },
  'morning': {
    'bg': Color(0xFFFEF9C3),
    'text': Color(0xFFA16207),
    'accent': Color(0xFFEAB308),
  },
  'evening': {
    'bg': Color(0xFFE0E7FF),
    'text': Color(0xFF4338CA),
    'accent': Color(0xFF6366F1),
  },
  'rosary': {
    'bg': Color(0xFFFCE7F3),
    'text': Color(0xFFBE185D),
    'accent': Color(0xFFEC4899),
  },
  'default': {
    'bg': Color(0xFFF3F4F6),
    'text': Color(0xFF374151),
    'accent': Color(0xFF6B7280),
  },
};

Map<String, Color> getCategoryStyle(String? slug) {
  final key = (slug ?? 'default').toLowerCase();
  return categoryColors[key] ?? categoryColors['default']!;
}

class PrayersScreen extends ConsumerWidget {
  const PrayersScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final categoriesAsync = ref.watch(prayerCategoriesFromDbProvider);

    return Scaffold(
      backgroundColor: const Color(
        0xFFFFFBEB,
      ), // Warm amber background like web
      body: CustomScrollView(
        slivers: [
          // Hero Section
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border(bottom: BorderSide(color: Colors.grey.shade200)),
              ),
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    // App Bar Row
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 8,
                      ),
                      child: Row(
                        children: [
                          const AppBarMenuButton(iconColor: Colors.black87),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.search,
                              color: Colors.black87,
                            ),
                            onPressed: () => _showSearchDialog(context, ref),
                          ),
                        ],
                      ),
                    ),
                    // Hero Content
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
                      child: Column(
                        children: [
                          // Badge
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.1),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  LucideIcons.bookOpen,
                                  size: 14,
                                  color: Colors.white70,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Catholic Treasury',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white.withValues(alpha: 0.9),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Title
                          Text.rich(
                            TextSpan(
                              children: [
                                TextSpan(
                                  text: 'Library of ',
                                  style: GoogleFonts.merriweather(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.black87,
                                  ),
                                ),
                                TextSpan(
                                  text: 'Sacred Prayers',
                                  style: GoogleFonts.merriweather(
                                    fontSize: 28,
                                    fontWeight: FontWeight.bold,
                                    foreground: Paint()
                                      ..shader =
                                          const LinearGradient(
                                            colors: [
                                              Color(0xFFD97706),
                                              Color(0xFFEA580C),
                                            ],
                                          ).createShader(
                                            const Rect.fromLTWH(0, 0, 200, 40),
                                          ),
                                  ),
                                ),
                              ],
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            'Explore our comprehensive collection of traditional Catholic prayers, litanies, and novenas.',
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.grey.shade600,
                              height: 1.5,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 20),
                          // Search Bar
                          GestureDetector(
                            onTap: () => _showSearchDialog(context, ref),
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 14,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.grey.shade100,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: Colors.grey.shade200),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    LucideIcons.search,
                                    size: 20,
                                    color: Colors.grey.shade500,
                                  ),
                                  const SizedBox(width: 12),
                                  Text(
                                    'Search prayers, novenas, litanies...',
                                    style: GoogleFonts.inter(
                                      fontSize: 14,
                                      color: Colors.grey.shade500,
                                    ),
                                  ),
                                ],
                              ),
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

          // Suggested for Today Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        LucideIcons.play,
                        size: 18,
                        color: Colors.amber.shade600,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Suggested for Today',
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.black87,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: _SuggestedCard(
                          label: 'MORNING OFFERING',
                          title: 'Act of Consecration',
                          preview: 'O my Queen, O my Mother, I love thee...',
                          duration: '~1 min',
                          gradientColors: const [
                            Color(0xFFFEF3C7),
                            Colors.white,
                          ],
                          accentColor: const Color(0xFFB45309),
                          onTap: () => context.push('/prayers/morning'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: _SuggestedCard(
                          label: 'EVENING PEACE',
                          title: 'Psalm 91',
                          preview:
                              'He who dwells in the shelter of the Most High...',
                          duration: '~3 min',
                          gradientColors: const [
                            Color(0xFFDBEAFE),
                            Colors.white,
                          ],
                          accentColor: const Color(0xFF1D4ED8),
                          onTap: () => context.push('/prayers/evening'),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Prayer Paths Section
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'PRAYER PATHS',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade500,
                      letterSpacing: 1.5,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      _PathChip(
                        icon: LucideIcons.heart,
                        label: 'Healing & Comfort',
                        bgColor: const Color(0xFFD1FAE5),
                        textColor: const Color(0xFF047857),
                        onTap: () => context.push('/prayers/healing'),
                      ),
                      _PathChip(
                        icon: LucideIcons.scroll,
                        label: 'Grief & Loss',
                        bgColor: const Color(0xFFF1F5F9),
                        textColor: const Color(0xFF475569),
                        onTap: () => context.push('/prayers/deceased'),
                      ),
                      _PathChip(
                        icon: LucideIcons.users,
                        label: 'Family Life',
                        bgColor: const Color(0xFFFEF3C7),
                        textColor: const Color(0xFF92400E),
                        onTap: () => context.push('/prayers/family'),
                      ),
                      _PathChip(
                        icon: LucideIcons.star,
                        label: 'Marian Devotion',
                        bgColor: const Color(0xFFDBEAFE),
                        textColor: const Color(0xFF1D4ED8),
                        onTap: () => context.push('/prayers/marian'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 24)),

          // Categories Section Title
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                'ALL CATEGORIES',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey.shade500,
                  letterSpacing: 1.5,
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 12)),

          // Categories Grid
          categoriesAsync.when(
            data: (categories) => SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.4,
                ),
                delegate: SliverChildBuilderDelegate((context, index) {
                  final category = categories[index];
                  final style = getCategoryStyle(category.id);
                  return _CategoryCard(
                    id: category.id,
                    name: category.name,
                    icon: category.icon,
                    count: category.count,
                    bgColor: style['bg']!,
                    textColor: style['text']!,
                    onTap: () => context.push(
                      '/prayers/${category.id}',
                      extra: category.name,
                    ),
                  );
                }, childCount: categories.length),
              ),
            ),
            loading: () => const SliverFillRemaining(
              child: Center(child: CircularProgressIndicator()),
            ),
            error: (err, _) => SliverToBoxAdapter(
              child: Center(
                child: Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    children: [
                      Icon(
                        LucideIcons.alertCircle,
                        color: Colors.red.shade400,
                        size: 48,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Failed to load categories',
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.w600,
                          color: Colors.red.shade700,
                        ),
                      ),
                      const SizedBox(height: 8),
                      TextButton(
                        onPressed: () =>
                            ref.invalidate(prayerCategoriesFromDbProvider),
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  void _showSearchDialog(BuildContext context, WidgetRef ref) {
    showDialog(context: context, builder: (context) => const _SearchDialog());
  }
}

class _SuggestedCard extends StatelessWidget {
  final String label;
  final String title;
  final String preview;
  final String duration;
  final List<Color> gradientColors;
  final Color accentColor;
  final VoidCallback onTap;

  const _SuggestedCard({
    required this.label,
    required this.title,
    required this.preview,
    required this.duration,
    required this.gradientColors,
    required this.accentColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradientColors,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: accentColor.withValues(alpha: 0.2)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 9,
                fontWeight: FontWeight.w700,
                color: accentColor,
                letterSpacing: 1.2,
              ),
            ),
            const SizedBox(height: 6),
            Text(
              title,
              style: GoogleFonts.merriweather(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              preview,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: Colors.grey.shade600,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Icon(LucideIcons.clock, size: 12, color: accentColor),
                const SizedBox(width: 4),
                Text(
                  duration,
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                    color: accentColor,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _PathChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color bgColor;
  final Color textColor;
  final VoidCallback onTap;

  const _PathChip({
    required this.icon,
    required this.label,
    required this.bgColor,
    required this.textColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: textColor.withValues(alpha: 0.2)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: textColor),
            const SizedBox(width: 8),
            Text(
              label,
              style: GoogleFonts.inter(
                fontSize: 13,
                fontWeight: FontWeight.w500,
                color: textColor,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String id;
  final String name;
  final String icon;
  final int count;
  final Color bgColor;
  final Color textColor;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.id,
    required this.name,
    required this.icon,
    required this.count,
    required this.bgColor,
    required this.textColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.04),
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(icon, style: const TextStyle(fontSize: 20)),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '$count',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: textColor,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Text(
              name,
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: Colors.black87,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

class _SearchDialog extends ConsumerStatefulWidget {
  const _SearchDialog();

  @override
  ConsumerState<_SearchDialog> createState() => _SearchDialogState();
}

class _SearchDialogState extends ConsumerState<_SearchDialog> {
  final _controller = TextEditingController();
  String _query = '';

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final searchResults = _query.length >= 2
        ? ref.watch(prayerSearchProvider(_query))
        : const AsyncValue<List<dynamic>>.data([]);

    return Dialog(
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Container(
        width: double.infinity,
        constraints: const BoxConstraints(maxHeight: 500, maxWidth: 400),
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _controller,
                    autofocus: true,
                    decoration: InputDecoration(
                      hintText: 'Search prayers...',
                      prefixIcon: const Icon(LucideIcons.search),
                      filled: true,
                      fillColor: Colors.grey.shade100,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                    ),
                    onChanged: (value) => setState(() => _query = value),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  onPressed: () => Navigator.pop(context),
                  icon: const Icon(LucideIcons.x),
                ),
              ],
            ),
            const SizedBox(height: 16),
            Flexible(
              child: searchResults.when(
                data: (prayers) {
                  if (_query.length < 2) {
                    return Center(
                      child: Text(
                        'Type at least 2 characters to search',
                        style: GoogleFonts.inter(color: Colors.grey),
                      ),
                    );
                  }
                  if (prayers.isEmpty) {
                    return Center(
                      child: Text(
                        'No prayers found',
                        style: GoogleFonts.inter(color: Colors.grey),
                      ),
                    );
                  }
                  return ListView.builder(
                    shrinkWrap: true,
                    itemCount: prayers.length,
                    itemBuilder: (context, index) {
                      final prayer = prayers[index];
                      return ListTile(
                        leading: Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            LucideIcons.bookOpen,
                            size: 18,
                            color: Color(0xFFB45309),
                          ),
                        ),
                        title: Text(
                          prayer.title,
                          style: GoogleFonts.inter(fontWeight: FontWeight.w500),
                        ),
                        subtitle: Text(
                          prayer.categoryLabel,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: Colors.grey,
                          ),
                        ),
                        onTap: () {
                          Navigator.pop(context);
                          context.push('/prayer/${prayer.id}');
                        },
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (_, __) => const Center(child: Text('Search failed')),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
