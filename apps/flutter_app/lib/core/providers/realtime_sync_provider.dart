import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/realtime_sync_service.dart';

/// Provider for RealtimeSyncService
final realtimeSyncServiceProvider = Provider<RealtimeSyncService>((ref) {
  final supabase = Supabase.instance.client;
  final service = RealtimeSyncService(supabase);

  // Clean up when provider is disposed
  ref.onDispose(() {
    service.dispose();
  });

  return service;
});
