import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import 'confession_guide_screen.dart'; // For access to confessionChecksProvider

class ConfessionCompanionScreen extends ConsumerStatefulWidget {
  const ConfessionCompanionScreen({super.key});

  @override
  ConsumerState<ConfessionCompanionScreen> createState() =>
      _ConfessionCompanionScreenState();
}

class _ConfessionCompanionScreenState
    extends ConsumerState<ConfessionCompanionScreen> {
  final PageController _pageController = PageController();
  int _currentStep = 0;
  final TextEditingController _penanceController = TextEditingController();

  final List<_ConfessionStep> _steps = [
    _ConfessionStep(
      title: 'Preparation',
      description: 'Take a moment to center yourself in prayer.',
      icon: LucideIcons.church,
    ),
    _ConfessionStep(
      title: 'Greeting',
      description: 'Enter the confessional and make the Sign of the Cross.',
      icon: LucideIcons.handMetal,
    ),
    _ConfessionStep(
      title: 'Confession',
      description: 'Confess your sins to the priest.',
      icon: LucideIcons.scroll,
    ),
    _ConfessionStep(
      title: 'Counsel & Penance',
      description: 'Listen to the priest and accept your penance.',
      icon: LucideIcons.ear,
    ),
    _ConfessionStep(
      title: 'Act of Contrition',
      description: 'Pray the Act of Contrition.',
      icon: LucideIcons.heartCrack,
    ),
    _ConfessionStep(
      title: 'Absolution',
      description: 'Receive God\'s forgiveness.',
      icon: LucideIcons.sparkles,
    ),
    _ConfessionStep(
      title: 'Thanksgiving',
      description: 'Go in peace and give thanks.',
      icon: LucideIcons.sun,
    ),
  ];

  @override
  void dispose() {
    _pageController.dispose();
    _penanceController.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep < _steps.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep++);
    } else {
      Navigator.pop(context);
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
      setState(() => _currentStep--);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.sacredNavy900,
        title: Text(
          'Confession Companion',
          style: GoogleFonts.merriweather(color: Colors.white, fontSize: 18),
        ),
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                'Step ${_currentStep + 1}/${_steps.length}',
                style: GoogleFonts.inter(color: AppTheme.gold500),
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          // Progress Bar
          LinearProgressIndicator(
            value: (_currentStep + 1) / _steps.length,
            backgroundColor: Colors.white10,
            color: AppTheme.gold500,
            minHeight: 4,
          ),

          Expanded(
            child: PageView.builder(
              controller: _pageController,
              physics: const NeverScrollableScrollPhysics(), // Disable swipe
              itemCount: _steps.length,
              itemBuilder: (context, index) {
                return _buildStepContent(index);
              },
            ),
          ),

          // Navigation Buttons
          Container(
            padding: const EdgeInsets.all(24),
            decoration: const BoxDecoration(
              color: AppTheme.sacredNavy900,
              border: Border(top: BorderSide(color: Colors.white10)),
            ),
            child: Row(
              children: [
                if (_currentStep > 0)
                  TextButton(
                    onPressed: _prevStep,
                    child: Text(
                      'Back',
                      style: GoogleFonts.inter(color: Colors.white70),
                    ),
                  ),
                const Spacer(),
                ShinyButton(
                  label: _currentStep == _steps.length - 1 ? 'Finish' : 'Next',
                  icon: _currentStep == _steps.length - 1
                      ? LucideIcons.check
                      : LucideIcons.chevronRight,
                  onPressed: _nextStep,
                  isLarge: true,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStepContent(int index) {
    final step = _steps[index];
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const SizedBox(height: 20),
          Icon(step.icon, size: 64, color: AppTheme.gold500),
          const SizedBox(height: 24),
          Text(
            step.title,
            style: GoogleFonts.playfairDisplay(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 12),
          Text(
            step.description,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white70,
              height: 1.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 40),
          _buildStepBody(index),
        ],
      ),
    );
  }

  Widget _buildStepBody(int index) {
    switch (index) {
      case 0: // Preparation
        return _buildPreparationBody();
      case 1: // Greeting
        return _buildGreetingBody();
      case 2: // Confession
        return _buildConfessionListBody();
      case 3: // Counsel & Penance
        return _buildPenanceBody();
      case 4: // Act of Contrition
        return _buildContritionBody();
      case 5: // Absolution
        return _buildAbsolutionBody();
      case 6: // Thanksgiving
        return _buildThanksgivingBody();
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildPreparationBody() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Prayer Before Confession',
            style: GoogleFonts.merriweather(
              fontSize: 18,
              color: AppTheme.gold500,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            'Come, Holy Spirit, into my soul.\n\nEnlighten my mind that I may know the sins I ought to confess, and grant me your grace to be truly sorry for my sins.',
            style: GoogleFonts.merriweather(
              fontSize: 16,
              color: Colors.white,
              height: 1.8,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGreetingBody() {
    return Column(
      children: [
        PremiumGlassCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Text(
                'Make the Sign of the Cross and say:',
                style: GoogleFonts.inter(color: Colors.white54, fontSize: 13),
              ),
              const SizedBox(height: 12),
              Text(
                '"Bless me, Father, for I have sinned."',
                style: GoogleFonts.merriweather(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        PremiumGlassCard(
          padding: const EdgeInsets.all(20),
          child: Column(
            children: [
              Text(
                'State how long it has been since your last confession:',
                style: GoogleFonts.inter(color: Colors.white54, fontSize: 13),
              ),
              const SizedBox(height: 12),
              Text(
                '"It has been ____ since my last confession."',
                style: GoogleFonts.merriweather(
                  fontSize: 18,
                  color: Colors.white,
                  fontStyle: FontStyle.italic,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildConfessionListBody() {
    final checks = ref.watch(confessionChecksProvider);
    final checkedItems = checks.entries
        .where((e) => e.value)
        .map((e) => e.key.split('-').last) // Extract simple text
        .toList();

    return Column(
      children: [
        if (checkedItems.isEmpty)
          const Text(
            'No sins marked from examination.',
            style: TextStyle(color: Colors.white38),
          )
        else
          Container(
            constraints: const BoxConstraints(maxHeight: 300),
            child: ListView.builder(
              shrinkWrap: true,
              itemCount: checkedItems.length,
              itemBuilder: (context, index) {
                return Container(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: Colors.white10),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        LucideIcons.circle,
                        size: 8,
                        color: Colors.redAccent,
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          checkedItems[index],
                          style: GoogleFonts.inter(color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        const SizedBox(height: 16),
        Text(
          'Conclude by saying:',
          style: GoogleFonts.inter(color: Colors.white54),
        ),
        const SizedBox(height: 8),
        Text(
          '"For these and all my sins, I am sorry."',
          style: GoogleFonts.merriweather(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: Colors.white,
            fontStyle: FontStyle.italic,
          ),
        ),
      ],
    );
  }

  Widget _buildPenanceBody() {
    return Column(
      children: [
        const Text(
          'Listen to the priest\'s counsel and the penance he assigns.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white70),
        ),
        const SizedBox(height: 24),
        TextField(
          controller: _penanceController,
          style: const TextStyle(color: Colors.white),
          maxLines: 3,
          decoration: InputDecoration(
            hintText: 'Note your penance here (optional)...',
            hintStyle: const TextStyle(color: Colors.white30),
            filled: true,
            fillColor: Colors.white.withValues(alpha: 0.05),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildContritionBody() {
    return PremiumGlassCard(
      padding: const EdgeInsets.all(24),
      child: Column(
        children: [
          const Icon(LucideIcons.quote, color: AppTheme.gold500, size: 24),
          const SizedBox(height: 16),
          Text(
            'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love.\n\nI firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.',
            style: GoogleFonts.merriweather(
              fontSize: 17,
              height: 1.8,
              color: Colors.white,
            ),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _buildAbsolutionBody() {
    return Column(
      children: [
        const Text(
          'The priest will now pray the Prayer of Absolution.',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white70),
        ),
        const SizedBox(height: 24),
        PremiumGlassCard(
          padding: const EdgeInsets.all(20),
          color: AppTheme.gold500.withValues(alpha: 0.1),
          child: Column(
            children: [
              Text(
                'Make the Sign of the Cross when he says:',
                style: GoogleFonts.inter(fontSize: 12, color: AppTheme.gold400),
              ),
              const SizedBox(height: 12),
              Text(
                '"I absolve you from your sins in the name of the Father, and of the Son, and of the Holy Spirit."',
                textAlign: TextAlign.center,
                style: GoogleFonts.merriweather(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                'Answer: "Amen."',
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildThanksgivingBody() {
    return Column(
      children: [
        const PremiumGlassCard(
          padding: EdgeInsets.all(20),
          child: Column(
            children: [
              Text(
                'Priest: "The Lord has freed you from your sins. Go in peace."',
                style: TextStyle(color: Colors.white70),
              ),
              SizedBox(height: 8),
              Text(
                'Answer: "Thanks be to God."',
                style: TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        Text(
          'Don\'t forget to complete your penance as soon as possible.',
          textAlign: TextAlign.center,
          style: GoogleFonts.inter(color: Colors.white54),
        ),
        if (_penanceController.text.isNotEmpty) ...[
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(16),
            width: double.infinity,
            decoration: BoxDecoration(
              color: Colors.white10,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Your Penance:',
                  style: TextStyle(color: AppTheme.gold500, fontSize: 12),
                ),
                const SizedBox(height: 8),
                Text(
                  _penanceController.text,
                  style: const TextStyle(color: Colors.white),
                ),
              ],
            ),
          ),
        ],
      ],
    );
  }
}

class _ConfessionStep {
  final String title;
  final String description;
  final IconData icon;

  _ConfessionStep({
    required this.title,
    required this.description,
    required this.icon,
  });
}
