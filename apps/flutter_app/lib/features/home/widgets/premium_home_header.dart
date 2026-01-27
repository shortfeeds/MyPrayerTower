import 'dart:math';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'dart:ui';
import '../../../core/theme/app_theme.dart';
import '../../auth/providers/auth_provider.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../widgets/perpetual_flame.dart';
import '../../../core/liturgy/liturgy_provider.dart';
import '../widgets/stained_glass_painter.dart';

class PremiumHomeHeader extends ConsumerWidget {
  const PremiumHomeHeader({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Blessed Night';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = ref.watch(authProvider).value;
    final userName = user?.name.split(' ').first ?? 'Pilgrim';

    return SliverAppBar(
      expandedHeight: 500.0, // Increased height for the new card
      collapsedHeight: kToolbarHeight + 10,
      floating: false,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      elevation: 0,
      leadingWidth: 70,
      leading: Padding(
        padding: const EdgeInsets.only(left: 20.0, top: 12.0, bottom: 12.0),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.1),
              width: 1,
            ),
          ),
          child: const AppBarMenuButton(
            iconColor: Colors.white,
            showBackground: false,
          ),
        ),
      ),
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 20.0, top: 12.0, bottom: 12.0),
          child: GestureDetector(
            onTap: () => context.push(user != null ? '/profile' : '/login'),
            child: Container(
              width: 44,
              height: 44,
              padding: const EdgeInsets.all(2),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [
                    AppTheme.gold500,
                    AppTheme.gold500.withValues(alpha: 0.1),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Container(
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppTheme.sacredNavy950,
                ),
                child: ClipOval(
                  child: user?.avatarUrl != null
                      ? Image.network(user!.avatarUrl!, fit: BoxFit.cover)
                      : const Icon(
                          LucideIcons.user,
                          color: Colors.white,
                          size: 20,
                        ),
                ),
              ),
            ),
          ),
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        stretchModes: const [StretchMode.zoomBackground, StretchMode.fadeTitle],
        background: Stack(
          fit: StackFit.expand,
          children: [
            // 1. Dynamic Living Sanctuary Background
            const _LivingSanctuaryBackground(),

            // 2. Content Layer
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(24, 16, 24, 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    // Top Row: Greeting & Flame (Flame preserved top-right context)
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _getGreeting(),
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w400,
                                  color: Colors.white.withValues(alpha: 0.9),
                                  letterSpacing: -0.5,
                                ),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                userName,
                                style: GoogleFonts.playfairDisplay(
                                  fontSize: 32,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                  letterSpacing: -0.5,
                                  height: 1.1,
                                ),
                              ),
                              const SizedBox(height: 12),
                              // Integrated Liturgical Info
                              const _LiturgicalInfoBadge(),
                            ],
                          ),
                        ),
                        const PerpetualFlame(participantCount: 1243),
                      ],
                    ),

                    const Spacer(),

                    // Central: Daily Inspiration Card
                    const _DailyInspirationCard(),

                    const SizedBox(height: 16),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LivingSanctuaryBackground extends ConsumerStatefulWidget {
  const _LivingSanctuaryBackground();

  @override
  ConsumerState<_LivingSanctuaryBackground> createState() =>
      _LivingSanctuaryBackgroundState();
}

class _LivingSanctuaryBackgroundState
    extends ConsumerState<_LivingSanctuaryBackground>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  final Map<int, List<Offset>> _shardPoints = {};
  final Random _random = Random(42); // Seed for consistency

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 20),
    )..repeat(reverse: true);

    _generateShardPoints();
  }

  void _generateShardPoints() {
    // Generate Voronoi-like shard points (simplified for demo)
    for (int i = 0; i < 15; i++) {
      final center = Offset(_random.nextDouble(), _random.nextDouble());
      final points = <Offset>[
        center,
        center +
            Offset(
              _random.nextDouble() * 0.4 - 0.2,
              _random.nextDouble() * 0.4 - 0.2,
            ),
        center +
            Offset(
              _random.nextDouble() * 0.4 - 0.2,
              _random.nextDouble() * 0.4 - 0.2,
            ),
      ];
      _shardPoints[i] = points;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final liturgicalColor = ref.watch(liturgicalColorProvider);

    return Stack(
      fit: StackFit.expand,
      children: [
        // Deep Base
        Container(color: AppTheme.sacredNavy950),

        // Animated Stained Glass
        AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return CustomPaint(
              painter: StainedGlassPainter(
                baseColor: liturgicalColor,
                progress: _controller.value,
                shardPoints: _shardPoints,
              ),
              size: Size.infinite,
            );
          },
        ),

        // Vignette Overlay
        Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
              colors: [
                Colors.black.withValues(alpha: 0.6),
                Colors.transparent,
                Colors.black.withValues(alpha: 0.7),
              ],
              stops: const [0.0, 0.4, 1.0],
            ),
          ),
        ),
      ],
    );
  }
}

