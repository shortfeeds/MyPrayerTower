import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/theme/app_theme.dart';
import '../core/services/config_service.dart';
import '../core/services/sacred_audio_service.dart';

class AppDrawer extends ConsumerStatefulWidget {
  const AppDrawer({super.key});

  @override
  ConsumerState<AppDrawer> createState() => _AppDrawerState();
}

class _AppDrawerState extends ConsumerState<AppDrawer> {
  bool _scriptureExpanded = false;

  @override
  Widget build(BuildContext context) {
    final flags = ref.watch(featureFlagsProvider);

    return Drawer(
      backgroundColor: Colors.transparent,
      child: ClipRRect(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
          child: Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  AppTheme.sacredNavy950.withValues(alpha: 0.98),
                  AppTheme.sacredNavy900.withValues(alpha: 0.95),
                ],
              ),
            ),
            child: Column(
              children: [
                _buildHeader(context),
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    children: [
                      // Main Navigation
                      _DrawerSection(
                        title: 'Navigate',
                        children: [
                          _DrawerItem(
                            icon: LucideIcons.home,
                            label: 'Home',
                            onTap: () => _navigate(context, '/'),
                          ),
                          if (isFeatureEnabled(flags, 'prayer_wall_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.heart,
                              label: 'Prayer Wall',
                              onTap: () => _navigate(context, '/prayer-wall'),
                              badge: 'Live',
                              badgeColor: Colors.pink,
                            ),
                          _DrawerItem(
                            icon: LucideIcons.tv,
                            label: 'Live Mass Hub',
                            onTap: () => _navigate(context, '/live-mass'),
                            badge: 'New',
                            badgeColor: Colors.red,
                          ),
                        ],
                      ),

                      // Scripture Section (Expandable)
                      if (isFeatureEnabled(flags, 'bible_enabled') ||
                          isFeatureEnabled(flags, 'daily_readings_enabled'))
                        _DrawerExpandableSection(
                          icon: LucideIcons.bookOpen,
                          title: 'Scripture',
                          isExpanded: _scriptureExpanded,
                          onToggle: () => setState(
                            () => _scriptureExpanded = !_scriptureExpanded,
                          ),
                          children: [
                            if (isFeatureEnabled(flags, 'bible_enabled'))
                              _DrawerSubItem(
                                icon: LucideIcons.book,
                                label: 'Bible',
                                description: 'Holy Scripture',
                                onTap: () => _navigate(context, '/bible'),
                              ),
                            if (isFeatureEnabled(
                              flags,
                              'daily_readings_enabled',
                            ))
                              _DrawerSubItem(
                                icon: LucideIcons.calendar,
                                label: 'Daily Readings',
                                description: 'Mass readings',
                                onTap: () => _navigate(context, '/readings'),
                              ),
                          ],
                        ),

                      // Prayer & Devotion
                      _DrawerSection(
                        title: 'Prayer & Devotion',
                        children: [
                          _DrawerItem(
                            icon: LucideIcons.sparkles,
                            label: 'Prayers',
                            onTap: () => _navigate(context, '/prayers'),
                          ),
                          if (isFeatureEnabled(flags, 'candles_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.flame,
                              label: 'Candles',
                              onTap: () => _navigate(context, '/candles'),
                              isHighlight: true,
                            ),
                          if (isFeatureEnabled(flags, 'rosary_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.circleEllipsis,
                              label: 'Rosary',
                              onTap: () => _navigate(context, '/rosary'),
                            ),
                          if (isFeatureEnabled(
                            flags,
                            'stations_of_cross_enabled',
                          ))
                            _DrawerItem(
                              icon: LucideIcons.cross,
                              label: 'Stations of the Cross',
                              onTap: () => _navigate(context, '/stations'),
                            ),
                          if (isFeatureEnabled(flags, 'novenas_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.calendarDays,
                              label: 'Novenas',
                              onTap: () => _navigate(context, '/novenas'),
                            ),
                        ],
                      ),

                      // Features Section (Directly listed, no "More Features" expandable)
                      _DrawerSection(
                        title: 'Features',
                        children: [
                          if (isFeatureEnabled(flags, 'challenges_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.trophy,
                              label: 'Challenges',
                              onTap: () => _navigate(context, '/challenges'),
                            ),
                          if (isFeatureEnabled(flags, 'catechism_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.book,
                              label: 'Catechism',
                              onTap: () => _navigate(context, '/catechism'),
                            ),
                          if (isFeatureEnabled(flags, 'examen_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.search,
                              label: 'Daily Examen',
                              onTap: () => _navigate(context, '/examen'),
                            ),
                          if (isFeatureEnabled(
                            flags,
                            'confession_guide_enabled',
                          ))
                            _DrawerItem(
                              icon: LucideIcons.shield,
                              label: 'Confession Guide',
                              onTap: () => _navigate(context, '/confession'),
                            ),
                          if (isFeatureEnabled(flags, 'library_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.library,
                              label: 'Library',
                              onTap: () => _navigate(context, '/library'),
                            ),
                          if (isFeatureEnabled(
                            flags,
                            'liturgical_calendar_enabled',
                          ))
                            _DrawerItem(
                              icon: LucideIcons.calendar,
                              label: 'Liturgical Calendar',
                              onTap: () => _navigate(context, '/calendar'),
                            ),
                        ],
                      ),

                      // Giving
                      _DrawerSection(
                        title: 'Giving',
                        children: [
                          if (isFeatureEnabled(
                            flags,
                            'spiritual_bouquets_enabled',
                          ))
                            _DrawerItem(
                              icon: LucideIcons.gift,
                              label: 'Spiritual Bouquets',
                              onTap: () => _navigate(context, '/bouquets'),
                            ),
                          if (isFeatureEnabled(flags, 'donations_enabled'))
                            _DrawerItem(
                              icon: LucideIcons.heart,
                              label: 'Contribute',
                              onTap: () => _navigate(context, '/donate'),
                            ),
                        ],
                      ),

                      const Divider(color: Colors.white12, height: 32),

                      // Sacred Audio Controller
                      const _SacredAudioController(),

                      const Divider(color: Colors.white12, height: 32),

                      // Account Section
                      _DrawerSection(
                        title: 'Account',
                        children: [
                          _DrawerItem(
                            icon: LucideIcons.user,
                            label: 'My Profile',
                            onTap: () => _navigate(context, '/login'),
                          ),
                          _DrawerItem(
                            icon: LucideIcons.settings,
                            label: 'Settings',
                            onTap: () => _navigate(context, '/settings'),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                _buildFooter(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _navigate(BuildContext context, String route) {
    Navigator.pop(context);
    context.go(route);
  }

  Widget _buildHeader(BuildContext context) {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 60, 20, 24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.sacredNavy800,
            AppTheme.sacredNavy900.withValues(alpha: 0.8),
          ],
        ),
        border: const Border(bottom: BorderSide(color: Colors.white12)),
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              gradient: AppTheme.goldGradient,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.gold500.withValues(alpha: 0.3),
                  blurRadius: 12,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: const Center(
              child: Icon(
                LucideIcons.user,
                size: 26,
                color: AppTheme.sacredNavy900,
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Welcome, Friend',
                  style: GoogleFonts.merriweather(
                    color: Colors.white,
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 6),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        AppTheme.gold500.withValues(alpha: 0.2),
                        AppTheme.gold400.withValues(alpha: 0.1),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(
                      color: AppTheme.gold500.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Text(
                    'Free Plan',
                    style: GoogleFonts.inter(
                      color: AppTheme.gold500,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => Navigator.pop(context),
            icon: Icon(
              LucideIcons.x,
              color: Colors.white.withValues(alpha: 0.6),
              size: 22,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy900.withValues(alpha: 0.5),
        border: const Border(top: BorderSide(color: Colors.white12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'FOLLOW US',
            style: GoogleFonts.inter(
              color: Colors.white54,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
          ),
          const SizedBox(height: 12),
          const Row(
            children: [
              _SocialIcon(
                icon: LucideIcons.instagram,
                url: 'https://instagram.com/myprayertower',
              ),
              SizedBox(width: 12),
              _SocialIcon(
                icon: LucideIcons.twitter,
                url: 'https://twitter.com/myprayertower',
              ),
              SizedBox(width: 12),
              _SocialIcon(
                icon: LucideIcons.facebook,
                url: 'https://facebook.com/myprayertower',
              ),
              SizedBox(width: 12),
              _SocialIcon(
                icon: LucideIcons.youtube,
                url: 'https://youtube.com/c/myprayertower',
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            '© 2026 MyPrayerTower • v1.0.0',
            style: GoogleFonts.inter(color: Colors.white38, fontSize: 10),
          ),
        ],
      ),
    );
  }
}

class _DrawerSection extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _DrawerSection({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 8),
          child: Text(
            title.toUpperCase(),
            style: GoogleFonts.inter(
              color: Colors.white38,
              fontSize: 10,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.5,
            ),
          ),
        ),
        ...children,
      ],
    );
  }
}

class _DrawerExpandableSection extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool isExpanded;
  final VoidCallback onToggle;
  final List<Widget> children;

  const _DrawerExpandableSection({
    required this.icon,
    required this.title,
    required this.isExpanded,
    required this.onToggle,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          leading: Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: AppTheme.gold500, size: 18),
          ),
          title: Text(
            title,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 14,
              fontWeight: FontWeight.w500,
            ),
          ),
          trailing: AnimatedRotation(
            turns: isExpanded ? 0.5 : 0,
            duration: const Duration(milliseconds: 200),
            child: const Icon(
              LucideIcons.chevronDown,
              color: Colors.white54,
              size: 18,
            ),
          ),
          onTap: onToggle,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 24,
            vertical: 4,
          ),
        ),
        AnimatedCrossFade(
          firstChild: const SizedBox(width: double.infinity),
          secondChild: Padding(
            padding: const EdgeInsets.only(left: 32),
            child: Column(children: children),
          ),
          crossFadeState: isExpanded
              ? CrossFadeState.showSecond
              : CrossFadeState.showFirst,
          duration: const Duration(milliseconds: 200),
        ),
      ],
    );
  }
}

class _DrawerItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isHighlight;
  final String? badge;
  final Color? badgeColor;

  const _DrawerItem({
    required this.icon,
    required this.label,
    required this.onTap,
    this.isHighlight = false,
    this.badge,
    this.badgeColor,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isHighlight
              ? AppTheme.gold500.withValues(alpha: 0.15)
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(
          icon,
          color: isHighlight ? AppTheme.gold500 : Colors.white70,
          size: 18,
        ),
      ),
      title: Row(
        children: [
          Expanded(
            child: Text(
              label,
              style: GoogleFonts.inter(
                color: isHighlight ? AppTheme.gold500 : Colors.white,
                fontSize: 14,
                fontWeight: isHighlight ? FontWeight.w600 : FontWeight.w500,
              ),
            ),
          ),
          if (badge != null)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
              decoration: BoxDecoration(
                color: (badgeColor ?? Colors.grey).withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(6),
                border: Border.all(
                  color: (badgeColor ?? Colors.grey).withValues(alpha: 0.3),
                ),
              ),
              child: Text(
                badge!,
                style: GoogleFonts.inter(
                  fontSize: 9,
                  fontWeight: FontWeight.bold,
                  color: badgeColor ?? Colors.grey,
                ),
              ),
            ),
        ],
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 2),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    );
  }
}

class _DrawerSubItem extends StatelessWidget {
  final IconData icon;
  final String label;
  final String description;
  final VoidCallback onTap;

  const _DrawerSubItem({
    required this.icon,
    required this.label,
    required this.description,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Icon(icon, color: Colors.white54, size: 16),
      title: Text(
        label,
        style: GoogleFonts.inter(
          color: Colors.white.withValues(alpha: 0.9),
          fontSize: 13,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        description,
        style: GoogleFonts.inter(color: Colors.white38, fontSize: 11),
      ),
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 24, vertical: 0),
      dense: true,
    );
  }
}

class _SacredAudioController extends ConsumerWidget {
  const _SacredAudioController();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final audioService = ref.watch(sacredAudioServiceProvider);
    final currentTrack = audioService.currentTrack;
    final isPlaying = audioService.isPlaying;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.music, color: Colors.white54, size: 14),
              const SizedBox(width: 8),
              Text(
                'ATMOSPHERIC AUDIO',
                style: GoogleFonts.inter(
                  color: Colors.white38,
                  fontSize: 10,
                  fontWeight: FontWeight.w600,
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
            ),
            child: Column(
              children: [
                ...sacredTracks.map((track) {
                  final isActive = currentTrack == track.id;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: InkWell(
                      onTap: () => ref
                          .read(sacredAudioServiceProvider)
                          .playTrack(track.url, track.id),
                      borderRadius: BorderRadius.circular(8),
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 8,
                        ),
                        decoration: BoxDecoration(
                          color: isActive
                              ? AppTheme.gold500.withValues(alpha: 0.1)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isActive && isPlaying
                                  ? LucideIcons.pause
                                  : LucideIcons.play,
                              size: 14,
                              color: isActive
                                  ? AppTheme.gold500
                                  : Colors.white70,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                track.title,
                                style: GoogleFonts.inter(
                                  color: isActive
                                      ? AppTheme.gold500
                                      : Colors.white70,
                                  fontSize: 13,
                                  fontWeight: isActive
                                      ? FontWeight.bold
                                      : FontWeight.normal,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
                const Divider(color: Colors.white12, height: 24),
                Row(
                  children: [
                    const Icon(
                      LucideIcons.volume2,
                      color: Colors.white38,
                      size: 14,
                    ),
                    Expanded(
                      child: SliderTheme(
                        data: SliderTheme.of(context).copyWith(
                          trackHeight: 2,
                          thumbShape: const RoundSliderThumbShape(
                            enabledThumbRadius: 6,
                          ),
                          overlayShape: const RoundSliderOverlayShape(
                            overlayRadius: 12,
                          ),
                        ),
                        child: Slider(
                          value: 0.5, // Mock value
                          activeColor: AppTheme.gold500,
                          inactiveColor: Colors.white10,
                          onChanged: (val) => ref
                              .read(sacredAudioServiceProvider)
                              .setVolume(val),
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
    );
  }
}

class _SocialIcon extends StatelessWidget {
  final IconData icon;
  final String url;

  const _SocialIcon({required this.icon, required this.url});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: () async {
        final uri = Uri.parse(url);
        if (await canLaunchUrl(uri)) {
          await launchUrl(uri, mode: LaunchMode.inAppWebView);
        }
      },
      borderRadius: BorderRadius.circular(10),
      child: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: Colors.white.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: Colors.white70, size: 18),
      ),
    );
  }
}
