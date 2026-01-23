import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:visibility_detector/visibility_detector.dart';
import '../models/ad_config.dart';
import '../services/ad_service.dart';

class OfflineAdBanner extends ConsumerStatefulWidget {
  final AdConfig adConfig;
  final double? height;

  const OfflineAdBanner({super.key, required this.adConfig, this.height});

  @override
  ConsumerState<OfflineAdBanner> createState() => _OfflineAdBannerState();
}

class _OfflineAdBannerState extends ConsumerState<OfflineAdBanner> {
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
      key: Key('ad-${widget.adConfig.id}'),
      onVisibilityChanged: _onVisibilityChanged,
      child: GestureDetector(
        onTap: _handleTap,
        child: Container(
          height: widget.height ?? 60,
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(8),
            image: DecorationImage(
              image: CachedNetworkImageProvider(widget.adConfig.imageUrl!),
              fit: BoxFit.cover,
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                top: 2,
                right: 2,
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 4,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.6),
                    borderRadius: BorderRadius.circular(4),
                  ),
                  child: const Text(
                    'Sponsored',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                    ),
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
