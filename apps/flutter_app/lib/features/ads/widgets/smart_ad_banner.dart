import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';
import 'package:google_fonts/google_fonts.dart';
import '../models/ad_config.dart';
import '../services/ad_service.dart';
import 'offline_ad_banner.dart';
import 'package:go_router/go_router.dart';

class SmartAdBanner extends ConsumerStatefulWidget {
  final String page;
  final String position;
  final double? height;

  const SmartAdBanner({
    super.key,
    required this.page,
    required this.position,
    this.height,
  });

  @override
  ConsumerState<SmartAdBanner> createState() => _SmartAdBannerState();
}

class _SmartAdBannerState extends ConsumerState<SmartAdBanner> {
  AdConfig? _adConfig;
  BannerAd? _bannerAd;
  bool _isAdLoaded = false;
  bool _isLoading = true;
  bool _hasError = false;

  @override
  void initState() {
    super.initState();
    _loadAdConfig();
  }

  Future<void> _loadAdConfig() async {
    try {
      final adService = ref.read(adServiceProvider);
      final config = await adService.getAdConfig(
        page: widget.page,
        position: widget.position,
      );

      if (mounted) {
        setState(() {
          _adConfig = config;
        });

        if (config?.adSource == AdSource.offline) {
          // Offline ad ready to show
          setState(() {
            _isAdLoaded = true;
            _isLoading = false;
          });
        } else if (kIsWeb) {
          // On Web, AdMob is not supported yet, so show house ad directly
          setState(() {
            _hasError = true; // Signals building the house ad fallback
            _isLoading = false;
          });
        } else {
          // Load Google Ad (AdMob)
          _loadGoogleAd(config);
        }
      }
    } catch (e) {
      debugPrint('Error loading ad config: $e');
      // Silently fail to load ad config, will default to empty/sizedbox or fallback
      if (mounted) {
        setState(() {
          _isLoading = false;
          _hasError = true; // This ensures we show empty container or fallback
        });
      }
    }
  }

  void _loadGoogleAd(AdConfig? config) {
    final adService = ref.read(adServiceProvider);
    _bannerAd = adService.createBannerAd(
      config: config,
      onAdLoaded: () {
        if (mounted) {
          setState(() {
            _isAdLoaded = true;
            _isLoading = false;
            _hasError = false;
          });
        }
      },
      onAdFailed: (error) {
        if (mounted) {
          setState(() {
            _hasError = true;
            _isLoading = false;
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
    if (_isLoading) return const SizedBox.shrink();

    // 1. Render Offline Ad (Priority)
    if (_adConfig != null && _adConfig!.adSource == AdSource.offline) {
      return OfflineAdBanner(adConfig: _adConfig!, height: widget.height);
    }

    // 2. Render Google AdMob
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

    // 3. Render House Ad (Fallback / Error)
    if (_hasError) {
      return _buildHouseAd();
    }

    return const SizedBox.shrink();
  }

  Widget _buildHouseAd() {
    return GestureDetector(
      onTap: () {
        if (mounted) {
          context.push('/light-candle');
        }
      },
      child: Container(
        width: double.infinity,
        height: widget.height ?? 60,
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
      ),
    );
  }
}
