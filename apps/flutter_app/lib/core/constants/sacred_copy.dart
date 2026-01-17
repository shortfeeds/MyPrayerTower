/// Sacred Copy Library
///
/// Centralized pastoral language for MyPrayerTower Flutter App.
/// All copy follows principles of:
/// - Gentle, reassuring tone
/// - Meaning before action
/// - Trust reinforcement
/// - No urgency or pressure
library;

class SacredCopy {
  SacredCopy._();

  // ============================================
  // GLOBAL EMOTIONAL TOUCHPOINTS
  // ============================================
  static const welcome = _WelcomeCopy();
  static const prayerComplete = _PrayerCompleteCopy();
  static const system = _SystemCopy();

  // ============================================
  // FEATURE-SPECIFIC COPY
  // ============================================
  static const candles = _CandleCopy();
  static const saints = _SaintsCopy();
  static const churches = _ChurchesCopy();
  static const memorials = _MemorialsCopy();
  static const prayerWall = _PrayerWallCopy();
  static const massOfferings = _MassOfferingsCopy();
  static const offerings = _OfferingsCopy();
  static const dashboard = _DashboardCopy();
}

// ============================================
// WELCOME COPY
// ============================================
class _WelcomeCopy {
  const _WelcomeCopy();

  String get homepage => 'You are welcome here.';
  String get returning => 'A quiet place to return whenever you need prayer.';
  String get closing => 'May peace remain with you.';
  String get heroHeadline => 'A global Catholic community';
  String get heroHighlight => 'united in prayer.';
  String get heroSubtitle =>
      'Pray together, light candles of hope, and offer intentions in faith.';
  String get heroReassurance => 'A place of prayer, remembrance, and hope.';
}

// ============================================
// PRAYER COMPLETION COPY
// ============================================
class _PrayerCompleteCopy {
  const _PrayerCompleteCopy();

  String get primary => 'Your prayer has been offered.';
  String get reassurance => 'You are not alone.';
  String get continuation => 'You may continue in peace.';
}

// ============================================
// SYSTEM MESSAGES (Toasts/Snackbars)
// ============================================
class _SystemCopy {
  const _SystemCopy();

  String get success => 'Received with care';
  String get submitted => 'Entrusted';
  String get completed => 'Offered in prayer';
  String get processing => 'Being prepared with reverence';
  String get error => 'We\'re here to help';
  String get loading => 'One moment...';
  String get saved => 'Safely kept';
}

// ============================================
// CANDLE FLOW COPY
// ============================================
class _CandleCopy {
  const _CandleCopy();

  // Hero Section
  String get badge => 'Sacred Light';
  String get heroTitle => 'Light a Virtual Candle';
  String get heroSubtitle =>
      'Join our community of prayer. Light a candle to represent your intentions and let the light of faith shine before the Lord.';
  String get lightCTA => 'Light Your Candle';

  // Flow Messages
  String get meaningFirst =>
      'Lighting a candle keeps your intention present in prayer.';
  String get afterSelection =>
      'This intention will be remembered with reverence.';
  String get noObligation =>
      'Choose the offering that feels right for your heart.';
  String get transparency =>
      'Every candle burns with care. Your intention is held in prayer throughout its duration.';

  // Tier Names
  String get tierDivineCathedral => 'Divine Cathedral';
  String get tierBlessedMarian => 'Blessed Marian';
  String get tierSacredAltar => 'Sacred Altar';
  String get tierDevotionVotive => 'Devotion Votive';
  String get tierHumblePrayer => 'Humble Prayer';

  // Tier Spiritual Messages
  String get msgDivineCathedral => 'Angels carry your prayers to Heaven';
  String get msgBlessedMarian => 'Under Our Lady\'s protection';
  String get msgSacredAltar => 'Presented before the Lord at His altar';
  String get msgDevotionVotive => 'A sincere offering of faith';
  String get msgHumblePrayer => 'A simple prayer for today';

  // Section Headers
  String get sectionDivineCathedral => '🕊️ Divine Cathedral Candles';
  String get sectionBlessedMarian => '✨ Blessed Marian Candles';
  String get sectionSacredAltar => '⛪ Sacred Altar Candles';
  String get sectionDevotionVotive => '✞ Devotion Votive Candles';
  String get sectionHumblePrayer => '🕯️ Humble Prayer Candles';

  // Stats
  String get prayersOffered => 'Prayers Offered';
  String get activeCandles => 'Active Candles';
}

// ============================================
// SAINTS COPY
// ============================================
class _SaintsCopy {
  const _SaintsCopy();

