import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:share_plus/share_plus.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../core/services/analytics_service.dart';
import '../../../core/services/home_widget_sync_service.dart';
import '../../../core/theme/app_theme.dart';

/// 60-Second Morning Sanctuary Routine + Streak + Share
class MorningSanctuaryCard extends StatefulWidget {
  const MorningSanctuaryCard({super.key});

  @override
  State<MorningSanctuaryCard> createState() => _MorningSanctuaryCardState();
}

class _MorningSanctuaryCardState extends State<MorningSanctuaryCard> {
  bool _amenDone = false;
  int _streak = 1;

  @override
  void initState() {
    super.initState();
    _loadStreak();
  }

  Future<void> _loadStreak() async {
    final prefs = await SharedPreferences.getInstance();
    final todayKey = DateTime.now().toIso8601String().substring(0, 10);
    final savedDate = prefs.getString('mpt_morning_amen_date');
    final savedStreak = prefs.getInt('mpt_prayer_streak') ?? 1;
    if (mounted) {
      setState(() {
        _streak = savedStreak;
        _amenDone = savedDate == todayKey;
      });
    }
    HomeWidgetSyncService.syncHomeWidget(streak: savedStreak);
  }

  Future<void> _sealAmen() async {
    if (_amenDone) return;
    HapticFeedback.mediumImpact();
    final prefs = await SharedPreferences.getInstance();
    final todayKey = DateTime.now().toIso8601String().substring(0, 10);
    final next = _streak + 1;
    await prefs.setString('mpt_morning_amen_date', todayKey);
    await prefs.setInt('mpt_prayer_streak', next);
    if (mounted) {
      setState(() {
        _amenDone = true;
        _streak = next;
      });
    }
    AnalyticsService().trackClick('Say Amen & Seal Prayer', category: 'amen');
    HomeWidgetSyncService.syncHomeWidget(streak: next);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF141E36), Color(0xFF0C1324)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.sun, size: 15, color: AppTheme.goldLight),
              const SizedBox(width: 6),
              Text(
                '60-SECOND MORNING SANCTUARY',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.0,
                  color: AppTheme.goldLight,
                ),
              ),
              const Spacer(),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.sacredGold.withValues(alpha: 0.15),
                  borderRadius: BorderRadius.circular(999),
                ),
                child: Text(
                  '🔥 $_streak-Day Streak',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.goldLight,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            '"Lord Jesus Christ, I offer You this day — my prayers, works, joys, and sufferings."',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 16,
              fontStyle: FontStyle.italic,
              color: AppTheme.textPrimary,
              height: 1.35,
            ),
          ),
          const SizedBox(height: 14),
          Row(
            children: [
              Expanded(
                child: ElevatedButton.icon(
                  onPressed: _sealAmen,
                  icon: Icon(
                    _amenDone ? LucideIcons.checkCircle2 : LucideIcons.heart,
                    size: 16,
                  ),
                  label: Text(
                    _amenDone ? 'Amen Sealed Today' : 'Say Amen — Free',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w800,
                      fontSize: 12.5,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _amenDone
                        ? const Color(0xFF10B981).withValues(alpha: 0.25)
                        : AppTheme.sacredGold,
                    foregroundColor:
                        _amenDone ? const Color(0xFF6EE7B7) : const Color(0xFF090E18),
                    padding: const EdgeInsets.symmetric(vertical: 11),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              IconButton(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  AnalyticsService().trackClick('Share Prayer / Intention', category: 'social');
                  Share.share(
                    '🕊️ Daily Morning Offering on MyPrayerTower:\n"Lord Jesus Christ, I offer You this day."\n\n🙏 Pray with me: https://www.myprayertower.com',
                  );
                },
                icon: const Icon(LucideIcons.share2, color: AppTheme.goldLight, size: 18),
                style: IconButton.styleFrom(
                  backgroundColor: Colors.white.withValues(alpha: 0.08),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
