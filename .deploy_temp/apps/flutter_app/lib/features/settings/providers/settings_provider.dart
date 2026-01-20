import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SettingsState {
  final double textSizeMultiplier;
  final bool biometricEnabled;

  const SettingsState({
    this.textSizeMultiplier = 1.0,
    this.biometricEnabled = false,
  });

  SettingsState copyWith({double? textSizeMultiplier, bool? biometricEnabled}) {
    return SettingsState(
      textSizeMultiplier: textSizeMultiplier ?? this.textSizeMultiplier,
      biometricEnabled: biometricEnabled ?? this.biometricEnabled,
    );
  }
}

class SettingsNotifier extends StateNotifier<SettingsState> {
  SettingsNotifier() : super(const SettingsState()) {
    _loadSettings();
  }

  Future<void> _loadSettings() async {
    final prefs = await SharedPreferences.getInstance();
    final multiplier = prefs.getDouble('textSizeMultiplier') ?? 1.0;
    final biometric = prefs.getBool('biometricEnabled') ?? false;
    state = state.copyWith(
      textSizeMultiplier: multiplier,
      biometricEnabled: biometric,
    );
  }

  Future<void> setTextSizeMultiplier(double value) async {
    state = state.copyWith(textSizeMultiplier: value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setDouble('textSizeMultiplier', value);
  }

  Future<void> setBiometricEnabled(bool value) async {
    state = state.copyWith(biometricEnabled: value);
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('biometricEnabled', value);
  }
}

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>(
  (ref) {
    return SettingsNotifier();
  },
);
