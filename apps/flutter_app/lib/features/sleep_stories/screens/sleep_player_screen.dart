import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:just_audio/just_audio.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../models/sleep_story_model.dart';

class SleepPlayerScreen extends StatefulWidget {
  final SleepStory story;

  const SleepPlayerScreen({super.key, required this.story});

  @override
  State<SleepPlayerScreen> createState() => _SleepPlayerScreenState();
}

class _SleepPlayerScreenState extends State<SleepPlayerScreen> {
  late final AudioPlayer _audioPlayer;
  bool _isPlaying = false;
  Duration _position = Duration.zero;
  Duration _duration = Duration.zero;

  // Sleep Timer
  Timer? _sleepTimer;
  int _sleepTimerMinutes = 0; // 0 = disabled
  int _secondsRemaining = 0;



  @override
  void initState() {
    super.initState();
    _audioPlayer = AudioPlayer();
    _initAudio();
  }

  Future<void> _initAudio() async {
    try {
      await _audioPlayer.setUrl(widget.story.audioUrl);
      _audioPlayer.positionStream.listen((pos) {
        if (mounted) setState(() => _position = pos);
      });
      _audioPlayer.durationStream.listen((dur) {
        if (mounted && dur != null) setState(() => _duration = dur);
      });
      _audioPlayer.playerStateStream.listen((state) {
        if (mounted) {
          setState(() => _isPlaying = state.playing);
        }
      });
      // Auto play on screen load
      await _audioPlayer.play();
    } catch (e) {
      debugPrint('Error initializing sleep audio: $e');
    }
  }

