import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/services/scheduled_notification_service.dart';
import '../../../core/services/notification_service.dart';

class NotificationSettingsScreen extends ConsumerStatefulWidget {
  const NotificationSettingsScreen({super.key});

  @override
  ConsumerState<NotificationSettingsScreen> createState() =>
      _NotificationSettingsScreenState();
}

class _NotificationSettingsScreenState
    extends ConsumerState<NotificationSettingsScreen> {
  bool _morningGospel = true;
  bool _saintOfDay = true;
  bool _angelusBells = true;
  bool _divineMercy = true;
  bool _streakReminder = true;
  bool _nightPrayer = true;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadPreferences();
  }

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    if (mounted) {
      setState(() {
        _morningGospel = prefs.getBool('pref_notif_morning') ?? true;
        _saintOfDay = prefs.getBool('pref_notif_saint') ?? true;
        _angelusBells = prefs.getBool('pref_notif_angelus') ?? true;
        _divineMercy = prefs.getBool('pref_notif_mercy') ?? true;
        _streakReminder = prefs.getBool('pref_notif_streak') ?? true;
        _nightPrayer = prefs.getBool('pref_notif_night') ?? true;
        _loading = false;
      });
    }
  }

  Future<void> _toggle(String key, bool value, Function(bool) update) async {
    setState(() {
      update(value);
    });
    final scheduledService = ref.read(scheduledNotificationServiceProvider);
    await scheduledService.setDevotionEnabled(key, value);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: AppTheme.sacredNavy950,
        body: Center(
          child: CircularProgressIndicator(color: AppTheme.gold500),
        ),
      );
    }

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Prayer Reminders',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        elevation: 0,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildInfoBanner(),
          const SizedBox(height: 20),
          _buildSectionHeader('DAILY SACRED CADENCE'),
          _buildToggleTile(
            title: '🌅 Morning Gospel & Readings',
            subtitle: '7:00 AM • Monastic chord chime with daily scripture',
            value: _morningGospel,
            onChanged: (val) => _toggle(
              'pref_notif_morning',
              val,
              (v) => _morningGospel = v,
            ),
          ),
          _buildToggleTile(
            title: '⭐ Saint of the Day',
            subtitle: '8:00 AM • Inspiration & intercessory prayers of the saints',
            value: _saintOfDay,
            onChanged: (val) => _toggle(
              'pref_notif_saint',
              val,
              (v) => _saintOfDay = v,
            ),
          ),
          _buildToggleTile(
            title: '🔔 The Angelus Bells',
            subtitle: '12:00 PM • Authentic Roman Cathedral 3-strike bronze chimes',
            value: _angelusBells,
            onChanged: (val) => _toggle(
              'pref_notif_angelus',
              val,
              (v) => _angelusBells = v,
            ),
          ),
          _buildToggleTile(
            title: '✝️ Hour of Great Mercy',
            subtitle: '3:00 PM • Sacred Solfeggio bell for the Chaplet of Divine Mercy',
            value: _divineMercy,
            onChanged: (val) => _toggle(
              'pref_notif_mercy',
              val,
              (v) => _divineMercy = v,
            ),
          ),
          _buildToggleTile(
            title: '🔥 Daily Devotion Streak',
            subtitle: '6:00 PM • Gentle nudge to sustain your holy habits',
            value: _streakReminder,
            onChanged: (val) => _toggle(
              'pref_notif_streak',
              val,
              (v) => _streakReminder = v,
            ),
          ),
          _buildToggleTile(
            title: '🌙 Night Compline & Examen',
            subtitle: '9:00 PM • Peaceful reflection before the Lord before rest',
            value: _nightPrayer,
            onChanged: (val) => _toggle(
              'pref_notif_night',
              val,
              (v) => _nightPrayer = v,
            ),
          ),
          const SizedBox(height: 24),
          _buildSectionHeader('INSTANT DEVOTIONAL PREVIEWS'),
          _buildTestNotificationTile(
            title: 'Test Angelus Cathedral Bells',
            subtitle: 'Simulate the 12:00 PM Angelus notification',
            icon: LucideIcons.bell,
            onTap: () async {
              final scaffoldMessenger = ScaffoldMessenger.of(context);
              final notif = ref.read(notificationServiceProvider);
              await notif.sendAngelusReminder();
              scaffoldMessenger.showSnackBar(
                const SnackBar(
                  content: Text('🔔 Ringing Roman Cathedral Angelus bells...'),
                  backgroundColor: AppTheme.sacredNavy900,
                ),
              );
            },
          ),
          _buildTestNotificationTile(
            title: 'Test 3:00 PM Divine Mercy Chime',
            subtitle: 'Simulate the Hour of Mercy notification',
            icon: LucideIcons.heartHandshake,
            onTap: () async {
              final scaffoldMessenger = ScaffoldMessenger.of(context);
              final notif = ref.read(notificationServiceProvider);
              await notif.sendDivineMercyReminder();
              scaffoldMessenger.showSnackBar(
                const SnackBar(
                  content: Text('✝️ Firing Divine Mercy Hour reminder...'),
                  backgroundColor: AppTheme.sacredNavy900,
                ),
              );
            },
          ),
          _buildTestNotificationTile(
            title: 'Test Morning Gospel Reminder',
            subtitle: 'Simulate the 7:00 AM Gospel chime & actions',
            icon: LucideIcons.bookOpen,
            onTap: () async {
              final scaffoldMessenger = ScaffoldMessenger.of(context);
              final notif = ref.read(notificationServiceProvider);
              await notif.sendMorningPrayerReminder();
              scaffoldMessenger.showSnackBar(
                const SnackBar(
                  content: Text('🌅 Firing Morning Gospel reminder...'),
                  backgroundColor: AppTheme.sacredNavy900,
                ),
              );
            },
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildInfoBanner() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppTheme.gold500.withOpacity(0.3)),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(LucideIcons.sparkles, color: AppTheme.gold500, size: 24),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Sacred Audio Channels',
                  style: GoogleFonts.merriweather(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.gold500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'All prayer reminders ring with authentic church bells and sacred monastic chimes. Quick action buttons like [🕊️ Pray] and [📖 Read] let you pray directly from your notification bar.',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: Colors.white70,
                    height: 1.4,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, left: 4),
      child: Text(
        title,
        style: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w700,
          color: AppTheme.gold500,
          letterSpacing: 1.1,
        ),
      ),
    );
  }

  Widget _buildToggleTile({
    required String title,
    required String subtitle,
    required bool value,
    required ValueChanged<bool> onChanged,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: SwitchListTile(
        title: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 15,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.inter(fontSize: 12, color: Colors.white60),
        ),
        value: value,
        onChanged: onChanged,
        activeColor: AppTheme.gold500,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      ),
    );
  }

  Widget _buildTestNotificationTile({
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.white.withOpacity(0.06)),
      ),
      child: ListTile(
        leading: Icon(icon, color: AppTheme.gold500, size: 22),
        title: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        subtitle: Text(
          subtitle,
          style: GoogleFonts.inter(fontSize: 12, color: Colors.white60),
        ),
        trailing: const Icon(
          LucideIcons.chevronRight,
          color: Colors.white38,
          size: 18,
        ),
        onTap: onTap,
      ),
    );
  }
}
