import 'package:flutter/material.dart';
import '../repositories/prayer_request_repository.dart';
import '../../../core/theme/app_theme.dart';
import 'package:lucide_icons/lucide_icons.dart';

class PrayerRequestCard extends StatefulWidget {
  final PrayerRequestData request;
  final VoidCallback onPray;
  final bool isOptimistic; // visual state only

  const PrayerRequestCard({
    super.key,
    required this.request,
    required this.onPray,
    this.isOptimistic = false,
  });

  @override
  State<PrayerRequestCard> createState() => _PrayerRequestCardState();
}

class _PrayerRequestCardState extends State<PrayerRequestCard> {
  late int _count;
  bool _hasPrayed = false;

  @override
  void initState() {
    super.initState();
    _count = widget.request.prayerCount;
  }

  @override
  void didUpdateWidget(PrayerRequestCard oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.request.prayerCount != oldWidget.request.prayerCount) {
      _count = widget.request.prayerCount;
    }
  }

  void _handlePray() {
    if (_hasPrayed) return;

    setState(() {
      _hasPrayed = true;
      _count++;
    });

    widget.onPray();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.sacredNavy800,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.request.intention,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 15,
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          if (widget.request.category != null) ...[
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.primaryBlue.withValues(
                                  alpha: 0.2,
                                ),
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                widget.request.category!,
                                style: const TextStyle(
                                  color: AppTheme.primaryBlue,
                                  fontSize: 10,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                          ],
                          Text(
                            widget.request.isAnonymous
                                ? 'Anonymous'
                                : widget.request.userName,
                            style: const TextStyle(
                              color: Colors.white38,
                              fontSize: 12,
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

          // Divider
          Divider(height: 1, color: Colors.white.withValues(alpha: 0.05)),

          // Action Bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(
                      LucideIcons.flame,
                      size: 16,
                      color: _hasPrayed ? Colors.orange : AppTheme.accentGold,
                    ),
                    const SizedBox(width: 6),
                    Text(
                      '$_count prayers',
                      style: TextStyle(
                        color: _hasPrayed ? Colors.orange : AppTheme.accentGold,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
                ElevatedButton.icon(
                  onPressed: _hasPrayed ? null : _handlePray,
                  icon: Icon(
                    _hasPrayed ? LucideIcons.check : LucideIcons.heart,
                    size: 16,
                  ),
                  label: Text(_hasPrayed ? 'Prayed' : 'Pray'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _hasPrayed
                        ? Colors.green.withValues(alpha: 0.2)
                        : AppTheme.accentGold.withValues(alpha: 0.15),
                    foregroundColor: _hasPrayed
                        ? Colors.green
                        : AppTheme.accentGold,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 8,
                    ),
                    textStyle: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
