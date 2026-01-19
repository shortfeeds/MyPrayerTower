import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class VaticanIIScreen extends StatelessWidget {
  const VaticanIIScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: Text(
              'Vatican II',
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
                    LucideIcons.landmark,
                    size: 48,
                    color: AppTheme.gold500,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Second Vatican Council',
                    style: GoogleFonts.merriweather(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'The 21st Ecumenical Council — 16 documents that shaped the modern Catholic Church.',
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

          // Constitutions
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Text(
                'Constitutions (Highest Authority)',
                style: GoogleFonts.merriweather(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold500,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final doc = documents
                      .where((d) => d.type == 'constitution')
                      .toList()[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _DocumentCard(document: doc),
                  );
                },
                childCount: documents
                    .where((d) => d.type == 'constitution')
                    .length,
              ),
            ),
          ),

          // Decrees & Declarations
          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 24, 16, 8),
            sliver: SliverToBoxAdapter(
              child: Text(
                'Decrees & Declarations',
                style: GoogleFonts.merriweather(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.gold500,
                ),
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  final doc = documents
                      .where((d) => d.type != 'constitution')
                      .toList()[index];
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: _DocumentCard(document: doc),
                  );
                },
                childCount: documents
                    .where((d) => d.type != 'constitution')
                    .length,
              ),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final VaticanDoc document;

  const _DocumentCard({required this.document});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (document.type) {
      case 'constitution':
        color = Colors.purpleAccent;
        break;
      case 'decree':
        color = Colors.blueAccent;
        break;
      default:
        color = AppTheme.gold500;
    }

    return PremiumGlassCard(
      padding: EdgeInsets.zero,
      child: InkWell(
        onTap: () => launchUrl(Uri.parse(document.url)),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: color.withValues(alpha: 0.3)),
                    ),
                    child: Text(
                      document.type.toUpperCase(),
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: color,
                      ),
                    ),
                  ),
                  const Spacer(),
                  const Icon(
                    LucideIcons.externalLink,
                    size: 16,
                    color: Colors.white30,
                  ),
                ],
              ),
              const SizedBox(height: 12),
              Text(
                document.latinTitle,
                style: GoogleFonts.merriweather(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              Text(
                document.title,
                style: GoogleFonts.inter(color: Colors.white60, fontSize: 14),
              ),
              const SizedBox(height: 8),
              if (document.type == 'constitution')
                Container(
                  margin: const EdgeInsets.only(top: 4),
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.black.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(
                        LucideIcons.book,
                        size: 14,
                        color: Colors.white54,
                      ),
                      const SizedBox(width: 8),
                      Text(
                        'Topic: ${document.topic}',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white70,
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
  }
}

class VaticanDoc {
  final String title;
  final String latinTitle;
  final String type;
  final String topic;
  final String url;

  const VaticanDoc({
    required this.title,
    required this.latinTitle,
    required this.type,
    required this.topic,
    required this.url,
  });
}

const documents = [
  // Constitutions (4)
  VaticanDoc(
    title: 'On the Sacred Liturgy',
    latinTitle: 'Sacrosanctum Concilium',
    type: 'constitution',
    topic: 'Liturgy',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19631204_sacrosanctum-concilium_en.html',
  ),
  VaticanDoc(
    title: 'On the Church',
    latinTitle: 'Lumen Gentium',
    type: 'constitution',
    topic: 'Ecclesiology',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19641121_lumen-gentium_en.html',
  ),
  VaticanDoc(
    title: 'On Divine Revelation',
    latinTitle: 'Dei Verbum',
    type: 'constitution',
    topic: 'Scripture',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651118_dei-verbum_en.html',
  ),
  VaticanDoc(
    title: 'On the Church in the Modern World',
    latinTitle: 'Gaudium et Spes',
    type: 'constitution',
    topic: 'Pastoral',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_const_19651207_gaudium-et-spes_en.html',
  ),
  // Decrees (9)
  VaticanDoc(
    title: 'On the Media',
    latinTitle: 'Inter Mirifica',
    type: 'decree',
    topic: 'Communications',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19631204_inter-mirifica_en.html',
  ),
  VaticanDoc(
    title: 'On Ecumenism',
    latinTitle: 'Unitatis Redintegratio',
    type: 'decree',
    topic: 'Ecumenism',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_unitatis-redintegratio_en.html',
  ),
  VaticanDoc(
    title: 'On Eastern Churches',
    latinTitle: 'Orientalium Ecclesiarum',
    type: 'decree',
    topic: 'Eastern Rites',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19641121_orientalium-ecclesiarum_en.html',
  ),
  VaticanDoc(
    title: 'On Bishops',
    latinTitle: 'Christus Dominus',
    type: 'decree',
    topic: 'Hierarchy',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_christus-dominus_en.html',
  ),
  VaticanDoc(
    title: 'On Priestly Formation',
    latinTitle: 'Optatam Totius',
    type: 'decree',
    topic: 'Seminaries',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_optatam-totius_en.html',
  ),
  VaticanDoc(
    title: 'On Religious Life',
    latinTitle: 'Perfectae Caritatis',
    type: 'decree',
    topic: 'Religious Life',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651028_perfectae-caritatis_en.html',
  ),
  VaticanDoc(
    title: 'On the Apostolate of the Laity',
    latinTitle: 'Apostolicam Actuositatem',
    type: 'decree',
    topic: 'Laity',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651118_apostolicam-actuositatem_en.html',
  ),
  VaticanDoc(
    title: 'On Missionary Activity',
    latinTitle: 'Ad Gentes',
    type: 'decree',
    topic: 'Missions',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651207_ad-gentes_en.html',
  ),
  VaticanDoc(
    title: 'On Priestly Life',
    latinTitle: 'Presbyterorum Ordinis',
    type: 'decree',
    topic: 'Priesthood',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decree_19651207_presbyterorum-ordinis_en.html',
  ),
  // Declarations (3)
  VaticanDoc(
    title: 'On Christian Education',
    latinTitle: 'Gravissimum Educationis',
    type: 'declaration',
    topic: 'Education',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651028_gravissimum-educationis_en.html',
  ),
  VaticanDoc(
    title: 'On Non-Christian Religions',
    latinTitle: 'Nostra Aetate',
    type: 'declaration',
    topic: 'Interfaith',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651028_nostra-aetate_en.html',
  ),
  VaticanDoc(
    title: 'On Religious Freedom',
    latinTitle: 'Dignitatis Humanae',
    type: 'declaration',
    topic: 'Freedom',
    url:
        'https://www.vatican.va/archive/hist_councils/ii_vatican_council/documents/vat-ii_decl_19651207_dignitatis-humanae_en.html',
  ),
];
