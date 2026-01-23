import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../models/ad_config.dart';

class AdRepository {
  final Ref ref;

  AdRepository(this.ref);

  Future<AdConfig?> fetchAd({
    required String page,
    required String position,
  }) async {
    try {
      final dio = ref.read(dioProvider);

      // Determine platform
      String platform = 'web';
      if (!kIsWeb) {
        if (Platform.isAndroid) platform = 'android';
        if (Platform.isIOS) platform = 'ios';
      }

      final response = await dio.get(
        '/sponsored',
        queryParameters: {
          'page': page,
          'position': position,
          'platform': platform,
        },
      );

      if (response.statusCode == 200 &&
          response.data != null &&
          response.data['ads'] != null) {
        final List ads = response.data['ads'];
        if (ads.isNotEmpty) {
          return AdConfig.fromJson(ads[0]);
        }
      }
    } catch (e) {
      debugPrint('Error fetching ad for $page-$position: $e');
    }
    return null;
  }

  Future<void> trackImpression(String adId) async {
    try {
      final dio = ref.read(dioProvider);
      await dio.post('/sponsored/$adId/mobile-impression');
    } catch (e) {
      debugPrint('Error tracking impression for $adId: $e');
    }
  }

  Future<void> trackClick(String adId) async {
    try {
      final dio = ref.read(dioProvider);
      await dio.post('/sponsored/$adId/mobile-click');
    } catch (e) {
      debugPrint('Error tracking click for $adId: $e');
    }
  }
}

final adRepositoryProvider = Provider<AdRepository>((ref) {
  return AdRepository(ref);
});
