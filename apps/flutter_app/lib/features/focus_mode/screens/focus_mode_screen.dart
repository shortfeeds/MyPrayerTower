import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_theme.dart';

/// Focus Mode / Prayer Timer Screen
class FocusModeScreen extends StatefulWidget {
  const FocusModeScreen({super.key});

  @override
  State<FocusModeScreen> createState() => _FocusModeScreenState();
}

class _FocusModeScreenState extends State<FocusModeScreen>
    with TickerProviderStateMixin {
  int _selectedMinutes = 15;
  int _remainingSeconds = 0;
  bool _isRunning = false;
  bool _isDeepFocus = false;
  Timer? _timer;
  String _selectedAmbience = 'silence';
  int _currentPromptIndex = 0;
  late AnimationController _breathingController;

  final List<int> _presets = [5, 10, 15, 20, 30, 45, 60];

  final List<String> _scripturePrompts = [
    '"Be still, and know that I am God." — Psalm 46:10',
    '"The Lord is my shepherd; I shall not want." — Psalm 23:1',
    '"Come to me, all you who labor and are burdened." — Matthew 11:28',
    '"Rejoice always. Pray without ceasing." — 1 Thessalonians 5:16-17',
    '"For with God nothing will be impossible." — Luke 1:37',
    '"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7',
  ];

  final Map<String, IconData> _ambienceOptions = {
    'silence': LucideIcons.volumeX,
    'bells': LucideIcons.bell,
    'rain': LucideIcons.cloudRain,
    'choir': LucideIcons.music,
  };

  @override
  void initState() {
    super.initState();
    _breathingController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _timer?.cancel();
    _breathingController.dispose();
    super.dispose();
  }

  void _startTimer() {
    setState(() {
      _isRunning = true;
      if (_remainingSeconds == 0) {
        _remainingSeconds = _selectedMinutes * 60;
      }
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() {
          _remainingSeconds--;
          if (_remainingSeconds % 20 == 0) {
            _currentPromptIndex =
                (_currentPromptIndex + 1) % _scripturePrompts.length;
          }
        });
      } else {
        _stopTimer();
        _showCompletionDialog();
      }
    });
  }

  void _stopTimer() {
    _timer?.cancel();
    setState(() => _isRunning = false);
  }

  void _resetTimer() {
    _stopTimer();
    setState(() => _remainingSeconds = 0);
  }

  void _showCompletionDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Column(
          children: [
            const Icon(LucideIcons.sparkles, color: AppTheme.gold500, size: 48),
            const SizedBox(height: 16),
            Text(
              'Sacred Silence Complete',
              textAlign: TextAlign.center,
              style: GoogleFonts.playfairDisplay(
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'You found peace for $_selectedMinutes minutes.',
              textAlign: TextAlign.center,
              style: GoogleFonts.inter(color: Colors.white70),
            ),
            const SizedBox(height: 24),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                _scripturePrompts[_currentPromptIndex],
                textAlign: TextAlign.center,
                style: GoogleFonts.playfairDisplay(
                  fontStyle: FontStyle.italic,
                  color: AppTheme.gold400,
                ),
              ),
            ),
          ],
        ),
        actions: [
          Center(
            child: TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'Amen',
                style: GoogleFonts.inter(
                  color: AppTheme.gold500,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _formatTime(int seconds) {
    final mins = seconds ~/ 60;
    final secs = seconds % 60;
    return '${mins.toString().padLeft(2, '0')}:${secs.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      body: Stack(
        children: [
          // Ambient Background Evolution
          Positioned.fill(
            child: AnimatedContainer(
              duration: const Duration(seconds: 2),
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 1.5,
                  colors: [
                    _isRunning
                        ? AppTheme.sacredNavy900.withValues(alpha: 0.8)
                        : AppTheme.sacredNavy950,
                    Colors.black,
                  ],
                ),
              ),
            ),
          ),

          // Glowing Aura (Breathing Animation)
          if (_isRunning)
            Center(
              child: AnimatedBuilder(
                animation: _breathingController,
                builder: (context, child) {
                  return Container(
                    width: 300 + (_breathingController.value * 50),
                    height: 300 + (_breathingController.value * 50),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold500.withValues(
                            alpha: 0.1 * _breathingController.value,
                          ),
                          blurRadius: 100,
                          spreadRadius: 20 * _breathingController.value,
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),

          SafeArea(
            child: Column(
              children: [
                // Top Bar
                Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      IconButton(
                        icon: const Icon(
                          LucideIcons.chevronLeft,
                          color: Colors.white70,
                        ),
                        onPressed: () => Navigator.pop(context),
                      ),
                      if (!_isDeepFocus)
                        Text(
                          'Sanctuary of Silence',
                          style: GoogleFonts.playfairDisplay(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      IconButton(
                        icon: Icon(
                          _isDeepFocus ? LucideIcons.eyeOff : LucideIcons.eye,
                          color: _isDeepFocus
                              ? AppTheme.gold500
                              : Colors.white24,
                        ),
                        onPressed: () =>
                            setState(() => _isDeepFocus = !_isDeepFocus),
                      ),
                    ],
                  ),
                ),

                Expanded(
                  child: SingleChildScrollView(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const SizedBox(height: 48),

                        // Main Timer / Breathing Guide
                        GestureDetector(
                          onTap: _isRunning ? _stopTimer : _startTimer,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              // Progress Ring
                              SizedBox(
                                width: 280,
                                height: 280,
                                child: CircularProgressIndicator(
                                  value: _remainingSeconds > 0
                                      ? 1 -
                                            (_remainingSeconds /
                                                (_selectedMinutes * 60))
                                      : 0,
                                  strokeWidth: 4,
                                  color: AppTheme.gold500.withValues(
                                    alpha: 0.5,
                                  ),
                                  backgroundColor: Colors.white.withValues(
                                    alpha: 0.05,
                                  ),
                                ),
                              ),

                              // Breathing Circle (Pneuma)
                              if (_isRunning)
                                AnimatedBuilder(
                                  animation: _breathingController,
                                  builder: (context, child) {
                                    return Container(
                                      width:
                                          220 +
                                          (_breathingController.value * 40),
                                      height:
                                          220 +
                                          (_breathingController.value * 40),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        border: Border.all(
                                          color: Colors.white.withValues(
                                            alpha: 0.1,
                                          ),
                                          width: 1,
                                        ),
                                        color: Colors.white.withValues(
                                          alpha: 0.02,
                                        ),
                                      ),
                                    );
                                  },
                                ),

                              // Time Label
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    _remainingSeconds > 0
                                        ? _formatTime(_remainingSeconds)
                                        : '$_selectedMinutes:00',
                                    style: GoogleFonts.playfairDisplay(
                                      fontSize: 64,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  if (_isRunning)
                                    Text(
                                          _breathingController.value > 0.5
                                              ? 'EXHALE'
                                              : 'INHALE',
                                          style: GoogleFonts.inter(
                                            fontSize: 12,
                                            letterSpacing: 4,
                                            color: AppTheme.gold500.withValues(
                                              alpha: 0.7,
                                            ),
                                            fontWeight: FontWeight.bold,
                                          ),
                                        )
                                        .animate(onPlay: (c) => c.repeat())
                                        .fadeIn()
                                        .fadeOut(delay: 2.seconds),
                                ],
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 64),

                        // Scripture Prompt (Visible in focus)
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 48),
                          child: AnimatedSwitcher(
                            duration: const Duration(seconds: 1),
                            child: Text(
                              _isRunning
                                  ? _scripturePrompts[_currentPromptIndex]
                                  : 'Tap to begin your sanctuary session.',
                              key: ValueKey(
                                _currentPromptIndex + (_isRunning ? 100 : 0),
                              ),
                              textAlign: TextAlign.center,
                              style: GoogleFonts.playfairDisplay(
                                fontSize: 18,
                                fontStyle: FontStyle.italic,
                                color: Colors.white70,
                                height: 1.5,
                              ),
                            ),
                          ),
                        ),

                        const SizedBox(height: 64),

                        // Controls (Hidden in Deep Focus)
                        AnimatedOpacity(
                          opacity: _isDeepFocus && _isRunning ? 0 : 1,
                          duration: const Duration(milliseconds: 500),
                          child: Column(
                            children: [
                              if (!_isRunning) ...[
                                // Presets
                                SingleChildScrollView(
                                  scrollDirection: Axis.horizontal,
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 24,
                                  ),
                                  child: Row(
                                    children: _presets.map((mins) {
                                      final isSelected =
                                          _selectedMinutes == mins;
                                      return Padding(
                                        padding: const EdgeInsets.only(
                                          right: 8,
                                        ),
                                        child: ChoiceChip(
                                          label: Text('$mins min'),
                                          selected: isSelected,
                                          onSelected: (_) => setState(() {
                                            _selectedMinutes = mins;
                                            _remainingSeconds = 0;
                                          }),
                                          selectedColor: AppTheme.gold500,
                                          backgroundColor: Colors.white
                                              .withValues(alpha: 0.05),
                                          labelStyle: GoogleFonts.inter(
                                            color: isSelected
                                                ? Colors.black
                                                : Colors.white70,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                                const SizedBox(height: 24),

                                // Ambience Selection
                                Center(
                                  child: Text(
                                    'SELECT AMBIENCE',
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white24,
                                      letterSpacing: 2,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 16),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: _ambienceOptions.entries.map((
                                    entry,
                                  ) {
                                    final isSelected =
                                        _selectedAmbience == entry.key;
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                      ),
                                      child: InkWell(
                                        onTap: () => setState(
                                          () => _selectedAmbience = entry.key,
                                        ),
                                        child: Column(
                                          children: [
                                            Container(
                                              padding: const EdgeInsets.all(12),
                                              decoration: BoxDecoration(
                                                color: isSelected
                                                    ? AppTheme.gold500
                                                    : Colors.white.withValues(
                                                        alpha: 0.05,
                                                      ),
                                                shape: BoxShape.circle,
                                              ),
                                              child: Icon(
                                                entry.value,
                                                color: isSelected
                                                    ? Colors.black
                                                    : Colors.white70,
                                                size: 20,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              entry.key.toUpperCase(),
                                              style: GoogleFonts.inter(
                                                fontSize: 8,
                                                color: Colors.white24,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  }).toList(),
                                ),
                              ],

                              const SizedBox(height: 48),

                              // Play / Pause / Reset
                              Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  if (_isRunning || _remainingSeconds > 0)
                                    IconButton(
                                      onPressed: _resetTimer,
                                      icon: const Icon(
                                        LucideIcons.rotateCcw,
                                        color: Colors.white24,
                                      ),
                                    ),
                                  const SizedBox(width: 24),
                                  GestureDetector(
                                    onTap: _isRunning
                                        ? _stopTimer
                                        : _startTimer,
                                    child: Container(
                                      padding: const EdgeInsets.all(20),
                                      decoration: BoxDecoration(
                                        shape: BoxShape.circle,
                                        color: AppTheme.gold500,
                                        boxShadow: [
                                          BoxShadow(
                                            color: AppTheme.gold500.withValues(
                                              alpha: 0.3,
                                            ),
                                            blurRadius: 15,
                                            spreadRadius: 2,
                                          ),
                                        ],
                                      ),
                                      child: Icon(
                                        _isRunning
                                            ? LucideIcons.pause
                                            : LucideIcons.play,
                                        color: Colors.black,
                                        size: 32,
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 24),
                                  // Placeholder for silent space
                                  const SizedBox(width: 48),
                                ],
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 120),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
