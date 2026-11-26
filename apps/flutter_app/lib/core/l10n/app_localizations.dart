import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppLanguage {
  final String code;
  final String nativeName;
  final String flag;

  const AppLanguage(this.code, this.nativeName, this.flag);
}

const List<AppLanguage> supportedAppLanguages = [
  AppLanguage('en', 'English', '🇺🇸'),
  AppLanguage('es', 'Español', '🇪🇸'),
  AppLanguage('pt', 'Português', '🇧🇷'),
  AppLanguage('fr', 'Français', '🇫🇷'),
  AppLanguage('it', 'Italiano', '🇮🇹'),
  AppLanguage('de', 'Deutsch', '🇩🇪'),
  AppLanguage('pl', 'Polski', '🇵🇱'),
  AppLanguage('tl', 'Filipino', '🇵🇭'),
  AppLanguage('hi', 'हिन्दी', '🇮🇳'),
  AppLanguage('ta', 'தமிழ்', '🇮🇳'),
  AppLanguage('ml', 'മലയാളം', '🇮🇳'),
  AppLanguage('ko', '한국어', '🇰🇷'),
  AppLanguage('zh', '中文', '🇨🇳'),
  AppLanguage('ar', 'العربية', '🇱🇧'),
];

class LocaleNotifier extends StateNotifier<Locale> {
  static const _prefKey = 'mpt_app_locale';

  LocaleNotifier() : super(_detectInitialLocale()) {
    _loadSaved();
  }

  static Locale _detectInitialLocale() {
    final deviceLang = ui.PlatformDispatcher.instance.locale.languageCode;
    final match = supportedAppLanguages.any((l) => l.code == deviceLang);
    return Locale(match ? deviceLang : 'en');
  }

  Future<void> _loadSaved() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final saved = prefs.getString(_prefKey);
      if (saved != null && supportedAppLanguages.any((l) => l.code == saved)) {
        state = Locale(saved);
      }
    } catch (_) {}
  }

  Future<void> setLocale(String code) async {
    state = Locale(code);
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_prefKey, code);
    } catch (_) {}
  }
}

final localeProvider = StateNotifierProvider<LocaleNotifier, Locale>((ref) {
  return LocaleNotifier();
});

