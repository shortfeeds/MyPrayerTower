import 'package:audioplayers/audioplayers.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class ChantScreen extends StatefulWidget {
  const ChantScreen({super.key});

  @override
  State<ChantScreen> createState() => _ChantScreenState();
}

class _ChantScreenState extends State<ChantScreen> {
  // Playlist data
  final List<Map<String, dynamic>> _chants = [
    {
      'title': 'Salve Regina',
      'duration': '3:45',
      'url': 'https://archive.org/download/gregorianchants/03-SalveRegina.mp3',
      'tone': 'Solemn Tone',
    },
    {
      'title': 'Pange Lingua',
      'duration': '4:20',
      'url': 'https://archive.org/download/gregorianchants/09-PangeLingua.mp3',
      'tone': 'Corpus Christi',
    },
    {
      'title': 'Kyrie (Missa De Angelis)',
      'duration': '2:30',
      'url': 'https://archive.org/download/gregorianchants/01-KyrieXI.mp3',
      'tone': 'Mass VIII',
    },
    {
      'title': 'Asperges Me',
      'duration': '3:10',
      'url': 'https://archive.org/download/gregorianchants/13-AspergesMe.mp3',
      'tone': 'Sprinkling Rite',
    },
  ];

  late AudioPlayer _audioPlayer;
  bool _isPlaying = false;
  Duration _duration = Duration.zero;
  Duration _position = Duration.zero;
  int _currentIndex = 0;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();

    // Listen to state changes
    _audioPlayer.onPlayerStateChanged.listen((state) {
      if (mounted) {
        setState(() {
          _isPlaying = state == PlayerState.playing;
        });
      }
    });

    // Listen to position changes
    _audioPlayer.onPositionChanged.listen((newPosition) {
      if (mounted) {
        setState(() => _position = newPosition);
      }
    });

    // Listen to duration changes
    _audioPlayer.onDurationChanged.listen((newDuration) {
      if (mounted) {
        setState(() => _duration = newDuration);
      }
    });

    // Listen to completion
    _audioPlayer.onPlayerComplete.listen((event) {
      _playNext();
    });

