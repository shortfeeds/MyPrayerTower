import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Catechism of the Catholic Church screen
class CatechismScreen extends ConsumerStatefulWidget {
  const CatechismScreen({super.key});

  @override
  ConsumerState<CatechismScreen> createState() => _CatechismScreenState();
}

class _CatechismScreenState extends ConsumerState<CatechismScreen> {
  // Search query - will be used for filtering
  final TextEditingController _searchController = TextEditingController();
  int? _expandedPart;

  final List<_CatechismPart> _parts = [
    _CatechismPart(
      number: 1,
      title: 'The Profession of Faith',
      sections: [
        _CatechismSection(
          title: 'I Believe - We Believe',
          paragraphs: '26-184',
          description: 'The nature of faith and the Creed',
        ),
        _CatechismSection(
          title: 'The Creeds',
          paragraphs: '185-1065',
          description: 'Apostles\' Creed and Nicene Creed explained',
        ),
      ],
    ),
    _CatechismPart(
      number: 2,
      title: 'The Celebration of the Christian Mystery',
      sections: [
        _CatechismSection(
          title: 'The Sacramental Economy',
          paragraphs: '1066-1209',
          description: 'Liturgy and the seven sacraments',
        ),
        _CatechismSection(
          title: 'The Seven Sacraments',
          paragraphs: '1210-1690',
          description: 'Baptism, Confirmation, Eucharist, and more',
        ),
      ],
    ),
    _CatechismPart(
      number: 3,
      title: 'Life in Christ',
      sections: [
        _CatechismSection(
          title: 'Man\'s Vocation: Life in the Spirit',
          paragraphs: '1691-2051',
          description: 'Beatitudes, conscience, and virtues',
        ),
        _CatechismSection(
          title: 'The Ten Commandments',
          paragraphs: '2052-2557',
          description: 'Moral teaching and application',
        ),
      ],
    ),
    _CatechismPart(
      number: 4,
      title: 'Christian Prayer',
      sections: [
        _CatechismSection(
          title: 'Prayer in the Christian Life',
          paragraphs: '2558-2758',
          description: 'The tradition and forms of prayer',
        ),
        _CatechismSection(
          title: 'The Lord\'s Prayer',
          paragraphs: '2759-2865',
          description: 'The Our Father explained',
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Catechism',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(LucideIcons.bookmark), onPressed: () {}),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              style: GoogleFonts.inter(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search catechism...',
                hintStyle: GoogleFonts.inter(color: AppTheme.textSecondary),
                prefixIcon: const Icon(LucideIcons.search, color: Colors.grey),
                filled: true,
                fillColor: AppTheme.darkCard,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),

          // Parts list
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: _parts.length,
              itemBuilder: (context, index) {
                final part = _parts[index];
                final isExpanded = _expandedPart == index;

                return Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  decoration: BoxDecoration(
                    color: AppTheme.darkCard,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(
                      color: isExpanded
                          ? AppTheme.gold500.withValues(alpha: 0.5)
                          : Colors.transparent,
                    ),
                  ),
                  child: Column(
                    children: [
                      // Header
                      InkWell(
                        onTap: () => setState(() {
                          _expandedPart = isExpanded ? null : index;
                        }),
                        borderRadius: BorderRadius.circular(16),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: AppTheme.gold500.withValues(
                                    alpha: 0.2,
                                  ),
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: Text(
                                    '${part.number}',
                                    style: GoogleFonts.inter(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                      color: AppTheme.gold500,
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
                                      'Part ${part.number}',
                                      style: GoogleFonts.inter(
                                        fontSize: 12,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ),
                                    Text(
                                      part.title,
                                      style: GoogleFonts.merriweather(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.white,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Icon(
                                isExpanded
                                    ? LucideIcons.chevronUp
                                    : LucideIcons.chevronDown,
                                color: AppTheme.textSecondary,
                              ),
                            ],
                          ),
                        ),
                      ),

                      // Sections (when expanded)
                      if (isExpanded)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                          child: Column(
                            children: part.sections.map((section) {
                              return Container(
                                margin: const EdgeInsets.only(top: 8),
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: AppTheme.sacredNavy900,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: InkWell(
                                  onTap: () => _openSection(section),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        child: Column(
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              section.title,
                                              style: GoogleFonts.inter(
                                                fontWeight: FontWeight.bold,
                                                color: Colors.white,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              section.description,
                                              style: GoogleFonts.inter(
                                                fontSize: 12,
                                                color: AppTheme.textSecondary,
                                              ),
                                            ),
                                            const SizedBox(height: 4),
                                            Text(
                                              '¶ ${section.paragraphs}',
                                              style: GoogleFonts.inter(
                                                fontSize: 11,
                                                color: AppTheme.gold500,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Icon(
                                        LucideIcons.chevronRight,
                                        size: 18,
                                        color: AppTheme.textSecondary,
                                      ),
                                    ],
                                  ),
                                ),
                              );
                            }).toList(),
                          ),
                        ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _openSection(_CatechismSection section) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Opening ${section.title}...'),
        backgroundColor: AppTheme.gold500,
      ),
    );
  }
}

class _CatechismPart {
  final int number;
  final String title;
  final List<_CatechismSection> sections;

  _CatechismPart({
    required this.number,
    required this.title,
    required this.sections,
  });
}

class _CatechismSection {
  final String title;
  final String paragraphs;
  final String description;

  _CatechismSection({
    required this.title,
    required this.paragraphs,
    required this.description,
  });
}
