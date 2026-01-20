import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

class Chaplet {
  final String id;
  final String name;
  final String patron;
  final String beads;
  final String description;
  final Color color;
  final List<ChapletPrayer> prayers;

  const Chaplet({
    required this.id,
    required this.name,
    required this.patron,
    required this.beads,
    required this.description,
    required this.color,
    required this.prayers,
  });
}

class ChapletPrayer {
  final String name;
  final String text;

  const ChapletPrayer({required this.name, required this.text});
}

const List<Chaplet> _chaplets = [
  Chaplet(
    id: 'divine-mercy',
    name: 'Divine Mercy Chaplet',
    patron: 'Divine Mercy of Jesus',
    beads: 'Standard Rosary beads',
    description:
        'Given by Jesus to St. Faustina. Prayed especially at 3:00 PM, the Hour of Great Mercy.',
    color: Color(0xFFE11D48), // Rose-600
    prayers: [
      ChapletPrayer(
        name: 'Opening',
        text:
            'You expired, Jesus, but the source of life gushed forth for souls, and the ocean of mercy opened up for the whole world.',
      ),
      ChapletPrayer(
        name: 'On Large Beads',
        text:
            'Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.',
      ),
      ChapletPrayer(
        name: 'On Small Beads',
        text:
            'For the sake of His sorrowful Passion, have mercy on us and on the whole world.',
      ),
      ChapletPrayer(
        name: 'Closing (3x)',
        text:
            'Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.',
      ),
    ],
  ),
  Chaplet(
    id: 'st-michael',
    name: 'St. Michael Chaplet',
    patron: 'St. Michael the Archangel',
    beads: 'Special St. Michael chaplet',
    description:
        'Honors the nine choirs of angels and invokes St. Michael\'s protection against evil.',
    color: Color(0xFF2563EB), // Blue-600
    prayers: [
      ChapletPrayer(
        name: 'Invocation',
        text:
            'O God, come to my assistance. O Lord, make haste to help me. Glory be...',
      ),
      ChapletPrayer(
        name: 'Per Choir',
        text:
            'By the intercession of St. Michael and the celestial Choir of [Seraphim/Cherubim/etc.], may the Lord make us worthy to burn with the fire of perfect charity. Amen.',
      ),
    ],
  ),
  Chaplet(
    id: 'holy-wounds',
    name: 'Chaplet of the Holy Wounds',
    patron: 'Holy Wounds of Jesus',
    beads: 'Standard Rosary beads',
    description:
        'Meditates on the five wounds of Christ received during His Passion.',
    color: Color(0xFF7C3AED), // Violet-600
    prayers: [
      ChapletPrayer(
        name: 'On Large Beads',
        text:
            'Eternal Father, I offer Thee the Wounds of our Lord Jesus Christ, to heal the wounds of our souls.',
      ),
      ChapletPrayer(
        name: 'On Small Beads',
        text:
            'My Jesus, pardon and mercy, through the merits of Thy Holy Wounds.',
      ),
    ],
  ),
  Chaplet(
    id: 'holy-spirit',
    name: 'Chaplet of the Holy Spirit',
    patron: 'Holy Spirit',
    beads: '7 groups of 7 beads',
    description:
        'Invokes the seven gifts of the Holy Spirit for guidance and strength.',
    color: Color(0xFFF59E0B), // Amber-500
    prayers: [
      ChapletPrayer(
        name: 'Per Gift',
        text:
            'Come, O Spirit of [Wisdom/Understanding/Counsel/etc.], fill the hearts of Thy faithful and kindle in them the fire of Thy love.',
      ),
    ],
  ),
  Chaplet(
    id: 'sacred-heart',
    name: 'Chaplet of the Sacred Heart',
    patron: 'Sacred Heart of Jesus',
    beads: '33 beads (years of Christ\'s life)',
    description:
        'Honors the Sacred Heart of Jesus and His infinite love for humanity.',
    color: Color(0xFFDC2626), // Red-600
    prayers: [
      ChapletPrayer(
        name: 'On Each Bead',
        text: 'Sacred Heart of Jesus, I trust in Thee.',
      ),
    ],
  ),
  Chaplet(
    id: 'seven-sorrows',
    name: 'Seven Sorrows of Mary',
    patron: 'Our Lady of Sorrows',
    beads: '7 groups of 7 beads',
    description: 'Meditates on the seven sorrows Mary experienced in her life.',
    color: Color(0xFF475569), // Slate-600
    prayers: [
      ChapletPrayer(
        name: 'Opening',
        text:
            'Most Merciful Mother, remind us always about the Sorrows of your Son, Jesus.',
      ),
    ],
  ),
];

class ChapletsScreen extends ConsumerStatefulWidget {
  const ChapletsScreen({super.key});

  @override
  ConsumerState<ChapletsScreen> createState() => _ChapletsScreenState();
}

class _ChapletsScreenState extends ConsumerState<ChapletsScreen> {
  String? _expandedId = 'divine-mercy';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Chaplet Collection',
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
      body: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _chaplets.length,
        separatorBuilder: (context, index) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final chaplet = _chaplets[index];
          final isExpanded = _expandedId == chaplet.id;

          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.grey.shade200),
            ),
            child: Column(
              children: [
                InkWell(
                  onTap: () => setState(
                    () => _expandedId = isExpanded ? null : chaplet.id,
                  ),
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16),
                    bottom: Radius.circular(16),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            color: chaplet.color.withValues(alpha: 0.1),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(LucideIcons.gem, color: chaplet.color),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                chaplet.name,
                                style: GoogleFonts.inter(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                  color: const Color(0xFF1E293B),
                                ),
                              ),
                              Text(
                                chaplet.patron,
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  color: const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          isExpanded
                              ? LucideIcons.chevronUp
                              : LucideIcons.chevronDown,
                          color: const Color(0xFF94A3B8),
                        ),
                      ],
                    ),
                  ),
                ),
                if (isExpanded)
                  Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Divider(height: 1),
                        const SizedBox(height: 12),
                        Text(
                          chaplet.description,
                          style: GoogleFonts.inter(
                            color: const Color(0xFF475569),
                            height: 1.5,
                          ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(
                              LucideIcons.circleDot,
                              size: 14,
                              color: Color(0xFF64748B),
                            ),
                            const SizedBox(width: 6),
                            Text(
                              'Beads: ${chaplet.beads}',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                color: const Color(0xFF64748B),
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 16),
                        ...chaplet.prayers.map(
                          (prayer) => Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: Colors.grey.shade100),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  prayer.name,
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: const Color(0xFF334155),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  prayer.text,
                                  style: GoogleFonts.inter(
                                    fontSize: 14,
                                    color: const Color(0xFF475569),
                                    height: 1.4,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }
}
