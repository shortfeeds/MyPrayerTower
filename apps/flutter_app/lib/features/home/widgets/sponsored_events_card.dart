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

/// Displays Tonight's Sponsored Rosary / Novena Event synced with Admin Panel
class SponsoredEventsCard extends ConsumerStatefulWidget {
  const SponsoredEventsCard({super.key});

  @override
  ConsumerState<SponsoredEventsCard> createState() => _SponsoredEventsCardState();
}

class _SponsoredEventsCardState extends ConsumerState<SponsoredEventsCard> {
  String _family = 'The Rodriguez Family';
  String _city = 'Madrid';
  String _country = 'Spain';
  String _dedication = 'In loving memory of Grandma Rosa';
  int _faithfulCount = 2847;
  List<Map<String, dynamic>> _recentSponsors = [];

  @override
  void initState() {
    super.initState();
    _fetchLiveSponsor();
  }

  String _formatSponsorName(String family, String? city, String? country) {
    final loc = [city ?? '', country ?? '']
        .map((s) => s.trim())
        .where((s) => s.isNotEmpty)
        .join(', ');
    return loc.isNotEmpty ? '$family ($loc)' : family;
  }

  Future<void> _fetchLiveSponsor() async {
    try {
      final res = await http
          .get(Uri.parse('https://www.myprayertower.com/api/events/sponsored'))
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final ts = data['config']?['tonightSponsor'];
        final recent = data['config']?['recentSponsors'];
        if (mounted) {
          setState(() {
            if (ts != null) {
              _family = ts['family'] ?? _family;
              _city = ts['city'] ?? '';
              _country = ts['country'] ?? '';
              _dedication = ts['dedication'] ?? _dedication;
              _faithfulCount = ts['faithfulCount'] ?? _faithfulCount;
            }
            if (recent is List) {
              _recentSponsors = recent
                  .whereType<Map>()
                  .map((e) => Map<String, dynamic>.from(e))
                  .toList();
            }
          });
        }
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final lang = ref.watch(localeProvider).languageCode;
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppTheme.marianNavySurface,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: AppTheme.sacredGold.withValues(alpha: 0.35),
          width: 1.2,
        ),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.sacredGold.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.35)),
            ),
            child: Text(
              AppStrings.tr(lang, 'tonight_rosary'),
              style: GoogleFonts.inter(
                fontSize: 9.5,
                fontWeight: FontWeight.w800,
                letterSpacing: 1.0,
                color: AppTheme.goldLight,
              ),
            ),
          ),
          const SizedBox(height: 10),
          Text(
            '✨ ${_formatSponsorName(_family, _city, _country)} ✨',
            style: GoogleFonts.cinzel(
              fontSize: 16,
              fontWeight: FontWeight.w700,
              color: AppTheme.textPrimary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 4),
          Text(
            '"$_dedication"',
            style: GoogleFonts.cormorantGaramond(
              fontSize: 15,
              fontStyle: FontStyle.italic,
              color: AppTheme.textSecondary,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            '$_faithfulCount faithful praying together tonight',
            style: GoogleFonts.inter(fontSize: 11.5, color: AppTheme.textMuted),
          ),
          if (_recentSponsors.isNotEmpty) ...[
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.black.withValues(alpha: 0.22),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(
                  color: AppTheme.sacredGold.withValues(alpha: 0.2),
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'RECENT SPONSORS & OFFERINGS',
                    style: GoogleFonts.inter(
                      fontSize: 9.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.0,
                      color: AppTheme.goldLight,
                    ),
                  ),
                  const SizedBox(height: 8),
                  ..._recentSponsors.take(4).map((sp) {
                    final display = _formatSponsorName(
                      (sp['family'] ?? 'Faithful Family').toString(),
                      sp['city']?.toString(),
                      sp['country']?.toString(),
                    );
                    final pkg = (sp['packageTitle'] ?? 'Event Sponsor').toString();
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Row(
                        children: [
                          const Icon(LucideIcons.sparkles,
                              size: 12, color: AppTheme.goldLight),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              display,
                              style: GoogleFonts.inter(
                                fontSize: 11.5,
                                fontWeight: FontWeight.w600,
                                color: AppTheme.textPrimary,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 6),
                          Text(
                            pkg,
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              color: AppTheme.textMuted,
                            ),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
          const SizedBox(height: 14),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () {
                HapticFeedback.lightImpact();
                _showSponsorOptionsSheet(context);
              },
              icon: const Icon(LucideIcons.crown, size: 16),
              label: Text(
                AppStrings.tr(lang, 'sponsor_tomorrow'),
                style: GoogleFonts.inter(fontWeight: FontWeight.w800, fontSize: 12.5),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.sacredGold,
                foregroundColor: const Color(0xFF090E18),
                padding: const EdgeInsets.symmetric(vertical: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                elevation: 0,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showSponsorOptionsSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.marianNavySurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Sponsor a Sacred Prayer Event',
                style: GoogleFonts.cinzel(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: AppTheme.goldLight,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                'Your family name and dedication will be displayed with reverence during the event.',
                style: GoogleFonts.inter(fontSize: 12.5, color: AppTheme.textSecondary),
              ),
              const SizedBox(height: 16),
              _tierTile(ctx, 'Nightly Rosary Stream', 'Daily · 8:00 PM', '\$25', '/donate'),
              _tierTile(ctx, 'Saint Feast Celebration', 'Per Feast Day', '\$50', '/donate'),
              _tierTile(ctx, 'First Friday Adoration', 'Monthly Vigil', '\$100', '/donate'),
              _tierTile(ctx, '9-Day Novena Series', '9 Consecutive Nights', '\$199', '/donate'),
            ],
          ),
        ),
      ),
    );
  }

  Widget _tierTile(
    BuildContext context,
    String title,
    String subtitle,
    String price,
    String route,
  ) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(
        title,
        style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: AppTheme.textPrimary, fontSize: 14),
      ),
      subtitle: Text(
        subtitle,
        style: GoogleFonts.inter(color: AppTheme.textSecondary, fontSize: 12),
      ),
      trailing: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: AppTheme.sacredGold,
          borderRadius: BorderRadius.circular(999),
        ),
        child: Text(
          price,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w800,
            color: const Color(0xFF090E18),
            fontSize: 12.5,
          ),
        ),
      ),
      onTap: () {
        Navigator.pop(context);
        context.push(route);
      },
    );
  }
}
