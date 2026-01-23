import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/pilgrimage_provider.dart';

class PilgrimagesScreen extends ConsumerWidget {
  const PilgrimagesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final pilgrimagesAsync = ref.watch(pilgrimagesProvider);

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
      body: pilgrimagesAsync.when(
        data: (sites) {
          if (sites.isEmpty) {
            return const Center(child: Text('No pilgrimages found.'));
          }
          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: sites.length,
            separatorBuilder: (context, index) => const SizedBox(height: 16),
            itemBuilder: (context, index) {
              final site = sites[index];
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
                            child: const Center(
                              child: CircularProgressIndicator(),
                            ),
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
                                onPressed: () => launchUrl(
                                  Uri.parse(site.virtualTourUrl!),
                                  mode: LaunchMode.inAppWebView,
                                ),
                                icon: const Icon(
                                  LucideIcons.externalLink,
                                  size: 16,
                                ),
                                label: const Text('Take Virtual Tour'),
                                style: OutlinedButton.styleFrom(
                                  foregroundColor: Colors.blue.shade700,
                                  side: BorderSide(color: Colors.blue.shade200),
                                  padding: const EdgeInsets.symmetric(
                                    vertical: 12,
                                  ),
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
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, st) => Center(child: Text('Error: $e')),
      ),
    );
  }
}
