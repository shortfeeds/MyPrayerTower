import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:geolocator/geolocator.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';
import 'package:url_launcher/url_launcher.dart';
import '../providers/church_provider.dart';
import '../models/church_model.dart';

// Parish class definition removed as we use Church model now

class ParishFinderScreen extends ConsumerStatefulWidget {
  const ParishFinderScreen({super.key});

  @override
  ConsumerState<ParishFinderScreen> createState() => _ParishFinderScreenState();
}

class _ParishFinderScreenState extends ConsumerState<ParishFinderScreen> {
  String? _error;
  bool _isLoadingLocation = false;

  Future<void> _findParishes() async {
    setState(() {
      _isLoadingLocation = true;
      _error = null;
    });

    try {
      final permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        final request = await Geolocator.requestPermission();
        if (request == LocationPermission.denied) {
          throw Exception('Location permission denied');
        }
      }

      if (permission == LocationPermission.deniedForever) {
        throw Exception(
          'Location permissions are permanently denied, we cannot request permissions.',
        );
      }

      final position = await Geolocator.getCurrentPosition();
      ref.read(currentLocationProvider.notifier).state = position;
    } catch (e) {
      if (mounted) {
        setState(() => _error = e.toString());
      }
    } finally {
      if (mounted) {
        setState(() => _isLoadingLocation = false);
      }
    }
  }

  Future<void> _launchMaps(String? address) async {
    if (address == null) return;
    final uri = Uri.parse(
      'https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent(address)}',
    );
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  Future<void> _launchUrl(String url) async {
    final uri = Uri.parse(url);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri);
    }
  }

  @override
  Widget build(BuildContext context) {
    final nearbyAsync = ref.watch(nearbyChurchesProvider);
    final currentLocation = ref.watch(currentLocationProvider);

    return Scaffold(
      backgroundColor: Colors.black,
      body: Stack(
        children: [
          // Background Image (Altar) - Consistent with Candles Screen
          Positioned.fill(
            child: Image.asset(
              'assets/images/candles/altar.png',
              fit: BoxFit.cover,
            ),
          ),
          // Dark Overlay for readability
          Positioned.fill(
            child: Container(color: Colors.black.withValues(alpha: 0.7)),
          ),

          // Main Content
          Column(
            children: [
              // AppBar (Transparent)
              AppBar(
                backgroundColor: Colors.transparent,
                elevation: 0,
                title: Text(
                  'Parish Finder',
                  style: GoogleFonts.merriweather(
                    // Use Merriweather for consistency
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                leading: IconButton(
                  icon: const Icon(
                    LucideIcons.chevronLeft,
                    color: Colors.white,
                  ),
                  onPressed: () => context.pop(),
                ),
              ),

              // Search Header with Search Button
              Padding(
                padding: const EdgeInsets.symmetric(
                  horizontal: 20,
                  vertical: 10,
                ),
                child: Column(
                  children: [
                    const Icon(
                      LucideIcons.church,
                      size: 48,
                      color: AppTheme.gold400,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Find Nearby Mass',
                      style: GoogleFonts.merriweather(
                        fontSize: 24,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Locate Catholic churches and Mass times near you.',
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: _isLoadingLocation ? null : _findParishes,
                        icon: _isLoadingLocation
                            ? const SizedBox(
                                width: 20,
                                height: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  color: Colors.white,
                                ),
                              )
                            : const Icon(LucideIcons.mapPin),
                        label: Text(
                          _isLoadingLocation
                              ? 'Locating...'
                              : 'Find Near Current Location',
                          style: const TextStyle(fontWeight: FontWeight.bold),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.gold600,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(30),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Results List
              Expanded(child: _buildBody(nearbyAsync, currentLocation)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildBody(
    AsyncValue<List<Church>> nearbyAsync,
    Position? currentLocation,
  ) {
    if (_error != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                LucideIcons.alertCircle,
                color: Colors.redAccent,
                size: 48,
              ),
              const SizedBox(height: 16),
              Text(
                'Unable to get location',
                style: GoogleFonts.merriweather(
                  color: Colors.white,
                  fontSize: 18,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                _error!,
                style: GoogleFonts.inter(color: Colors.white70),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      );
    }

    if (currentLocation == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              LucideIcons.map,
              size: 64,
              color: Colors.white.withValues(alpha: 0.1),
            ),
            const SizedBox(height: 16),
            Text(
              'Tap above to search nearby',
              style: GoogleFonts.inter(color: Colors.white38),
            ),
          ],
        ),
      );
    }

    return nearbyAsync.when(
      data: (churches) {
        if (churches.isEmpty) {
          return Center(
            child: Text(
              'No churches found nearby',
              style: GoogleFonts.inter(color: Colors.white70),
            ),
          );
        }
        return ListView.builder(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 30),
          itemCount: churches.length,
          itemBuilder: (context, index) {
            final church = churches[index];
            return _ParishCard(
              church: church,
              onMapTap: () => _launchMaps(church.address),
              onWebTap: church.website != null
                  ? () => _launchUrl(church.website!)
                  : null,
            );
          },
        );
      },
      loading: () => const Center(
        child: CircularProgressIndicator(color: AppTheme.gold500),
      ),
      error: (e, st) => Center(
        child: Text(
          'Error loading churches',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
      ),
    );
  }
}

class _ParishCard extends StatelessWidget {
  final Church church;
  final VoidCallback onMapTap;
  final VoidCallback? onWebTap;

  const _ParishCard({
    required this.church,
    required this.onMapTap,
    this.onWebTap,
  });

  @override
  Widget build(BuildContext context) {
    // Assuming address is not null for display, or handle gracefully
    final addressDisplay = church.address ?? '${church.city}, ${church.state}';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.black.withValues(alpha: 0.5), // Semi-transparent card
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.3),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      church.name,
                      style: GoogleFonts.merriweather(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      addressDisplay,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              // Distance display currently not in model, can be added later or calculated
              // Hiding for now to avoid errors
              /*
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppTheme.gold500.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  church.distance ?? 'Nearby', 
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontWeight: FontWeight.bold,
                    color: AppTheme.gold400,
                  ),
                ),
              ),
              */
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: OutlinedButton.icon(
                  onPressed: onMapTap,
                  icon: const Icon(LucideIcons.map, size: 16),
                  label: const Text('Directions'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side: const BorderSide(color: Colors.white24),
                  ),
                ),
              ),
              if (onWebTap != null) ...[
                const SizedBox(width: 12),
                OutlinedButton.icon(
                  onPressed: onWebTap,
                  icon: const Icon(LucideIcons.globe, size: 16),
                  label: const Text('Website'),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: AppTheme.gold400,
                    side: BorderSide(
                      color: AppTheme.gold400.withValues(alpha: 0.5),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}
