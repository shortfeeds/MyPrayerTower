import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/shiny_button.dart';
import '../data/stations_data.dart';

/// Stations of the Cross Screen - Immersive Pilgrimage
class StationsOfTheCrossScreen extends StatefulWidget {
  const StationsOfTheCrossScreen({super.key});

  @override
  State<StationsOfTheCrossScreen> createState() =>
      _StationsOfTheCrossScreenState();
}

class _StationsOfTheCrossScreenState extends State<StationsOfTheCrossScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0; // 0 = intro, 1-14 = stations, 15 = closing

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    _pageController.nextPage(
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    );
  }

  void _prevPage() {
    _pageController.previousPage(
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeInOutCubic,
    );
  }

  @override
  Widget build(BuildContext context) {
    final totalPages =
        stationsOfTheCross.length + 2; // intro + 14 stations + closing

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        flexibleSpace: Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppTheme.sacredNavy900.withValues(alpha: 0.9),
                Colors.transparent,
              ],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
        leading: IconButton(
          icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 16),
            child: Center(
              child: Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 12,
                  vertical: 6,
                ),
                decoration: BoxDecoration(
                  color: Colors.black38,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.white12),
                ),
                child: Text(
                  _currentPage == 0
                      ? 'Intro'
                      : _currentPage == totalPages - 1
                      ? 'Closing'
                      : 'Station $_currentPage',
                  style: GoogleFonts.inter(
                    color: AppTheme.gold400,
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
      body: Stack(
        children: [
          // Ambient Background
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: RadialGradient(
                  center: Alignment.center,
                  radius: 1.5,
                  colors: [AppTheme.sacredNavy900, Colors.black],
                ),
              ),
            ),
          ),

          // Content
          Column(
            children: [
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  onPageChanged: (page) => setState(() => _currentPage = page),
                  itemCount: totalPages,
                  itemBuilder: (context, index) {
                    if (index == 0) {
                      return _buildIntroPage();
                    } else if (index == totalPages - 1) {
                      return _buildClosingPage();
                    } else {
                      return _buildStationPage(stationsOfTheCross[index - 1]);
                    }
                  },
                ),
              ),

              // Navigation & Progress
              _buildBottomControls(totalPages),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBottomControls(int totalPages) {
    final progress = (_currentPage + 1) / totalPages;

    return Container(
      padding: const EdgeInsets.fromLTRB(24, 0, 24, 32),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [Colors.transparent, Colors.black.withValues(alpha: 0.8)],
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Subtle Progress Indicator
          ClipRRect(
            borderRadius: BorderRadius.circular(2),
            child: LinearProgressIndicator(
              value: progress,
              backgroundColor: Colors.white10,
              valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.gold500),
              minHeight: 2,
            ),
          ),
          const SizedBox(height: 24),

          // Buttons
          Row(
            children: [
              if (_currentPage > 0) ...[
                TextButton.icon(
                  onPressed: _prevPage,
                  icon: const Icon(
                    LucideIcons.arrowLeft,
                    color: Colors.white70,
                  ),
                  label: Text(
                    'Back',
                    style: GoogleFonts.inter(color: Colors.white70),
                  ),
                ),
                const Spacer(),
              ],

              if (_currentPage == 0)
                Expanded(
                  child: ShinyButton(
                    label: 'Begin Pilgrimage',
                    icon: LucideIcons.footprints,
                    onPressed: _nextPage,
                  ),
                )
              else if (_currentPage == totalPages - 1)
                Expanded(
                  child: ShinyButton(
                    label: 'Finish',
                    icon: LucideIcons.check,
                    onPressed: () => Navigator.pop(context),
                  ),
                )
              else
                ShinyButton(
                  label: 'Next Station',
                  icon: LucideIcons.arrowRight,
                  onPressed: _nextPage,
                  isLarge: true,
                ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildIntroPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 100),
      child: Column(
        children: [
          const Icon(
            LucideIcons.cross,
            size: 80,
            color: AppTheme.gold500,
          ).animate().fadeIn(duration: 800.ms).scale(),
          const SizedBox(height: 32),
          Text(
            'The Way of the Cross',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 36,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              shadows: [
                Shadow(
                  color: AppTheme.gold500.withValues(alpha: 0.5),
                  blurRadius: 20,
                ),
              ],
            ),
          ).animate().fadeIn(delay: 300.ms).slideY(begin: 0.2, end: 0),
          const SizedBox(height: 16),
          Text(
            'A spiritual pilgrimage of prayer and meditation.',
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white70,
              letterSpacing: 0.5,
            ),
          ).animate().fadeIn(delay: 500.ms),
          const SizedBox(height: 48),
          PremiumGlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(
                  'Opening Prayer',
                  style: GoogleFonts.merriweather(
                    fontSize: 18,
                    color: AppTheme.gold400,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  stationsOpeningPrayer,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: Colors.white,
                    height: 1.8,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 700.ms).slideY(begin: 0.1, end: 0),
        ],
      ),
    );
  }

  Widget _buildStationPage(Station station) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(24, 100, 24, 40),
      child: Column(
        children: [
          // Station Number Badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.05),
              borderRadius: BorderRadius.circular(30),
              border: Border.all(color: Colors.white24),
            ),
            child: Text(
              'STATION ${toRoman(station.number)}',
              style: GoogleFonts.inter(
                fontSize: 12,
                fontWeight: FontWeight.bold,
                color: Colors.white70,
                letterSpacing: 2,
              ),
            ),
          ).animate().fadeIn(),
          const SizedBox(height: 24),

          // Title
          Text(
            station.title,
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(delay: 200.ms),
          const SizedBox(height: 32),

          // Scripture Card
          PremiumGlassCard(
            padding: const EdgeInsets.all(20),
            color: Colors.white.withValues(alpha: 0.03),
            child: Column(
              children: [
                const Icon(
                  LucideIcons.bookOpen,
                  color: AppTheme.gold500,
                  size: 20,
                ),
                const SizedBox(height: 12),
                Text(
                  station.scripture,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.merriweather(
                    fontSize: 15,
                    fontStyle: FontStyle.italic,
                    color: Colors.white,
                    height: 1.6,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 400.ms).slideY(begin: 0.1, end: 0),
          const SizedBox(height: 24),

          // Meditation
          Text(
            'MEDITATION',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: AppTheme.textMuted,
              letterSpacing: 1.5,
            ),
          ).animate().fadeIn(delay: 600.ms),
          const SizedBox(height: 12),
          Text(
            station.meditation,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white.withValues(alpha: 0.9),
              height: 1.7,
            ),
          ).animate().fadeIn(delay: 700.ms),
          const SizedBox(height: 32),

          // Prayer Card
          PremiumGlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(
                  'PRAYER',
                  style: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: AppTheme.gold400,
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  station.prayer,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.merriweather(
                    fontSize: 15,
                    color: Colors.white,
                    height: 1.8,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 900.ms).slideY(begin: 0.1, end: 0),
        ],
      ),
    );
  }

  Widget _buildClosingPage() {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 100),
      child: Column(
        children: [
          const Icon(
            LucideIcons.sun,
            size: 80,
            color: AppTheme.gold500,
          ).animate().fadeIn().scale(),
          const SizedBox(height: 32),
          Text(
            'Your Journey is Complete',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 32,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ).animate().fadeIn(delay: 300.ms),
          const SizedBox(height: 48),
          PremiumGlassCard(
            padding: const EdgeInsets.all(24),
            child: Column(
              children: [
                Text(
                  'Closing Prayer',
                  style: GoogleFonts.merriweather(
                    fontSize: 18,
                    color: AppTheme.gold400,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  stationsClosingPrayer,
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    color: Colors.white,
                    height: 1.8,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(delay: 500.ms).slideY(begin: 0.1, end: 0),
        ],
      ),
    );
  }

  String toRoman(int number) {
    if (number < 1) return "";
    if (number >= 10) return "X${toRoman(number - 10)}";
    if (number >= 9) return "IX${toRoman(number - 9)}";
    if (number >= 5) return "V${toRoman(number - 5)}";
    if (number >= 4) return "IV${toRoman(number - 4)}";
    if (number >= 1) return "I${toRoman(number - 1)}";
    return "";
  }
}
