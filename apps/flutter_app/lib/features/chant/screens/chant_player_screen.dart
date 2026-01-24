import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';

import '../../../core/theme/app_theme.dart';
import '../providers/chant_provider.dart';

class ChantPlayerScreen extends ConsumerStatefulWidget {
  const ChantPlayerScreen({super.key});

  @override
  ConsumerState<ChantPlayerScreen> createState() => _ChantPlayerScreenState();
}

class _ChantPlayerScreenState extends ConsumerState<ChantPlayerScreen>
    with SingleTickerProviderStateMixin {
  late TabController _lyricsTabController;
  bool _showLyrics = false;

  @override
  void initState() {
    super.initState();
    _lyricsTabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _lyricsTabController.dispose();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    if (d.inHours > 0) {
      final hours = d.inHours;
      final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
      final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
      return '$hours:$minutes:$seconds';
    }
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    final chantState = ref.watch(chantProvider);
    final chant = chantState.currentChant;

    if (chant == null) return const SizedBox.shrink();

    return Container(
      height: MediaQuery.of(context).size.height * 0.92,
      decoration: const BoxDecoration(
        color: AppTheme.sacredNavy900,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag Handle
          Center(
            child: Container(
              width: 40,
              height: 4,
              margin: const EdgeInsets.symmetric(vertical: 12),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
          ),

          // Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(
                    LucideIcons.chevronDown,
                    color: Colors.white,
                  ),
                  onPressed: () => Navigator.pop(context),
                ),
                Text(
                  'Now Playing',
                  style: GoogleFonts.inter(
                    color: Colors.white70,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1,
                  ),
                ),
                IconButton(
                  icon: const Icon(
                    LucideIcons.moreHorizontal,
                    color: Colors.white,
                  ),
                  onPressed: () {},
                ),
              ],
            ),
          ),

          Expanded(
            child: _showLyrics
                ? _buildLyricsView(chant)
                : _buildCoverView(chant),
          ),

          // Player Controls
          _buildControls(chantState, ref),
        ],
      ),
    );
  }

  Widget _buildCoverView(dynamic chant) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          margin: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(24),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.5),
                blurRadius: 30,
                offset: const Offset(0, 15),
              ),
            ],
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            child: CachedNetworkImage(
              imageUrl: chant.coverUrl,
              fit: BoxFit.cover,
              width: 300,
              height: 300,
              placeholder: (context, url) => Container(color: Colors.white10),
            ),
          ),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Text(
            chant.title,
            textAlign: TextAlign.center,
            style: GoogleFonts.merriweather(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(
          chant.category,
          style: GoogleFonts.inter(fontSize: 16, color: AppTheme.gold500),
        ),
        const SizedBox(height: 24),
        FilledButton.icon(
          onPressed: () => setState(() => _showLyrics = true),
          icon: const Icon(LucideIcons.scrollText, size: 18),
          label: const Text('View Lyrics'),
          style: FilledButton.styleFrom(
            backgroundColor: Colors.white12,
            foregroundColor: Colors.white,
            shape: const StadiumBorder(),
          ),
        ),
      ],
    );
  }

  Widget _buildLyricsView(dynamic chant) {
    return Column(
      children: [
        const SizedBox(height: 16),
        TabBar(
          controller: _lyricsTabController,
          indicatorColor: AppTheme.gold500,
          labelColor: AppTheme.gold500,
          unselectedLabelColor: Colors.white54,
          tabs: const [
            Tab(text: 'LATIN'),
            Tab(text: 'ENGLISH'),
          ],
        ),
        Expanded(
          child: TabBarView(
            controller: _lyricsTabController,
            children: [
              _buildLyricsText(chant.latinLyrics, isLatin: true),
              _buildLyricsText(chant.englishLyrics, isLatin: false),
            ],
          ),
        ),
        TextButton(
          onPressed: () => setState(() => _showLyrics = false),
          child: const Text(
            'Show Artwork',
            style: TextStyle(color: Colors.white54),
          ),
        ),
      ],
    );
  }

  Widget _buildLyricsText(String lyrics, {bool isLatin = false}) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Text(
        lyrics,
        textAlign: TextAlign.center,
        style: isLatin
            ? GoogleFonts.crimsonText(
                fontSize: 22,
                fontStyle: FontStyle.italic,
                color: Colors.white,
                height: 1.6,
              )
            : GoogleFonts.inter(
                fontSize: 18,
                color: Colors.white70,
                height: 1.6,
              ),
      ),
    );
  }

  Widget _buildControls(dynamic state, WidgetRef ref) {
    final notifier = ref.read(chantProvider.notifier);

    return Container(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 40),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Slider
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              trackHeight: 4,
              activeTrackColor: AppTheme.gold500,
              inactiveTrackColor: Colors.white12,
              thumbColor: Colors.white,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
              overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
            ),
            child: Slider(
              value: state.position.inSeconds.toDouble(),
              max: state.duration.inSeconds.toDouble() > 0
                  ? state.duration.inSeconds.toDouble()
                  : 1.0,
              onChanged: (value) {
                notifier.seek(Duration(seconds: value.toInt()));
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatDuration(state.position),
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white54),
                ),
                Text(
                  _formatDuration(state.duration),
                  style: GoogleFonts.inter(fontSize: 12, color: Colors.white54),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.skipBack, color: Colors.white),
                iconSize: 32,
                onPressed: () => notifier.playPrevious(),
              ),
              GestureDetector(
                onTap: () => notifier.togglePlay(),
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppTheme.gold500,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.gold500.withValues(alpha: 0.3),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: state.isLoading
                      ? const CircularProgressIndicator(color: Colors.black)
                      : Icon(
                          state.isPlaying
                              ? LucideIcons.pause
                              : LucideIcons.play,
                          color: Colors.black,
                          size: 32,
                        ),
                ),
              ),
              IconButton(
                icon: const Icon(LucideIcons.skipForward, color: Colors.white),
                iconSize: 32,
                onPressed: () => notifier.playNext(),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
