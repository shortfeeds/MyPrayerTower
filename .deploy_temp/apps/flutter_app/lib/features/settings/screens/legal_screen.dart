import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_theme.dart';

class LegalScreen extends StatelessWidget {
  final String title;
  final String content;

  const LegalScreen({super.key, required this.title, required this.content});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Text(
          title,
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        elevation: 0,
      ),
      body: Markdown(
        data: content,
        styleSheet: MarkdownStyleSheet(
          h1: GoogleFonts.merriweather(
            color: AppTheme.gold500,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
          h2: GoogleFonts.merriweather(
            color: Colors.white,
            fontSize: 20,
            fontWeight: FontWeight.w600,
          ),
          h3: GoogleFonts.inter(
            color: AppTheme.gold400,
            fontSize: 18,
            fontWeight: FontWeight.w600,
          ),
          p: GoogleFonts.inter(
            color: Colors.white70,
            fontSize: 16,
            height: 1.5,
          ),
          listBullet: GoogleFonts.inter(color: AppTheme.gold500),
        ),
      ),
    );
  }
}

class LegalContent {
  static const String terms = '''
# Terms of Service

*Last Updated: January 18, 2026*

## 1. Acceptance of Terms
By accessing or using MyPrayerTower ("the App"), you agree to be bound by these Terms of Service.

## 2. Description of Service
MyPrayerTower provides a digital platform for Catholic prayer, including virtual candles, prayer requests, and spiritual tools.

## 3. User Accounts
- You are responsible for maintaining the confidentiality of your account.
- You notify us immediately of any unauthorized use.

## 4. Virtual Goods & Donations
- Donations for "Virtual Candles" or "Mass Offerings" are final and non-refundable.
- These are voluntary contributions to support the ministry.

## 5. User Content
- You grant us a license to display prayer requests you post publicly ("Prayer Wall").
- We reserve the right to remove content that violates our community standards (e.g., hate speech, disrespect).

## 6. Biometric Features
- The App uses device-native biometric authentication (Fingerprint/Face ID).
- We do **not** store your biometric data. It remains securely on your device.

## 7. App Widgets
- The App provides home screen widgets for convenience.
- Recent readings/prayers are cached locally for widget functionality.

## 8. Updates
We may update these terms at any time. Continued use implies acceptance.
''';

  static const String privacy = '''
# Privacy Policy

*Last Updated: January 18, 2026*

## 1. Information We Collect
- **Account Data**: Email, Name (via Supabase Auth).
- **User Content**: Prayer requests, journal entries, memorials.
- **Usage Data**: Anonymous analytics to improve app performance.

## 2. Secure Data Storage
- **Prayer Journal**: Encrypted locally using Hive and your device's secure storage.
- **Biometrics**: We do not access or store raw biometric data. We only receive a "success/failure" signal from your device.

## 3. Location Data
- **Parish Finder**: We ask for permission to access your location to find nearby churches.
- Approximate location is processed ephemeral and not stored on our servers.

## 4. Ads & Analytics
- We use AdMob and Google Analytics.
- See Google's Privacy Policy for data handling regarding advertising IDs.

## 5. Third-Party Services
- **PayPal**: Payment processing.
- **Supabase**: Backend database and authentication.

## 6. Your Rights
- You may request deletion of your account and data at any time via App Settings.

## 7. Contact
For privacy concerns, contact: privacy@myprayertower.com
''';
}
