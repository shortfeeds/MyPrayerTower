import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:timeago/timeago.dart' as timeago;
import '../../../core/theme/app_theme.dart';
import '../models/prayer_request_model.dart';
import '../repositories/prayer_wall_repository.dart';

class PrayerRequestCard extends ConsumerStatefulWidget {
  final PrayerRequest request;
  final VoidCallback? onPray;

  const PrayerRequestCard({super.key, required this.request, this.onPray});

  @override
  ConsumerState<PrayerRequestCard> createState() => _PrayerRequestCardState();
}

class _PrayerRequestCardState extends ConsumerState<PrayerRequestCard> {
  bool _isPrayed = false;
  bool _isSaved = false;

  void _handlePray() {
    if (_isPrayed) return;
    setState(() => _isPrayed = true);

    // Call repository
    ref.read(prayerWallRepositoryProvider).prayForRequest(widget.request.id);

    // Trigger visual feedback (could be animation)
    if (widget.onPray != null) widget.onPray!();
  }

  void _handleSave() {
    setState(() => _isSaved = !_isSaved);
    // Persist to local storage or API if needed
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          _isSaved ? 'Saved to Prayer Corner' : 'Removed from Saved',
        ),
        duration: const Duration(milliseconds: 1500),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _handleShare() {
    // Implement share logic
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Sharing functionality comming soon')),
    );
  }

  void _handleReport() {
    // Implement report logic
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Report functionality comming soon')),
    );
  }

  @override
  Widget build(BuildContext context) {
    final req = widget.request;
    final isAnswered = req.isAnswered;
    final status = req.status; // unused visually unless archived
    final isArchived = status == 'ARCHIVED';

    // Author Name
    String authorName = 'Anonymous';
    if (!req.isAnonymous) {
      if (req.user?.firstName != null) {
        authorName =
            '${req.user!.firstName!} ${req.user!.lastName?.substring(0, 1) ?? ""}.';
      } else {
        // Fallback?
        authorName = 'Praying Soul';
      }
    }

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isAnswered ? Colors.green.shade200 : const Color(0xFFE5E7EB),
          width: isAnswered ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            offset: const Offset(0, 2),
            blurRadius: 10,
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Answered Badge
          if (isAnswered)
            Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Row(
                children: [
                  Icon(
                    LucideIcons.checkCircle,
                    size: 16,
                    color: Colors.green.shade600,
                  ),
                  const SizedBox(width: 6),
                  Text(
                    'Answered!',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Colors.green.shade600,
                    ),
                  ),
                ],
              ),
            ),

          // Content
          Text(
            '"${req.content}"',
            style: GoogleFonts.merriweather(
              fontSize: 16,
              height: 1.6,
              color: Colors.grey.shade800,
            ),
          ),

          const Spacer(),
          const SizedBox(height: 16),
          const Divider(height: 24, color: Color(0xFFF3F4F6)),

          // Meta Info
          Wrap(
            crossAxisAlignment: WrapCrossAlignment.center,
            spacing: 8,
            runSpacing: 4,
            children: [
              Text(
                authorName,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  fontSize: 12,
                  color: Colors.grey.shade700,
                ),
              ),
              if (req.country != null) ...[
                Text(
                  '•',
                  style: GoogleFonts.inter(color: Colors.grey.shade300),
                ),
                Icon(LucideIcons.globe, size: 12, color: Colors.grey.shade400),
                Text(
                  req.country!,
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    color: Colors.grey.shade500,
                  ),
                ),
              ],
              Text('•', style: GoogleFonts.inter(color: Colors.grey.shade300)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.sacredNavy50,
                  borderRadius: BorderRadius.circular(99),
                ),
                child: Text(
                  req.category ?? 'Other',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.sacredNavy600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Icon(LucideIcons.clock, size: 12, color: Colors.grey.shade300),
              const SizedBox(width: 4),
              Text(
                req.createdAt != null ? timeago.format(req.createdAt!) : '',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.grey.shade400,
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Actions
          Row(
            children: [
              // Pray Button
              InkWell(
                onTap: _isPrayed || isArchived ? null : _handlePray,
                borderRadius: BorderRadius.circular(99),
                child: Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 16,
                    vertical: 8,
                  ),
                  decoration: BoxDecoration(
                    gradient: _isPrayed
                        ? null
                        : const LinearGradient(
                            colors: [AppTheme.gold400, AppTheme.gold500],
                          ),
                    color: _isPrayed ? Colors.green.shade50 : null,
                    borderRadius: BorderRadius.circular(99),
                    border: _isPrayed
                        ? Border.all(color: Colors.green.shade100)
                        : null,
                    boxShadow: _isPrayed
                        ? null
                        : [
                            BoxShadow(
                              color: AppTheme.gold500.withValues(alpha: 0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 2),
                            ),
                          ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      if (_isPrayed)
                        Icon(
                          LucideIcons.check,
                          size: 14,
                          color: Colors.green.shade700,
                        )
                      else
                        const Text('🙏', style: TextStyle(fontSize: 14)),
                      const SizedBox(width: 6),
                      Text(
                        _isPrayed ? 'Prayed' : 'Pray',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: _isPrayed
                              ? Colors.green.shade700
                              : Colors.white,
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 6,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: _isPrayed
                              ? Colors.green.shade200
                              : Colors.white.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(99),
                        ),
                        child: Text(
                          '${req.prayerCount + (_isPrayed ? 1 : 0)}',
                          style: GoogleFonts.inter(
                            fontSize: 10,
                            fontWeight: FontWeight.w700,
                            color: _isPrayed
                                ? Colors.green.shade800
                                : Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const Spacer(),
              // Secondary Actions
              _ControlIcon(
                icon: LucideIcons.bookmark,
                isActive: _isSaved,
                activeColor: AppTheme.gold600,
                onTap: _handleSave,
              ),
              const SizedBox(width: 4),
              _ControlIcon(icon: LucideIcons.share2, onTap: _handleShare),
              const SizedBox(width: 4),
              _ControlIcon(
                icon: LucideIcons.flag,
                hoverColor: Colors.red.shade50,
                iconColor: Colors.grey.shade400,
                onTap: _handleReport,
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ControlIcon extends StatelessWidget {
  final IconData icon;
  final VoidCallback onTap;
  final bool isActive;
  final Color? activeColor;
  final Color? hoverColor;
  final Color? iconColor;

  const _ControlIcon({
    required this.icon,
    required this.onTap,
    this.isActive = false,
    this.activeColor,
    this.hoverColor,
    this.iconColor,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isActive
              ? (activeColor?.withValues(alpha: 0.1) ?? Colors.grey.shade100)
              : Colors.transparent,
          borderRadius: BorderRadius.circular(8),
        ),
        child: Icon(
          icon,
          size: 18,
          fill: isActive ? 1.0 : 0.0,
          color: isActive ? activeColor : (iconColor ?? Colors.grey.shade400),
        ),
      ),
    );
  }
}
