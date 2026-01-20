import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/app_settings_model.dart';

final appSettingsRepositoryProvider = Provider<AppSettingsRepository>((ref) {
  return AppSettingsRepository(ref.watch(supabaseProvider));
});

class AppSettingsRepository {
  final SupabaseClient _supabase;

  AppSettingsRepository(this._supabase);

  /// Fetch global app settings
  Future<AppSettings?> getSettings() async {
    try {
      final data = await _supabase
          .from('AppSettings')
          .select()
          .eq('id', 'app_settings')
          .single();

      return AppSettings.fromJson(data);
    } catch (e) {
      // Return null or default if table missing
      return null;
    }
  }
}
