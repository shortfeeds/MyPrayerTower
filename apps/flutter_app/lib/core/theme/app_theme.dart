import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ---------------------------------------------------------------------------
  // SACRED GLOW PALETTE (New Premium Theme)
  // ---------------------------------------------------------------------------

  // Deep, rich backgrounds (Midnight Blue to Void)
  static const Color voidBlack = Color(0xFF020408);
  static const Color deepSpace = Color(0xFF050B14);
  static const Color sacredNavy950 = Color(0xFF080F1A); // Original base
  static const Color sacredNavy900 = Color(0xFF0D1A2E); // Surface

  // Vibrant Accents (Electric Gold & Royal Purple)
  static const Color gold600 = Color(0xFFB48E2D);
  static const Color gold500 = Color(0xFFFFD700); // Brighter Gold
  static const Color gold400 = Color(0xFFFFE57F);
  static const Color gold300 = Color(0xFFFFF1C2);

  static const Color royalPurple900 = Color(0xFF1E1035);
  static const Color royalPurple700 = Color(0xFF4C1D95);
  static const Color royalPurple500 = Color(0xFF8B5CF6);
  static const Color royalPurple400 = Color(0xFFA78BFA);

  // Text Colors
  static const Color textPrimary = Color(0xFFFFFFFF);
  static const Color textSecondary = Color(0xFFCBD5E1); // Blue-ish gray
  static const Color textMuted = Color(0xFF64748B);

  // Functional
  static const Color error = Color(0xFFFF453A);
  static const Color success = Color(0xFF32D74B);
  static const Color info = Color(0xFF0A84FF);

  // ---------------------------------------------------------------------------
  // LEGACY ALIASES
  // ---------------------------------------------------------------------------
  static const Color sacredNavy800 = Color(0xFF11223B);
  static const Color sacredNavy700 = Color(0xFF152A47);
  static const Color sacredNavy600 = Color(0xFF1A3354);
  static const Color sacredNavy500 = Color(0xFF1E3A5F);
  static const Color gold100 = gold300;
  static const Color cream50 = Color(0xFFFDFBF7);
  static const Color primaryBlue = royalPurple500; // Shift to purple as primary
  static const Color darkBg = deepSpace;
  static const Color darkSurface = sacredNavy900;
  static const Color darkCard = sacredNavy900;
  static const Color darkBorder = sacredNavy700;
  static const Color primaryDark = sacredNavy900;
  static const Color accentGold = gold500;
  static const Color accentAmber = gold400;
  static const Color warning = gold400;

  // Missing colors
  static const Color flameOrange = Color(0xFFFF9500);
  static const Color sacredRed = Color(0xFFFF3B30);
  static const Color cardBackground = sacredNavy900;
  static const Color sacredPurple = royalPurple500;
  static const Color sacredGold = gold500;

  // ---------------------------------------------------------------------------
  // GRADIENTS
  // ---------------------------------------------------------------------------

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [royalPurple700, Color(0xFF2E1065)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold400, gold600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sacredGradient = LinearGradient(
    colors: [deepSpace, sacredNavy950],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [
      Color(0x1AFFFFFF), // White 10%
      Color(0x05FFFFFF), // White 2%
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // ---------------------------------------------------------------------------
  // THEME DATA
  // ---------------------------------------------------------------------------

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: deepSpace,
      primaryColor: royalPurple700,
      fontFamily: GoogleFonts.outfit().fontFamily, // Modern, geometric sans
      colorScheme: const ColorScheme.dark(
        primary: gold500,
        secondary: royalPurple500,
        surface: sacredNavy900,
        error: error,
        onPrimary: sacredNavy900,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        onError: Colors.white,
      ),

      // Typography
      textTheme: TextTheme(
        displayLarge: GoogleFonts.outfit(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.outfit(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        displaySmall: GoogleFonts.outfit(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: textPrimary,
        ),
        headlineMedium: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineSmall: GoogleFonts.outfit(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          // Keep Inter for reading text
          fontSize: 16,
          color: textSecondary,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: textSecondary,
          height: 1.5,
        ),
        labelLarge: GoogleFonts.outfit(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: gold500,
          letterSpacing: 0.5,
        ),
      ),

      // AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.outfit(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),

      // Cards
      cardTheme: CardThemeData(
        color: sacredNavy900,
        elevation: 8,
        shadowColor: Colors.black54,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: Colors.white.withValues(alpha: 0.05),
            width: 1,
          ),
        ),
        margin: EdgeInsets.zero,
      ),

      // Inputs
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: sacredNavy900,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.05)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: gold500),
        ),
        contentPadding: const EdgeInsets.all(20),
        hintStyle: GoogleFonts.inter(color: textMuted),
      ),

      // Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold500,
          foregroundColor: sacredNavy900,
          elevation: 4,
          shadowColor: gold500.withValues(alpha: 0.4),
          textStyle: GoogleFonts.outfit(
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),

      // Bottom Nav
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: deepSpace,
        selectedItemColor: gold500,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 0,
        showUnselectedLabels: true,
        selectedLabelStyle: TextStyle(
          fontWeight: FontWeight.w600,
          fontSize: 12,
        ),
        unselectedLabelStyle: TextStyle(
          fontWeight: FontWeight.w500,
          fontSize: 11,
        ),
      ),
      // Divider
      dividerTheme: DividerThemeData(
        color: Colors.white.withValues(alpha: 0.1),
        thickness: 1,
        space: 1,
      ),

      // Bottom Sheet
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: sacredNavy900,
        modalBackgroundColor: sacredNavy900,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  static BoxDecoration get glassDecoration => BoxDecoration(
    gradient: glassGradient,
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.2),
        blurRadius: 16,
        spreadRadius: 2,
        offset: const Offset(0, 4),
      ),
    ],
  );

  static BoxDecoration get goldBorderDecoration => BoxDecoration(
    color: sacredNavy900,
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: gold500.withValues(alpha: 0.3)),
    boxShadow: [
      BoxShadow(
        color: gold500.withValues(alpha: 0.05),
        blurRadius: 20,
        spreadRadius: 0,
        offset: const Offset(0, 8),
      ),
    ],
  );

  static BoxDecoration get sacredCardDecoration => BoxDecoration(
    color: sacredNavy900,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: Colors.white.withValues(alpha: 0.05)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.3),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ],
  );
}

// Extension for easy access to custom colors
extension ColorExtensions on BuildContext {
  Color get primaryBlue => AppTheme.primaryBlue;
  Color get primaryDark => AppTheme.primaryDark;
  Color get accentGold => AppTheme.accentGold;
  Color get accentAmber => AppTheme.accentAmber;
  Color get darkBg => AppTheme.darkBg;
  Color get darkSurface => AppTheme.darkSurface;
  Color get darkCard => AppTheme.darkCard;
  Color get success => AppTheme.success;
  Color get warning => AppTheme.warning;
  Color get error => AppTheme.error;
  Color get info => AppTheme.info;
}
