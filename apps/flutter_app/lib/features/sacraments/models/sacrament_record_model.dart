import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';

enum SacramentType {
  baptism,
  communion,
  confirmation,
  reconciliation,
  anointing,
  matrimony,
  holyOrders,
}

class SacramentRecord {
  final String id;
  final SacramentType type;
  final String name;
  final bool isCompleted;
  final DateTime? date;
  final String? church;
  final String? city;
  final String? celebrant; // Priest/Bishop
  final List<String>? godparents;
  final List<String>? witnesses; // Specific to Matrimony
  final String? confirmationName;
  final String? spouseName;
  final String? notes;

  const SacramentRecord({
    required this.id,
    required this.type,
    required this.name,
    this.isCompleted = false,
    this.date,
    this.church,
    this.city,
    this.celebrant,
    this.godparents,
    this.witnesses,
    this.confirmationName,
    this.spouseName,
    this.notes,
  });

  SacramentRecord copyWith({
    String? id,
    SacramentType? type,
    String? name,
    bool? isCompleted,
    DateTime? date,
    String? church,
    String? city,
    String? celebrant,
    List<String>? godparents,
    List<String>? witnesses,
    String? confirmationName,
    String? spouseName,
    String? notes,
  }) {
    return SacramentRecord(
      id: id ?? this.id,
      type: type ?? this.type,
      name: name ?? this.name,
      isCompleted: isCompleted ?? this.isCompleted,
      date: date ?? this.date,
      church: church ?? this.church,
      city: city ?? this.city,
      celebrant: celebrant ?? this.celebrant,
      godparents: godparents ?? this.godparents,
      witnesses: witnesses ?? this.witnesses,
      confirmationName: confirmationName ?? this.confirmationName,
      spouseName: spouseName ?? this.spouseName,
      notes: notes ?? this.notes,
    );
  }

  // Helper to get icon
  IconData get icon {
    switch (type) {
      case SacramentType.baptism:
        return LucideIcons.droplets;
      case SacramentType.communion:
        return LucideIcons.utensils; // or specialized host icon
      case SacramentType.confirmation:
        return LucideIcons.flame;
      case SacramentType.reconciliation:
        return LucideIcons.key;
      case SacramentType.anointing:
        return LucideIcons.cross;
      case SacramentType.matrimony:
        return LucideIcons.heartHandshake;
      case SacramentType.holyOrders:
        return LucideIcons.church;
    }
  }

  // Helper to get color
  Color get color {
    switch (type) {
      case SacramentType.baptism:
        return Colors.blue;
      case SacramentType.communion:
        return Colors.amber;
      case SacramentType.confirmation:
        return Colors.red;
      case SacramentType.reconciliation:
        return Colors.purple;
      case SacramentType.anointing:
        return Colors.green;
      case SacramentType.matrimony:
        return Colors.pink;
      case SacramentType.holyOrders:
        return Colors.indigo;
    }
  }
}
