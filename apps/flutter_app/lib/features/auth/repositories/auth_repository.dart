import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/api/api_client.dart';
import '../../../core/storage/secure_storage.dart';
import '../models/user_model.dart';
import '../../../core/constants/app_constants.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    dio: ref.watch(dioProvider),
    storage: ref.watch(secureStorageProvider),
  );
});

class AuthRepository {
  final Dio _dio;
  final SecureStorage _storage;

  AuthRepository({required Dio dio, required SecureStorage storage})
    : _dio = dio,
      _storage = storage;

  Future<User> login({required String email, required String password}) async {
    try {
      final response = await _dio.post(
        ApiConstants.loginEndpoint,
        data: {'email': email, 'password': password},
      );

      final data = response.data;
      final token = data['token'] as String;
      final userJson = data['user'] as Map<String, dynamic>;

      await _storage.saveToken(token);

      return User.fromJson(userJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<User> register({
    required String name,
    required String email,
    required String password,
  }) async {
    try {
      final response = await _dio.post(
        ApiConstants.registerEndpoint,
        data: {'name': name, 'email': email, 'password': password},
      );

      final data = response.data;
      final token = data['token'] as String;
      final userJson = data['user'] as Map<String, dynamic>;

      await _storage.saveToken(token);

      return User.fromJson(userJson);
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<User?> getCurrentUser() async {
    try {
      final token = await _storage.getToken();
      if (token == null) return null;

      final response = await _dio.get(ApiConstants.userEndpoint);
      return User.fromJson(response.data);
    } on DioException catch (e) {
      // If unauthorized, clear token
      if (e.response?.statusCode == 401) {
        await _storage.clearToken();
        return null;
      }
      throw _handleDioError(e);
    }
  }

  Future<void> logout() async {
    await _storage.clearToken();
  }

  String _handleDioError(DioException error) {
    if (error.response?.data != null &&
        error.response?.data['message'] != null) {
      return error.response?.data['message'];
    }
    return 'An unexpected error occurred. Please try again.';
  }
}
