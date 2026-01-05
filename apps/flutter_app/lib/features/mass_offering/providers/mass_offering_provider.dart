import 'package:flutter_riverpod/flutter_riverpod.dart';

class MassOfferingState {
  final bool isLoading;
  final String? errorMessage; // For submission errors
  final bool isSuccess;

  const MassOfferingState({
    this.isLoading = false,
    this.errorMessage,
    this.isSuccess = false,
  });

  MassOfferingState copyWith({
    bool? isLoading,
    String? errorMessage,
    bool? isSuccess,
  }) {
    return MassOfferingState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage, // Reset if not provided, or logic might vary
      isSuccess: isSuccess ?? this.isSuccess,
    );
  }
}

class MassOfferingNotifier extends StateNotifier<MassOfferingState> {
  MassOfferingNotifier() : super(const MassOfferingState());

  Future<void> submitOffering({
    required String intention,
    required String type,
    required DateTime date,
    required bool hasCandleAddon,
    required bool hasFlowerAddon,
  }) async {
    state = state.copyWith(
      isLoading: true,
      errorMessage: null,
      isSuccess: false,
    );

    try {
      // Simulate API call / Payment processing
      await Future.delayed(const Duration(seconds: 2));

      // In a real app, you'd call a repository here
      // await _repository.submitMassOffering(...);

      state = state.copyWith(isLoading: false, isSuccess: true);
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: 'Failed to process offering. Please try again.',
      );
    }
  }

  void reset() {
    state = const MassOfferingState();
  }
}

final massOfferingProvider =
    StateNotifierProvider<MassOfferingNotifier, MassOfferingState>((ref) {
      return MassOfferingNotifier();
    });
