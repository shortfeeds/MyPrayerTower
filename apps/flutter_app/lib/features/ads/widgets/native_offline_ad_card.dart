import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:visibility_detector/visibility_detector.dart';
import '../../../core/theme/app_theme.dart';
import '../models/ad_config.dart';
import '../services/ad_service.dart';

class NativeOfflineAdCard extends ConsumerStatefulWidget {
  final AdConfig adConfig;

  const NativeOfflineAdCard({super.key, required this.adConfig});

  @override
  ConsumerState<NativeOfflineAdCard> createState() =>
      _NativeOfflineAdCardState();
}

class _NativeOfflineAdCardState extends ConsumerState<NativeOfflineAdCard> {
  bool _impressionTracked = false;

  void _onVisibilityChanged(VisibilityInfo info) {
    if (!_impressionTracked && info.visibleFraction > 0.5) {
      _impressionTracked = true;
      ref.read(adServiceProvider).trackImpression(widget.adConfig.id);
    }
  }

  Future<void> _handleTap() async {
    if (widget.adConfig.linkUrl == null) return;

    ref.read(adServiceProvider).trackClick(widget.adConfig.id);

    final uri = Uri.parse(widget.adConfig.linkUrl!);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.inAppWebView);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (widget.adConfig.imageUrl == null) return const SizedBox.shrink();

    return VisibilityDetector(
      key: Key('native-ad-${widget.adConfig.id}'),
      onVisibilityChanged: _onVisibilityChanged,
      child: GestureDetector(
        onTap: _handleTap,
        child: Container(
          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.1),
                blurRadius: 4,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 8,
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.textSecondary.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        'SPONSORED',
                        style: GoogleFonts.inter(
                          fontSize: 9,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textSecondary,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        widget.adConfig.linkUrl != null
                            ? Uri.parse(widget.adConfig.linkUrl!).host
                            : 'Recommended',
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          color: AppTheme.textSecondary,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                  ],
                ),
              ),
              // Image
              AspectRatio(
                aspectRatio: 1.91, // Standard link image ratio
                child: CachedNetworkImage(
                  imageUrl: widget.adConfig.imageUrl!,
                  fit: BoxFit.cover,
                  placeholder: (context, url) => Container(
                    color: Colors.black12,
                    child: const Center(
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  ),
                  errorWidget: (context, url, error) => const Icon(Icons.error),
                ),
              ),
              // Content (if native assets were available, here we just use what we have)
              if (widget.adConfig.linkUrl != null)
                Padding(
                  padding: const EdgeInsets.all(12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'Learn More',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: AppTheme.gold500,
                        ),
                      ),
                      const Icon(
                        Icons.arrow_forward,
                        size: 14,
                        color: AppTheme.gold500,
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