  void _togglePlayPause() async {
    HapticFeedback.lightImpact();
    if (_isPlaying) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.play();
    }
  }

  void _seekBy(int seconds) async {
    HapticFeedback.selectionClick();
    final newPos = _position + Duration(seconds: seconds);
    final clamped = newPos < Duration.zero
        ? Duration.zero
        : (newPos > _duration ? _duration : newPos);
    await _audioPlayer.seek(clamped);
  }

  void _cycleSleepTimer() {
    HapticFeedback.mediumImpact();
    final timers = [0, 15, 30, 45, 60];
    final currentIdx = timers.indexOf(_sleepTimerMinutes);
    final nextMinutes = timers[(currentIdx + 1) % timers.length];

    _sleepTimer?.cancel();
    setState(() {
      _sleepTimerMinutes = nextMinutes;
      _secondsRemaining = nextMinutes * 60;
    });

    if (nextMinutes > 0) {
      _sleepTimer = Timer.periodic(const Duration(seconds: 1), (t) {
        if (_secondsRemaining > 1) {
          setState(() => _secondsRemaining--);
        } else {
          t.cancel();
          _audioPlayer.pause();
          setState(() {
            _sleepTimerMinutes = 0;
            _secondsRemaining = 0;
            _isPlaying = false;
          });
        }
      });

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          backgroundColor: AppTheme.sacredNavy900,
          content: Text(
            'Sleep Timer set for $nextMinutes minutes. Rest peacefully in Christ.',
            style: GoogleFonts.inter(color: Colors.white, fontSize: 13),
          ),
          duration: const Duration(seconds: 2),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          backgroundColor: AppTheme.sacredNavy900,
          content: Text('Sleep Timer turned off.'),
          duration: Duration(seconds: 2),
        ),
      );
    }
  }

  @override
  void dispose() {
    _sleepTimer?.cancel();
    _audioPlayer.dispose();
    super.dispose();
  }

  String _formatDuration(Duration d) {
    final minutes = d.inMinutes;
    final seconds = d.inSeconds % 60;
    return '$minutes:${seconds.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF070B14), // Deepest midnight navy
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronDown, color: Colors.white70, size: 28),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          // Sleep timer badge button
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: TextButton.icon(
              onPressed: _cycleSleepTimer,
              style: TextButton.styleFrom(
                backgroundColor: _sleepTimerMinutes > 0
                    ? AppTheme.gold500.withValues(alpha: 0.2)
                    : Colors.white.withValues(alpha: 0.05),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                  side: BorderSide(
                    color: _sleepTimerMinutes > 0
                        ? AppTheme.gold500.withValues(alpha: 0.5)
                        : Colors.white.withValues(alpha: 0.1),
                  ),
                ),
              ),
              icon: Icon(
                LucideIcons.moon,
                size: 16,
                color: _sleepTimerMinutes > 0 ? AppTheme.gold400 : Colors.white60,
              ),
              label: Text(
                _sleepTimerMinutes > 0
                    ? '${(_secondsRemaining / 60).ceil()}m'
                    : 'Sleep Timer',
                style: GoogleFonts.inter(
                  color: _sleepTimerMinutes > 0 ? AppTheme.gold400 : Colors.white70,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 24),
          child: Column(
            children: [
              const SizedBox(height: 20),

              // Illuminated Halo Artwork
              Center(
                child: Container(
                  width: 180,
                  height: 180,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: RadialGradient(
                      colors: [
                        AppTheme.gold500.withValues(alpha: 0.2),
                        const Color(0xFF0F172A),
                        const Color(0xFF070B14),
                      ],
                    ),
                    border: Border.all(
                      color: AppTheme.gold500.withValues(alpha: 0.35),
                      width: 1.5,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: AppTheme.gold500.withValues(alpha: 0.15),
                        blurRadius: 40,
                        spreadRadius: 4,
                      ),
                    ],
                  ),
                  child: const Center(
                    child: Icon(
                      LucideIcons.sparkles,
                      color: AppTheme.gold400,
                      size: 54,
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 32),

              // Title & Subtitle
              Text(
                widget.story.title,
                style: GoogleFonts.cinzel(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  letterSpacing: 0.5,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              Text(
                widget.story.saintOrTheme,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.gold400,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 4),
              Text(
                'Narrated by ${widget.story.narrator}',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.white38,
                ),
                textAlign: TextAlign.center,
              ),

              const SizedBox(height: 28),

              // Progress Scrubber Slider
              SliderTheme(
                data: SliderTheme.of(context).copyWith(
                  trackHeight: 3,
                  activeTrackColor: AppTheme.gold500,
                  inactiveTrackColor: Colors.white12,
                  thumbColor: AppTheme.gold500,
                  thumbShape: const RoundSliderThumbShape(enabledThumbRadius: 6),
                  overlayShape: const RoundSliderOverlayShape(overlayRadius: 14),
                ),
                child: Slider(
                  value: _position.inMilliseconds.toDouble().clamp(
                        0.0,
                        _duration.inMilliseconds.toDouble() > 0
                            ? _duration.inMilliseconds.toDouble()
                            : 1.0,
                      ),
                  min: 0.0,
                  max: _duration.inMilliseconds.toDouble() > 0
                      ? _duration.inMilliseconds.toDouble()
                      : 1.0,
                  onChanged: (val) {
                    _audioPlayer.seek(Duration(milliseconds: val.toInt()));
                  },
                ),
              ),

              // Time labels
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      _formatDuration(_position),
                      style: GoogleFonts.inter(color: Colors.white38, fontSize: 12),
                    ),
                    Text(
                      _formatDuration(_duration),
                      style: GoogleFonts.inter(color: Colors.white38, fontSize: 12),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Playback Controls Row
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.rotateCcw, color: Colors.white70, size: 24),
                    tooltip: '15 seconds back',
                    onPressed: () => _seekBy(-15),
                  ),
                  const SizedBox(width: 24),
                  Container(
                    width: 68,
                    height: 68,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.gold500,
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold500.withValues(alpha: 0.3),
                          blurRadius: 20,
                        ),
                      ],
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isPlaying ? LucideIcons.pause : LucideIcons.play,
                        color: Colors.black,
                        size: 32,
                      ),
                      onPressed: _togglePlayPause,
                    ),
                  ),
                  const SizedBox(width: 24),
                  IconButton(
                    icon: const Icon(LucideIcons.rotateCw, color: Colors.white70, size: 24),
                    tooltip: '15 seconds forward',
                    onPressed: () => _seekBy(15),
                  ),
                ],
              ),

              const SizedBox(height: 36),

              // Scripture Card
              PremiumGlassCard(
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: AppTheme.gold500.withValues(alpha: 0.2),
                    ),
                  ),
                  child: Column(
                    children: [
                      const Icon(LucideIcons.quote, color: AppTheme.gold400, size: 20),
                      const SizedBox(height: 8),
                      Text(
                        widget.story.scripture,
                        style: GoogleFonts.merriweather(
                          fontSize: 13,
                          fontStyle: FontStyle.italic,
                          color: Colors.white.withValues(alpha: 0.9),
                          height: 1.5,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Read-Along Excerpt
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.03),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: Colors.white.withValues(alpha: 0.06)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'PRAYERFUL REFLECTION',
                      style: GoogleFonts.cinzel(
                        fontSize: 11,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold400,
                        letterSpacing: 1.0,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      widget.story.excerpt,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.white70,
                        height: 1.6,
                      ),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 48),
            ],
          ),
        ),
      ),
    );
  }
}
