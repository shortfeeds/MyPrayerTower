import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../models/church_model.dart';

class ChurchRepository {
  final ApiService _apiService;

  ChurchRepository(this._apiService);

  Future<List<Church>> findNearby(
    double lat,
    double lng, {
    double radius = 25,
  }) async {
    final response = await _apiService.get(
      '/churches/nearby',
      queryParameters: {'lat': lat, 'lng': lng, 'radius': radius},
    );
    return (response.data as List).map((e) => Church.fromJson(e)).toList();
  }

  Future<List<Church>> search({String? query, String? city}) async {
    final response = await _apiService.get(
      '/churches',
      queryParameters: {
        if (query != null) 'search': query,
        if (city != null) 'city': city,
      },
    );
    return (response.data['data'] as List)
        .map((e) => Church.fromJson(e))
        .toList();
  }
}

final churchRepositoryProvider = Provider<ChurchRepository>((ref) {
  return ChurchRepository(ref.watch(apiServiceProvider));
});
