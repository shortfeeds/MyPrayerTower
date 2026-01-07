import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:google_fonts/google_fonts.dart';
import '../services/ad_service.dart';

class SmartAdBanner extends ConsumerStatefulWidget {
  final String page;
  final String position;

  const SmartAdBanner({super.key, required this.page, required this.position});

  @override
  ConsumerState<SmartAdBanner> createState() => _SmartAdBannerState();
}

class _SmartAdBannerState extends ConsumerState<SmartAdBanner> {
  BannerAd? _bannerAd;
  bool _isAdLoaded = false;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _loadAd();
  }

  void _loadAd() {
    final adService = ref.read(adServiceProvider);
    _bannerAd = adService.createBannerAd(
      onAdLoaded: () {
        if (mounted) {
          setState(() {
            _isAdLoaded = true;
            _hasError = false;
          });
        }
      },
      onAdFailed: (error) {
        if (mounted) {
          setState(() {
            _hasError = true;
          });
        }
      },
    );
    _bannerAd?.load();
  }

  @override
  void dispose() {
    _bannerAd?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    if (_isAdLoaded && _bannerAd != null) {
      return Container(
        width: double.infinity,
        height: _bannerAd!.size.height.toDouble(),
        alignment: Alignment.center,
        child: SizedBox(
          width: _bannerAd!.size.width.toDouble(),
          height: _bannerAd!.size.height.toDouble(),
          child: AdWidget(ad: _bannerAd!),
        ),
      );
    }

    if (_hasError) {
      // House Ad (Offline / Fallback Mode)
      return Container(
        width: double.infinity,
        height: 60,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              const Color(0xFF1E293B),
              Colors.amber.withValues(alpha: 0.1),
            ],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.amber.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.amber.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.light_mode,
                color: Colors.amber,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Light a Virtual Candle',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    'Pray for your intentions',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const Icon(
              Icons.arrow_forward_ios,
              color: Colors.white38,
              size: 14,
            ),
          ],
        ),
      );
    }

    // Loading State
    return const SizedBox.shrink();
  }
}
