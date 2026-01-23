import 'package:flutter/material.dart';

import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class SummaScreen extends StatefulWidget {
  const SummaScreen({super.key});

  @override
  State<SummaScreen> createState() => _SummaScreenState();
}

class _SummaScreenState extends State<SummaScreen> {
  String? _expandedPart = 'I';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: Text(
              'Summa Theologica',
              style: GoogleFonts.merriweather(
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            backgroundColor: AppTheme.sacredNavy900,
            leading: IconButton(
              icon: const Icon(LucideIcons.chevronLeft, color: Colors.white),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: const BoxDecoration(
                gradient: AppTheme.primaryGradient,
              ),
              child: Column(
                children: [
                  const Icon(
                    LucideIcons.scale,
                    size: 48,
                    color: AppTheme.gold500,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'St. Thomas Aquinas',
                    style: GoogleFonts.merriweather(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'The masterwork of scholastic theology — systematic examination of Christian doctrine.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: Colors.white70,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final part = summaStructure[index];
                final isExpanded = _expandedPart == part.shortName;

                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: PremiumGlassCard(
                    padding: EdgeInsets.zero,
                    child: Column(
                      children: [
                        InkWell(
                          onTap: () {
                            setState(() {
                              _expandedPart = isExpanded
                                  ? null
                                  : part.shortName;
                            });
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Padding(
                            padding: const EdgeInsets.all(16),
                            child: Row(
                              children: [
                                Container(
                                  width: 48,
                                  height: 48,
                                  decoration: BoxDecoration(
                                    color: isExpanded
                                        ? AppTheme.gold500.withValues(
                                            alpha: 0.2,
                                          )
                                        : Colors.white.withValues(alpha: 0.05),
                                    borderRadius: BorderRadius.circular(12),
                                    border: Border.all(
                                      color: isExpanded
                                          ? AppTheme.gold500
                                          : Colors.white10,
                                    ),
                                  ),
                                  child: Center(
                                    child: Text(
                                      part.shortName,
                                      style: GoogleFonts.merriweather(
                                        color: isExpanded
                                            ? AppTheme.gold500
                                            : Colors.white70,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 16),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        part.name,
                                        style: GoogleFonts.merriweather(
                                          fontWeight: FontWeight.bold,
                                          color: Colors.white,
                                          fontSize: 16,
                                        ),
                                      ),
                                      Text(
                                        '${part.questions.length} questions included',
                                        style: GoogleFonts.inter(
                                          color: Colors.white54,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Icon(
                                  isExpanded
                                      ? LucideIcons.chevronUp
                                      : LucideIcons.chevronDown,
                                  color: Colors.white54,
                                ),
                              ],
                            ),
                          ),
                        ),
                        if (isExpanded)
                          Container(
                            decoration: BoxDecoration(
                              color: Colors.black.withValues(alpha: 0.2),
                              borderRadius: const BorderRadius.vertical(
                                bottom: Radius.circular(12),
                              ),
                            ),
                            child: Column(
                              children: [
                                Divider(
                                  height: 1,
                                  color: Colors.white.withValues(alpha: 0.1),
                                ),
                                ...part.questions.map(
                                  (q) => InkWell(
                                    onTap: () {
                                      final partNum = part.shortName == 'I'
                                          ? '1'
                                          : part.shortName == 'I-II'
                                          ? '2'
                                          : part.shortName == 'II-II'
                                          ? '3'
                                          : '4';
                                      final url =
                                          'https://www.newadvent.org/summa/$partNum${q.number.toString().padLeft(3, '0')}.htm';
                                      launchUrl(
                                        Uri.parse(url),
                                        mode: LaunchMode.inAppWebView,
                                      );
                                    },
                                    child: Padding(
                                      padding: const EdgeInsets.all(16),
                                      child: Row(
                                        children: [
                                          Text(
                                            'Q${q.number}',
                                            style: GoogleFonts.inter(
                                              fontWeight: FontWeight.bold,
                                              color: AppTheme.gold500,
                                            ),
                                          ),
                                          const SizedBox(width: 16),
                                          Expanded(
                                            child: Text(
                                              q.title,
                                              style: GoogleFonts.inter(
                                                color: Colors.white70,
                                              ),
                                            ),
                                          ),
                                          const Icon(
                                            LucideIcons.externalLink,
                                            size: 14,
                                            color: Colors.white30,
                                          ),
                                        ],
                                      ),
                                    ),
                                  ),
                                ),
                                Padding(
                                  padding: const EdgeInsets.all(16),
                                  child: TextButton.icon(
                                    onPressed: () {
                                      final partNum = part.shortName == 'I'
                                          ? '1'
                                          : part.shortName == 'I-II'
                                          ? '2'
                                          : part.shortName == 'II-II'
                                          ? '3'
                                          : '4';
                                      launchUrl(
                                        Uri.parse(
                                          'https://www.newadvent.org/summa/$partNum.htm',
                                        ),
                                        mode: LaunchMode.inAppWebView,
                                      );
                                    },
                                    icon: const Icon(
                                      LucideIcons.externalLink,
                                      size: 16,
                                      color: AppTheme.gold500,
                                    ),
                                    label: Text(
                                      'View full ${part.shortName}',
                                      style: GoogleFonts.inter(
                                        color: AppTheme.gold500,
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                      ],
                    ),
                  ),
                );
              }, childCount: summaStructure.length),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class SummaQuestion {
  final int number;
  final String title;
  final int articles;

  const SummaQuestion({
    required this.number,
    required this.title,
    required this.articles,
  });
}

class SummaPart {
  final String name;
  final String shortName;
  final List<SummaQuestion> questions;

  const SummaPart({
    required this.name,
    required this.shortName,
    required this.questions,
  });
}

const summaStructure = [
  SummaPart(
    name: 'Prima Pars (First Part)',
    shortName: 'I',
    questions: [
      SummaQuestion(
        number: 1,
        title: 'The Nature and Extent of Sacred Doctrine',
        articles: 10,
      ),
      SummaQuestion(number: 2, title: 'The Existence of God', articles: 3),
      SummaQuestion(number: 3, title: 'The Simplicity of God', articles: 8),
      SummaQuestion(number: 4, title: 'The Perfection of God', articles: 3),
      SummaQuestion(number: 5, title: 'The Goodness in General', articles: 6),
    ],
  ),
  SummaPart(
    name: 'Prima Secundae (First Part of the Second Part)',
    shortName: 'I-II',
    questions: [
      SummaQuestion(number: 1, title: 'The Last End of Man', articles: 8),
      SummaQuestion(
        number: 2,
        title: 'Those Things in Which Man\'s Happiness Consists',
        articles: 8,
      ),
      SummaQuestion(
        number: 6,
        title: 'The Voluntary and the Involuntary',
        articles: 8,
      ),
    ],
  ),
  SummaPart(
    name: 'Secunda Secundae (Second Part of the Second Part)',
    shortName: 'II-II',
    questions: [
      SummaQuestion(number: 1, title: 'Faith', articles: 10),
      SummaQuestion(number: 17, title: 'Hope', articles: 8),
      SummaQuestion(number: 23, title: 'Charity', articles: 8),
    ],
  ),
  SummaPart(
    name: 'Tertia Pars (Third Part)',
    shortName: 'III',
    questions: [
      SummaQuestion(
        number: 1,
        title: 'The Fitness of the Incarnation',
        articles: 6,
      ),
      SummaQuestion(number: 60, title: 'The Sacraments', articles: 8),
      SummaQuestion(number: 73, title: 'The Eucharist', articles: 6),
    ],
  ),
];
