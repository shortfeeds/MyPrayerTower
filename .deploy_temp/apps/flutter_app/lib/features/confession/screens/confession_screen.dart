import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';

class ConfessionScreen extends ConsumerStatefulWidget {
  const ConfessionScreen({super.key});

  @override
  ConsumerState<ConfessionScreen> createState() => _ConfessionScreenState();
}

class _ConfessionScreenState extends ConsumerState<ConfessionScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Confession Guide',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.gold500,
          labelColor: AppTheme.gold500,
          unselectedLabelColor: AppTheme.textMuted,
          labelStyle: GoogleFonts.inter(fontWeight: FontWeight.w600),
          tabs: const [
            Tab(text: 'Examine'),
            Tab(text: 'The Rite'),
            Tab(text: 'Prayers'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: const [_ExaminationTab(), _RiteTab(), _PrayersTab()],
      ),
    );
  }
}

/// Detailed Examination of Conscience with reflection questions
class _ExaminationTab extends StatelessWidget {
  const _ExaminationTab();

  static const List<_Commandment> _commandments = [
    _Commandment(
      number: 1,
      title: 'I am the Lord your God',
      subtitle: 'You shall not have strange gods before me',
      questions: [
        'Do I give God time every day in prayer?',
        'Do I seek to love Him with my whole heart?',
        'Have I been involved with superstitious practices or the occult?',
        'Do I ever despair of God\'s mercy?',
        'Have I put my faith in fortune-telling, horoscopes, or charms?',
      ],
    ),
    _Commandment(
      number: 2,
      title: 'You shall not take the name of the Lord in vain',
      subtitle: 'Respect for God\'s Holy Name',
      questions: [
        'Have I used God\'s name carelessly or in anger?',
        'Have I cursed or sworn falsely?',
        'Have I spoken disrespectfully of sacred things?',
        'Do I use the Holy Name of Jesus with reverence?',
      ],
    ),
    _Commandment(
      number: 3,
      title: 'Remember to keep holy the Lord\'s Day',
      subtitle: 'Honor the Sabbath',
      questions: [
        'Do I attend Mass every Sunday and Holy Day of Obligation?',
        'Do I participate actively and reverently at Mass?',
        'Have I missed Mass through my own fault?',
        'Do I keep Sunday as a day of rest and family time?',
        'Do I avoid unnecessary work on Sundays?',
      ],
    ),
    _Commandment(
      number: 4,
      title: 'Honor your father and your mother',
      subtitle: 'Respect for parents and authority',
      questions: [
        'Do I honor and obey my parents?',
        'Have I disrespected or disobeyed legitimate authority?',
        'Do I treat my family members with patience and love?',
        'Have I neglected my duties to my family?',
        'Do I care for elderly family members?',
      ],
    ),
    _Commandment(
      number: 5,
      title: 'You shall not kill',
      subtitle: 'Respect for human life',
      questions: [
        'Have I physically hurt anyone or wished them harm?',
        'Have I spoken hateful words or harbored anger?',
        'Have I led others to sin by my example or words?',
        'Do I respect my own body and take care of my health?',
        'Have I abused alcohol or drugs?',
        'Have I supported or participated in abortion?',
      ],
    ),
    _Commandment(
      number: 6,
      title: 'You shall not commit adultery',
      subtitle: 'Purity of heart and body',
      questions: [
        'Have I engaged in sexual activity outside of marriage?',
        'Have I been faithful to my spouse in thought and action?',
        'Have I viewed pornography or impure material?',
        'Do I dress and act modestly?',
        'Have I respected the dignity of others?',
      ],
    ),
    _Commandment(
      number: 7,
      title: 'You shall not steal',
      subtitle: 'Respect for property',
      questions: [
        'Have I taken what does not belong to me?',
        'Have I returned what I borrowed?',
        'Have I been honest in my business dealings?',
        'Do I waste time at work or school?',
        'Have I paid my just debts?',
        'Do I give to those in need according to my ability?',
      ],
    ),
    _Commandment(
      number: 8,
      title: 'You shall not bear false witness',
      subtitle: 'Truth and honesty',
      questions: [
        'Have I lied or been deceitful?',
        'Have I gossiped or revealed others\' secrets?',
        'Have I damaged another\'s reputation through slander?',
        'Have I judged others rashly or unfairly?',
        'Do I try to see the best in others?',
      ],
    ),
    _Commandment(
      number: 9,
      title: 'You shall not covet your neighbor\'s wife',
      subtitle: 'Purity of thought',
      questions: [
        'Have I entertained impure thoughts or desires?',
        'Have I been jealous of others\' relationships?',
        'Do I guard my eyes and mind from temptation?',
        'Have I respected the sanctity of marriage?',
      ],
    ),
    _Commandment(
      number: 10,
      title: 'You shall not covet your neighbor\'s goods',
      subtitle: 'Contentment and generosity',
      questions: [
        'Am I envious of others\' possessions or success?',
        'Am I content with what God has given me?',
        'Do I share generously with others?',
        'Have I been greedy or materialistic?',
        'Do I trust in God\'s providence?',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Header
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppTheme.gold500.withValues(alpha: 0.2),
                AppTheme.sacredNavy900,
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.3)),
          ),
          child: Column(
            children: [
              const Icon(LucideIcons.heart, size: 32, color: AppTheme.gold500),
              const SizedBox(height: 12),
              Text(
                'Examination of Conscience',
                style: GoogleFonts.merriweather(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Reflect prayerfully on these questions based on the Ten Commandments',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(color: Colors.white70, height: 1.5),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Commandments
        ..._commandments.map((c) => _CommandmentCard(commandment: c)),
        const SizedBox(height: 100),
      ],
    );
  }
}

class _CommandmentCard extends StatefulWidget {
  final _Commandment commandment;

