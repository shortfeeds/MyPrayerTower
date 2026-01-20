import 'package:flutter/material.dart';
import '../../../core/theme/app_theme.dart';

/// Visual representation of rosary beads with progress tracking
class VisualRosaryBeads extends StatelessWidget {
  final int currentBead;
  final int totalBeads;
  final Color activeColor;
  final VoidCallback? onTapBead;

  const VisualRosaryBeads({
    super.key,
    required this.currentBead,
    this.totalBeads = 53,
    this.activeColor = AppTheme.gold500,
    this.onTapBead,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: activeColor.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          // Progress indicator
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Bead $currentBead of $totalBeads',
                style: const TextStyle(color: Colors.white70, fontSize: 12),
              ),
              Text(
                '${((currentBead / totalBeads) * 100).toInt()}%',
                style: TextStyle(
                  color: activeColor,
                  fontWeight: FontWeight.bold,
                  fontSize: 14,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Visual bead representation
          SizedBox(height: 60, child: _buildBeadChain()),
        ],
      ),
    );
  }

  Widget _buildBeadChain() {
    // Show a horizontal representation of current decade
    final currentDecade = (currentBead - 5) ~/ 11;
    final beadInDecade = currentBead <= 5
        ? currentBead
        : (currentBead - 5) % 11;

    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // Cross (start)
        _buildCross(currentBead >= 0),
        const SizedBox(width: 4),

        // Introductory beads (1-5)
        ...List.generate(
          5,
          (i) => _buildBead(
            currentBead > i,
            currentBead == i,
            isLarge: i == 0, // Our Father bead
          ),
        ),

        const SizedBox(width: 8),

        // Current decade indicator
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          decoration: BoxDecoration(
            color: activeColor.withValues(alpha: 0.2),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            'Decade ${currentDecade + 1}',
            style: TextStyle(
              color: activeColor,
              fontSize: 10,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),

        const SizedBox(width: 8),

        // Current decade beads (10 + 1)
        ...List.generate(
          11,
          (i) => _buildBead(
            beadInDecade > i,
            beadInDecade == i,
            isLarge: i == 0, // Our Father bead
          ),
        ),
      ],
    );
  }

  Widget _buildBead(bool isPrayed, bool isCurrent, {bool isLarge = false}) {
    final size = isLarge ? 16.0 : 10.0;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 2),
      child: GestureDetector(
        onTap: onTapBead,
        child: Container(
          width: size,
          height: size,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            color: isPrayed
                ? activeColor
                : (isCurrent
                      ? activeColor.withValues(alpha: 0.5)
                      : Colors.white24),
            border: isCurrent ? Border.all(color: activeColor, width: 2) : null,
            boxShadow: isPrayed || isCurrent
                ? [
                    BoxShadow(
                      color: activeColor.withValues(alpha: 0.4),
                      blurRadius: 4,
                      spreadRadius: 1,
                    ),
                  ]
                : null,
          ),
        ),
      ),
    );
  }

  Widget _buildCross(bool isActive) {
    return Container(
      width: 20,
      height: 22,
      decoration: BoxDecoration(
        color: isActive ? activeColor : Colors.white24,
        borderRadius: BorderRadius.circular(2),
      ),
      child: const Center(
        child: Text('✝', style: TextStyle(fontSize: 12, color: Colors.black87)),
      ),
    );
  }
}
