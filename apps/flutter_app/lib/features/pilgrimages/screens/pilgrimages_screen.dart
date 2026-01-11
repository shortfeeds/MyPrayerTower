import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class PilgrimageSite {
  final String name;
  final String location;
  final String country;
  final String description;
  final String significance;
  final String? virtualTourUrl;
  final String imageUrl;

  const PilgrimageSite({
    required this.name,
    required this.location,
    required this.country,
    required this.description,
    required this.significance,
    this.virtualTourUrl,
    required this.imageUrl,
  });
}

const List<PilgrimageSite> _sites = [
  PilgrimageSite(
    name: 'Vatican City & St. Peter\'s Basilica',
    location: 'Rome',
    country: 'Italy',
    description:
        'The heart of Catholicism, home to the Pope and the tomb of St. Peter.',
    significance: 'Center of the Universal Church',
    virtualTourUrl:
        'https://www.vatican.va/various/basiliche/san_pietro/vr_tour/index-en.html',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/800px-St_Peter%27s_Basilica_1.jpg',
  ),
  PilgrimageSite(
    name: 'Holy Land - Jerusalem',
    location: 'Jerusalem',
    country: 'Israel',
    description:
        'Walk where Jesus walked. Visit the Church of the Holy Sepulchre, Via Dolorosa, and more.',
    significance: 'Sites of Christ\'s life, death, and resurrection',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG/800px-Jerusalem_Holy_Sepulchre_BW_2010-09-21_18-34-14.JPG',
  ),
  PilgrimageSite(
    name: 'Lourdes',
    location: 'Lourdes',
    country: 'France',
    description:
        'Where Our Lady appeared to St. Bernadette in 1858. Known for miraculous healings.',
    significance: 'Marian apparition site',
    virtualTourUrl: 'https://www.lourdes-france.org/en/virtual-tour/',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Lourdes_Basilika_und_Grotte.jpg/800px-Lourdes_Basilika_und_Grotte.jpg',
  ),
  PilgrimageSite(
    name: 'Fatima',
    location: 'Fátima',
    country: 'Portugal',
    description:
        'Site of the 1917 apparitions to three shepherd children. Home of the Miracle of the Sun.',
    significance: 'Marian apparition site',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Fatima_sanctuary.jpg/800px-Fatima_sanctuary.jpg',
  ),
  PilgrimageSite(
    name: 'Santiago de Compostela',
    location: 'Santiago',
    country: 'Spain',
    description:
        'End point of the Camino pilgrimage. Burial site of St. James the Apostle.',
    significance: 'Apostolic shrine',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg/800px-Catedral_de_Santiago_de_Compostela_agosto_2018_%28cropped%29.jpg',
  ),
  PilgrimageSite(
    name: 'Guadalupe',
    location: 'Mexico City',
    country: 'Mexico',
    description:
        'Where Our Lady appeared to St. Juan Diego in 1531. The tilma is preserved here.',
    significance: 'Marian apparition site',
    imageUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG/800px-Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG',
  ),
];

class PilgrimagesScreen extends ConsumerWidget {
  const PilgrimagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Virtual Pilgrimages',
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
        itemCount: _sites.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final site = _sites[index];
          return Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            clipBehavior: Clip.antiAlias,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Stack(
                  children: [
                    CachedNetworkImage(
                      imageUrl: site.imageUrl,
                      height: 200,
                      width: double.infinity,
                      fit: BoxFit.cover,
                      placeholder: (context, url) => Container(
                        height: 200,
                        color: Colors.grey.shade200,
                        child: const Center(child: CircularProgressIndicator()),
                      ),
                      errorWidget: (context, url, error) => Container(
                        height: 200,
                        color: Colors.grey.shade200,
                        child: const Icon(Icons.error),
                      ),
                    ),
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.9),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              LucideIcons.globe,
                              size: 12,
                              color: Color(0xFF1E293B),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              site.country,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: const Color(0xFF1E293B),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        site.name,
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          const Icon(
                            LucideIcons.mapPin,
                            size: 14,
                            color: Colors.blue,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            site.location,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.blue.shade700,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(
                        site.description,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: const Color(0xFF64748B),
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            const Icon(
                              LucideIcons.info,
                              size: 16,
                              color: Color(0xFF64748B),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                'Significance: ${site.significance}',
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  color: const Color(0xFF475569),
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (site.virtualTourUrl != null) ...[
                        const SizedBox(height: 16),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: () =>
                                launchUrl(Uri.parse(site.virtualTourUrl!)),
                            icon: const Icon(
                              LucideIcons.externalLink,
                              size: 16,
                            ),
                            label: const Text('Take Virtual Tour'),
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.blue.shade700,
                              side: BorderSide(color: Colors.blue.shade200),
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                            ),
                          ),
                        ),
                      ],
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