  const _CommandmentCard({required this.commandment});

  @override
  State<_CommandmentCard> createState() => _CommandmentCardState();
}

class _CommandmentCardState extends State<_CommandmentCard> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: _isExpanded
              ? AppTheme.gold500.withValues(alpha: 0.5)
              : Colors.transparent,
        ),
      ),
      child: Column(
        children: [
          InkWell(
            onTap: () => setState(() => _isExpanded = !_isExpanded),
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppTheme.gold500.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Center(
                      child: Text(
                        '${widget.commandment.number}',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.gold500,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          widget.commandment.title,
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: Colors.white,
                          ),
                        ),
                        Text(
                          widget.commandment.subtitle,
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    _isExpanded
                        ? LucideIcons.chevronUp
                        : LucideIcons.chevronDown,
                    color: AppTheme.textSecondary,
                    size: 20,
                  ),
                ],
              ),
            ),
          ),
          if (_isExpanded)
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
              child: Column(
                children: widget.commandment.questions.map((q) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          margin: const EdgeInsets.only(top: 6),
                          width: 6,
                          height: 6,
                          decoration: const BoxDecoration(
                            color: AppTheme.gold500,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Text(
                            q,
                            style: GoogleFonts.inter(
                              fontSize: 13,
                              color: Colors.white70,
                              height: 1.5,
                            ),
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
    );
  }
}

/// The Rite of Confession steps
class _RiteTab extends StatelessWidget {
  const _RiteTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        _StepCard(
          step: '1',
          title: 'Enter the Confessional',
          content:
              'Kneel or sit. Make the Sign of the Cross:\n\n"In the name of the Father, and of the Son, and of the Holy Spirit. Amen."',
        ),
        _StepCard(
          step: '2',
          title: 'Begin Your Confession',
          content:
              '"Bless me Father, for I have sinned. It has been [time] since my last confession. These are my sins..."',
          isHighlight: true,
        ),
        _StepCard(
          step: '3',
          title: 'Confess Your Sins',
          content:
              'Confess your sins simply and honestly. The priest may offer counsel and will assign a penance.',
        ),
        _StepCard(
          step: '4',
          title: 'Act of Contrition',
          content:
              '"O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen."',
          isHighlight: true,
        ),
        _StepCard(
          step: '5',
          title: 'Absolution',
          content:
              'The priest will extend his hands and pray the prayer of absolution. Respond "Amen" at the end.',
        ),
        _StepCard(
          step: '6',
          title: 'Complete Your Penance',
          content:
              'After leaving the confessional, complete the penance the priest assigned. Give thanks to God for His mercy.',
        ),
        SizedBox(height: 100),
      ],
    );
  }
}

/// Prayers Tab with common confession prayers
class _PrayersTab extends StatelessWidget {
  const _PrayersTab();

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: const [
        _PrayerCard(
          title: 'Act of Contrition',
          prayer:
              'O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love. I firmly resolve, with the help of Thy grace, to sin no more and to avoid the near occasions of sin. Amen.',
        ),
        _PrayerCard(
          title: 'Prayer Before Confession',
          prayer:
              'Come, Holy Spirit, enlighten my mind that I may clearly know all the sins I must confess. Move my heart that I may be sincerely sorry for them, honestly confess them, and firmly resolve not to commit them again. Amen.',
        ),
        _PrayerCard(
          title: 'Prayer After Confession',
          prayer:
              'Almighty and merciful God, I give You thanks for pardoning my sins. Grant me the grace to sin no more and to love You more and more. Through Christ our Lord. Amen.',
        ),
        _PrayerCard(
          title: 'Psalm 51 (Miserere)',
          prayer:
              'Have mercy on me, O God, according to Your steadfast love; according to Your abundant mercy, blot out my transgressions. Wash me thoroughly from my iniquity, and cleanse me from my sin. For I know my transgressions, and my sin is ever before me.',
        ),
        SizedBox(height: 100),
      ],
    );
  }
}

class _PrayerCard extends StatelessWidget {
  final String title;
  final String prayer;

  const _PrayerCard({required this.title, required this.prayer});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(LucideIcons.bookmark, size: 18, color: AppTheme.gold500),
              const SizedBox(width: 8),
              Text(
                title,
                style: GoogleFonts.merriweather(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold500,
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            prayer,
            style: GoogleFonts.merriweather(
              fontSize: 14,
              color: Colors.white,
              height: 1.7,
              fontStyle: FontStyle.italic,
            ),
          ),
        ],
      ),
    );
  }
}

class _StepCard extends StatelessWidget {
  final String step;
  final String title;
  final String content;
  final bool isHighlight;

  const _StepCard({
    required this.step,
    required this.title,
    required this.content,
    this.isHighlight = false,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: isHighlight ? AppTheme.gold500 : AppTheme.darkCard,
              shape: BoxShape.circle,
              border: Border.all(
                color: isHighlight ? AppTheme.gold500 : Colors.white24,
              ),
            ),
            child: Center(
              child: Text(
                step,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.bold,
                  color: isHighlight ? Colors.black : Colors.white,
                ),
              ),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: GoogleFonts.merriweather(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: isHighlight ? AppTheme.gold500 : Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.sacredNavy900,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    content,
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.white70,
                      height: 1.6,
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

class _Commandment {
  final int number;
  final String title;
  final String subtitle;
  final List<String> questions;

  const _Commandment({
    required this.number,
    required this.title,
    required this.subtitle,
    required this.questions,
  });
}
