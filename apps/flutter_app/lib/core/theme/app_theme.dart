import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  // ---------------------------------------------------------------------------
  // CATHEDRAL NOCTURNE PALETTE (Dark Marian / Ecclesiastical)
  // ---------------------------------------------------------------------------

  // Deep, rich Marian backgrounds (Cathedral at Midnight)
  static const Color midnightNocturne = Color(0xFF090E18); // Marian Midnight Navy
  static const Color marianNavyBase = Color(0xFF0F172A); // Marian Navy Foundation
  static const Color marianNavySurface = Color(0xFF162035); // Marian Navy Surface
  static const Color marianNavyCard = Color(0xFF1D2A45); // Elevated Card Surface
  static const Color marianNavyHighlight = Color(0xFF253557); // Highlighted Border / Glass

  // Sacred Gold & Candlelight Accents
  static const Color sacredGold = Color(0xFFD4AF37); // Classic Vatican / Catholic Gold Leaf
  static const Color goldLight = Color(0xFFFFDF7A); // Divine Light Radiance
  static const Color goldWarm = Color(0xFFFFC233); // Warm Golden Glow
  static const Color goldAmber = Color(0xFFFF9E1B); // Candle Flame Amber
  static const Color candleOrange = Color(0xFFFF6D00); // Inner Wick Flame

  // Liturgical Season Accents (for seasonal dynamic tinting)
  static const Color liturgicalGreen = Color(0xFF2E7D32); // Ordinary Time
  static const Color liturgicalViolet = Color(0xFF6A1B9A); // Advent & Lent
  static const Color liturgicalRed = Color(0xFFC62828); // Martyrs, Pentecost, Passion
  static const Color liturgicalGold = Color(0xFFD4AF37); // Christmas & Easter Solemnities
  static const Color liturgicalRose = Color(0xFFD81B60); // Gaudete & Laetare Sundays

  // ---------------------------------------------------------------------------
  // VATICAN ALABASTER PALETTE (Light / Contemplative High-Contrast)
  // ---------------------------------------------------------------------------
  static const Color alabasterBg = Color(0xFFFAF7F2); // Warm Parchment Ivory
  static const Color alabasterSurface = Color(0xFFFFFFFF); // Alabaster White
  static const Color alabasterCard = Color(0xFFF3ECE2); // Subtle Sacred Cream
  static const Color alabasterBorder = Color(0xFFE2D7C5); // Sepia Border
  static const Color alabasterTextPrimary = Color(0xFF1F1B18); // Deep Sepia Charcoal
  static const Color alabasterTextSecondary = Color(0xFF5D544C); // Muted Contemplative Brown
  static const Color alabasterTextMuted = Color(0xFF8C8276);

  // Text Colors (Dark Theme)
  static const Color textPrimary = Color(0xFFF9F7F2); // Luminous Alabaster Off-white
  static const Color textSecondary = Color(0xFFBAC5D8); // Soft Marian Silver
  static const Color textMuted = Color(0xFF7A89A0); // Muted Silver Slate

  // Functional
  static const Color error = Color(0xFFE57373);
  static const Color success = Color(0xFF81C784);
  static const Color info = Color(0xFF64B5F6);

  // ---------------------------------------------------------------------------
  // LEGACY ALIASES (Full backwards compatibility for all 50+ modules)
  // ---------------------------------------------------------------------------
  static const Color voidBlack = midnightNocturne;
  static const Color deepSpace = midnightNocturne;
  static const Color sacredNavy950 = marianNavyBase;
  static const Color sacredNavy900 = marianNavySurface;
  static const Color sacredNavy800 = marianNavyCard;
  static const Color sacredNavy700 = Color(0xFF233252);
  static const Color sacredNavy600 = Color(0xFF2C3E66);
  static const Color sacredNavy500 = Color(0xFF3B5285);
  static const Color sacredNavy50 = Color(0xFFF0F4FA);

  static const Color gold600 = Color(0xFFB8860B);
  static const Color gold500 = sacredGold;
  static const Color gold400 = goldLight;
  static const Color gold300 = Color(0xFFFFF3D0);
  static const Color gold100 = Color(0xFFFFF9E6);
  static const Color cream50 = Color(0xFFFFFDF5);

  static const Color royalPurple900 = Color(0xFF26143D);
  static const Color royalPurple700 = Color(0xFF4527A0);
  static const Color royalPurple500 = Color(0xFF7C4DFF);
  static const Color royalPurple400 = Color(0xFFB388FF);

  static const Color primaryBlue = Color(0xFF2A4D82);
  static const Color darkBg = midnightNocturne;
  static const Color darkSurface = marianNavySurface;
  static const Color darkCard = marianNavySurface;
  static const Color darkBorder = Color(0x33D4AF37);
  static const Color primaryDark = midnightNocturne;
  static const Color accentGold = sacredGold;
  static const Color accentAmber = goldAmber;
  static const Color warning = goldAmber;
  static const Color flameOrange = candleOrange;
  static const Color sacredRed = liturgicalRed;
  static const Color cardBackground = marianNavySurface;
  static const Color sacredPurple = liturgicalViolet;

  // ---------------------------------------------------------------------------
  // GRADIENTS
  // ---------------------------------------------------------------------------
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [
      Color(0xFF131D31),
      Color(0xFF090E18),
    ],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient goldGradient = LinearGradient(
    colors: [goldLight, sacredGold],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient sacredGradient = LinearGradient(
    colors: [marianNavyBase, midnightNocturne],
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
  );

  static const LinearGradient cathedralAtmosphereGradient = LinearGradient(
    colors: [
      Color(0x33D4AF37), // Subtle gold divine glow at top
      Color(0x00000000), // Dissolves into cathedral darkness
    ],
    begin: Alignment.topCenter,
    end: Alignment.center,
  );

  static const LinearGradient glassGradient = LinearGradient(
    colors: [
      Color(0x1AFFFFFF), // White 10%
      Color(0x08FFFFFF), // White 3%
    ],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  // Dynamic liturgical gradient builder
  static LinearGradient seasonalAtmosphere(Color liturgicalColor) {
    return LinearGradient(
      colors: [
        liturgicalColor.withValues(alpha: 0.18),
        midnightNocturne,
      ],
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
    );
  }

  // ---------------------------------------------------------------------------
  // SACRED TYPOGRAPHY HELPERS
  // ---------------------------------------------------------------------------

  /// Classic Roman Lapidary font for sacred headings and cathedral titles
  static TextStyle sacredHeader({
    double fontSize = 24,
    FontWeight fontWeight = FontWeight.w600,
    Color color = textPrimary,
    double letterSpacing = 0.5,
  }) {
    return GoogleFonts.cinzel(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
    );
  }

  /// Classic contemplative serif font for prayers, scripture and novenas
  static TextStyle devotionalText({
    double fontSize = 17,
    FontWeight fontWeight = FontWeight.normal,
    Color color = textPrimary,
    double height = 1.65,
    double letterSpacing = 0.2,
  }) {
    return GoogleFonts.ebGaramond(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      height: height,
      letterSpacing: letterSpacing,
    );
  }

  /// Clean, highly legible sans-serif for UI labels, badges, buttons, and navigation
  static TextStyle uiText({
    double fontSize = 14,
    FontWeight fontWeight = FontWeight.w500,
    Color color = textSecondary,
    double letterSpacing = 0.2,
  }) {
    return GoogleFonts.inter(
      fontSize: fontSize,
      fontWeight: fontWeight,
      color: color,
      letterSpacing: letterSpacing,
    );
  }

  // ---------------------------------------------------------------------------
  // THEME DATA
  // ---------------------------------------------------------------------------

  static ThemeData get darkTheme => getDynamicTheme(sacredGold);
  static ThemeData get lightTheme => getLightDynamicTheme(sacredGold);

  /// Dynamic Dark Cathedral Theme tinted with current liturgical season color
  static ThemeData getDynamicTheme(Color primaryColor) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: midnightNocturne,
      primaryColor: primaryColor,
      fontFamily: GoogleFonts.inter().fontFamily,
      colorScheme: ColorScheme.dark(
        primary: primaryColor,
        secondary: sacredGold,
        surface: marianNavySurface,
        error: error,
        onPrimary: midnightNocturne,
        onSecondary: midnightNocturne,
        onSurface: textPrimary,
        onError: Colors.white,
      ),

      // Ecclesiastical Typography Hierarchy
      textTheme: TextTheme(
        displayLarge: GoogleFonts.cinzel(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: 0.5,
        ),
        displayMedium: GoogleFonts.cinzel(
          fontSize: 26,
          fontWeight: FontWeight.bold,
          color: textPrimary,
          letterSpacing: 0.5,
        ),
        displaySmall: GoogleFonts.cinzel(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          color: textPrimary,
          letterSpacing: 0.3,
        ),
        headlineLarge: GoogleFonts.cinzel(
          fontSize: 22,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineMedium: GoogleFonts.cinzel(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        headlineSmall: GoogleFonts.cinzel(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleLarge: GoogleFonts.cinzel(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 16,
          fontWeight: FontWeight.w600,
          color: textPrimary,
        ),
        titleSmall: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: textSecondary,
        ),
        bodyLarge: GoogleFonts.ebGaramond(
          fontSize: 17,
          color: textPrimary,
          height: 1.65,
          letterSpacing: 0.2,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: textSecondary,
          height: 1.5,
        ),
        bodySmall: GoogleFonts.inter(
          fontSize: 12,
          color: textMuted,
          height: 1.4,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: sacredGold,
          letterSpacing: 0.5,
        ),
        labelMedium: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textSecondary,
        ),
      ),

      // Cathedral AppBar
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.cinzel(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: textPrimary,
          letterSpacing: 0.5,
        ),
        iconTheme: const IconThemeData(color: textPrimary),
      ),

      // Cathedral Surface Cards
      cardTheme: CardThemeData(
        color: marianNavySurface,
        elevation: 8,
        shadowColor: Colors.black87,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: Colors.white.withValues(alpha: 0.08),
            width: 1,
          ),
        ),
        margin: EdgeInsets.zero,
      ),

      // Inputs with clear readability
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: marianNavySurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.12)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withValues(alpha: 0.12)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: sacredGold, width: 1.5),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
        hintStyle: GoogleFonts.inter(color: textMuted),
        labelStyle: GoogleFonts.inter(color: textSecondary),
        floatingLabelStyle: GoogleFonts.inter(color: sacredGold),
      ),

      // Sacred Golden Buttons
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: sacredGold,
          foregroundColor: midnightNocturne,
          elevation: 4,
          shadowColor: sacredGold.withValues(alpha: 0.35),
          textStyle: GoogleFonts.inter(
            fontWeight: FontWeight.bold,
            fontSize: 15,
            letterSpacing: 0.3,
          ),
          padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
        ),
      ),

      // Bottom Navigation
      bottomNavigationBarTheme: const BottomNavigationBarThemeData(
        backgroundColor: midnightNocturne,
        selectedItemColor: sacredGold,
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

      // Subtle Divider
      dividerTheme: DividerThemeData(
        color: Colors.white.withValues(alpha: 0.08),
        thickness: 1,
        space: 1,
      ),

      // Bottom Sheet
      bottomSheetTheme: const BottomSheetThemeData(
        backgroundColor: marianNavySurface,
        modalBackgroundColor: marianNavySurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
        ),
      ),

      // Dialog Theme
      dialogTheme: DialogThemeData(
        backgroundColor: marianNavySurface,
        surfaceTintColor: Colors.transparent,
        titleTextStyle: GoogleFonts.cinzel(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.bold,
          letterSpacing: 0.4,
        ),
        contentTextStyle: GoogleFonts.inter(
          color: textSecondary,
          fontSize: 14,
          height: 1.5,
        ),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: Colors.white.withValues(alpha: 0.1),
            width: 1,
          ),
        ),
      ),
    );
  }

  /// Vatican Alabaster Light Theme for daylight reading and contemplation
  static ThemeData getLightDynamicTheme(Color primaryColor) {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: alabasterBg,
      primaryColor: primaryColor,
      fontFamily: GoogleFonts.inter().fontFamily,
      colorScheme: ColorScheme.light(
        primary: primaryColor,
        secondary: sacredGold,
        surface: alabasterSurface,
        error: error,
        onPrimary: Colors.white,
        onSecondary: Colors.white,
        onSurface: alabasterTextPrimary,
        onError: Colors.white,
      ),

      textTheme: TextTheme(
        displayLarge: GoogleFonts.cinzel(
          fontSize: 32,
          fontWeight: FontWeight.bold,
          color: alabasterTextPrimary,
          letterSpacing: 0.5,
        ),
        displayMedium: GoogleFonts.cinzel(
          fontSize: 26,
          fontWeight: FontWeight.bold,
          color: alabasterTextPrimary,
        ),
        headlineMedium: GoogleFonts.cinzel(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: alabasterTextPrimary,
        ),
        titleLarge: GoogleFonts.cinzel(
          fontSize: 18,
          fontWeight: FontWeight.w600,
          color: alabasterTextPrimary,
        ),
        bodyLarge: GoogleFonts.ebGaramond(
          fontSize: 17,
          color: alabasterTextPrimary,
          height: 1.65,
          letterSpacing: 0.2,
        ),
        bodyMedium: GoogleFonts.inter(
          fontSize: 14,
          color: alabasterTextSecondary,
          height: 1.5,
        ),
        labelLarge: GoogleFonts.inter(
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: sacredGold,
          letterSpacing: 0.5,
        ),
      ),

      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: GoogleFonts.cinzel(
          fontSize: 20,
          fontWeight: FontWeight.w600,
          color: alabasterTextPrimary,
        ),
        iconTheme: const IconThemeData(color: alabasterTextPrimary),
      ),

      cardTheme: CardThemeData(
        color: alabasterSurface,
        elevation: 2,
        shadowColor: Colors.black12,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: alabasterBorder, width: 1),
        ),
      ),

      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: alabasterSurface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: alabasterBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: alabasterBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: sacredGold, width: 1.5),
        ),
      ),
    );
  }

  // ---------------------------------------------------------------------------
  // HELPERS & DECORATIONS
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
    color: marianNavySurface.withValues(alpha: 0.88),
    borderRadius: BorderRadius.circular(32),
    border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withValues(alpha: 0.35),
        blurRadius: 20,
        spreadRadius: 2,
        offset: const Offset(0, 8),
      ),
    ],
  );

  static BoxDecoration get goldBorderDecoration => BoxDecoration(
    color: marianNavySurface,
    borderRadius: BorderRadius.circular(24),
    border: Border.all(color: sacredGold.withValues(alpha: 0.35)),
    boxShadow: [
      BoxShadow(
        color: sacredGold.withValues(alpha: 0.08),
        blurRadius: 20,
        spreadRadius: 0,
        offset: const Offset(0, 8),
      ),
    ],
  );

  static BoxDecoration get sacredCardDecoration => BoxDecoration(
    color: marianNavySurface,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
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
