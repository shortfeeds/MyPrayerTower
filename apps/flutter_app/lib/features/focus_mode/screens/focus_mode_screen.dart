import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Focus Mode / Prayer Timer Screen
class FocusModeScreen extends StatefulWidget {
  const FocusModeScreen({super.key});

  @override
  State<FocusModeScreen> createState() => _FocusModeScreenState();
}

class _FocusModeScreenState extends State<FocusModeScreen> {
  int _selectedMinutes = 15;
  int _remainingSeconds = 0;
  bool _isRunning = false;
  Timer? _timer;
  String _selectedAmbience = 'silence';

  final List<int> _presets = [5, 10, 15, 20, 30, 45, 60];

  final Map<String, IconData> _ambienceOptions = {
    'silence': LucideIcons.volumeX,
    'bells': LucideIcons.bell,
    'rain': LucideIcons.cloudRain,
    'choir': LucideIcons.music,
  };

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _startTimer() {
    setState(() {
      _isRunning = true;
      _remainingSeconds = _selectedMinutes * 60;
    });

    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_remainingSeconds > 0) {
        setState(() => _remainingSeconds--);
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
        backgroundColor: AppTheme.darkCard,
        title: Row(
          children: [
            const Icon(LucideIcons.checkCircle, color: Colors.green),
            const SizedBox(width: 12),
            Text(
              'Prayer Complete',
              style: GoogleFonts.playfairDisplay(color: Colors.white),
            ),
          ],
        ),
        content: Text(
          'You spent $_selectedMinutes minutes in focused prayer. May God bless your devotion.',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text(
              'Amen',
              style: GoogleFonts.inter(color: AppTheme.gold400),
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
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Focus Mode',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(),

              // Timer Display
              Container(
                width: 280,
                height: 280,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      AppTheme.royalPurple900.withValues(alpha: 0.6),
                      AppTheme.sacredNavy900.withValues(alpha: 0.8),
                    ],
                  ),
                  border: Border.all(
                    color: AppTheme.gold500.withValues(alpha: 0.5),
                    width: 4,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: AppTheme.gold500.withValues(alpha: 0.2),
                      blurRadius: 30,
                      spreadRadius: 5,
                    ),
                  ],
                ),
                child: Center(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (!_isRunning && _remainingSeconds == 0) ...[
                        const Icon(
                          LucideIcons.timer,
                          size: 48,
                          color: AppTheme.gold400,
                        ),
                        const SizedBox(height: 12),
                        Text(
                          '$_selectedMinutes min',
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                      ] else ...[
                        Text(
                          _formatTime(_remainingSeconds),
                          style: GoogleFonts.playfairDisplay(
                            fontSize: 56,
                            fontWeight: FontWeight.bold,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _isRunning ? 'Praying...' : 'Paused',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: AppTheme.gold400,
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 40),

              // Preset Buttons
              if (!_isRunning && _remainingSeconds == 0) ...[
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  alignment: WrapAlignment.center,
                  children: _presets.map((mins) {
                    final isSelected = _selectedMinutes == mins;
                    return ChoiceChip(
                      label: Text('$mins min'),
                      selected: isSelected,
                      onSelected: (_) =>
                          setState(() => _selectedMinutes = mins),
                      selectedColor: AppTheme.gold500,
                      backgroundColor: AppTheme.darkCard,
                      labelStyle: GoogleFonts.inter(
                        color: isSelected ? Colors.black : Colors.white70,
                        fontWeight: FontWeight.w600,
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),

                // Ambience Options
                Text(
                  'AMBIENCE',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.textMuted,
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: _ambienceOptions.entries.map((entry) {
                    final isSelected = _selectedAmbience == entry.key;
                    return Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 8),
                      child: InkWell(
                        onTap: () =>
                            setState(() => _selectedAmbience = entry.key),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppTheme.gold500
                                : AppTheme.darkCard,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected
                                  ? AppTheme.gold500
                                  : Colors.white24,
                            ),
                          ),
                          child: Icon(
                            entry.value,
                            color: isSelected ? Colors.black : Colors.white70,
                            size: 24,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],

              const Spacer(),

              // Control Buttons
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (_isRunning || _remainingSeconds > 0) ...[
                    // Reset Button
                    IconButton(
                      onPressed: _resetTimer,
                      icon: const Icon(LucideIcons.rotateCcw),
                      color: Colors.white54,
                      iconSize: 28,
                    ),
                    const SizedBox(width: 24),
                  ],

                  // Play/Pause Button
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [AppTheme.gold400, AppTheme.gold500],
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: AppTheme.gold500.withValues(alpha: 0.4),
                          blurRadius: 20,
                          spreadRadius: 2,
                        ),
                      ],
                    ),
                    child: IconButton(
                      onPressed: _isRunning ? _stopTimer : _startTimer,
                      icon: Icon(
                        _isRunning ? LucideIcons.pause : LucideIcons.play,
                        color: Colors.black,
                      ),
                      iconSize: 36,
                      padding: const EdgeInsets.all(20),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 40),

              // Tip
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(
                      LucideIcons.lightbulb,
                      color: AppTheme.gold400,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        'Find a quiet place, silence your phone, and open your heart to God.',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white70,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
