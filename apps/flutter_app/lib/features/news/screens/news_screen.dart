import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../ads/widgets/native_ad_widget.dart';

class NewsSource {
  final String name;
  final String url;
  final String feed;
  final String logo;
  final String description;

  const NewsSource({
    required this.name,
    required this.url,
    required this.feed,
    required this.logo,
    required this.description,
  });
}

const List<NewsSource> _sources = [
  NewsSource(
    name: 'Vatican News',
    url: 'https://www.vaticannews.va/en.html',
    feed: 'https://www.vaticannews.va/en.rss.xml',
    logo: '🇻🇦',
    description: 'Official news portal of the Holy See',
  ),
  NewsSource(
    name: 'Catholic News Agency',
    url: 'https://www.catholicnewsagency.com/',
    feed: 'https://www.catholicnewsagency.com/rss',
    logo: '📰',
    description: 'Breaking Catholic news & analysis',
  ),
  NewsSource(
    name: 'EWTN News',
    url: 'https://www.ncregister.com/',
    feed: 'https://www.ncregister.com/rss',
    logo: '📺',
    description: 'National Catholic Register - In-depth Catholic journalism',
  ),
  NewsSource(
    name: 'Catholic Herald',
    url: 'https://catholicherald.co.uk/',
    feed: 'https://catholicherald.co.uk/feed/',
    logo: '🇬🇧',
    description: 'UK-based Catholic news and commentary',
  ),
  NewsSource(
    name: 'Crux Now',
    url: 'https://cruxnow.com/',
    feed: 'https://cruxnow.com/feed',
    logo: '✝️',
    description: 'Taking the Catholic pulse',
  ),
  NewsSource(
    name: 'America Magazine',
    url: 'https://www.americamagazine.org/',
    feed: 'https://www.americamagazine.org/rss.xml',
    logo: '🇺🇸',
    description: 'Jesuit review of faith and culture',
  ),
];

class NewsScreen extends ConsumerWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Catholic News',
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
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // Sources Grid
            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _sources.length + 1, // +1 for Ad
              separatorBuilder: (context, index) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                // Insert Ad at index 3
                if (index == 3) {
                  return const NativeAdListItem();
                }

                // Adjust index for data source
                final int dataIndex = index > 3 ? index - 1 : index;
                if (dataIndex >= _sources.length) return const SizedBox();

                final source = _sources[dataIndex];
                return InkWell(
                  onTap: () => launchUrl(
                    Uri.parse(source.url),
                    mode: LaunchMode.inAppWebView,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.02),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(source.logo, style: const TextStyle(fontSize: 32)),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      source.name,
                                      style: GoogleFonts.merriweather(
                                        fontSize: 16,
                                        fontWeight: FontWeight.bold,
                                        color: const Color(0xFF1E293B),
                                      ),
                                    ),
                                  ),
                                  const Icon(
                                    LucideIcons.externalLink,
                                    size: 16,
                                    color: Colors.grey,
                                  ),
                                ],
                              ),
                              const SizedBox(height: 4),
                              Text(
                                source.description,
                                style: GoogleFonts.inter(
                                  fontSize: 13,
                                  color: const Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),

            const SizedBox(height: 32),

            // RSS Info
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.orange.shade50, Colors.orange.shade100],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(color: Colors.orange.shade200),
              ),
              child: Column(
                children: [
                  const Icon(LucideIcons.rss, size: 40, color: Colors.orange),
                  const SizedBox(height: 16),
                  Text(
                    'Subscribe via RSS',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: Colors.orange.shade900,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'These sources offer RSS feeds for your favorite reader.',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      color: Colors.orange.shade800,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    alignment: WrapAlignment.center,
                    children: _sources
                        .take(3)
                        .map(
                          (s) => ActionChip(
                            label: Text('${s.name} RSS'),
                            onPressed: () => launchUrl(
                              Uri.parse(s.feed),
                              mode: LaunchMode.inAppWebView,
                            ),
                            backgroundColor: Colors.white,
                            labelStyle: TextStyle(
                              color: Colors.orange.shade800,
                              fontSize: 12,
                            ),
                            avatar: const Icon(
                              LucideIcons.rss,
                              size: 14,
                              color: Colors.orange,
                            ),
                          ),
                        )
                        .toList(),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
