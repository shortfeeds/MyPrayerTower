import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class Hymn {
  final String title;
  final String? latinTitle;
  final String type; // 'traditional', 'marian', 'eucharistic', 'seasonal'
  final String firstLine;
  final int verses;

  const Hymn({
    required this.title,
    this.latinTitle,
    required this.type,
    required this.firstLine,
    required this.verses,
  });
}

const List<Hymn> _hymns = [
  Hymn(
    title: 'Holy God, We Praise Thy Name',
    latinTitle: 'Grosser Gott',
    type: 'traditional',
    firstLine:
        'Holy God, we praise Thy name; Lord of all, we bow before Thee...',
    verses: 4,
  ),
  Hymn(
    title: 'Immaculate Mary',
    type: 'marian',
    firstLine: 'Immaculate Mary, your praises we sing...',
    verses: 4,
  ),
  Hymn(
    title: 'Hail, Holy Queen Enthroned Above',
    latinTitle: 'Salve, Regina',
    type: 'marian',
    firstLine: 'Hail, Holy Queen enthroned above, O Maria...',
    verses: 3,
  ),
  Hymn(
    title: 'O Salutaris Hostia',
    type: 'eucharistic',
    firstLine:
        'O saving Victim, opening wide the gate of heaven to us below...',
    verses: 2,
  ),
  Hymn(
    title: 'Tantum Ergo',
    type: 'eucharistic',
    firstLine: 'Down in adoration falling, this great sacrament we hail...',
    verses: 2,
  ),
  Hymn(
    title: 'Panis Angelicus',
    type: 'eucharistic',
    firstLine:
        'Bread of angels, made the bread of those who journey from their homes...',
    verses: 2,
  ),
  Hymn(
    title: 'Adeste Fideles',
    type: 'seasonal',
    firstLine: 'O come, all ye faithful, joyful and triumphant...',
    verses: 4,
  ),
  Hymn(
    title: 'Veni, Veni Emmanuel',
    type: 'seasonal',
    firstLine: 'O come, O come, Emmanuel, and ransom captive Israel...',
    verses: 7,
  ),
  Hymn(
    title: 'Stabat Mater',
    type: 'marian',
    firstLine:
        'At the cross her station keeping, stood the mournful Mother weeping...',
    verses: 20,
  ),
  Hymn(
    title: 'Ave Maria',
    type: 'marian',
    firstLine: 'Ave Maria, gratia plena, Dominus tecum...',
    verses: 1,
  ),
  Hymn(
    title: 'Faith of Our Fathers',
    type: 'traditional',
    firstLine:
        'Faith of our fathers, living still, in spite of dungeon, fire, and sword...',
    verses: 4,
  ),
  Hymn(
    title: 'Amazing Grace',
    type: 'traditional',
    firstLine:
        'Amazing grace, how sweet the sound, that saved a wretch like me...',
    verses: 5,
  ),
];

class HymnsScreen extends ConsumerStatefulWidget {
  const HymnsScreen({super.key});

  @override
  ConsumerState<HymnsScreen> createState() => _HymnsScreenState();
}

class _HymnsScreenState extends ConsumerState<HymnsScreen> {
  String _filter = 'all';
  String _searchQuery = '';

  Map<String, Color> get _typeColors => {
    'traditional': Colors.blue,
    'marian': Colors.pink,
    'eucharistic': Colors.amber,
    'seasonal': Colors.green,
  };

  Map<String, Color> get _typeBgColors => {
    'traditional': Colors.blue.shade50,
    'marian': Colors.pink.shade50,
    'eucharistic': Colors.amber.shade50,
    'seasonal': Colors.green.shade50,
  };

