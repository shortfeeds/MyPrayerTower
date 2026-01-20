import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../data/divine_office_data.dart';

class DivineOfficeScreen extends StatefulWidget {
  const DivineOfficeScreen({super.key});

  @override
  State<DivineOfficeScreen> createState() => _DivineOfficeScreenState();
}

class _DivineOfficeScreenState extends State<DivineOfficeScreen> {
  late LiturgyHour _selectedHour;

  @override
  void initState() {
    super.initState();
    _selectedHour = DivineOfficeData.getHourForTime(DateTime.now());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.darkBg,
        title: Text(
          'Liturgy of the Hours',
          style: GoogleFonts.playfairDisplay(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ),
      body: Column(
        children: [
          // Hour Selector
          Container(
            height: 90,
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: LiturgyHour.values.length,
              itemBuilder: (context, index) {
                final hour = LiturgyHour.values[index];
                final isSelected = hour == _selectedHour;

                return Padding(
                  padding: const EdgeInsets.only(right: 12),
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedHour = hour),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: 70,
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.gold500
                            : AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? AppTheme.gold500 : Colors.white12,
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            _getIconForHour(hour),
                            size: 24,
                            color: isSelected ? Colors.black : Colors.white70,
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _getShortName(hour),
                            style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: isSelected
                                  ? FontWeight.bold
                                  : FontWeight.normal,
                              color: isSelected ? Colors.black : Colors.white70,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ),

          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: _buildPrayerContent(_selectedHour),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPrayerContent(LiturgyHour hour) {
    final data = DivineOfficeData.getContent(hour);
    final description = DivineOfficeData.getDescription(hour);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Header Card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                AppTheme.royalPurple900.withValues(alpha: 0.8),
                AppTheme.sacredNavy900,
              ],
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: Colors.white10),
          ),
          child: Column(
            children: [
              Icon(_getIconForHour(hour), size: 48, color: AppTheme.gold400),
              const SizedBox(height: 16),
              Text(
                'Content for this hour is not available yet.',
                style: GoogleFonts.inter(color: Colors.white54),
              ),
              const SizedBox(height: 24),
              OutlinedButton(
                onPressed: () {}, // Future: Load from real Divine Office API
                child: const Text('Refresh'),
              ),
              const SizedBox(height: 8),
              Text(
                _getTimeRange(hour),
                style: GoogleFonts.playfairDisplay(
                  fontSize: 28,
                  fontStyle: FontStyle.italic,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                description,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  color: Colors.white70,
                  height: 1.5,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Opening
        _buildSectionTitle('INTRODUCTION'),
        _buildResponseText(
          'God, come to my assistance.',
          'Lord, make haste to help me.',
        ),
        _buildResponseText(
          'Glory to the Father, and to the Son, and to the Holy Spirit:',
          'As it was in the beginning, is now, and will be for ever. Amen. Alleluia.',
        ),

        const SizedBox(height: 32),

        // Hymn
        _buildSectionTitle('HYMN'),
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            children: [
              Text(
                data['hymn'],
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold400,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 32),

        // Psalm
        _buildSectionTitle('PSALMODY'),
        _buildPsalmCard(data['psalm1']),

        const SizedBox(height: 32),

        // Reading
        _buildSectionTitle('READING'),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white12),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'READING',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: AppTheme.gold400,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    data['reading']['reference'],
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                data['reading']['text'],
                style: GoogleFonts.inter(
                  fontSize: 16,
                  color: Colors.white,
                  height: 1.6,
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 32),

        // Responsory
        _buildSectionTitle('RESPONSORY'),
        Text(
          data['response'],
          style: GoogleFonts.inter(
            fontSize: 15,
            color: Colors.white70,
            height: 1.8,
          ),
        ),

        const SizedBox(height: 32),

        // Canticle
        _buildSectionTitle(data['canticle']['name'].toUpperCase()),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white12),
          ),
          child: Text(
            data['canticle']['text'],
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white,
              height: 1.6,
            ),
          ),
        ),

        const SizedBox(height: 32),

        // Prayer
        _buildSectionTitle('CONCLUDING PRAYER'),
        Text(
          data['prayer'],
          style: GoogleFonts.playfairDisplay(
            fontSize: 18,
            color: Colors.white,
            fontStyle: FontStyle.italic,
            height: 1.6,
          ),
          textAlign: TextAlign.center,
        ),

        const SizedBox(height: 48),
      ],
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Center(
        child: Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 12,
            letterSpacing: 2,
            fontWeight: FontWeight.bold,
            color: AppTheme.textMuted,
          ),
        ),
      ),
    );
  }

  Widget _buildResponseText(String v, String r) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: RichText(
        text: TextSpan(
          style: GoogleFonts.inter(
            fontSize: 16,
            height: 1.5,
            color: Colors.white,
          ),
          children: [
            const TextSpan(
              text: 'V. ',
              style: TextStyle(
                color: AppTheme.gold400,
                fontWeight: FontWeight.bold,
              ),
            ),
            TextSpan(text: '$v\n'),
            const TextSpan(
              text: 'R. ',
              style: TextStyle(
                color: AppTheme.gold400,
                fontWeight: FontWeight.bold,
              ),
            ),
            TextSpan(text: r),
          ],
        ),
      ),
    );
  }

  Widget _buildPsalmCard(Map<String, dynamic> psalm) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: AppTheme.gold500.withValues(alpha: 0.3),
              ),
            ),
            child: Text(
              psalm['antiphon'],
              style: GoogleFonts.inter(
                fontSize: 14,
                color: AppTheme.gold400,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
          const SizedBox(height: 16),
          Text(
            psalm['text'],
            style: GoogleFonts.inter(
              fontSize: 16,
              color: Colors.white,
              height: 1.6,
            ),
          ),
          const SizedBox(height: 8),
          Align(
            alignment: Alignment.centerRight,
            child: Text(
              psalm['reference'],
              style: GoogleFonts.inter(fontSize: 12, color: Colors.white54),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getIconForHour(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.vigils:
        return LucideIcons.moon;
      case LiturgyHour.lauds:
        return LucideIcons.sunrise;
      case LiturgyHour.terce:
        return LucideIcons.sun;
      case LiturgyHour.sext:
        return LucideIcons.sun;
      case LiturgyHour.none:
        return LucideIcons.sunset;
      case LiturgyHour.vespers:
        return LucideIcons.cloudMoon;
      case LiturgyHour.compline:
        return LucideIcons.bed;
    }
  }

  String _getShortName(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.vigils:
        return 'Vigils';
      case LiturgyHour.lauds:
        return 'Lauds';
      case LiturgyHour.terce:
        return 'Terce';
      case LiturgyHour.sext:
        return 'Sext';
      case LiturgyHour.none:
        return 'None';
      case LiturgyHour.vespers:
        return 'Vespers';
      case LiturgyHour.compline:
        return 'Compline';
    }
  }

  String _getTimeRange(LiturgyHour hour) {
    switch (hour) {
      case LiturgyHour.vigils:
        return 'Before Dawn';
      case LiturgyHour.lauds:
        return 'Morning (6-9 AM)';
      case LiturgyHour.terce:
        return 'Mid-Morning (9 AM)';
      case LiturgyHour.sext:
        return 'Mid-Day (12 PM)';
      case LiturgyHour.none:
        return 'Afternoon (3 PM)';
      case LiturgyHour.vespers:
        return 'Evening (6 PM)';
      case LiturgyHour.compline:
        return 'Night (9 PM)';
    }
  }
}
