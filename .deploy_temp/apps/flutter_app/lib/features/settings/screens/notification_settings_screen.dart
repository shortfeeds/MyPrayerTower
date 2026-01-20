import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/streak_service.dart';

/// Notification preferences state
class NotificationPreferences {
  final bool morningPrayer;
  final bool angelus;
  final bool eveningReminder;
  final bool nightPrayer;
  final bool streakReminder;
  final bool weeklyDigest;

  const NotificationPreferences({
    this.morningPrayer = true,
    this.angelus = true,
    this.eveningReminder = true,
    this.nightPrayer = true,
    this.streakReminder = true,
    this.weeklyDigest = true,
  });

  NotificationPreferences copyWith({
    bool? morningPrayer,
    bool? angelus,
    bool? eveningReminder,
    bool? nightPrayer,
    bool? streakReminder,
    bool? weeklyDigest,
  }) {
    return NotificationPreferences(
      morningPrayer: morningPrayer ?? this.morningPrayer,
      angelus: angelus ?? this.angelus,
      eveningReminder: eveningReminder ?? this.eveningReminder,
      nightPrayer: nightPrayer ?? this.nightPrayer,
      streakReminder: streakReminder ?? this.streakReminder,
      weeklyDigest: weeklyDigest ?? this.weeklyDigest,
    );
  }
}

/// Provider for notification preferences
final notificationPreferencesProvider =
    StateNotifierProvider<
      NotificationPreferencesNotifier,
      NotificationPreferences
    >(
      (ref) =>
          NotificationPreferencesNotifier(ref.watch(sharedPreferencesProvider)),
    );

class NotificationPreferencesNotifier
    extends StateNotifier<NotificationPreferences> {
  final SharedPreferences _prefs;

  NotificationPreferencesNotifier(this._prefs)
    : super(const NotificationPreferences()) {
    _load();
  }

  void _load() {
    state = NotificationPreferences(
      morningPrayer: _prefs.getBool('notif_morning') ?? true,
      angelus: _prefs.getBool('notif_angelus') ?? true,
      eveningReminder: _prefs.getBool('notif_evening') ?? true,
      nightPrayer: _prefs.getBool('notif_night') ?? true,
      streakReminder: _prefs.getBool('notif_streak') ?? true,
      weeklyDigest: _prefs.getBool('notif_weekly') ?? true,
    );
  }

  Future<void> setMorningPrayer(bool value) async {
    await _prefs.setBool('notif_morning', value);
    state = state.copyWith(morningPrayer: value);
  }

  Future<void> setAngelus(bool value) async {
    await _prefs.setBool('notif_angelus', value);
    state = state.copyWith(angelus: value);
  }

  Future<void> setEveningReminder(bool value) async {
    await _prefs.setBool('notif_evening', value);
    state = state.copyWith(eveningReminder: value);
  }

  Future<void> setNightPrayer(bool value) async {
    await _prefs.setBool('notif_night', value);
    state = state.copyWith(nightPrayer: value);
  }

  Future<void> setStreakReminder(bool value) async {
    await _prefs.setBool('notif_streak', value);
    state = state.copyWith(streakReminder: value);
  }

  Future<void> setWeeklyDigest(bool value) async {
    await _prefs.setBool('notif_weekly', value);
    state = state.copyWith(weeklyDigest: value);
  }
}

class NotificationSettingsScreen extends ConsumerWidget {
  const NotificationSettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final prefs = ref.watch(notificationPreferencesProvider);
    final notifier = ref.read(notificationPreferencesProvider.notifier);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Notifications',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Daily Reminders',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),

            _buildToggle(
              icon: LucideIcons.sunrise,
              title: 'Morning Prayer',
              subtitle: '7:00 AM - Start your day with prayer',
              value: prefs.morningPrayer,
              onChanged: notifier.setMorningPrayer,
            ),
            _buildToggle(
              icon: LucideIcons.bell,
              title: 'Angelus',
              subtitle: '12:00 PM - Midday prayer reminder',
              value: prefs.angelus,
              onChanged: notifier.setAngelus,
            ),
            _buildToggle(
              icon: LucideIcons.sunset,
              title: 'Evening Reminder',
              subtitle: '6:00 PM - Don\'t break your streak!',
              value: prefs.eveningReminder,
              onChanged: notifier.setEveningReminder,
            ),
            _buildToggle(
              icon: LucideIcons.moon,
              title: 'Night Prayer',
              subtitle: '9:00 PM - End your day with Compline',
              value: prefs.nightPrayer,
              onChanged: notifier.setNightPrayer,
            ),

            const SizedBox(height: 32),
            Text(
              'Other Notifications',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),

            _buildToggle(
              icon: LucideIcons.flame,
              title: 'Streak Reminders',
              subtitle: 'Get notified when your streak is at risk',
              value: prefs.streakReminder,
              onChanged: notifier.setStreakReminder,
            ),
            _buildToggle(
              icon: LucideIcons.mail,
              title: 'Weekly Digest',
              subtitle: 'Summary of your prayer activity',
              value: prefs.weeklyDigest,
              onChanged: notifier.setWeeklyDigest,
            ),

            const SizedBox(height: 32),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppTheme.sacredNavy900,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                children: [
                  const Icon(
                    LucideIcons.info,
                    color: AppTheme.textSecondary,
                    size: 20,
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'You can also manage notifications in your device settings.',
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildToggle({
    required IconData icon,
    required String title,
    required String subtitle,
    required bool value,
    required Future<void> Function(bool) onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          Icon(icon, color: AppTheme.gold500, size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  subtitle,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: AppTheme.textSecondary,
                  ),
                ),
              ],
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: AppTheme.gold500,
          ),
        ],
      ),
    );
  }
}
