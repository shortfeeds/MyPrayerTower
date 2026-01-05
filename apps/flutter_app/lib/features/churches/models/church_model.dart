import 'package:freezed_annotation/freezed_annotation.dart';

part 'church_model.freezed.dart';
part 'church_model.g.dart';

@freezed
class Church with _$Church {
  const factory Church({
    required String id,
    required String name,
    required String slug,
    String? address,
    required String city,
    String? state,
    String? country,
    @JsonKey(name: 'primaryImageUrl') String? imageUrl,
    String? website,
    String? phone,
    @Default('PARISH') String type,
    @Default(false) bool isVerified,
    double? latitude,
    double? longitude,
    Map<String, dynamic>? massSchedule,
    Map<String, dynamic>? confessionSchedule,
  }) = _Church;

  factory Church.fromJson(Map<String, dynamic> json) => _$ChurchFromJson(json);
}
