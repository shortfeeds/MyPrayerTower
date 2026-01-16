import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/mass_offering_model.dart';

final massOfferingRepositoryProvider = Provider<MassOfferingRepository>((ref) {
  return MassOfferingRepository(ref.watch(supabaseProvider));
});

class MassOfferingRepository {
  final SupabaseClient _supabase;

  MassOfferingRepository(this._supabase);

  /// Create a new Mass Offering
  Future<MassOffering> createOffering(MassOffering offering) async {
    // Remove null values to let DB defaults take over (e.g. createdAt, status)
    // But offering object should ideally have defaults set
    final json = offering.toJson();
    json.removeWhere((key, value) => value == null);

    // If ID is missing, generate one or let DB handle it (but model requires ID)
    // Assuming offering.id is valid

    final data = await _supabase
        .from('MassOffering')
        .insert(json)
        .select()
        .single();

    return MassOffering.fromJson(data);
  }

  /// Get offerings for a user
  Future<List<MassOffering>> getUserOfferings(String userId) async {
    try {
      final data = await _supabase
          .from('MassOffering')
          .select()
          .eq('userId', userId)
          .order('createdAt', ascending: false);

      return (data as List).map((json) => MassOffering.fromJson(json)).toList();
    } catch (e) {
      // Return empty list on error or if table doesn't exist yet
      return [];
    }
  }

  /// Get single offering by Order Number
  Future<MassOffering?> getOfferingByOrderNumber(String orderNumber) async {
    try {
      final data = await _supabase
          .from('MassOffering')
          .select()
          .eq('orderNumber', orderNumber)
          .single();

      return MassOffering.fromJson(data);
    } catch (e) {
      return null;
    }
  }
}
