import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PrayerCertificatePreview extends StatelessWidget {
  final String userName;
  final String novenaName;
  final DateTime completionDate;

  const PrayerCertificatePreview({
    super.key,
    required this.userName,
    required this.novenaName,
    required this.completionDate,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: const Color(0xFFFFFDF7), // Parchment color
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: const Color(0xFFD4AF37),
          width: 8,
        ), // Gold border
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.2),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Certificate Header
          Text(
            'Spiritual Keepsake',
            style: GoogleFonts.playfairDisplay(
              color: const Color(0xFFD4AF37),
              fontSize: 14,
              fontWeight: FontWeight.bold,
              letterSpacing: 4,
            ),
          ),
          const SizedBox(height: 24),
          const Icon(Icons.auto_awesome, color: Color(0xFFD4AF37), size: 48),
          const SizedBox(height: 24),

          Text(
            'This commemorates the completion of',
            style: GoogleFonts.inter(
              color: Colors.black54,
              fontSize: 14,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            novenaName,
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              color: const Color(0xFF1A1A1A),
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 24),

          Container(
            height: 1,
            width: 100,
            color: const Color(0xFFD4AF37).withValues(alpha: 0.3),
          ),
          const SizedBox(height: 24),

          Text(
            'Accomplished with devotion by',
            style: GoogleFonts.inter(color: Colors.black54, fontSize: 12),
          ),
          const SizedBox(height: 12),
          Text(
            userName,
            style: GoogleFonts.dancingScript(
              color: const Color(0xFF1A1A1A),
              fontSize: 32,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 32),

          Text(
            '"The prayer of a righteous person is powerful and effective."',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              color: Colors.black45,
              fontSize: 12,
              fontStyle: FontStyle.italic,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'James 5:16',
            style: TextStyle(color: Colors.black38, fontSize: 10),
          ),

          const SizedBox(height: 48),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'DATE',
                    style: GoogleFonts.inter(
                      color: Colors.black38,
                      fontSize: 8,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 1,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '${completionDate.day}/${completionDate.month}/${completionDate.year}',
                    style: const TextStyle(color: Colors.black87, fontSize: 12),
                  ),
                ],
              ),
              // Simulated Wax Seal
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: const Color(0xFFA02020),
                  shape: BoxShape.circle,
                  border: Border.all(color: const Color(0xFF801010), width: 2),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.1),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Icon(Icons.church, color: Colors.white, size: 30),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
