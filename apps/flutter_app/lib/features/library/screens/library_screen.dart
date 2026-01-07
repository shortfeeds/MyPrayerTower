import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/library_repository.dart';
import 'web_document_screen.dart';

class LibraryScreen extends ConsumerWidget {
  const LibraryScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final documents = ref.watch(libraryDocumentsProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Library',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.menu),
          onPressed: () => Scaffold.of(context).openDrawer(),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Header
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  AppTheme.gold500.withValues(alpha: 0.15),
                  AppTheme.sacredNavy900,
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.gold500.withValues(alpha: 0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    LucideIcons.library,
                    color: AppTheme.gold500,
                    size: 28,
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Catholic Library',
                        style: GoogleFonts.merriweather(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        'Church documents, teachings & encyclicals',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white54,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),

          // Essential Documents
          const _SectionHeader(title: 'Essential Documents'),
          const SizedBox(height: 12),
          ...documents
              .where(
                (d) => ['CATECHISM', 'CANON_LAW', 'GIRM'].contains(d.category),
              )
              .map((doc) => _DocumentCard(document: doc)),

          const SizedBox(height: 24),

          // Papal Encyclicals
          const _SectionHeader(title: 'Papal Encyclicals'),
          const SizedBox(height: 12),
          ...documents
              .where((d) => d.category == 'ENCYCLICAL')
              .map((doc) => _DocumentCard(document: doc)),

          const SizedBox(height: 24),

          // Quick Links
          const _SectionHeader(title: 'External Resources'),
          const SizedBox(height: 12),
          const _QuickLinkCard(
            icon: LucideIcons.globe,
            title: 'Vatican Website',
            subtitle: 'Official Vatican documents and news',
            url: 'https://www.vatican.va',
            color: Colors.amber,
          ),
          const _QuickLinkCard(
            icon: LucideIcons.book,
            title: 'USCCB',
            subtitle: 'US Conference of Catholic Bishops',
            url: 'https://www.usccb.org',
            color: Colors.blue,
          ),

          const SizedBox(height: 100),
        ],
      ),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final String title;

  const _SectionHeader({required this.title});

  @override
  Widget build(BuildContext context) {
    return Text(
      title.toUpperCase(),
      style: GoogleFonts.inter(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        color: AppTheme.gold500,
        letterSpacing: 1.5,
      ),
    );
  }
}

class _DocumentCard extends StatelessWidget {
  final LibraryDocument document;

  const _DocumentCard({required this.document});

  Color get _categoryColor {
    switch (document.category) {
      case 'CATECHISM':
        return Colors.amber;
      case 'CANON_LAW':
        return Colors.purple;
      case 'GIRM':
        return Colors.teal;
      case 'ENCYCLICAL':
        return Colors.blue;
      default:
        return Colors.grey;
    }
  }

  IconData get _categoryIcon {
    switch (document.category) {
      case 'CATECHISM':
        return LucideIcons.book;
      case 'CANON_LAW':
        return LucideIcons.scale;
      case 'GIRM':
        return LucideIcons.fileText;
      case 'ENCYCLICAL':
        return LucideIcons.scroll;
      default:
        return LucideIcons.file;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white10),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _openDocument(context),
          borderRadius: BorderRadius.circular(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _categoryColor.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(_categoryIcon, color: _categoryColor, size: 24),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        document.title,
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        document.content,
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white54,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      if (document.paragraphCount != null) ...[
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Icon(
                              LucideIcons.fileText,
                              size: 12,
                              color: _categoryColor.withValues(alpha: 0.8),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${document.paragraphCount} paragraphs',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: _categoryColor,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ],
                  ),
                ),
                const Icon(
                  LucideIcons.chevronRight,
                  size: 20,
                  color: Colors.white38,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  void _openDocument(BuildContext context) async {
    // Navigate to appropriate screen
    if (document.id == 'catechism') {
      Navigator.of(context).pushNamed('/catechism');
    } else if (document.id == 'canon_law') {
      Navigator.of(context).pushNamed('/canon_law');
    } else if (document.source.startsWith('http')) {
      // Open in internal Web Document Viewer
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (context) =>
              WebDocumentScreen(title: document.title, url: document.source),
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Opening ${document.title}...'),
          backgroundColor: AppTheme.gold500,
        ),
      );
    }
  }
}

class _QuickLinkCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final String url;
  final Color color;

  const _QuickLinkCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.url,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            final uri = Uri.parse(url);
            if (await canLaunchUrl(uri)) {
              await launchUrl(uri, mode: LaunchMode.externalApplication);
            }
          },
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: GoogleFonts.inter(
                          fontWeight: FontWeight.w600,
                          color: Colors.white,
                        ),
                      ),
                      Text(
                        subtitle,
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          color: Colors.white54,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(LucideIcons.externalLink, size: 16, color: color),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
