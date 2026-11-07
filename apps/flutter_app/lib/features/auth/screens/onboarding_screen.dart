import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../core/constants/app_constants.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // Selected spiritual profile answers
  String _selectedJourney = 'Daily Faithful';
  final Set<String> _selectedDevotions = {'The Holy Rosary', 'Daily Mass & Scripture'};
  String _selectedPrayerRhythm = 'Dawn & Night';

  final List<Map<String, dynamic>> _journeyOptions = [
    {
      'title': 'Curious Seeker',
      'desc': 'Beginning my journey to understand prayer and Catholic faith.',
      'icon': LucideIcons.compass,
    },
    {
      'title': 'Daily Faithful',
      'desc': 'Cultivating consistent prayer and daily scripture habit.',
      'icon': LucideIcons.flame,
    },
    {
      'title': 'Devout Contemplative',
      'desc': 'Deep prayer, the Holy Rosary, Latin, and Divine Office.',
      'icon': LucideIcons.bookOpen,
    },
    {
      'title': 'Returning Pilgrim',
      'desc': 'Returning home to the Church, seeking grace and peace.',
      'icon': LucideIcons.church,
    },
  ];

  final List<Map<String, dynamic>> _devotionOptions = [
    {
      'name': 'The Holy Rosary',
      'subtitle': 'Marian mysteries with sacred contemplation',
      'icon': LucideIcons.circleDot,
    },
    {
      'name': 'Daily Mass & Scripture',
      'subtitle': 'Liturgy of the Word and daily Gospel reflections',
      'icon': LucideIcons.book,
    },
    {
      'name': 'Divine Mercy & Chaplets',
      'subtitle': '3:00 PM Hour of Mercy and healing intercessions',
      'icon': LucideIcons.heartHandshake,
    },
    {
      'name': 'Saints & Novenas',
      'subtitle': 'Patron saint intercessions and 9-day petitions',
      'icon': LucideIcons.sparkles,
    },
    {
      'name': 'Sacred Silence & Adoration',
      'subtitle': 'Eucharistic presence, Gregorian chant, and quiet rest',
      'icon': LucideIcons.headphones,
    },
  ];

  final List<Map<String, dynamic>> _rhythmOptions = [
    {
      'title': 'Dawn & Morning',
      'time': '6:00 AM – 8:00 AM',
      'desc': 'Lauds and Morning Offering before the day begins',
      'icon': LucideIcons.sunrise,
    },
    {
      'title': 'Noonday Angelus',
      'time': '12:00 PM',
      'desc': 'Pause midday to remember the Incarnation of Christ',
      'icon': LucideIcons.sun,
    },
    {
      'title': 'Hour of Mercy',
      'time': '3:00 PM',
      'desc': 'The solemn hour of the Passion and Divine Mercy Chaplet',
      'icon': LucideIcons.clock,
    },
    {
      'title': 'Night Compline',
      'time': '9:00 PM – 10:00 PM',
      'desc': 'Examination of Conscience and peace before rest',
      'icon': LucideIcons.moon,
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  Future<void> _completeOnboarding() async {
    HapticFeedback.mediumImpact();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConstants.onboardingKey, true);
    await prefs.setString('user_spiritual_journey', _selectedJourney);
    await prefs.setStringList('user_preferred_devotions', _selectedDevotions.toList());
    await prefs.setString('user_prayer_rhythm', _selectedPrayerRhythm);

    if (mounted) {
      context.go('/');
    }
  }

  void _nextPage() {
    HapticFeedback.selectionClick();
    if (_currentPage < 3) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOutCubic,
      );
    } else {
      _completeOnboarding();
    }
  }

  void _prevPage() {
    HapticFeedback.selectionClick();
    if (_currentPage > 0) {
      _pageController.previousPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOutCubic,
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: Stack(
        children: [
          // Background Cathedral Radial Glow
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: RadialGradient(
                  center: const Alignment(0, -0.4),
                  radius: 1.3,
                  colors: [
                    AppTheme.gold500.withValues(alpha: 0.12),
                    AppTheme.sacredNavy900.withValues(alpha: 0.7),
                    AppTheme.sacredNavy950,
                  ],
                ),
              ),
            ),
          ),

          SafeArea(
            child: Column(
              children: [
                // Top Navigation Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      if (_currentPage > 0)
                        IconButton(
                          icon: const Icon(LucideIcons.arrowLeft, color: Colors.white70),
                          onPressed: _prevPage,
                        )
                      else
                        const SizedBox(width: 48),

                      // Step Indicator dots
                      Row(
                        children: List.generate(4, (index) {
                          final isActive = _currentPage == index;
                          return AnimatedContainer(
                            duration: const Duration(milliseconds: 250),
                            margin: const EdgeInsets.symmetric(horizontal: 4),
                            height: 6,
                            width: isActive ? 24 : 6,
                            decoration: BoxDecoration(
                              color: isActive ? AppTheme.gold500 : Colors.white24,
                              borderRadius: BorderRadius.circular(3),
                            ),
                          );
                        }),
                      ),

                      TextButton(
                        onPressed: _completeOnboarding,
                        child: Text(
                          'Skip',
                          style: GoogleFonts.inter(
                            color: Colors.white54,
                            fontSize: 14,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Pages
                Expanded(
                  child: PageView(
                    controller: _pageController,
                    physics: const NeverScrollableScrollPhysics(), // Require tap to advance
                    onPageChanged: (idx) => setState(() => _currentPage = idx),
                    children: [
                      _buildWelcomeStep(),
                      _buildJourneyStep(),
                      _buildDevotionsStep(),
                      _buildRhythmStep(),
                    ],
                  ),
                ),

                // Bottom Action Bar
                Padding(
                  padding: const EdgeInsets.fromLTRB(24, 8, 24, 20),
                  child: SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: _nextPage,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.gold500,
                        foregroundColor: Colors.black,
                        elevation: 4,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            _currentPage == 3 ? 'Enter the Sanctuary' : 'Continue',
                            style: GoogleFonts.merriweather(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            _currentPage == 3 ? LucideIcons.check : LucideIcons.arrowRight,
                            size: 18,
                          ),
                        ],
                      ),
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

  // STEP 1: Welcome & Sanctuary Introduction
  Widget _buildWelcomeStep() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: AppTheme.gold500.withValues(alpha: 0.12),
              border: Border.all(
                color: AppTheme.gold500.withValues(alpha: 0.35),
                width: 1.5,
              ),
              boxShadow: [
                BoxShadow(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  blurRadius: 30,
                  spreadRadius: 2,
                ),
              ],
            ),
            child: const Icon(
              LucideIcons.church,
              color: AppTheme.gold500,
              size: 56,
            ),
          ).animate().scale(duration: const Duration(milliseconds: 600), curve: Curves.easeOutBack),

          const SizedBox(height: 32),

          Text(
            'Sanctuary of Prayer',
            style: GoogleFonts.cinzel(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: Colors.white,
              letterSpacing: 1.2,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 200.ms),

          const SizedBox(height: 12),

          Text(
            'Welcome to MyPrayerTower — your sanctuary for daily Catholic prayer, holy liturgy, community intercession, and peace.',
            style: GoogleFonts.merriweather(
              fontSize: 15,
              color: Colors.white70,
              height: 1.6,
            ),
            textAlign: TextAlign.center,
          ).animate().fadeIn(delay: 350.ms),

          const SizedBox(height: 36),

          // Core Blessings preview chips
          Wrap(
            spacing: 10,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: [
              _buildFeaturePill(LucideIcons.circleDot, 'Holy Rosary'),
              _buildFeaturePill(LucideIcons.bookOpen, 'Daily Readings'),
              _buildFeaturePill(LucideIcons.heartHandshake, 'Prayer Wall'),
              _buildFeaturePill(LucideIcons.mapPin, '10,000+ Churches'),
            ],
          ).animate().fadeIn(delay: 500.ms),
        ],
      ),
    );
  }

  Widget _buildFeaturePill(IconData icon, String text) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white.withValues(alpha: 0.06),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: AppTheme.gold500.withValues(alpha: 0.25),
        ),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: AppTheme.gold500, size: 14),
          const SizedBox(width: 6),
          Text(
            text,
            style: GoogleFonts.inter(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // STEP 2: Spiritual Journey
  Widget _buildJourneyStep() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      children: [
        Text(
          'Your Spiritual Walk',
          style: GoogleFonts.cinzel(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Where is your heart currently positioned in your walk with God?',
          style: GoogleFonts.inter(
            fontSize: 14,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 24),

        ..._journeyOptions.map((opt) {
          final isSelected = _selectedJourney == opt['title'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: PremiumGlassCard(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _selectedJourney = opt['title'] as String);
              },
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: isSelected
                        ? AppTheme.gold500
                        : Colors.white.withValues(alpha: 0.08),
                    width: isSelected ? 1.5 : 1,
                  ),
                  color: isSelected
                      ? AppTheme.gold500.withValues(alpha: 0.12)
                      : Colors.transparent,
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold500.withValues(alpha: 0.25)
                            : Colors.white.withValues(alpha: 0.06),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        opt['icon'] as IconData,
                        color: isSelected ? AppTheme.gold500 : Colors.white70,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            opt['title'] as String,
                            style: GoogleFonts.merriweather(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? AppTheme.gold500 : Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            opt['desc'] as String,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.white60,
                              height: 1.4,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(
                      isSelected ? LucideIcons.checkCircle2 : LucideIcons.circle,
                      color: isSelected ? AppTheme.gold500 : Colors.white24,
                      size: 20,
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  // STEP 3: Primary Devotions
  Widget _buildDevotionsStep() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      children: [
        Text(
          'Holy Devotions',
          style: GoogleFonts.cinzel(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'Select the devotions that nourish your soul most (choose multiple):',
          style: GoogleFonts.inter(
            fontSize: 14,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 20),

        ..._devotionOptions.map((dev) {
          final isSelected = _selectedDevotions.contains(dev['name']);
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() {
                  if (isSelected) {
                    if (_selectedDevotions.length > 1) {
                      _selectedDevotions.remove(dev['name']);
                    }
                  } else {
                    _selectedDevotions.add(dev['name'] as String);
                  }
                });
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: isSelected
                      ? AppTheme.gold500.withValues(alpha: 0.12)
                      : Colors.white.withValues(alpha: 0.04),
                  border: Border.all(
                    color: isSelected
                        ? AppTheme.gold500
                        : Colors.white.withValues(alpha: 0.1),
                    width: isSelected ? 1.5 : 1,
                  ),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold500.withValues(alpha: 0.2)
                            : Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        dev['icon'] as IconData,
                        color: isSelected ? AppTheme.gold500 : Colors.white60,
                        size: 20,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            dev['name'] as String,
                            style: GoogleFonts.merriweather(
                              fontSize: 15,
                              fontWeight: FontWeight.w600,
                              color: isSelected ? AppTheme.gold500 : Colors.white,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            dev['subtitle'] as String,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.white54,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Checkbox(
                      value: isSelected,
                      activeColor: AppTheme.gold500,
                      checkColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(5),
                      ),
                      onChanged: (val) {
                        HapticFeedback.selectionClick();
                        setState(() {
                          if (val == true) {
                            _selectedDevotions.add(dev['name'] as String);
                          } else if (_selectedDevotions.length > 1) {
                            _selectedDevotions.remove(dev['name']);
                          }
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  // STEP 4: Prayer Rhythm
  Widget _buildRhythmStep() {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      children: [
        Text(
          'Sacred Rhythm',
          style: GoogleFonts.cinzel(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          'When do you feel most called to converse with the Father?',
          style: GoogleFonts.inter(
            fontSize: 14,
            color: Colors.white70,
          ),
        ),
        const SizedBox(height: 20),

        ..._rhythmOptions.map((rh) {
          final isSelected = _selectedPrayerRhythm == rh['title'];
          return Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: InkWell(
              onTap: () {
                HapticFeedback.selectionClick();
                setState(() => _selectedPrayerRhythm = rh['title'] as String);
              },
              borderRadius: BorderRadius.circular(16),
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(16),
                  color: isSelected
                      ? AppTheme.gold500.withValues(alpha: 0.12)
                      : Colors.white.withValues(alpha: 0.04),
                  border: Border.all(
                    color: isSelected
                        ? AppTheme.gold500
                        : Colors.white.withValues(alpha: 0.1),
                    width: isSelected ? 1.5 : 1,
                  ),
                ),
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold500.withValues(alpha: 0.2)
                            : Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(
                        rh['icon'] as IconData,
                        color: isSelected ? AppTheme.gold500 : Colors.white70,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text(
                                rh['title'] as String,
                                style: GoogleFonts.merriweather(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                  color: isSelected ? AppTheme.gold500 : Colors.white,
                                ),
                              ),
                              const Spacer(),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500.withValues(alpha: 0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  rh['time'] as String,
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w600,
                                    color: AppTheme.gold400,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          Text(
                            rh['desc'] as String,
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.white60,
                              height: 1.3,
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
        }),

        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: AppTheme.sacredNavy900,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.2)),
          ),
          child: Row(
            children: [
              const Icon(LucideIcons.bellRing, color: AppTheme.gold500, size: 20),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  'Your gentle prayer reminders will automatically sync to this sacred schedule.',
                  style: GoogleFonts.inter(color: Colors.white70, fontSize: 12),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
