import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/l10n/app_localizations.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/post_prayer_offering_sheet.dart';

class _IntentionOption {
  final String id;
  final String label;
  final String emoji;
  final String verse;
  final String prayer;
  final String route;

  const _IntentionOption({
    required this.id,
    required this.label,
    required this.emoji,
    required this.verse,
    required this.prayer,
    required this.route,
  });
}

const _intentions = [
  _IntentionOption(
    id: 'healing',
    label: 'Healing',
    emoji: '🕊️',
    verse: '"He heals the brokenhearted and binds up their wounds." — Ps 147:3',
    prayer: 'Lord Jesus, Physician of soul and body, pour Your healing grace upon this intention.',
    route: '/prayers',
  ),
  _IntentionOption(
    id: 'family',
    label: 'Family',
    emoji: '🏡',
    verse: '"As for me and my household, we will serve the Lord." — Josh 24:15',
    prayer: 'Holy Family of Nazareth, watch over our home with peace and unity.',
    route: '/prayers',
  ),
  _IntentionOption(
    id: 'peace',
    label: 'Peace',
    emoji: '🌿',
    verse: '"Peace I leave with you; my peace I give to you." — Jn 14:27',
    prayer: 'Prince of Peace, quiet my anxious heart and anchor my soul in Your trust.',
    route: '/prayers',
  ),
  _IntentionOption(
    id: 'deceased',
    label: 'Deceased',
    emoji: '🕯️',
    verse: '"Eternal rest grant unto them, O Lord, and let perpetual light shine."',
    prayer: 'Merciful Father, welcome our faithful departed into Your eternal light.',
    route: '/memorials',
  ),
  _IntentionOption(
    id: 'thanks',
    label: 'Thanks',
    emoji: '✨',
    verse: '"Give thanks to the Lord, for He is good." — Ps 107:1',
    prayer: 'Thank You, Father, for every blessing seen and unseen in our lives.',
    route: '/prayers',
  ),
  _IntentionOption(
    id: 'guidance',
    label: 'Guidance',
    emoji: '🧭',
    verse: '"He will make straight your paths." — Prov 3:6',
    prayer: 'Come, Holy Spirit, illuminate my path and grant wisdom for every step.',
    route: '/prayers',
  ),
];

/// Option 2: Marian Midnight & Gold Sanctuary Hero + Interactive Intention Selector
class SanctuaryHeroCard extends ConsumerStatefulWidget {
  const SanctuaryHeroCard({super.key});

  @override
  ConsumerState<SanctuaryHeroCard> createState() => _SanctuaryHeroCardState();
}

class _SanctuaryHeroCardState extends ConsumerState<SanctuaryHeroCard> {
  String _selectedId = 'healing';
  bool _prayed = false;
  String _candlesCount = '12,847';
  String? _remoteHeroTitle;
  String? _remoteHeroSub;

  @override
  void initState() {
    super.initState();
    _syncFrontendConfig();
  }

