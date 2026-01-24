import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';

/// Enhanced Community Prayer section for homepage
class PrayerWallPreview extends StatelessWidget {
  const PrayerWallPreview({super.key});

  static const List<_PrayerRequest> _mockRequests = [
    _PrayerRequest(
      name: 'Maria S.',
      intention: 'Please pray for my mother\'s surgery tomorrow...',
      category: 'Health',
      prayerCount: 127,
      timeAgo: '2h ago',
    ),
    _PrayerRequest(
      name: 'John P.',
      intention: 'Prayers needed for my job interview this week.',
      category: 'Career',
      prayerCount: 89,
      timeAgo: '4h ago',
    ),
    _PrayerRequest(
      name: 'Anonymous',
      intention: 'Please pray for my marriage and family.',
      category: 'Family',
      prayerCount: 203,
      timeAgo: '1d ago',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.sacredNavy900.withValues(alpha: 0.8),
            AppTheme.sacredNavy900.withValues(alpha: 0.5),
          ],
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.sacredRed.withValues(alpha: 0.3),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [AppTheme.sacredRed, Colors.pink.shade400],
                        ),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        LucideIcons.heartHandshake,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Prayer Wall',
                      style: GoogleFonts.merriweather(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                TextButton(
                  onPressed: () => context.push('/prayer-wall'),
                  child: Row(
                    children: [
                      Text(
                        'View All',
                        style: GoogleFonts.inter(
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        LucideIcons.arrowRight,
                        color: AppTheme.gold500,
                        size: 14,
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Prayer Requests
          ...List.generate(_mockRequests.length, (index) {
            final request = _mockRequests[index];
            return Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 12,
                    vertical: 4,
                  ),
                  child: _PrayerRequestTile(request: request),
                )
                .animate(delay: Duration(milliseconds: 100 * index))
                .fadeIn()
                .slideX(
                  begin: 0.1,
                  curve: Curves.easeOutQuad,
                  duration: 600.ms,
                );
          }),

          // Add Prayer Button
          Padding(
            padding: const EdgeInsets.all(12),
            child: GestureDetector(
              onTap: () {
                HapticFeedback.lightImpact();
                context.push('/prayer-wall');
              },
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      AppTheme.sacredRed.withValues(alpha: 0.2),
                      AppTheme.gold500.withValues(alpha: 0.1),
                    ],
                  ),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(
                    color: AppTheme.sacredRed.withValues(alpha: 0.3),
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(
                      LucideIcons.plus,
                      color: AppTheme.sacredRed,
                      size: 18,
                    ),
                    const SizedBox(width: 8),
                    Text(
                      'Submit Prayer Request',
                      style: GoogleFonts.inter(
                        color: AppTheme.sacredRed,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ).animate().scale(
            delay: 800.ms,
            duration: 400.ms,
            curve: Curves.easeOutBack,
          ),
        ],
      ),
    );
  }
}

class _PrayerRequestTile extends StatefulWidget {
  final _PrayerRequest request;

  const _PrayerRequestTile({required this.request});

  @override
  State<_PrayerRequestTile> createState() => _PrayerRequestTileState();
}

class _PrayerRequestTileState extends State<_PrayerRequestTile> {
  late bool _isPrayed;
  late int _count;

  @override
  void initState() {
    super.initState();
    _isPrayed = false;
    _count = widget.request.prayerCount;
  }

  void _handlePray() {
    if (_isPrayed) return; // Prevent double taps for demo

    HapticFeedback.mediumImpact();
    setState(() {
      _isPrayed = true;
      _count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: AppTheme.gold500.withValues(alpha: 0.2),
                child: Text(
                  widget.request.name[0].toUpperCase(),
                  style: GoogleFonts.inter(
                    color: AppTheme.gold500,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      widget.request.name,
                      style: GoogleFonts.inter(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 13,
                      ),
                    ),
                    Text(
                      '${widget.request.category} • ${widget.request.timeAgo}',
                      style: GoogleFonts.inter(
                        color: AppTheme.textMuted,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),

              // Interactive Pray Button
              GestureDetector(
                onTap: _handlePray,
                child: AnimatedContainer(
                  duration: 300.ms,
                  curve: Curves.easeOutBack,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: _isPrayed
                          ? [Colors.green.shade600, Colors.green.shade400]
                          : [AppTheme.sacredRed, Colors.pink.shade400],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      if (_isPrayed)
                        BoxShadow(
                          color: Colors.green.withValues(alpha: 0.4),
                          blurRadius: 8,
                          spreadRadius: 1,
                        ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // Animate Icon Change
                      Icon(
                            _isPrayed ? LucideIcons.check : LucideIcons.heart,
                            size: 12,
                            color: Colors.white,
                          )
                          .animate(target: _isPrayed ? 1 : 0)
                          .scale(duration: 300.ms, curve: Curves.elasticOut),

                      const SizedBox(width: 4),

                      // Animate Count Change
                      Text(
                            '$_count',
                            style: GoogleFonts.inter(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          )
                          .animate(key: ValueKey(_count))
                          .scale(duration: 200.ms, curve: Curves.easeOutBack),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            '"${widget.request.intention}"',
            style: GoogleFonts.inter(
              color: AppTheme.textSecondary,
              fontSize: 13,
              fontStyle: FontStyle.italic,
              height: 1.4,
            ),
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}

class _PrayerRequest {
  final String name;
  final String intention;
  final String category;
  final int prayerCount;
  final String timeAgo;

  const _PrayerRequest({
    required this.name,
    required this.intention,
    required this.category,
    required this.prayerCount,
    required this.timeAgo,
  });
}