  @override
  Widget build(BuildContext context) {
    final filteredHymns = _hymns.where((h) {
      final matchesSearch = h.title.toLowerCase().contains(
        _searchQuery.toLowerCase(),
      );
      final matchesFilter = _filter == 'all' || h.type == _filter;
      return matchesSearch && matchesFilter;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Hymn Library',
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1E293B),
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
      ),
      body: Column(
        children: [
          // Search & Filter Header
          Container(
            color: Colors.white,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Column(
              children: [
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  decoration: InputDecoration(
                    hintText: 'Search hymns...',
                    prefixIcon: const Icon(
                      LucideIcons.search,
                      color: Colors.grey,
                    ),
                    filled: true,
                    fillColor: Colors.grey.shade50,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                    contentPadding: const EdgeInsets.symmetric(vertical: 0),
                  ),
                ),
                const SizedBox(height: 12),
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children:
                        [
                          'all',
                          'traditional',
                          'marian',
                          'eucharistic',
                          'seasonal',
                        ].map((type) {
                          final isSelected = _filter == type;
                          final color = type == 'all'
                              ? Colors.purple
                              : _typeColors[type] ?? Colors.grey;

                          return Padding(
                            padding: const EdgeInsets.only(right: 8),
                            child: FilterChip(
                              label: Text(
                                type[0].toUpperCase() + type.substring(1),
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: isSelected
                                      ? FontWeight.bold
                                      : FontWeight.w500,
                                  color: isSelected
                                      ? Colors.white
                                      : Colors.grey.shade700,
                                ),
                              ),
                              selected: isSelected,
                              onSelected: (selected) {
                                if (selected) setState(() => _filter = type);
                              },
                              backgroundColor: Colors.white,
                              selectedColor: color,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(20),
                                side: BorderSide(
                                  color: isSelected
                                      ? Colors.transparent
                                      : Colors.grey.shade200,
                                ),
                              ),
                              showCheckmark: false,
                              padding: const EdgeInsets.symmetric(
                                horizontal: 4,
                                vertical: 0,
                              ),
                            ),
                          );
                        }).toList(),
                  ),
                ),
              ],
            ),
          ),

          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: filteredHymns.length + 1, // +1 for footer
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                if (index == filteredHymns.length) {
                  // Resources Footer
                  return Container(
                    padding: const EdgeInsets.all(24),
                    child: Column(
                      children: [
                        Text(
                          'Sheet Music & Recordings',
                          style: GoogleFonts.merriweather(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            _ResourceButton(
                              label: 'CPDL',
                              url:
                                  'https://www.cpdl.org/wiki/index.php/Main_Page',
                            ),
                            SizedBox(width: 12),
                            _ResourceButton(
                              label: 'Hymnary.org',
                              url: 'https://hymnary.org/',
                            ),
                          ],
                        ),
                      ],
                    ),
                  );
                }

                final hymn = filteredHymns[index];
                final color = _typeColors[hymn.type] ?? Colors.grey;
                final bgColor = _typeBgColors[hymn.type] ?? Colors.grey.shade50;

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.grey.shade100),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withValues(alpha: 0.02),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: bgColor,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              hymn.type.toUpperCase(),
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: color,
                              ),
                            ),
                          ),
                          Text(
                            '${hymn.verses} verses',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: Colors.grey.shade400,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        hymn.title,
                        style: GoogleFonts.merriweather(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1E293B),
                        ),
                      ),
                      if (hymn.latinTitle != null)
                        Text(
                          hymn.latinTitle!,
                          style: GoogleFonts.inter(
                            fontSize: 13,
                            color: Colors.purple.shade600,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      const SizedBox(height: 8),
                      Text(
                        '"${hymn.firstLine}"',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontStyle: FontStyle.italic,
                          color: const Color(0xFF64748B),
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
}

class _ResourceButton extends StatelessWidget {
  final String label;
  final String url;

  const _ResourceButton({required this.label, required this.url});

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: () => launchUrl(Uri.parse(url), mode: LaunchMode.inAppWebView),
      icon: const Icon(LucideIcons.externalLink, size: 14),
      label: Text(label),
      style: OutlinedButton.styleFrom(
        foregroundColor: const Color(0xFF64748B),
        side: BorderSide(color: Colors.grey.shade300),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
    );
  }
}
