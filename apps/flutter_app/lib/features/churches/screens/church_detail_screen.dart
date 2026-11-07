import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_scaffold.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../models/church_model.dart';
import '../repositories/churches_repository.dart';
// If churchDetailProvider is needed, import it. But we are using repository directly in initState for this implementation.
// import '../providers/church_detail_provider.dart';

class ChurchDetailScreen extends ConsumerStatefulWidget {
  final String churchId;
  final Church? churchExtra;

  const ChurchDetailScreen({
    super.key,
    required this.churchId,
    this.churchExtra,
  });

  @override
  ConsumerState<ChurchDetailScreen> createState() => _ChurchDetailScreenState();
}

class _ChurchDetailScreenState extends ConsumerState<ChurchDetailScreen> {
  late Future<Church> _churchFuture;
  bool _isTimesConfirmed = false;

  void _confirmParishTimes() {
    HapticFeedback.mediumImpact();
    setState(() => _isTimesConfirmed = true);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(LucideIcons.church, color: AppTheme.gold500, size: 18),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Deo Gratias! Thank you for verifying these Mass & Confession times.',
                style: GoogleFonts.inter(fontSize: 13),
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF0F172A),
        duration: const Duration(seconds: 3),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
          side: const BorderSide(color: AppTheme.sacredGold, width: 1),
        ),
      ),
    );
  }

  void _showSuggestCorrectionDialog(Church church) {
    final textController = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppTheme.gold500, width: 1),
        ),
        title: Text(
          'Suggest Schedule Update',
          style: GoogleFonts.cinzel(color: AppTheme.gold500, fontWeight: FontWeight.bold),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Enter updated Mass, Confession, or Adoration times for ${church.name}:',
              style: GoogleFonts.inter(fontSize: 13, color: Colors.white70),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: textController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'e.g. Sunday Mass now at 8:00 AM & 10:30 AM...',
                hintStyle: const TextStyle(color: Colors.white38),
                filled: true,
                fillColor: Colors.black26,
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.white60)),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.pop(ctx);
              HapticFeedback.lightImpact();
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Thank you! Your correction has been submitted for verification.'),
                  backgroundColor: Color(0xFF0F172A),
                  duration: Duration(seconds: 3),
                ),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.gold500,
              foregroundColor: Colors.black,
            ),
            child: const Text('Submit Update'),
          ),
        ],
      ),
    );
  }

  @override
  void initState() {
    super.initState();
    _churchFuture = _loadChurch();
  }

  Future<Church> _loadChurch() {
    if (widget.churchExtra != null) {
      return Future.value(widget.churchExtra);
    }
    return ref.read(churchesRepositoryProvider).getChurchById(widget.churchId);
  }

  @override
  Widget build(BuildContext context) {
    return PremiumScaffold(
      // padding: EdgeInsets.zero, // Removed invalid param
      body: FutureBuilder<Church>(
        future: _churchFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(
              child: CircularProgressIndicator(color: AppTheme.gold500),
            );
          }

          if (snapshot.hasError) {
            return const Center(
              child: Text(
                'Error loading church',
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          if (!snapshot.hasData) {
            return const Center(
              child: Text(
                'Church not found',
                style: TextStyle(color: Colors.white),
              ),
            );
          }

          final church = snapshot.data!;
          return CustomScrollView(
            slivers: [
              _buildSliverAppBar(context, church),
              SliverPadding(
                padding: const EdgeInsets.all(20),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildInfoSection(church),
                    const SizedBox(height: 24),
                    _buildActionButtons(church),
                    const SizedBox(height: 24),
                    _buildSectionHeader('Mass Schedule'),
                    const SizedBox(height: 12),
                    if (church.massSchedule != null)
                      _buildScheduleCard(
                        church.massSchedule!,
                        LucideIcons.clock,
                      ),
                    const SizedBox(height: 12),
                    // Community Mass Verification Card
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: const Color(0xFF1E293B),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.gold500.withValues(alpha: 0.3)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            children: [
                              const Icon(LucideIcons.checkCircle2, color: AppTheme.gold500, size: 20),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'Parish Times Community Verification',
                                      style: GoogleFonts.cinzel(
                                        fontSize: 13,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.gold500,
                                      ),
                                    ),
                                    Text(
                                      _isTimesConfirmed
                                          ? 'Verified by you for today.'
                                          : 'Help fellow parishioners keep schedules accurate.',
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
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _isTimesConfirmed ? null : _confirmParishTimes,
                                  icon: Icon(
                                    _isTimesConfirmed ? LucideIcons.check : LucideIcons.thumbsUp,
                                    size: 15,
                                  ),
                                  label: Text(
                                    _isTimesConfirmed ? 'Times Confirmed' : 'Confirm Times Accurate',
                                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.bold),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: _isTimesConfirmed ? Colors.greenAccent : AppTheme.gold500,
                                    side: BorderSide(
                                      color: _isTimesConfirmed ? Colors.greenAccent : AppTheme.gold500,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              IconButton(
                                onPressed: () => _showSuggestCorrectionDialog(church),
                                icon: const Icon(LucideIcons.edit3, size: 18),
                                tooltip: 'Suggest Update',
                                style: IconButton.styleFrom(
                                  backgroundColor: Colors.white.withValues(alpha: 0.08),
                                  foregroundColor: Colors.white70,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    if (church.confessionSchedule != null) ...[
                      _buildSectionHeader('Confession'),
                      const SizedBox(height: 12),
                      _buildScheduleCard(
                        church.confessionSchedule!,
                        LucideIcons.heartHandshake,
                      ),
                      const SizedBox(height: 24),
                    ],
                    _buildSectionHeader('About'),
                    const SizedBox(height: 12),
                    Text(
                      church.description ?? 'No description available.',
                      style: GoogleFonts.merriweather(
                        fontSize: 16,
                        height: 1.6,
                        color: Colors.white70,
                      ),
                    ),
                    const SizedBox(height: 40),
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildSliverAppBar(BuildContext context, Church church) {
    return SliverAppBar(
      expandedHeight: 300,
      pinned: true,
      backgroundColor: AppTheme.sacredNavy950,
      leading: IconButton(
        icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
        onPressed: () => context.pop(),
      ),
      flexibleSpace: FlexibleSpaceBar(
        background: Stack(
          fit: StackFit.expand,
          children: [
            if (church.primaryImageUrl != null)
              Image.network(
                church.primaryImageUrl!,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) =>
                    Container(color: AppTheme.sacredNavy800),
              )
            else
              Container(color: AppTheme.sacredNavy800),

            // Gradient Overlay
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.black26,
                    Colors.transparent,
                    AppTheme.sacredNavy950,
                  ],
                  stops: [0.0, 0.5, 1.0],
                ),
              ),
            ),

            Positioned(
              bottom: 20,
              left: 20,
              right: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  if (church.isVerified)
                    Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: const Color(0xFF059669),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            LucideIcons.shieldCheck,
                            size: 12,
                            color: Colors.white,
                          ),
                          SizedBox(width: 4),
                          Text(
                            'OFFICIAL VERIFIED LISTING',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                  Text(
                    church.name,
                    style: GoogleFonts.merriweather(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(
                        LucideIcons.mapPin,
                        size: 16,
                        color: AppTheme.gold500,
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          '${church.city}, ${church.state}',
                          style: GoogleFonts.inter(
                            fontSize: 16,
                            color: Colors.white70,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoSection(Church church) {
    return Row(
      children: [
        Expanded(child: _buildInfoItem('Type', church.type)),
        Container(width: 1, height: 40, color: Colors.white24),
        Expanded(
          child: _buildInfoItem('Denom.', church.denomination ?? 'Catholic'),
        ),
        // Review Rating is not in model, skipping
      ],
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Column(
      children: [
        Text(
          label.toUpperCase(),
          style: const TextStyle(
            color: Colors.white38,
            fontSize: 10,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
          textAlign: TextAlign.center,
        ),
      ],
    );
  }

  Widget _buildActionButtons(Church church) {
    return Row(
      children: [
        if (church.phone != null)
          Expanded(
            child: _PremiumActionButton(
              icon: LucideIcons.phone,
              label: 'Call',
              onTap: () => launchUrl(Uri.parse('tel:${church.phone}')),
            ),
          ),
        if (church.phone != null && church.website != null)
          const SizedBox(width: 16),
        if (church.website != null)
          Expanded(
            child: _PremiumActionButton(
              icon: LucideIcons.globe,
              label: 'Website',
              onTap: () => launchUrl(
                Uri.parse(church.website!),
                mode: LaunchMode.inAppWebView,
              ),
            ),
          ),
        const SizedBox(width: 16),
        Expanded(
          child: _PremiumActionButton(
            icon: LucideIcons.navigation,
            label: 'Directions',
            isPrimary: true,
            onTap: () {}, // Integrate map launch
          ),
        ),
      ],
    );
  }

  Widget _buildSectionHeader(String title) {
    return Row(
      children: [
        Container(width: 4, height: 16, color: AppTheme.gold500),
        const SizedBox(width: 12),
        Text(
          title,
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
      ],
    );
  }

  Widget _buildScheduleCard(Map<String, dynamic> schedule, IconData icon) {
    return PremiumGlassCard(
      child: Column(
        children: schedule.entries.map((e) {
          return Padding(
            padding: const EdgeInsets.only(bottom: 12),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(icon, size: 16, color: AppTheme.gold500),
                const SizedBox(width: 12),
                SizedBox(
                  width: 80,
                  child: Text(
                    e.key,
                    style: const TextStyle(
                      color: Colors.white70,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                Expanded(
                  child: Text(
                    e.value.toString(),
                    style: const TextStyle(color: Colors.white),
                  ),
                ),
              ],
            ),
          );
        }).toList(),
      ),
    );
  }
}

class _PremiumActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  final bool isPrimary;

  const _PremiumActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
    this.isPrimary = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isPrimary
              ? AppTheme.gold500
              : Colors.white.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(16),
          border: isPrimary
              ? null
              : Border.all(color: Colors.white.withValues(alpha: 0.1)),
        ),
        child: Column(
          children: [
            Icon(
              icon,
              size: 20,
              color: isPrimary ? Colors.black : Colors.white,
            ),
            const SizedBox(height: 4),
            Text(
              label,
              style: TextStyle(
                color: isPrimary ? Colors.black : Colors.white70,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
