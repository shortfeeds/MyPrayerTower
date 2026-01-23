import 'package:freezed_annotation/freezed_annotation.dart';

part 'ad_config.freezed.dart';
part 'ad_config.g.dart';

enum AdSource {
  @JsonValue('OFFLINE')
  offline,
  @JsonValue('GOOGLE')
  google,
}

@freezed
class AdConfig with _$AdConfig {
  const factory AdConfig({
    required String id,
    @Default(AdSource.offline) AdSource adSource,
    String? imageUrl,
    String? linkUrl,
    String? googleAdUnitId,
    String? androidAdUnitId,
    String? iosAdUnitId,
    String? position,
    @Default(0) int priority,
  }) = _AdConfig;

  factory AdConfig.fromJson(Map<String, dynamic> json) =>
      _$AdConfigFromJson(json);
}
