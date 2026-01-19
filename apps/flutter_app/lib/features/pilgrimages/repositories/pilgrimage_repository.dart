import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../models/pilgrimage_model.dart';

class PilgrimageRepository {
  final ApiService _apiService;

  PilgrimageRepository(this._apiService);

  Future<List<Pilgrimage>> getPilgrimages() async {
    final response = await _apiService.get('/pilgrimages');
    // Ensure response is a list
    return (response.data as List).map((e) => Pilgrimage.fromJson(e)).toList();
  }

  Future<Pilgrimage> getPilgrimage(String id) async {
    final response = await _apiService.get('/pilgrimages/$id');
    return Pilgrimage.fromJson(response.data);
  }
}

final pilgrimageRepositoryProvider = Provider<PilgrimageRepository>((ref) {
  return PilgrimageRepository(ref.watch(apiServiceProvider));
});