  String get badge => 'Saint of the Day';
  String get prayWith => 'Pray with this Saint';
  String get prayWithCTA => 'Seek their intercession';
  String get feastDay => 'Honored on';
  String get feastDayContext => 'Celebrated on';
  String get intercession => 'Seeking this Saint\'s intercession';
  String get patronOf => 'Patron of';
  String get devotion => 'A model of faith and devotion';
  String get browseAll => 'Browse All Saints';
  String get noSaintToday => 'No specific saint feast today.';
  String get learnMore => 'Learn More';
}

// ============================================
// CHURCHES COPY
// ============================================
class _ChurchesCopy {
  const _ChurchesCopy();

  String get heading => 'Places of Prayer Near You';
  String get heroTitle => 'Places of Prayer Near You';
  String get heroSubtitle =>
      'Find a sacred space for Mass, Confession, and Adoration';
  String get prayForParish => 'Pray for this parish';
  String get offerMassHere => 'Offer a Mass here';
  String get findChurch => 'Find a Church';
}

// ============================================
// MEMORIALS COPY
// ============================================
class _MemorialsCopy {
  const _MemorialsCopy();

  String get remembered => 'This intention is remembered.';
  String get eternally => 'In loving memory, held eternally in prayer.';
  String get anniversary => 'Remember on anniversary';
  String get heroTitle => 'Light a Memorial';
  String get heroSubtitle =>
      'Honor those who have passed with a lasting tribute of prayer.';
}

// ============================================
// PRAYER WALL COPY
// ============================================
class _PrayerWallCopy {
  const _PrayerWallCopy();

  String get submitIntention => 'Share your prayer';
  String get beingPrayed => 'Being lifted in prayer';
  String get answered => 'Answered in prayer';
  String get community => 'Join in prayer';
  String get heroTitle => 'Prayer Wall';
  String get heroSubtitle =>
      'Share your prayer intentions with our global community of faith.';
}

// ============================================
// MASS OFFERINGS COPY
// ============================================
class _MassOfferingsCopy {
  const _MassOfferingsCopy();

  String get aboutTitle => 'About Mass Intentions';
  String get aboutDescription =>
      'A Mass intention is a beautiful way to remember a loved one or seek God\'s blessing. Each intention is entrusted to a partnered monastery or parish where it will be offered with reverence during Holy Mass.';
  String get reassurance =>
      'Each intention is handled prayerfully and respectfully.';
  String get transparency =>
      'Your offering supports our partner monasteries and keeps this ministry sustainable.';
  String get offerCTA => 'Offer a Mass Intention';
}

// ============================================
// GENERAL OFFERINGS COPY
// ============================================
class _OfferingsCopy {
  const _OfferingsCopy();

  String get transparency =>
      'Your offering helps sustain this sacred ministry and supports our partner communities.';
  String get gratitude => 'Thank you for your generosity.';
  String get noObligation =>
      'All offerings are voluntary and deeply appreciated.';
}

// ============================================
// DASHBOARD COPY
// ============================================
class _DashboardCopy {
  const _DashboardCopy();

  String get history => 'Remembered Intentions';
  String get saved => 'Prayers You Hold';
  String get completed => 'Answered in Prayer';
  String get prayerCorner => 'My Prayer Corner';
}

// ============================================
// CORE ACTIONS (Home Screen)
// ============================================
class CoreAction {
  final String id;
  final String title;
  final String description;
  final String cta;
  final String route;

  const CoreAction({
    required this.id,
    required this.title,
    required this.description,
    required this.cta,
    required this.route,
  });
}

const List<CoreAction> coreActions = [
  CoreAction(
    id: 'pray',
    title: 'Pray With Others',
    description: 'Join Catholics around the world in shared prayer.',
    cta: 'Join in Prayer',
    route: '/prayer-wall',
  ),
  CoreAction(
    id: 'candle',
    title: 'Light a Candle',
    description: 'A sign of hope, remembrance, and continued prayer.',
    cta: 'Light a Candle',
    route: '/candles',
  ),
  CoreAction(
    id: 'mass',
    title: 'Offer a Mass Intention',
    description:
        'Entrust your intention through the tradition of the Holy Mass.',
    cta: 'Offer a Mass Intention',
    route: '/mass-offering',
  ),
];

// ============================================
// SOCIAL REASSURANCE
// ============================================
class SocialReassurance {
  static const String prayersBeingOffered =
      'Prayers are being offered right now';
  static const String candlesLit = 'Candles are currently lit in remembrance';
  static const String intentionsRemembered = 'Intentions remembered today';
}

// ============================================
// WHY WE EXIST
// ============================================
class WhyWeExist {
  static const String title = 'Why MyPrayerTower Exists';
  static const String paragraph1 =
      'In moments of need, remembrance, or gratitude, prayer brings us together.';
  static const String paragraph2 =
      'MyPrayerTower exists to provide a peaceful place where intentions are shared, remembered, and lifted in faith.';
}
