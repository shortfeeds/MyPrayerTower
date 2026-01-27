import 'package:hive_flutter/hive_flutter.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class PassportStamp {
  final String id;
  final String name;
  final DateTime visitedAt;

  PassportStamp({
    required this.id,
    required this.name,
    required this.visitedAt,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'visitedAt': visitedAt.toIso8601String(),
  };

  factory PassportStamp.fromJson(Map<String, dynamic> json) => PassportStamp(
    id: json['id'],
    name: json['name'],
    visitedAt: DateTime.parse(json['visitedAt']),
  );
}

class PassportService {
  static const String _boxName = 'pilgrim_passport';

  Future<void> init() async {
    await Hive.openBox(_boxName);
  }

  List<PassportStamp> getStamps() {
    final box = Hive.box(_boxName);
    return box.values
        .map((e) => PassportStamp.fromJson(Map<String, dynamic>.from(e)))
        .toList();
  }

  Future<void> addStamp(String id, String name) async {
    final box = Hive.box(_boxName);
    if (box.containsKey(id)) return;

    final stamp = PassportStamp(id: id, name: name, visitedAt: DateTime.now());
    await box.put(id, stamp.toJson());
  }

  Future<void> clearAll() async {
    final box = Hive.box(_boxName);
    await box.clear();
  }
}

final passportServiceProvider = Provider<PassportService>((ref) {
  return PassportService();
});

final passportStampsProvider = FutureProvider<List<PassportStamp>>((ref) async {
  final service = ref.watch(passportServiceProvider);
  return service.getStamps();
});
