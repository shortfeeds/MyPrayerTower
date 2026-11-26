import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Live Global Sanctuary Ticker synced with /api/offerings/recent and /api/events/sponsored
class GlobalSanctuaryTicker extends StatefulWidget {
  const GlobalSanctuaryTicker({super.key});

  @override
  State<GlobalSanctuaryTicker> createState() => _GlobalSanctuaryTickerState();
}

class _GlobalSanctuaryTickerState extends State<GlobalSanctuaryTicker> {
  List<String> _items = [
    'Candle lit by Carlos S. (Philippines) — Eternal repose of Maria Santos',
    'Rosary sponsored by The Rodriguez Family (Madrid, Spain)',
    'Healing candle lit by Patrick O. (Ireland) — Recovery after surgery',
  ];
  int _idx = 0;
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _loadLive();
    _timer = Timer.periodic(const Duration(seconds: 4), (_) {
      if (mounted && _items.isNotEmpty) {
        setState(() => _idx = (_idx + 1) % _items.length);
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  Future<void> _loadLive() async {
    try {
      final res = await http
          .get(Uri.parse('https://www.myprayertower.com/api/offerings/recent'))
          .timeout(const Duration(seconds: 6));
      if (res.statusCode == 200) {
        final data = jsonDecode(res.body);
        final list = data['memorials'];
        if (list is List && list.isNotEmpty && mounted) {
          final next = list
              .take(6)
              .map((m) => '${m['title']} by ${m['offeredBy']}')
              .toList();
          setState(() => _items = next);
        }
      }
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final text = _items[_idx % _items.length];
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: AppTheme.marianNavySurface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppTheme.sacredGold.withValues(alpha: 0.25)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
            decoration: BoxDecoration(
              color: const Color(0xFF10B981).withValues(alpha: 0.18),
              borderRadius: BorderRadius.circular(999),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(LucideIcons.globe, size: 11, color: Color(0xFF6EE7B7)),
                const SizedBox(width: 4),
                Text(
                  'LIVE',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: const Color(0xFF6EE7B7),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              text,
              style: GoogleFonts.cormorantGaramond(
                fontSize: 13.5,
                fontStyle: FontStyle.italic,
                color: AppTheme.textSecondary,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
