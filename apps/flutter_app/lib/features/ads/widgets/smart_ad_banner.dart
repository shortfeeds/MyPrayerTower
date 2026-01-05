import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';
import '../models/ad_model.dart';
import '../repositories/ad_repository.dart';

class SmartAdBanner extends ConsumerStatefulWidget {
  final String page;
  final String position;

  const SmartAdBanner({super.key, required this.page, required this.position});

  @override
  ConsumerState<SmartAdBanner> createState() => _SmartAdBannerState();
}

class _SmartAdBannerState extends ConsumerState<SmartAdBanner> {
  BannerAd? _googleBannerAd;
  bool _isGoogleAdLoaded = false;

  @override
  void dispose() {
    _googleBannerAd?.dispose();
    super.dispose();
  }

  void _loadGoogleAd(String adUnitId) {
    _googleBannerAd = BannerAd(
      adUnitId: adUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (_) {
          setState(() {
            _isGoogleAdLoaded = true;
          });
        },
        onAdFailedToLoad: (ad, error) {
          // ad.dispose();
          // print('Ad failed to load: $error');
        },
      ),
    )..load();
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    final adRepo = ref.watch(adRepositoryProvider);

    return FutureBuilder<List<AdModel>>(
      // Fetch ads for this slot
      future: adRepo.getAds(page: widget.page, position: widget.position),
      builder: (context, snapshot) {
        if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return const SizedBox.shrink();
        }

        final ad = snapshot.data!.first;

        // 1. Offline Sponsor Ad
        if (ad.adSource == 'OFFLINE' && ad.imageUrl != null) {
          // Track Impression
          adRepo.trackImpression(ad.id);

          return Container(
            margin: const EdgeInsets.symmetric(vertical: 12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.only(left: 4, bottom: 4),
                  child: Text(
                    'SPONSORED',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textSecondary.withValues(alpha: 0.5),
                      letterSpacing: 1.2,
                    ),
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    if (ad.linkUrl != null) {
                      adRepo.trackClick(ad.id);
                      _launchUrl(ad.linkUrl!);
                    }
                  },
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(12),
                    child: CachedNetworkImage(
                      imageUrl: ad.imageUrl!,
                      width: double.infinity,
                      height: widget.position == 'sidebar'
                          ? 250
                          : 60, // Adjust height
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        color: AppTheme.sacredNavy800,
                        height: 60,
                        child: const Center(
                          child: CircularProgressIndicator(strokeWidth: 2),
                        ),
                      ),
                      errorWidget: (context, url, error) =>
                          const SizedBox.shrink(),
                    ),
                  ),
                ),
              ],
            ),
          );
        }

        // 2. Google Ad (Banner)
        if (ad.adSource == 'GOOGLE' && ad.googleAdUnitId != null) {
          if (_googleBannerAd == null) {
            // Initialize ad only once
            _loadGoogleAd(ad.googleAdUnitId!);
          }

          if (_isGoogleAdLoaded && _googleBannerAd != null) {
            return Container(
              alignment: Alignment.center,
              margin: const EdgeInsets.symmetric(vertical: 12),
              width: _googleBannerAd!.size.width.toDouble(),
              height: _googleBannerAd!.size.height.toDouble(),
              child: AdWidget(ad: _googleBannerAd!),
            );
          }
          // Placeholder while loading or if failed
          return const SizedBox(height: 50); // Min height to prevent jump
        }

        return const SizedBox.shrink();
      },
    );
  }
}
