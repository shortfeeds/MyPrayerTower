import 'package:freezed_annotation/freezed_annotation.dart';

part 'pilgrimage_model.freezed.dart';
part 'pilgrimage_model.g.dart';

@freezed
class Pilgrimage with _$Pilgrimage {
  const factory Pilgrimage({
    required String id,
    required String name,
    required String location,
    required String country,
    required String description,
    required String significance,
    required String imageUrl,
    String? virtualTourUrl,
    @Default(0) int viewCount,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) = _Pilgrimage;

  factory Pilgrimage.fromJson(Map<String, dynamic> json) =>
      _$PilgrimageFromJson(json);
}
