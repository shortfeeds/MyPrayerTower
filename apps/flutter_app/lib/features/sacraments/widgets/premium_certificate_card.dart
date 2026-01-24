import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../models/sacrament_record_model.dart';
import 'package:intl/intl.dart';

class PremiumCertificateCard extends StatelessWidget {
  final String? userName;
  final SacramentRecord record;
  final VoidCallback? onDownload;

  const PremiumCertificateCard({
    super.key,
    required this.record,
    this.userName,
    this.onDownload,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Stack(
          children: [
            // Certificate Container
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 16),
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFFFdfbf7), // Light parchment
                borderRadius: BorderRadius.circular(12),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.3),
                    blurRadius: 20,
                    offset: const Offset(0, 10),
                  ),
                ],
                // Subtle border
                border: Border.all(color: const Color(0xFFD4AF37), width: 8),
              ),
              child: Stack(
                children: [
                  // Watermark
                  Positioned.fill(
                    child: Center(
                      child: Opacity(
                        opacity: 0.05,
                        child: Icon(
                          record.icon,
                          size: 200,
                          color: Colors.black,
                        ),
                      ),
                    ),
                  ),

                  // Ornamental Corners (CSS-like mock)
                  Positioned(top: 8, left: 8, child: _buildCornerOrnament(0)),
                  Positioned(top: 8, right: 8, child: _buildCornerOrnament(1)),
                  Positioned(
                    bottom: 8,
                    left: 8,
                    child: _buildCornerOrnament(3),
                  ),
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: _buildCornerOrnament(2),
                  ),

                  // Content
                  Padding(
                    padding: const EdgeInsets.symmetric(
                      vertical: 40,
                      horizontal: 32,
                    ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        // Header
                        const Icon(
                          LucideIcons.crown,
                          size: 32,
                          color: Color(0xFFD4AF37),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'Certificate of ${record.name}',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.cinzel(
                            fontSize: 22,
                            fontWeight: FontWeight.bold,
                            color: Colors.black87,
                            letterSpacing: 2,
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Body Text
                        Text(
                          'This is to certify that',
                          style: GoogleFonts.pinyonScript(
                            fontSize: 24,
                            color: Colors.black54,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          userName ?? 'User Name',
                          style: GoogleFonts.greatVibes(
                            fontSize: 36,
                            color: Colors.black,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'has devoutly received the Holy Sacrament of',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.crimsonText(
                            fontSize: 16,
                            color: Colors.black54,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          record.name.toUpperCase(),
                          style: GoogleFonts.cinzel(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFFD4AF37),
                          ),
                        ),
                        const SizedBox(height: 24),

                        // Details Grid
                        _buildDetailsGrid(),

                        const SizedBox(height: 32),

                        // Signature Line
                        Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Column(
                              children: [
                                Container(
                                  width: 160,
                                  height: 1,
                                  color: Colors.black26,
                                ),
                                const SizedBox(height: 8),
                                Text(
                                  'Signature of Priest',
                                  style: GoogleFonts.crimsonText(
                                    fontSize: 12,
                                    color: Colors.black45,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(width: 32),
                            // Gold Seal
                            Container(
                              width: 60,
                              height: 60,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: const LinearGradient(
                                  colors: [
                                    Color(0xFFD4AF37),
                                    Color(0xFFF4C430),
                                  ],
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.2),
                                    blurRadius: 5,
                                    offset: const Offset(2, 2),
                                  ),
                                ],
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.5),
                                  width: 2,
                                ),
                              ),
                              child: Center(
                                child: Text(
                                  'Seal',
                                  style: GoogleFonts.cinzel(
                                    fontSize: 10,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                  ),
                                ),
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
          ],
        ),

        // Actions
        if (onDownload != null) ...[
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildActionButton(
                label: 'Share',
                icon: LucideIcons.share2,
                onTap: () {},
              ),
              const SizedBox(width: 16),
              _buildActionButton(
                label: 'Download PDF',
                icon: LucideIcons.download,
                onTap: onDownload!,
                primary: true,
              ),
            ],
          ),
        ],
      ],
    );
  }

  Widget _buildDetailsGrid() {
    return Column(
      children: [
        if (record.church != null) _buildDetailLine('Church', record.church!),
        if (record.date != null)
          _buildDetailLine('On', DateFormat.yMMMMd().format(record.date!)),
        if (record.celebrant != null)
          _buildDetailLine('Celebrant', record.celebrant!),
        if (record.confirmationName != null)
          _buildDetailLine('Confirmation Name', record.confirmationName!),
        if (record.godparents != null && record.godparents!.isNotEmpty)
          _buildDetailLine('Godparents', record.godparents!.join(', ')),
        if (record.witnesses != null && record.witnesses!.isNotEmpty)
          _buildDetailLine('Witnesses', record.witnesses!.join(', ')),
      ],
    );
  }

  Widget _buildDetailLine(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: RichText(
        textAlign: TextAlign.center,
        text: TextSpan(
          style: GoogleFonts.crimsonText(fontSize: 16, color: Colors.black87),
          children: [
            TextSpan(
              text: '$label: ',
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                color: Colors.black54,
              ),
            ),
            TextSpan(
              text: value,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCornerOrnament(int turns) {
    return RotatedBox(
      quarterTurns: turns,
      child: Icon(
        LucideIcons.flower2, // Abstract ornament
        size: 24,
        color: const Color(0xFFD4AF37).withValues(alpha: 0.5),
      ),
    );
  }

  Widget _buildActionButton({
    required String label,
    required IconData icon,
    required VoidCallback onTap,
    bool primary = false,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(30),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          decoration: BoxDecoration(
            color: primary ? AppTheme.gold500 : Colors.white10,
            borderRadius: BorderRadius.circular(30),
            border: Border.all(
              color: primary ? Colors.transparent : Colors.white24,
            ),
          ),
          child: Row(
            children: [
              Icon(
                icon,
                size: 18,
                color: primary ? Colors.black : Colors.white,
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontWeight: FontWeight.w600,
                  color: primary ? Colors.black : Colors.white,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
