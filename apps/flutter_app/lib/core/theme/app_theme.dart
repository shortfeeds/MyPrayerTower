import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ---------------------------------------------------------------------------
  // SACRED GLOW PALETTE (New Premium Theme)
  // ---------------------------------------------------------------------------

  // Deep, rich backgrounds (Cathedral at Midnight)
  static const Color voidBlack = Color(0xFF0F0518); // Deep Purple Black
  static const Color deepSpace = Color(0xFF13091C); // Dark Royal Purple Base
  static const Color sacredNavy950 = deepSpace; // Map legacy to new base
  static const Color sacredNavy900 = Color(
    0xFF1E102E,
  ); // Slightly lighter purple surface

  // Vibrant Accents (Candlelight & Incense)
  static const Color gold600 = Color(0xFFFFB300); // Warm Amber
  static const Color gold500 = Color(0xFFFFCA28); // Candlelight Gold
  static const Color gold400 = Color(0xFFFFE082); // Soft Light
  static const Color gold300 = Color(0xFFFFF8E1);

  // Spiritual Purples
  static const Color royalPurple900 = Color(0xFF2D1B4E);
  static const Color royalPurple700 = Color(0xFF4527A0);
  static const Color royalPurple500 = Color(0xFF7C4DFF);
  static const Color royalPurple400 = Color(0xFFB388FF);

  // Text Colors
  static const Color textPrimary = Color(0xFFFDFBF7); // Off-white cream
  static const Color textSecondary = Color(0xFFD1C4E9); // Soft lavendar grey
  static const Color textMuted = Color(0xFF9575CD); // Muted purple

  // Functional
  static const Color error = Color(0xFFCF6679);
  static const Color success = Color(0xFF81C784);
  static const Color info = Color(0xFF64B5F6);

  // ---------------------------------------------------------------------------
  // LEGACY ALIASES
  // ---------------------------------------------------------------------------
  static const Color sacredNavy800 = Color(0xFF25163A);
  static const Color sacredNavy700 = Color(0xFF2D1B4E);
  static const Color sacredNavy600 = Color(0xFF38205D);
  static const Color sacredNavy500 = royalPurple700;
  static const Color sacredNavy50 = Color(0xFFF3E5F5); // Very light purple
  static const Color gold100 = gold300;
  static const Color cream50 = Color(0xFFFFFDE7);
  static const Color primaryBlue = royalPurple500;
  static const Color darkBg = deepSpace;
  static const Color darkSurface = sacredNavy900;
  static const Color darkCard = sacredNavy900;
  static const Color darkBorder = royalPurple900;
  static const Color primaryDark = deepSpace;
  static const Color accentGold = gold500;
  static const Color accentAmber = gold400;
  static const Color warning = gold400;

  // Missing colors
  static const Color flameOrange = Color(0xFFFF6D00);
  static const Color sacredRed = Color(0xFFD32F2F);
  static const Color cardBackground = sacredNavy900;
  static const Color sacredPurple = royalPurple500;
  static const Color sacredGold = gold500;

  // ---------------------------------------------------------------------------
  // GRADIENTS
  // ---------------------------------------------------------------------------

  static const LinearGradient primaryGradient = LinearGradient(
    colors: [royalPurple700, royalPurple900],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold400, gold600],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sacredGradient = LinearGradient(
    colors: [deepSpace, Color(0xFF0F0518)],
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
      fontFamily: GoogleFonts.outfit().fontFamily,
      colorScheme: const ColorScheme.dark(
        primary: gold500,
        secondary: royalPurple500,
        surface: sacredNavy900,
        error: error,
        onPrimary: deepSpace,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        onError: Colors.white,
      ),

      // Typography
      textTheme: TextTheme(
        displayLarge: GoogleFonts.playfairDisplay(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        displayMedium: GoogleFonts.playfairDisplay(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: -0.5,
        ),
        displaySmall: GoogleFonts.playfairDisplay(
          fontSize: 24,
          fontWeight: FontWeight.w700,
          color: textPrimary,
        ),
        headlineMedium: GoogleFonts.playfairDisplay(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineSmall: GoogleFonts.playfairDisplay(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: GoogleFonts.outfit(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          // Keep Inter for reading text
          fontSize: 16,
          color: textSecondary,
          height: 1.6,
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
        titleTextStyle: GoogleFonts.playfairDisplay(
          fontSize: 22,
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

      // Inputs - UPDATED for Visibility on White Forms
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white, // Changed to white for forms
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: gold500),
        ),
        contentPadding: const EdgeInsets.all(20),
        hintStyle: GoogleFonts.inter(color: Colors.grey.shade600),
        labelStyle: GoogleFonts.inter(color: Colors.black87),
        floatingLabelStyle: GoogleFonts.inter(color: gold600),
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

      // Bottom Nav (Legacy - will be overridden by custom widget)
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

      // Dialog Theme - White background with black text for visibility
      dialogTheme: DialogThemeData(
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.inter(
          color: Colors.black87,
          fontSize: 20,
          fontWeight: FontWeight.bold,
        ),
        contentTextStyle: GoogleFonts.inter(
          color: Colors.black87,
          fontSize: 14,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
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

  static BoxDecoration get floatingNavDecoration => BoxDecoration(
    color: sacredNavy900.withValues(alpha: 0.8),
    borderRadius: BorderRadius.circular(32),
    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.3),
        blurRadius: 20,
        spreadRadius: 2,
        offset: const Offset(0, 8),
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
