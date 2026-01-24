import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';

class ExamenScreen extends StatefulWidget {
  const ExamenScreen({super.key});

  @override
  State<ExamenScreen> createState() => _ExamenScreenState();
}

class _ExamenScreenState extends State<ExamenScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // State for inputs
  final Map<int, TextEditingController> _controllers = {};
  double _moodValue = 0.5; // 0.0 to 1.0

  final List<Map<String, dynamic>> _steps = [
    {
      'title': 'Presence',
      'subtitle': 'Place yourself in God\'s presence',
      'content':
          'Become aware of God\'s presence. Look back on the events of the day in the company of the Holy Spirit. Ask God to bring clarity and understanding.',
      'icon': LucideIcons.sparkles,
      'hasInput': true,
      'inputLabel': 'How do you feel God\'s presence right now?',
    },
    {
      'title': 'Gratitude',
      'subtitle': 'Review the day with thanksgiving',
      'content':
          'Walk through your day in the presence of God and note its joys and delights. Focus on the day\'s gifts—small and large. What did you receive? What did you give?',
      'icon': LucideIcons.heart,
      'hasInput': true,
      'inputLabel': 'List three things you are grateful for today:',
    },
    {
      'title': 'Review',
      'subtitle': 'Pay attention to your emotions',
      'content':
          'Reflect on the feelings you experienced during the day. Boredom? Elation? Resentment? Compassion? Anger? Confidence? What is God saying through these feelings?',
      'icon': LucideIcons.search,
      'hasInput': true,
      'hasMoodSlider': true,
      'inputLabel': 'What emotions stood out today?',
    },
    {
      'title': 'Sorrow',
      'subtitle': 'Choose one feature of the day',
      'content':
          'Ask the Holy Spirit to direct you to something that God thinks is important. Look at it. Pray about it. Allow the prayer to arise spontaneously from your heart.',
      'icon': LucideIcons.cloudRain, // Represents sorrow/cleansing
      'hasInput': true,
      'inputLabel': 'Write a short prayer about this moment:',
    },
    {
      'title': 'Grace',
      'subtitle': 'Look toward tomorrow',
      'content':
          'Ask God to give you light for tomorrow\'s challenges. Pay attention to the feelings that surface as you survey what\'s coming up. Seek God\'s guidance and hope.',
      'icon': LucideIcons.sunrise,
      'hasInput': true,
      'inputLabel': 'What do you need grace for tomorrow?',
    },
  ];

  @override
  void initState() {
    super.initState();
    for (int i = 0; i < _steps.length; i++) {
      _controllers[i] = TextEditingController();
    }
  }

  @override
  void dispose() {
    _pageController.dispose();
    for (var c in _controllers.values) {
      c.dispose();
    }
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _steps.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOutCubic,
      );
    } else {
      // Finish
      Navigator.pop(context);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Examen completed. Your reflections have been saved.'),
          backgroundColor: AppTheme.sacredNavy800,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      resizeToAvoidBottomInset: false, // Handle keyboard manually if needed
      body: Stack(
        children: [
          // Ambient Background
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Color(0xFF0F172A), // Slate 900
                    Color(0xFF1E1B4B), // Indigo 950
                    Colors.black,
                  ],
                ),
              ),
            ),
          ),

          // Stars/Particles layer could go here

          // Content
          Column(
            children: [
              // Custom Approx AppBar
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  child: Row(
                    children: [
                      IconButton(
                        icon: const Icon(LucideIcons.x, color: Colors.white70),
                        onPressed: () => Navigator.pop(context),
                      ),
                      Expanded(
                        child: Text(
                          'Daily Examen',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.merriweather(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      const SizedBox(width: 48), // Balance close button
                    ],
                  ),
                ),
              ),

              // Progress
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 8,
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(2),
                  child: LinearProgressIndicator(
                    value: (_currentPage + 1) / _steps.length,
                    backgroundColor: Colors.white10,
                    valueColor: const AlwaysStoppedAnimation<Color>(
                      AppTheme.gold500,
                    ),
                    minHeight: 2,
                  ),
                ),
              ),

              // Steps PageView
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  physics:
                      const NeverScrollableScrollPhysics(), // Force guided nav
                  onPageChanged: (index) =>
                      setState(() => _currentPage = index),
                  itemCount: _steps.length,
                  itemBuilder: (context, index) {
                    final step = _steps[index];
                    return _buildStep(index, step);
                  },
                ),
              ),

              // Bottom Nav
              _buildBottomBar(),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStep(int index, Map<String, dynamic> step) {
    final bool isReview = step['title'] == 'Review';

    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(
        24,
        0,
        24,
        100,
      ), // Padding for bottom bar
      child: Column(
        children: [
          const SizedBox(height: 24),
          // Icon
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.1),
              shape: BoxShape.circle,
              boxShadow: [
                BoxShadow(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Icon(
              step['icon'] as IconData,
              size: 40,
              color: AppTheme.gold400,
            ),
          ).animate().fadeIn(duration: 600.ms).scale(),

          const SizedBox(height: 32),

          // Titles
          Text(
            (step['title'] as String).toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              letterSpacing: 2,
              color: AppTheme.gold500,
            ),
          ).animate().fadeIn(delay: 200.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 8),

          Text(
            step['subtitle'] as String,
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2, end: 0),

          const SizedBox(height: 24),

          // Content Card
          PremiumGlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(
                  step['content'] as String,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    height: 1.6,
                    color: Colors.white.withValues(alpha: 0.9),
                  ),
                ),

                if (isReview) ...[
                  const SizedBox(height: 32),
                  Text(
                    'How was your day mostly?',
                    style: GoogleFonts.inter(
                      fontSize: 12,
                      color: Colors.white54,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Icon(LucideIcons.frown, color: Colors.white38),
                      Expanded(
                        child: SliderTheme(
                          data: SliderTheme.of(context).copyWith(
                            activeTrackColor: AppTheme.gold500,
                            thumbColor: Colors.white,
                            overlayColor: AppTheme.gold500.withValues(
                              alpha: 0.2,
                            ),
                          ),
                          child: Slider(
                            value: _moodValue,
                            onChanged: (v) => setState(() => _moodValue = v),
                          ),
                        ),
                      ),
                      const Icon(LucideIcons.smile, color: Colors.white38),
                    ],
                  ),
                ],
              ],
            ),
          ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1, end: 0),

          const SizedBox(height: 32),

          // Journaling Area
          if (step['hasInput'] == true) ...[
            Align(
              alignment: Alignment.centerLeft,
              child: Text(
                step['inputLabel'] as String,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Colors.white70,
                ),
              ),
            ).animate().fadeIn(delay: 600.ms),
            const SizedBox(height: 16),
            TextField(
              controller: _controllers[index],
              maxLines: 4,
              style: GoogleFonts.inter(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Tap to reflect...',
                hintStyle: GoogleFonts.inter(
                  color: Colors.white24,
                  fontStyle: FontStyle.italic,
                ),
                filled: true,
                fillColor: Colors.white.withValues(alpha: 0.05),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: BorderSide.none,
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(16),
                  borderSide: const BorderSide(
                    color: AppTheme.gold500,
                    width: 1,
                  ),
                ),
                contentPadding: const EdgeInsets.all(20),
              ),
            ).animate().fadeIn(delay: 700.ms),
          ],
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return Align(
      alignment: Alignment.bottomCenter,
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
            colors: [Colors.black, Colors.black.withValues(alpha: 0)],
            stops: const [0.4, 1.0],
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            if (_currentPage > 0)
              TextButton(
                onPressed: () {
                  _pageController.previousPage(
                    duration: const Duration(milliseconds: 600),
                    curve: Curves.easeInOutCubic,
                  );
                },
                child: Text(
                  'Back',
                  style: GoogleFonts.inter(color: Colors.white54),
                ),
              )
            else
              const SizedBox(width: 64), // Spacer

            ShinyButton(
              label: _currentPage == _steps.length - 1 ? 'Finish' : 'Next Step',
              icon: _currentPage == _steps.length - 1
                  ? LucideIcons.check
                  : LucideIcons.arrowRight,
              onPressed: _nextPage,
              isLarge: true,
            ),
          ],
        ),
      ),
    );
  }
}
