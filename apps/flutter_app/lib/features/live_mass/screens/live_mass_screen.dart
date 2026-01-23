import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';

/// Live Mass Streams Screen
class LiveMassScreen extends StatelessWidget {
  const LiveMassScreen({super.key});

  static final List<_MassStream> _streams = [
    _MassStream(
      name: 'EWTN Daily Mass',
      description:
          'Live and recorded Masses from the Eternal Word Television Network',
      url: 'https://www.ewtn.com/tv/watch',
      icon: LucideIcons.tv,
      color: Colors.blue,
    ),
    _MassStream(
      name: 'Vatican Live',
      description: 'Official Vatican YouTube channel with Papal Masses',
      url: 'https://www.youtube.com/vaticanews',
      icon: LucideIcons.church,
      color: Colors.amber,
    ),
    _MassStream(
      name: 'Catholic TV',
      description: 'America\'s Catholic Television Network',
      url: 'https://www.catholictv.org/live',
      icon: LucideIcons.video,
      color: Colors.red,
    ),
    _MassStream(
      name: 'The Catholic Channel',
      description: 'SiriusXM Catholic programming',
      url: 'https://www.siriusxm.com/thecatholicchannel',
      icon: LucideIcons.radio,
      color: Colors.purple,
    ),
    _MassStream(
      name: 'Word on Fire',
      description: 'Bishop Robert Barron\'s ministry',
      url: 'https://www.wordonfire.org/daily-mass/',
      icon: LucideIcons.flame,
      color: Colors.orange,
    ),
    _MassStream(
      name: 'Relevant Radio',
      description: 'Catholic Radio streaming 24/7',
      url: 'https://relevantradio.com/listen/',
      icon: LucideIcons.radio,
      color: Colors.green,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Live Mass & Catholic Media',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.royalPurple900.withValues(alpha: 0.6),
                  AppTheme.sacredNavy900.withValues(alpha: 0.8),
                ],
              ),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Column(
              children: [
                const Icon(
                  LucideIcons.video,
                  size: 48,
                  color: AppTheme.gold400,
                ),
                const SizedBox(height: 12),
                Text(
                  'Watch Mass Live',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Stream daily Mass from trusted Catholic sources around the world.',
                  style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Streams List
          ..._streams.map((stream) => _StreamCard(stream: stream)),

          const SizedBox(height: 80),
        ],
      ),
    );
  }
}

class _MassStream {
  final String name;
  final String description;
  final String url;
  final IconData icon;
  final Color color;

  _MassStream({
    required this.name,
    required this.description,
    required this.url,
    required this.icon,
    required this.color,
  });
}

class _StreamCard extends StatelessWidget {
  final _MassStream stream;

  const _StreamCard({required this.stream});

  Future<void> _launchUrl() async {
    final uri = Uri.parse(stream.url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.inAppWebView);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: stream.color.withValues(alpha: 0.3)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(16),
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: stream.color.withValues(alpha: 0.2),
            shape: BoxShape.circle,
          ),
          child: Icon(stream.icon, color: stream.color, size: 24),
        ),
        title: Text(
          stream.name,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            stream.description,
            style: GoogleFonts.inter(fontSize: 12, color: AppTheme.textMuted),
          ),
        ),
        trailing: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: stream.color.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(LucideIcons.externalLink, color: stream.color, size: 18),
        ),
        onTap: _launchUrl,
      ),
    );
  }
}
