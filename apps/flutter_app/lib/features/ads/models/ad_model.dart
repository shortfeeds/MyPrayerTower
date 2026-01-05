import 'package:freezed_annotation/freezed_annotation.dart';

part 'ad_model.freezed.dart';
part 'ad_model.g.dart';

@freezed
class AdModel with _$AdModel {
  const factory AdModel({
    required String id,
    required String adSource, // 'OFFLINE' or 'GOOGLE'
    String? imageUrl,
    String? linkUrl,
    String? googleAdUnitId,
    String? altText,
    String? position,
  }) = _AdModel;

  factory AdModel.fromJson(Map<String, dynamic> json) =>
      _$AdModelFromJson(json);
}
