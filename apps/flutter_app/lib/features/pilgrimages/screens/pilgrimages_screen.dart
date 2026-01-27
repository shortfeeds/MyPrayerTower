import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/pilgrimage_provider.dart';
import '../services/passport_service.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';

class PilgrimagesScreen extends ConsumerStatefulWidget {
  const PilgrimagesScreen({super.key});

  @override
  ConsumerState<PilgrimagesScreen> createState() => _PilgrimagesScreenState();
}

class _PilgrimagesScreenState extends ConsumerState<PilgrimagesScreen> {
  bool _showPassport = false;

  @override
  Widget build(BuildContext context) {
    final pilgrimagesAsync = ref.watch(pilgrimagesProvider);
    final stampsAsync = ref.watch(passportStampsProvider);

    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        title: Text(
          'Virtual Pilgrimages',
          style: GoogleFonts.playfairDisplay(fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(_showPassport ? LucideIcons.map : LucideIcons.bookOpen),
            onPressed: () => setState(() => _showPassport = !_showPassport),
            tooltip: _showPassport ? 'View Sites' : 'View Passport',
          ),
        ],
      ),
      body: _showPassport
          ? _PassportView(stampsAsync: stampsAsync)
          : _SitesView(pilgrimagesAsync: pilgrimagesAsync),
    );
  }
}

class _SitesView extends ConsumerWidget {
  final AsyncValue<List<dynamic>> pilgrimagesAsync;

  const _SitesView({required this.pilgrimagesAsync});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return pilgrimagesAsync.when(
      data: (sites) {
        if (sites.isEmpty) {
          return const Center(child: Text('No pilgrimages found.'));
        }
        return ListView.builder(
          padding: const EdgeInsets.all(20),
          itemCount: sites.length,
          itemBuilder: (context, index) {
            final site = sites[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 24),
              child: PremiumGlassCard(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildImageHeader(site),
                    Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            site.name,
                            style: GoogleFonts.merriweather(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 8),
                          _buildLocationInfo(site),
                          const SizedBox(height: 16),
                          Text(
                            site.description,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: Colors.white70,
                              height: 1.5,
                            ),
                          ),
                          const SizedBox(height: 20),
                          _buildVirtualTourButton(context, ref, site),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error: $e')),
    );
  }

  Widget _buildImageHeader(dynamic site) {
    return Stack(
      children: [
        ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          child: CachedNetworkImage(
            imageUrl: site.imageUrl,
            height: 220,
            width: double.infinity,
            fit: BoxFit.cover,
          ),
        ),
        Positioned(
          top: 16,
          left: 16,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.6),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white24),
            ),
            child: Row(
              children: [
                const Icon(
                  LucideIcons.globe,
                  size: 12,
                  color: AppTheme.gold400,
                ),
                const SizedBox(width: 6),
                Text(
                  site.country.toUpperCase(),
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildLocationInfo(dynamic site) {
    return Row(
      children: [
        const Icon(LucideIcons.mapPin, size: 14, color: AppTheme.gold400),
        const SizedBox(width: 6),
        Text(
          site.location,
          style: GoogleFonts.inter(
            fontSize: 14,
            color: AppTheme.gold100,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _buildVirtualTourButton(
    BuildContext context,
    WidgetRef ref,
    dynamic site,
  ) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () async {
          if (site.virtualTourUrl != null) {
            await ref
                .read(passportServiceProvider)
                .addStamp(site.id, site.name);
            await launchUrl(
              Uri.parse(site.virtualTourUrl!),
              mode: LaunchMode.inAppWebView,
            );

            if (!context.mounted) return;

            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text(
                  'Passport Stamped! Journey recorded in your soul.',
                ),
                backgroundColor: AppTheme.gold600,
              ),
            );
          }
        },
        icon: const Icon(LucideIcons.externalLink, size: 18),
        label: const Text('EMBARK ON PILGRIMAGE'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppTheme.gold500,
          foregroundColor: AppTheme.sacredNavy950,
          padding: const EdgeInsets.symmetric(vertical: 16),
        ),
      ),
    );
  }
}

class _PassportView extends StatelessWidget {
  final AsyncValue<List<PassportStamp>> stampsAsync;

  const _PassportView({required this.stampsAsync});

  @override
  Widget build(BuildContext context) {
    return stampsAsync.when(
      data: (stamps) {
        if (stamps.isEmpty) {
          return Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(
                  LucideIcons.bookOpen,
                  size: 64,
                  color: Colors.white24,
                ),
                const SizedBox(height: 24),
                Text(
                  'Your Passport is Empty',
                  style: GoogleFonts.playfairDisplay(
                    fontSize: 22,
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 8),
                const Text(
                  'Embark on virtual journeys to earn stamps.',
                  style: TextStyle(color: Colors.white54),
                ),
              ],
            ),
          );
        }

        return Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'YOUR SPIRITUAL JOURNEY',
                style: GoogleFonts.inter(
                  color: AppTheme.gold500,
                  fontSize: 12,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 2,
                ),
              ),
              const SizedBox(height: 24),
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 0.8,
                  ),
                  itemCount: stamps.length,
                  itemBuilder: (context, index) {
                    final stamp = stamps[index];
                    return Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.05),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: AppTheme.gold500.withValues(alpha: 0.2),
                        ),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Container(
                            width: 80,
                            height: 80,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              border: Border.all(
                                color: AppTheme.gold500,
                                width: 2,
                              ),
                            ),
                            child: const Center(
                              child: Icon(
                                LucideIcons.landmark,
                                color: AppTheme.gold500,
                                size: 32,
                              ),
                            ),
                          ),
                          const SizedBox(height: 16),
                          Text(
                            stamp.name,
                            textAlign: TextAlign.center,
                            style: GoogleFonts.merriweather(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            '${stamp.visitedAt.day}/${stamp.visitedAt.month}/${stamp.visitedAt.year}',
                            style: const TextStyle(
                              color: Colors.white30,
                              fontSize: 10,
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
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Center(child: Text('Error: $e')),
    );
  }
}
