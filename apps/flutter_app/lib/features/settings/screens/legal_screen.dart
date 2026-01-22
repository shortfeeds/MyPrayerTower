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

*Last Updated: January 22, 2026*

## 1. Acceptance of Terms
By accessing or using MyPrayerTower ("the App"), you agree to be bound by these Terms of Service.

## 2. Nature of Our Services
**MyPrayerTower is a privately-owned technology company based in Mumbai, India.** We have been serving the global Catholic community since 2018.

**We are NOT:**
- A registered charity or tax-exempt organization
- A parish, diocese, or canonical entity of the Catholic Church
- Affiliated with the Vatican or any specific diocese
- A religious institution that administers sacraments

We operate as an **intermediary service provider**, connecting Catholic faithful with spiritual resources and partner churches.

## 3. No Guarantee of Spiritual Outcomes
We facilitate spiritual services with sincerity. However, we make **no representations or warranties** regarding the spiritual efficacy of any prayer, Mass, candle, or spiritual bouquet. We cannot guarantee answers to prayers or miraculous interventions.

## 4. Description of Service
MyPrayerTower provides a digital platform for Catholic prayer, including virtual candles, Mass offering coordination with partner churches, prayer requests, and spiritual tools.

## 5. Virtual Goods & Service Fees
- Payments for "Virtual Candles" or "Mass Offerings" are **service fees**, not charitable donations.
- These are NOT tax-deductible.
- Mass offerings are forwarded to partner churches; scheduling is at clergy's discretion.
- We strive for Mass fulfillment within 90 days or offer refund/alternatives.

## 6. User Content
- You grant us a license to display prayer requests you post publicly.
- We reserve the right to remove content that violates Catholic values or our guidelines.

## 7. Biometric Features
- The App uses device-native biometric authentication.
- We do **not** store your biometric data. It remains on your device.

## 8. Governing Law
These Terms are governed by the laws of India. Disputes are subject to the courts in Mumbai, Maharashtra, India.

## 9. Updates
We may update these terms at any time. Continued use implies acceptance.
''';

  static const String privacy = '''
# Privacy Policy

*Last Updated: January 22, 2026*

## 1. About MyPrayerTower
MyPrayerTower is a Catholic service provider based in Mumbai, India. We are NOT a registered charity.

## 2. Information We Collect
- **Account Data**: Email, Name (via Supabase Auth).
- **User Content**: Prayer requests, journal entries, memorials.
- **Usage Data**: Anonymous analytics to improve app performance.

## 3. Secure Data Storage
- **Prayer Journal**: Encrypted locally using your device's secure storage.
- **Biometrics**: We do not access or store biometric data.

## 4. How Your Service Fees Are Used
When you pay for services:
- **50%** - Platform Development & Maintenance
- **30%** - Partner Church Stipends
- **20%** - Operations & Support

**Important:** Payments to MyPrayerTower are **not tax-deductible** as charitable contributions.

## 5. Location Data
- Used to find nearby churches.
- Not stored on our servers.

## 6. Ads & Analytics
- We use AdMob and Google Analytics.
- See Google's Privacy Policy for details.

## 7. Third-Party Services
- **PayPal / Google Play**: Payment processing.
- **Supabase**: Backend database and authentication.

## 8. Your Rights
You may request deletion of your account and data at any time.

## 9. Contact
For privacy concerns: privacy@myprayertower.com
''';
}