class AppStrings {
  static const Map<String, Map<String, String>> _dict = {
    'en': {
      'hero_title': 'A Quiet Catholic Sanctuary in Your Pocket',
      'hero_sub': 'Light a vigil candle, pray the Rosary, or entrust your family to the Holy Sacrifice of the Mass.',
      'light_candle': 'Light a Candle — Free',
      'request_mass': 'Request a Holy Mass — \$10',
      'whats_on_heart': 'WHAT WEIGHS ON YOUR HEART TODAY?',
      'pray_now': 'Pray Now (✠ Amen)',
      'amen_offered': '✠ Amen Offered',
      'explore': 'Explore',
      'tonight_rosary': "TONIGHT'S SPONSORED ROSARY MARATHON",
      'sponsor_tomorrow': "Sponsor Tomorrow's Rosary — \$25",
      'language': 'Language',
      'choose_language': 'Choose App Language',
    },
    'es': {
      'hero_title': 'Un Santuario Católico en Tu Bolsillo',
      'hero_sub': 'Enciende una vela votiva, reza el Santo Rosario o encomienda a tu familia en la Santa Misa.',
      'light_candle': 'Encender una Vela — Desde Gratis',
      'request_mass': 'Solicitar una Santa Misa — \$10',
      'whats_on_heart': '¿QUÉ LLEVAS EN TU CORAZÓN HOY?',
      'pray_now': 'Rezar Ahora (✠ Amén)',
      'amen_offered': '✠ Amén Ofrecido',
      'explore': 'Explorar',
      'tonight_rosary': 'ROSARIO PATROCINADO DE ESTA NOCHE',
      'sponsor_tomorrow': 'Patrocinar el Rosario de Mañana — \$25',
      'language': 'Idioma',
      'choose_language': 'Elegir Idioma',
    },
    'pt': {
      'hero_title': 'Um Santuário Católico no Seu Bolso',
      'hero_sub': 'Acenda uma vela votiva, reze o Santo Terço ou confie sua família à Santa Missa.',
      'light_candle': 'Acender uma Vela — Grátis',
      'request_mass': 'Pedir uma Santa Missa — \$10',
      'whats_on_heart': 'O QUE PESA NO SEU CORAÇÃO HOJE?',
      'pray_now': 'Rezar Agora (✠ Amém)',
      'amen_offered': '✠ Amém Oferecido',
      'explore': 'Explorar',
      'tonight_rosary': 'TERÇO PATROCINADO DE HOJE À NOITE',
      'sponsor_tomorrow': 'Patrocinar o Terço de Amanhã — \$25',
      'language': 'Idioma',
      'choose_language': 'Escolher Idioma',
    },
    'fr': {
      'hero_title': 'Un Sanctuaire Catholique dans Votre Poche',
      'hero_sub': 'Allumez un cierge, priez le Saint Rosaire ou confiez votre famille à la Sainte Messe.',
      'light_candle': 'Allumer un Cierge — Gratuit',
      'request_mass': 'Demander une Sainte Messe — \$10',
      'whats_on_heart': 'QUELLE INTENTION PORTEZ-VOUS AUJOURD\'HUI ?',
      'pray_now': 'Prier Maintenant (✠ Amen)',
      'amen_offered': '✠ Amen Offert',
      'explore': 'Explorer',
      'tonight_rosary': 'CHAPELET PARRAINÉ DE CE SOIR',
      'sponsor_tomorrow': 'Parrainer le Chapelet de Demain — \$25',
      'language': 'Langue',
      'choose_language': 'Choisir la Langue',
    },
    'it': {
      'hero_title': 'Un Santuario Cattolico nella Tua Tasca',
      'hero_sub': 'Accendi una candela votiva, prega il Santo Rosario o affida la tua famiglia alla Santa Messa.',
      'light_candle': 'Accendi una Candela — Gratis',
      'request_mass': 'Richiedi una Santa Messa — \$10',
      'whats_on_heart': 'COSA PORTI NEL CUORE OGGI?',
      'pray_now': 'Prega Ora (✠ Amen)',
      'amen_offered': '✠ Amen Offerto',
      'explore': 'Esplora',
      'tonight_rosary': 'ROSARIO SPONSORIZZATO DI STASERA',
      'sponsor_tomorrow': 'Sponsorizza il Rosario di Domani — \$25',
      'language': 'Lingua',
      'choose_language': 'Scegli la Lingua',
    },
    'tl': {
      'hero_title': 'Tahimik na Santuwaryong Katoliko sa Iyong Bulsa',
      'hero_sub': 'Magsindi ng kandila, magdasal ng Santo Rosaryo, o mag-alay ng Banal na Misa.',
      'light_candle': 'Magsindi ng Kandila — Libre',
      'request_mass': 'Mag-alay ng Banal na Misa — \$10',
      'whats_on_heart': 'ANO ANG IYONG PANALANGIN NGAYON?',
      'pray_now': 'Magdasal Ngayon (✠ Amen)',
      'amen_offered': '✠ Amen Naialay',
      'explore': 'Tuklasin',
      'tonight_rosary': 'SPONSORED ROSARY NGAYONG GABI',
      'sponsor_tomorrow': 'I-sponsor ang Rosaryo Bukas — \$25',
      'language': 'Wika',
      'choose_language': 'Pumili ng Wika',
    },
    'de': {
      'hero_title': 'Ein Katholisches Heiligtum in Ihrer Tasche',
      'hero_sub': 'Entzünden Sie eine Kerze, beten Sie den Rosenkranz oder lassen Sie eine Heilige Messe feiern.',
      'light_candle': 'Kerze Entzünden — Kostenlos',
      'request_mass': 'Heilige Messe Beantragen — \$10',
      'whats_on_heart': 'WAS BEWEGT IHR HERZ HEUTE?',
      'pray_now': 'Jetzt Beten (✠ Amen)',
      'amen_offered': '✠ Amen Gebetet',
      'explore': 'Entdecken',
      'tonight_rosary': 'HEUTIGER ROSENKRANZ-MARATHON',
      'sponsor_tomorrow': 'Morgigen Rosenkranz Unterstützen — \$25',
      'language': 'Sprache',
      'choose_language': 'Sprache Wählen',
    },
    'pl': {
      'hero_title': 'Katolickie Sanktuarium w Twojej Kieszeni',
      'hero_sub': 'Zapal świecę wotywną, odmów Różaniec lub zamów intencję Mszy Świętej.',
      'light_candle': 'Zapal Świecę — Za Darmo',
      'request_mass': 'Zamów Mszę Świętą — \$10',
      'whats_on_heart': 'O CO CHCESZ SIĘ DZIŚ MODLIĆ?',
      'pray_now': 'Módl się Teraz (✠ Amen)',
      'amen_offered': '✠ Amen Odmówione',
      'explore': 'Odkryj',
      'tonight_rosary': 'DZISIEJSZY RÓŻANIEC SPONSOROWANY',
      'sponsor_tomorrow': 'Wesprzyj Jutrzejszy Różaniec — \$25',
      'language': 'Język',
      'choose_language': 'Wybierz Język',
    },
  };

  static String tr(String langCode, String key) {
    return _dict[langCode]?[key] ?? _dict['en']?[key] ?? key;
  }
}