  Future<void> _syncFrontendConfig() async {
    try {
      final res = await http
          .get(Uri.parse('https://www.myprayertower.com/api/frontend-config'))
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final cfg = data['config'];
        if (cfg != null && mounted) {
          setState(() {
            _candlesCount = cfg['candlesBurningCount'] ?? _candlesCount;
            _remoteHeroTitle = cfg['heroTitle'];
            _remoteHeroSub = cfg['heroSubtitle'];
          });
        }
      }
    } catch (_) {}
  }

  _IntentionOption get _active =>
      _intentions.firstWhere((e) => e.id == _selectedId, orElse: () => _intentions.first);

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(localeProvider).languageCode;
    final heroTitle = (lang == 'en' && _remoteHeroTitle != null)
        ? _remoteHeroTitle!
        : AppStrings.tr(lang, 'hero_title');
    final heroSub = (lang == 'en' && _remoteHeroSub != null)
        ? _remoteHeroSub!
        : AppStrings.tr(lang, 'hero_sub');
    return Column(
      children: [
        // Marian Midnight Hero Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            gradient: const LinearGradient(
              colors: [Color(0xFF172844), Color(0xFF090E18)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            border: Border.all(
              color: AppTheme.sacredGold.withValues(alpha: 0.4),
              width: 1.2,
            ),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.45),
                blurRadius: 24,
                offset: const Offset(0, 10),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(LucideIcons.flame, size: 14, color: AppTheme.goldLight),
                  const SizedBox(width: 6),
                  Text(
                    'PERPETUAL MARIAN VIGIL · $_candlesCount CANDLES',
                    style: GoogleFonts.inter(
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1.1,
                      color: AppTheme.goldLight,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                heroTitle,
                style: GoogleFonts.cinzel(
                  fontSize: 21,
                  fontWeight: FontWeight.w700,
                  height: 1.2,
                  color: AppTheme.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                heroSub,
                style: GoogleFonts.cormorantGaramond(
                  fontSize: 15,
                  fontStyle: FontStyle.italic,
                  color: AppTheme.textSecondary,
                ),
              ),
              const SizedBox(height: 16),
              // Primary Golden CTA
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    context.push('/candles');
                  },
                  icon: const Icon(LucideIcons.flame, size: 18),
                  label: Text(
                    AppStrings.tr(lang, 'light_candle'),
                    style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 13.5),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.sacredGold,
                    foregroundColor: const Color(0xFF090E18),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    elevation: 0,
                  ),
                ),
              ),
              const SizedBox(height: 10),
              // Secondary Crimson / Navy Mass CTA
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  onPressed: () {
                    HapticFeedback.lightImpact();
                    context.push('/mass-offering');
                  },
                  icon: const Icon(LucideIcons.church, size: 17, color: AppTheme.goldLight),
                  label: Text(
                    AppStrings.tr(lang, 'request_mass'),
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  style: OutlinedButton.styleFrom(
                    backgroundColor: const Color(0xFF1D2A45),
                    side: const BorderSide(color: AppTheme.sacredGold, width: 1),
                    padding: const EdgeInsets.symmetric(vertical: 13),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),

        // Interactive 6-Intention Selector
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppTheme.marianNavySurface,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.25)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.tr(lang, 'whats_on_heart'),
                style: GoogleFonts.cinzel(
                  fontSize: 11.5,
                  fontWeight: FontWeight.w700,
                  letterSpacing: 1.0,
                  color: AppTheme.goldLight,
                ),
              ),
              const SizedBox(height: 12),
              GridView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 3,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                  childAspectRatio: 1.9,
                ),
                itemCount: _intentions.length,
                itemBuilder: (context, idx) {
                  final item = _intentions[idx];
                  final selected = item.id == _selectedId;
                  return InkWell(
                    onTap: () {
                      HapticFeedback.selectionClick();
                      setState(() {
                        _selectedId = item.id;
                        _prayed = false;
                      });
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      decoration: BoxDecoration(
                        color: selected
                            ? AppTheme.sacredGold.withValues(alpha: 0.2)
                            : AppTheme.marianNavyBase,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: selected
                              ? AppTheme.sacredGold
                              : AppTheme.textSecondary.withValues(alpha: 0.2),
                        ),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        '${item.emoji} ${item.label}',
                        style: GoogleFonts.inter(
                          fontSize: 11.5,
                          fontWeight: FontWeight.w600,
                          color: selected ? AppTheme.textPrimary : AppTheme.textSecondary,
                        ),
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.midnightNocturne,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.2)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _active.verse,
                      style: GoogleFonts.cormorantGaramond(
                        fontSize: 14.5,
                        fontStyle: FontStyle.italic,
                        color: AppTheme.goldLight,
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      _active.prayer,
                      style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      children: [
                        Expanded(
                          child: ElevatedButton(
                            onPressed: () {
                              HapticFeedback.mediumImpact();
                              setState(() => _prayed = true);
                              showPostPrayerOfferingSheet(
                                context,
                                intention: _active.label,
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.sacredGold,
                              foregroundColor: const Color(0xFF090E18),
                              padding: const EdgeInsets.symmetric(vertical: 10),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                            child: Text(
                              _prayed ? AppStrings.tr(lang, 'amen_offered') : AppStrings.tr(lang, 'pray_now'),
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () => context.push(_active.route),
                          style: OutlinedButton.styleFrom(
                            side: BorderSide(color: AppTheme.sacredGold.withValues(alpha: 0.4)),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                          ),
                          child: Text(
                            AppStrings.tr(lang, 'explore'),
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: AppTheme.goldLight,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
