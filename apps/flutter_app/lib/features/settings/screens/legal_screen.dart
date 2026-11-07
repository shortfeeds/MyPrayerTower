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

*Last Updated: November 7, 2026*

## 1. Acceptance of Terms
By accessing or using MyPrayerTower ("the App"), you agree to be bound by these Terms of Service.

## 2. Nature of Our Services & Legal Status
**MyPrayerTower is an independent digital media platform and technology intermediary based in Mumbai, India.** We have been serving the global Catholic community since 2018.

**Entity Classification:**
- We are NOT a 501(c)(3) registered charity, diocese, or ecclesiastical trust.
- We do not directly administer Catholic sacraments or govern clergy.
- We operate as an **intermediary digital technology provider**, connecting the Catholic faithful with liturgical resources, sleep stories, and partner Catholic priests.

## 3. Commercial Service Fees & 100% Digital Delivery
- Payments for Mass offerings, virtual candles, sleep stories, and subscriptions are **commercial service facilitation fees** (SAC Code).
- Payments are **NOT tax-deductible** as charitable donations.
- All deliverables are **100% digital** (electronic certificates, streaming audio, digital sanctuary shrines). No physical merchandise is shipped.
- Mass offerings are forwarded to partner Catholic priests; scheduling is at clergy discretion. We guarantee fulfillment within 90 days or offer a full refund or alternative.

## 4. Fee Transparency Breakdown (70/20/10)
Devotional contributions are apportioned transparently:
- **70% Church & Clergy**: Direct Mass stipends forwarded to partner priests and sanctuary altar maintenance.
- **20% Pastoral Care**: Intention coordination, digital certificate verification, and user pastoral support.
- **10% Infrastructure**: Encrypted servers, SSL security, and multi-platform app updates.

## 5. Google Play Billing 8.0 & In-App Purchases
- In-app purchases, offerings, and subscriptions on Android are processed through **Google Play Billing (Library 8.0+)**.
- Subscriptions auto-renew unless cancelled at least 24 hours before the end of the billing cycle.
- You can manage or cancel your subscription anytime in the Google Play Subscriptions Center.

## 6. No Guarantee of Spiritual Outcomes
We facilitate spiritual services with sincere Catholic devotion. However, we make **no representations or warranties** regarding the spiritual efficacy of any prayer, Mass, or candle. We cannot guarantee answers to prayers or miraculous outcomes.

## 7. Biometric & Device Privacy
- The App uses device-native biometric authentication (fingerprint/Face ID).
- We do **not** store or transmit your biometric data. It remains strictly on your device hardware.
- Offline audio (Catholic Sleep Stories) streams locally; no microphone or recording is used.

## 8. Governing Law
These Terms are governed by the substantive laws of India. Disputes are subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra, India.
''';

  static const String privacy = '''
# Privacy Policy

*Last Updated: November 7, 2026*

## 1. About MyPrayerTower
MyPrayerTower is an independent Catholic digital devotional platform based in Mumbai, India, serving the global faithful since 2018. We are not a registered tax-exempt charity.

## 2. Information We Collect
- **Account Data**: Email, Name, and profile picture (via Supabase Auth).
- **User Content**: Prayer wall requests, memorials, and journal entries.
- **Usage Metrics**: Anonymous performance analytics to maintain server stability.

## 3. Secure Data Storage & Biometrics
- **Prayer Journal**: Encrypted locally using your device's secure storage.
- **Biometrics**: On-device biometric verification only; we never store or transmit biometric identifiers.
- **Catholic Sleep Stories**: Audio is cached locally on-device. No audio recording or microphone access is required.

## 4. Devotional Offering Distribution (70/20/10)
Devotional contributions are apportioned transparently:
- **70% Church & Clergy**: Direct Mass stipends for partner priests and altar sanctuary upkeep.
- **20% Pastoral Care**: Intention coordination, certificate issuance, and user pastoral support.
- **10% Infrastructure**: SSL encryption, cloud database integrity, and app maintenance.

*Important:* Payments to MyPrayerTower are commercial service fees and are **not tax-deductible**.

## 5. Location Data
- Used only with your permission to locate nearby Catholic parishes and Mass times.
- Never stored on or tracked by our remote servers.

## 6. Third-Party Partners
- **Google Play Billing (Library 8.0+) / PayPal**: Secure tokenized payment processing.
- **Supabase**: Encrypted database and user authentication.
- **Firebase**: Push notifications for daily scripture and feast reminders.
- **AdMob**: Privacy-compliant ads for free-tier users.

## 7. Your Privacy Rights (GDPR & CCPA)
You have the right to access, rectify, export, or permanently delete your account and submitted prayer requests at any time.

## 8. Contact Our Data Privacy Officer
Email: privacy@myprayertower.com
Website: [https://www.myprayertower.com/privacy](https://www.myprayertower.com/privacy)
''';
}
