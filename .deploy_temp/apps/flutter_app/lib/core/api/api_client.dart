import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../constants/app_constants.dart';
import '../storage/secure_storage.dart';

/// Dio API client provider
final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(
    BaseOptions(
      baseUrl: ApiConstants.baseUrl,
      connectTimeout: const Duration(
        milliseconds: ApiConstants.connectionTimeout,
      ),
      receiveTimeout: const Duration(milliseconds: ApiConstants.receiveTimeout),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ),
  );

  // Add interceptors
  dio.interceptors.add(AuthInterceptor(ref));
  dio.interceptors.add(LogInterceptor(requestBody: true, responseBody: true));

  return dio;
});

/// API Service provider
final apiServiceProvider = Provider<ApiService>((ref) {
  return ApiService(ref.watch(dioProvider));
});

// For backward compatibility or specific use cases
final apiClientProvider = Provider<ApiClient>((ref) {
  return ApiClient(ref.watch(dioProvider));
});

/// Auth Interceptor for adding tokens to requests
class AuthInterceptor extends Interceptor {
  final Ref ref;

  AuthInterceptor(this.ref);

  @override
  void onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    // Get token from secure storage
    final storage = ref.read(secureStorageProvider);
    final token = await storage.getToken();

    if (token != null && token.isNotEmpty) {
      options.headers['Authorization'] = 'Bearer $token';
    }

    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Handle 401 Unauthorized - token expired
    if (err.response?.statusCode == 401) {
      // Try to refresh token
      // For now, just clear the token and redirect to login
      final storage = ref.read(secureStorageProvider);
      await storage.clearToken();
    }

    handler.next(err);
  }
}

/// Main API Service class
class ApiService {
  final Dio _dio;

  ApiService(this._dio);

  /// GET request
  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.get<T>(
      path,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// POST request
  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.post<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// PUT request
  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.put<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// DELETE request
  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.delete<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }

  /// PATCH request
  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) async {
    return _dio.patch<T>(
      path,
      data: data,
      queryParameters: queryParameters,
      options: options,
    );
  }
}

// Wrapper to match previous code expectations if needed, or simply alias ApiService
class ApiClient extends ApiService {
  ApiClient(super.dio);
}

/// API Response wrapper
class ApiResponse<T> {
  final T? data;
  final String? error;
  final bool success;
  final int? statusCode;

  ApiResponse({this.data, this.error, required this.success, this.statusCode});

  factory ApiResponse.success(T data, {int? statusCode}) {
    return ApiResponse(data: data, success: true, statusCode: statusCode);
  }

  factory ApiResponse.error(String message, {int? statusCode}) {
    return ApiResponse(error: message, success: false, statusCode: statusCode);
  }
}

/// Extension for handling Dio responses
extension DioResponseExtension on Response {
  ApiResponse<T> toApiResponse<T>() {
    if (statusCode != null && statusCode! >= 200 && statusCode! < 300) {
      return ApiResponse.success(data as T, statusCode: statusCode);
    } else {
      return ApiResponse.error(
        data?['message'] ?? 'Unknown error',
        statusCode: statusCode,
      );
    }
  }
}
