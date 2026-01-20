import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../core/theme/app_theme.dart';

/// Offline sponsor management screen for admin users
class SponsorManagementScreen extends ConsumerStatefulWidget {
  const SponsorManagementScreen({super.key});

  @override
  ConsumerState<SponsorManagementScreen> createState() =>
      _SponsorManagementScreenState();
}

class _SponsorManagementScreenState
    extends ConsumerState<SponsorManagementScreen> {
  final List<_Sponsor> _sponsors = [
    _Sponsor(
      id: '1',
      name: 'Catholic Book Store',
      imageUrl: 'https://example.com/sponsor1.jpg',
      linkUrl: 'https://catholicbookstore.com',
      page: 'home',
      position: 'banner',
      impressions: 12500,
      clicks: 340,
      isActive: true,
      startDate: DateTime(2024, 1, 1),
      endDate: DateTime(2024, 12, 31),
    ),
    _Sponsor(
      id: '2',
      name: 'Holy Rosary Company',
      imageUrl: 'https://example.com/sponsor2.jpg',
      linkUrl: 'https://holyrosary.com',
      page: 'prayers',
      position: 'inline',
      impressions: 8200,
      clicks: 195,
      isActive: true,
      startDate: DateTime(2024, 3, 1),
      endDate: DateTime(2024, 6, 30),
    ),
    _Sponsor(
      id: '3',
      name: 'Religious Art Gallery',
      imageUrl: 'https://example.com/sponsor3.jpg',
      linkUrl: 'https://religiousart.com',
      page: 'saints',
      position: 'sidebar',
      impressions: 5600,
      clicks: 120,
      isActive: false,
      startDate: DateTime(2024, 2, 1),
      endDate: DateTime(2024, 4, 30),
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Sponsor Management',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.plus),
            onPressed: _showAddSponsorDialog,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Stats Overview
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: AppTheme.goldGradient,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _buildStat('Total Sponsors', '${_sponsors.length}'),
                  _buildStat(
                    'Active',
                    '${_sponsors.where((s) => s.isActive).length}',
                  ),
                  _buildStat(
                    'Total Impressions',
                    _formatNumber(
                      _sponsors.fold(0, (sum, s) => sum + s.impressions),
                    ),
                  ),
                  _buildStat(
                    'Total Clicks',
                    _formatNumber(
                      _sponsors.fold(0, (sum, s) => sum + s.clicks),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            Text(
              'Active Campaigns',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 16),

            // Sponsor list
            ..._sponsors.map((sponsor) => _buildSponsorCard(sponsor)),
          ],
        ),
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 11, color: Colors.black54),
        ),
      ],
    );
  }

  Widget _buildSponsorCard(_Sponsor sponsor) {
    final ctr = sponsor.impressions > 0
        ? (sponsor.clicks / sponsor.impressions * 100).toStringAsFixed(2)
        : '0.00';

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(16),
        border: sponsor.isActive
            ? Border.all(color: AppTheme.gold500.withValues(alpha: 0.3))
            : null,
      ),
      child: Column(
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: CachedNetworkImage(
                    imageUrl: sponsor.imageUrl,
                    width: 60,
                    height: 60,
                    fit: BoxFit.cover,
                    placeholder: (_, __) => Container(
                      color: AppTheme.sacredNavy900,
                      child: const Icon(LucideIcons.image, color: Colors.grey),
                    ),
                    errorWidget: (_, __, ___) => Container(
                      color: AppTheme.sacredNavy900,
                      child: const Icon(LucideIcons.image, color: Colors.grey),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              sponsor.name,
                              style: GoogleFonts.inter(
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: sponsor.isActive
                                  ? Colors.green.withValues(alpha: 0.2)
                                  : Colors.grey.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              sponsor.isActive ? 'ACTIVE' : 'INACTIVE',
                              style: GoogleFonts.inter(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: sponsor.isActive
                                    ? Colors.green
                                    : Colors.grey,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '${sponsor.page} • ${sponsor.position}',
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: AppTheme.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Stats row
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: AppTheme.sacredNavy900,
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(16),
                bottomRight: Radius.circular(16),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildMetric('Impressions', _formatNumber(sponsor.impressions)),
                _buildMetric('Clicks', _formatNumber(sponsor.clicks)),
                _buildMetric('CTR', '$ctr%'),
                _buildMetric(
                  'Days Left',
                  '${sponsor.endDate.difference(DateTime.now()).inDays}',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String label, String value) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            color: AppTheme.gold500,
          ),
        ),
        Text(
          label,
          style: GoogleFonts.inter(fontSize: 10, color: AppTheme.textSecondary),
        ),
      ],
    );
  }

  String _formatNumber(int number) {
    if (number >= 1000000) {
      return '${(number / 1000000).toStringAsFixed(1)}M';
    } else if (number >= 1000) {
      return '${(number / 1000).toStringAsFixed(1)}K';
    }
    return '$number';
  }

  void _showAddSponsorDialog() {
    final nameController = TextEditingController();
    final urlController = TextEditingController();
    String selectedPage = 'home';
    String selectedPosition = 'banner';

    showDialog(
      context: context,
      builder: (context) => StatefulBuilder(
        builder: (context, setDialogState) => AlertDialog(
          backgroundColor: AppTheme.sacredNavy900,
          title: Text(
            'Add New Sponsor',
            style: GoogleFonts.merriweather(color: Colors.white),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Sponsor Name',
                  labelStyle: TextStyle(color: Colors.white70),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white24),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: urlController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Image URL',
                  labelStyle: TextStyle(color: Colors.white70),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white24),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              DropdownButton<String>(
                value: selectedPage,
                dropdownColor: AppTheme.sacredNavy800,
                isExpanded: true,
                style: const TextStyle(color: Colors.white),
                items: ['home', 'prayers', 'saints', 'bible']
                    .map(
                      (e) => DropdownMenuItem(
                        value: e,
                        child: Text(e.toUpperCase()),
                      ),
                    )
                    .toList(),
                onChanged: (v) => setDialogState(() => selectedPage = v!),
              ),
              const SizedBox(height: 8),
              DropdownButton<String>(
                value: selectedPosition,
                dropdownColor: AppTheme.sacredNavy800,
                isExpanded: true,
                style: const TextStyle(color: Colors.white),
                items: ['banner', 'inline', 'sidebar', 'footer']
                    .map(
                      (e) => DropdownMenuItem(
                        value: e,
                        child: Text(e.toUpperCase()),
                      ),
                    )
                    .toList(),
                onChanged: (v) => setDialogState(() => selectedPosition = v!),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
              ),
              onPressed: () {
                if (nameController.text.isNotEmpty) {
                  setState(() {
                    _sponsors.insert(
                      0,
                      _Sponsor(
                        id: DateTime.now().millisecondsSinceEpoch.toString(),
                        name: nameController.text,
                        imageUrl: urlController.text.isNotEmpty
                            ? urlController.text
                            : 'https://via.placeholder.com/150',
                        linkUrl: 'https://example.com',
                        page: selectedPage,
                        position: selectedPosition,
                        impressions: 0,
                        clicks: 0,
                        isActive: true,
                        startDate: DateTime.now(),
                        endDate: DateTime.now().add(const Duration(days: 30)),
                      ),
                    );
                  });
                  Navigator.pop(context);
                }
              },
              child: const Text(
                'Add Sponsor',
                style: TextStyle(color: Colors.black),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _Sponsor {
  final String id;
  final String name;
  final String imageUrl;
  final String linkUrl;
  final String page;
  final String position;
  final int impressions;
  final int clicks;
  final bool isActive;
  final DateTime startDate;
  final DateTime endDate;

  _Sponsor({
    required this.id,
    required this.name,
    required this.imageUrl,
    required this.linkUrl,
    required this.page,
    required this.position,
    required this.impressions,
    required this.clicks,
    required this.isActive,
    required this.startDate,
    required this.endDate,
  });
}