    // Init first track but don't play automatically
    _setSource(0, autoPlay: false);
  }

  Future<void> _setSource(int index, {bool autoPlay = true}) async {
    try {
      if (mounted) setState(() => _isLoading = true);
      await _audioPlayer.setSourceUrl(_chants[index]['url']);
      if (mounted) {
        setState(() {
          _currentIndex = index;
          _position = Duration.zero;
        });
      }
      if (autoPlay) {
        await _audioPlayer.resume();
      } else {
        setState(() => _isLoading = false);
      }
    } catch (e) {
      if (mounted) {
        setState(() => _isLoading = false);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              e.toString().contains('WebAudioError')
                  ? 'Audio temporarily unavailable. Please try again later.'
                  : 'Error loading audio. Please check your connection.',
            ),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _togglePlay() async {
    if (_isPlaying) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.resume();
    }
  }

  void _playNext() {
    int nextIndex = (_currentIndex + 1) % _chants.length;
    _setSource(nextIndex);
  }

  void _playPrevious() {
    int prevIndex = (_currentIndex - 1);
    if (prevIndex < 0) prevIndex = _chants.length - 1;
    _setSource(prevIndex);
  }

  void _playTrack(int index) {
    if (_currentIndex == index && _isPlaying) {
      _togglePlay(); // Pause if same track
    } else {
      _setSource(index);
    }
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes.remainder(60).toString().padLeft(2, '0');
    final seconds = d.inSeconds.remainder(60).toString().padLeft(2, '0');
    return '$minutes:$seconds';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 200.0,
            floating: false,
            pinned: true,
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => context.pop(),
            ),
            flexibleSpace: FlexibleSpaceBar(
              centerTitle: true,
              title: Text(
                'Gregorian Chant',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 20,
                  color: Colors.white,
                ),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl:
                        'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000&auto=format&fit=crop',
                    fit: BoxFit.cover,
                    placeholder: (context, url) =>
                        Container(color: AppTheme.sacredNavy900),
                    errorWidget: (context, url, error) =>
                        Container(color: AppTheme.sacredNavy900),
                  ),
                  Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, AppTheme.deepSpace],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                _buildNowPlayingCard(),
                const SizedBox(height: 24),
                Text(
                  'Library',
                  style: GoogleFonts.merriweather(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 12),
                ..._chants.asMap().entries.map((entry) {
                  return _buildChantItem(
                    index: entry.key,
                    data: entry.value,
                    isPlaying: _currentIndex == entry.key && _isPlaying,
                    isActive: _currentIndex == entry.key,
                  ).animate(delay: (100 * entry.key).ms).fadeIn().slideX();
                }),
                const SizedBox(height: 100),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNowPlayingCard() {
    final currentChant = _chants[_currentIndex];

    return PremiumGlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(LucideIcons.music, size: 48, color: AppTheme.gold500),
          const SizedBox(height: 16),
          Text(
            currentChant['title'],
            textAlign: TextAlign.center,
            style: GoogleFonts.merriweather(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
          Text(
            currentChant['tone'],
            style: GoogleFonts.inter(fontSize: 14, color: Colors.white70),
          ),
          const SizedBox(height: 24),

          // Progress bar
          SliderTheme(
            data: SliderThemeData(
              trackHeight: 2,
              thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
              overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
              activeTrackColor: AppTheme.gold500,
              inactiveTrackColor: Colors.white24,
              thumbColor: Colors.white,
              overlayColor: AppTheme.gold500.withValues(alpha: 0.2),
            ),
            child: Slider(
              value: _position.inSeconds.toDouble(),
              max: _duration.inSeconds.toDouble() > 0
                  ? _duration.inSeconds.toDouble()
                  : 1.0,
              onChanged: (value) async {
                final position = Duration(seconds: value.toInt());
                await _audioPlayer.seek(position);
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _formatDuration(_position),
                  style: const TextStyle(color: Colors.white54, fontSize: 10),
                ),
                Text(
                  _formatDuration(_duration),
                  style: const TextStyle(color: Colors.white54, fontSize: 10),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              IconButton(
                icon: const Icon(LucideIcons.skipBack, color: Colors.white),
                onPressed: _playPrevious,
              ),
              const SizedBox(width: 16),
              GestureDetector(
                onTap: _togglePlay,
                child: Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500,
                    shape: BoxShape.circle,
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.gold500.withValues(alpha: 0.4),
                        blurRadius: 16,
                      ),
                    ],
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            color: Colors.black,
                            strokeWidth: 2,
                          ),
                        )
                      : Icon(
                          _isPlaying ? LucideIcons.pause : LucideIcons.play,
                          color: Colors.black,
                          size: 28,
                        ),
                ),
              ),
              const SizedBox(width: 16),
              IconButton(
                icon: const Icon(LucideIcons.skipForward, color: Colors.white),
                onPressed: _playNext,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChantItem({
    required int index,
    required Map<String, dynamic> data,
    required bool isPlaying, // Actually playing
    required bool isActive, // Selected but maybe paused
  }) {
    return GestureDetector(
      onTap: () => _playTrack(index),
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isActive
              ? AppTheme.gold500.withValues(alpha: 0.1)
              : Colors.white.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isActive
                ? AppTheme.gold500.withValues(alpha: 0.3)
                : Colors.white.withValues(alpha: 0.05),
          ),
        ),
        child: Row(
          children: [
            Icon(
              isActive && isPlaying
                  ? LucideIcons.barChart2
                  : LucideIcons.playCircle,
              color: isActive ? AppTheme.gold500 : Colors.white54,
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    data['title'],
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
                      color: isActive ? Colors.white : Colors.white70,
                    ),
                  ),
                  Text(
                    data['tone'],
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white38,
                    ),
                  ),
                ],
              ),
            ),
            Text(
              data['duration'],
              style: GoogleFonts.inter(fontSize: 14, color: Colors.white38),
            ),
          ],
        ),
      ),
    );
  }
}
