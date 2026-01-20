import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Native ad that blends with Prayer Wall feed items
class NativeAdCard extends ConsumerStatefulWidget {
  const NativeAdCard({super.key});

  @override
  ConsumerState<NativeAdCard> createState() => _NativeAdCardState();
}

class _NativeAdCardState extends ConsumerState<NativeAdCard> {
  bool _isLoaded = false;
  final bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  void _loadAd() {
    // Simulate ad loading for now
    // In production, use AdService to load native ad
    Future.delayed(const Duration(milliseconds: 500), () {
      if (mounted) {
        setState(() {
          _isLoaded = true;
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_hasError) {
      return const SizedBox.shrink();
    }

    if (!_isLoaded) {
      return const SizedBox.shrink();
    }

    // Native ad styled to match prayer wall cards
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Sponsored label
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  'Sponsored',
                  style: GoogleFonts.inter(fontSize: 10, color: Colors.white54),
                ),
              ),
              const Spacer(),
              Icon(
                LucideIcons.info,
                size: 14,
                color: Colors.white.withValues(alpha: 0.3),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Ad content placeholder (would be filled by native ad)
          Row(
            children: [
              // Ad icon
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Icon(
                  LucideIcons.sparkles,
                  color: AppTheme.gold500,
                  size: 24,
                ),
              ),
              const SizedBox(width: 12),

              // Ad text
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Support Our Mission',
                      style: GoogleFonts.inter(
                        color: Colors.white,
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      'Help us grow the prayer community',
                      style: GoogleFonts.inter(
                        color: Colors.white60,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 12),

          // CTA button
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () {
                // Ad click handling
              },
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: AppTheme.gold500.withValues(alpha: 0.5),
                ),
                foregroundColor: AppTheme.gold500,
              ),
              child: const Text('Learn More'),
            ),
          ),
        ],
      ),
    );
  }
}
