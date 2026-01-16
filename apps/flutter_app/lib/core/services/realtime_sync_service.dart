import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

/// Real-time sync service using industry standard patterns:
/// - Periodic background sync (5-minute intervals) to avoid battery drain
/// - Manual pull-to-refresh on all screens
/// - Optimized for performance and battery life
class RealtimeSyncService {
  final SupabaseClient _client;
  Timer? _syncTimer;
  final List<RealtimeChannel> _channels = [];

  // Callbacks for data updates
  Function()? onCandlesUpdated;
  Function()? onPrayerWallUpdated;
  Function()? onMemorialsUpdated;
  Function()? onDonationsUpdated;

  RealtimeSyncService(this._client);

  /// Start periodic background sync (5-minute intervals)
  /// This is the industry standard approach for mobile apps
  void startPeriodicSync() {
    // Initial sync
    _syncAll();

    // Set up periodic sync every 5 minutes
    _syncTimer = Timer.periodic(const Duration(minutes: 5), (_) {
      _syncAll();
    });

    debugPrint(
      '✅ RealtimeSyncService: Periodic sync started (5-min intervals)',
    );
  }

  /// Perform a full sync of all tables
  Future<void> _syncAll() async {
    try {
      // Just trigger the callbacks to refresh data from Supabase
      // The repositories will fetch fresh data
      onCandlesUpdated?.call();
      onPrayerWallUpdated?.call();
      onMemorialsUpdated?.call();
      onDonationsUpdated?.call();

      debugPrint('🔄 Background sync completed');
    } catch (e) {
      debugPrint('⚠️ Background sync error: $e');
    }
  }

  /// Manual sync for pull-to-refresh
  Future<void> manualSync() async {
    debugPrint('🔄 Manual sync triggered');
    await _syncAll();
  }

  /// Subscribe to real-time updates for candles (instant updates)
  /// Only use for critical data that needs immediate visibility
  void subscribeToCandles() {
    final channel = _client
        .channel('candles_realtime')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'candles',
          callback: (payload) {
            debugPrint('🕯️ Candle update: ${payload.eventType}');
            onCandlesUpdated?.call();
          },
        )
        .subscribe();

    _channels.add(channel);
    debugPrint('✅ Subscribed to candles real-time updates');
  }

  /// Subscribe to real-time updates for prayer wall
  void subscribeToPrayerWall() {
    final channel = _client
        .channel('prayer_wall_realtime')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'prayer_requests',
          callback: (payload) {
            debugPrint('🙏 Prayer wall update: ${payload.eventType}');
            onPrayerWallUpdated?.call();
          },
        )
        .subscribe();

    _channels.add(channel);
    debugPrint('✅ Subscribed to prayer wall real-time updates');
  }

  /// Subscribe to real-time updates for memorials
  void subscribeToMemorials() {
    final channel = _client
        .channel('memorials_realtime')
        .onPostgresChanges(
          event: PostgresChangeEvent.all,
          schema: 'public',
          table: 'memorials',
          callback: (payload) {
            debugPrint('🕊️ Memorial update: ${payload.eventType}');
            onMemorialsUpdated?.call();
          },
        )
        .subscribe();

    _channels.add(channel);
    debugPrint('✅ Subscribed to memorials real-time updates');
  }

  /// Subscribe to all real-time channels
  /// Only call this for high-priority data that needs instant updates
  void subscribeToAll() {
    subscribeToCandles();
    subscribeToPrayerWall();
    subscribeToMemorials();
  }

  /// Stop periodic sync and unsubscribe from all channels
  void dispose() {
    _syncTimer?.cancel();
    _syncTimer = null;

    for (var channel in _channels) {
      _client.removeChannel(channel);
    }
    _channels.clear();

    debugPrint('🛑 RealtimeSyncService disposed');
  }
}
