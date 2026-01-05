import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // Sacred Navy Palette (from Tailwind)
  static const Color sacredNavy950 = Color(0xFF080F1A); // Main background
  static const Color sacredNavy900 = Color(0xFF0D1A2E); // Surface / Cards
  static const Color sacredNavy800 = Color(0xFF11223B); // Lighter surface
  static const Color sacredNavy700 = Color(0xFF152A47); // Borders
  static const Color sacredNavy600 = Color(0xFF1A3354);
  static const Color sacredNavy500 = Color(0xFF1E3A5F);

  // Gold Palette
  static const Color gold500 = Color(0xFFD4AF37); // Primary Accent
  static const Color gold400 = Color(0xFFF8C044); // Lighter Gold
  static const Color gold300 = Color(0xFFFAD575);
  static const Color gold100 = Color(0xFFFEF5D6); // Text on gold

  // Cream/White Palette
  static const Color cream50 = Color(0xFFFDFBF7);
  static const Color textPrimary = Color(0xFFF0F4F9); // sacred 50
  static const Color textSecondary = Color(0xFFB8C9E3); // sacred 200
  static const Color textMuted = Color(0xFF5F82BC); // sacred 400

  // Semantic Colors
  static const Color primaryBlue = Color(0xFF3366CC); // primary 500
  static const Color error = Color(0xFFEF4444);
  static const Color success = Color(0xFF10B981);
  static const Color info = Color(0xFF3B82F6);

  // Legacy Aliases for Backward Compatibility
  static const Color darkBg = sacredNavy950;
  static const Color darkSurface = sacredNavy900;
  static const Color darkCard = sacredNavy900;
  static const Color darkBorder = sacredNavy700;
  static const Color primaryDark = sacredNavy900;
  static const Color accentGold = gold500;
  static const Color accentAmber = gold400;
  static const Color warning = gold400;

  static const LinearGradient primaryGradient = premiumGradient;

  // Gradients
  static const LinearGradient premiumGradient = LinearGradient(
    colors: [Color(0xFF0C4A6E), Color(0xFF1E4EB8), Color(0xFF4C1D95)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [gold400, gold500],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sacredGradient = LinearGradient(
    colors: [sacredNavy950, sacredNavy900],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: sacredNavy950,
      primaryColor: sacredNavy900,
      colorScheme: const ColorScheme.dark(
        primary: gold500,
        secondary: primaryBlue,
        surface: sacredNavy900,
        // background: sacredNavy950, // Deprecated
        error: error,
        onPrimary: sacredNavy900,
        onSecondary: Colors.white,
        onSurface: textPrimary,
        // onBackground: textPrimary, // Deprecated
        onError: Colors.white,
      ),
      textTheme: TextTheme(
        displayLarge: GoogleFonts.merriweather(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          height: 1.2,
        ),
        displayMedium: GoogleFonts.merriweather(
          fontSize: 28,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          height: 1.2,
        ),
        displaySmall: GoogleFonts.merriweather(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          height: 1.2,
        ),
        headlineMedium: GoogleFonts.merriweather(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          height: 1.3,
        ),
        headlineSmall: GoogleFonts.merriweather(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          height: 1.3,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        bodyLarge: GoogleFonts.inter(
          fontSize: 16,
          color: textSecondary,
          height: 1.5,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: textSecondary,
          height: 1.5,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: gold500,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontFamily: 'Merriweather',
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
        iconTheme: IconThemeData(color: textPrimary),
      ),
      cardTheme: CardThemeData(
        color: sacredNavy900,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(
            color: Color(0x33F8C044),
            width: 1,
          ), // Subtle gold border
        ),
        margin: EdgeInsets.zero,
      ),
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: sacredNavy900,
        selectedItemColor: gold500,
        unselectedItemColor: textMuted,
        type: BottomNavigationBarType.fixed,
        elevation: 8,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: gold500,
          foregroundColor: sacredNavy900,
          elevation: 0,
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.w600,
            fontSize: 16,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: sacredNavy800,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide.none,
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: gold500),
        ),
        hintStyle: GoogleFonts.inter(color: textMuted),
        contentPadding: const EdgeInsets.all(16),
      ),

      // Text Button
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: primaryBlue,
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Outlined Button
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: textPrimary,
          side: const BorderSide(color: sacredNavy700),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          textStyle: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),

      // Divider
      dividerTheme: const DividerThemeData(
        color: sacredNavy700,
        thickness: 1,
        space: 1,
      ),

      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: darkCard,
        selectedColor: primaryBlue,
        disabledColor: darkCard,
        labelStyle: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textSecondary,
        ),
        secondaryLabelStyle: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textPrimary,
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: darkBorder),
        ),
      ),

      // Bottom Sheet
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: darkSurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
      ),

      // Dialog
      dialogTheme: DialogThemeData(
        backgroundColor: darkSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        titleTextStyle: GoogleFonts.merriweather(
          fontSize: 20,
          fontWeight: FontWeight.bold,
          color: textPrimary,
        ),
        contentTextStyle: GoogleFonts.inter(fontSize: 14, color: textSecondary),
      ),

      // Snackbar
      snackBarTheme: SnackBarThemeData(
        backgroundColor: darkCard,
        contentTextStyle: GoogleFonts.inter(color: textPrimary),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  // Styles helpers
  static final BoxDecoration glassDecoration = BoxDecoration(
    color: sacredNavy900.withValues(alpha: 0.85),
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.1),
        blurRadius: 10,
        offset: const Offset(0, 4),
      ),
    ],
  );

  static final BoxDecoration sacredCardDecoration = BoxDecoration(
    color: sacredNavy900,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: gold500.withValues(alpha: 0.15)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.2),
        blurRadius: 10,
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