class _DailyInspirationCard extends StatelessWidget {
  const _DailyInspirationCard();

  static const List<Map<String, String>> _dailyVerses = [
    {
      'verse': 'I can do all things through Christ who strengthens me.',
      'ref': 'Philippians 4:13',
    },
    {
      'verse': 'The Lord is my shepherd; I shall not want.',
      'ref': 'Psalm 23:1',
    },
    {
      'verse': 'For God so loved the world that He gave His only begotten Son.',
      'ref': 'John 3:16',
    },
    {
      'verse':
          'Trust in the Lord with all your heart, and lean not on your own understanding.',
      'ref': 'Proverbs 3:5',
    },
    {
      'verse': 'The Lord is my light and my salvation; whom shall I fear?',
      'ref': 'Psalm 27:1',
    },
    {
      'verse':
          'Be strong and courageous. Do not be afraid; do not be discouraged.',
      'ref': 'Joshua 1:9',
    },
    {
      'verse':
          'Come to me, all you who are weary and burdened, and I will give you rest.',
      'ref': 'Matthew 11:28',
    },
    {
      'verse': 'For I know the plans I have for you, declares the Lord.',
      'ref': 'Jeremiah 29:11',
    },
    {
      'verse':
          'The name of the Lord is a fortified tower; the righteous run to it and are safe.',
      'ref': 'Proverbs 18:10',
    },
    {
      'verse': 'Cast all your anxiety on Him because He cares for you.',
      'ref': '1 Peter 5:7',
    },
    {
      'verse': 'But those who hope in the Lord will renew their strength.',
      'ref': 'Isaiah 40:31',
    },
    {
      'verse':
          'And we know that in all things God works for the good of those who love Him.',
      'ref': 'Romans 8:28',
    },
    {
      'verse': 'Peace I leave with you; my peace I give you.',
      'ref': 'John 14:27',
    },
    {
      'verse': 'Jesus said to him, "I am the way, the truth, and the life."',
      'ref': 'John 14:6',
    },
  ];

  Map<String, String> _getTodaysVerse() {
    final now = DateTime.now();
    final startOfYear = DateTime(now.year, 1, 1);
    final dayOfYear = now.difference(startOfYear).inDays;
    final verseIndex = dayOfYear % _dailyVerses.length;
    return _dailyVerses[verseIndex];
  }

  @override
  Widget build(BuildContext context) {
    final todaysVerse = _getTodaysVerse();
    final quote = todaysVerse['verse']!;
    final author = todaysVerse['ref']!;

    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.white.withValues(alpha: 0.15),
              width: 1,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.2),
                blurRadius: 16,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(
                    LucideIcons.sparkles,
                    color: AppTheme.gold500,
                    size: 14,
                  ),
                  const SizedBox(width: 8),
                  Text(
                    "VERSE OF THE DAY",
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold500,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                quote,
                style: GoogleFonts.merriweather(
                  fontSize: 16,
                  color: Colors.white,
                  height: 1.5,
                  fontStyle: FontStyle.italic,
                ),
              ),
              const SizedBox(height: 8),
              Align(
                alignment: Alignment.centerRight,
                child: Text(
                  "— $author",
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: Colors.white70,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _LiturgicalInfoBadge extends ConsumerWidget {
  const _LiturgicalInfoBadge();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final seasonName = ref.watch(liturgicalSeasonNameProvider);
    final seasonColor = ref.watch(liturgicalColorProvider);
    final date = DateTime.now();
    final dateStr = "${date.day} ${_getMonthName(date.month)} ${date.year}";

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(LucideIcons.calendar, color: AppTheme.gold400, size: 12),
          const SizedBox(width: 8),
          Text(
            dateStr.toUpperCase(),
            style: GoogleFonts.inter(
              color: Colors.white70,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 0.5,
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 1,
            height: 12,
            color: Colors.white.withValues(alpha: 0.1),
          ),
          const SizedBox(width: 12),
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(
              color: seasonColor,
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: seasonColor.withValues(alpha: 0.4),
                  blurRadius: 4,
                  spreadRadius: 1,
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          Text(
            seasonName.toUpperCase(),
            style: GoogleFonts.inter(
              color: seasonColor,
              fontSize: 10,
              fontWeight: FontWeight.bold,
              letterSpacing: 0.5,
            ),
          ),
        ],
      ),
    );
  }

  String _getMonthName(int month) {
    const months = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    return months[month - 1];
  }
}
