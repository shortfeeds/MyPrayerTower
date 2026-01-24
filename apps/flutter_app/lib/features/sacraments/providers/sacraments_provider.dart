import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/sacrament_record_model.dart';

class SacramentsState {
  final List<SacramentRecord> records;
  final bool isLoading;

  SacramentsState({required this.records, this.isLoading = false});

  SacramentsState copyWith({List<SacramentRecord>? records, bool? isLoading}) {
    return SacramentsState(
      records: records ?? this.records,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  int get completedCount => records.where((r) => r.isCompleted).length;
  double get progress => records.isEmpty ? 0 : completedCount / records.length;
}

final sacramentsProvider =
    StateNotifierProvider<SacramentsController, SacramentsState>((ref) {
      return SacramentsController();
    });

class SacramentsController extends StateNotifier<SacramentsState> {
  SacramentsController() : super(SacramentsState(records: _initialRecords));

  void updateRecord(SacramentRecord updatedRecord) {
    state = state.copyWith(
      records: state.records
          .map((r) => r.id == updatedRecord.id ? updatedRecord : r)
          .toList(),
    );
  }

  // Mock Initial Data (Standard 7 Sacraments)
  static final List<SacramentRecord> _initialRecords = [
    const SacramentRecord(
      id: 'baptism',
      type: SacramentType.baptism,
      name: 'Baptism',
      isCompleted: true,
      date: null, // User to fill
      church: null,
      notes:
          'I was just a baby, but my parents told me it was a beautiful day.',
    ),
    const SacramentRecord(
      id: 'reconciliation',
      type: SacramentType.reconciliation,
      name: 'First Reconciliation',
      isCompleted: true, // Typical for adults
    ),
    const SacramentRecord(
      id: 'communion',
      type: SacramentType.communion,
      name: 'First Holy Communion',
      isCompleted: true,
    ),
    const SacramentRecord(
      id: 'confirmation',
      type: SacramentType.confirmation,
      name: 'Confirmation',
      isCompleted: false, // User might not have done this
    ),
    const SacramentRecord(
      id: 'matrimony',
      type: SacramentType.matrimony,
      name: 'Holy Matrimony',
      isCompleted: false,
    ),
    const SacramentRecord(
      id: 'holyOrders',
      type: SacramentType.holyOrders,
      name: 'Holy Orders',
      isCompleted: false,
    ),
    const SacramentRecord(
      id: 'anointing',
      type: SacramentType.anointing,
      name: 'Anointing of the Sick',
      isCompleted: false,
    ),
  ];
}
