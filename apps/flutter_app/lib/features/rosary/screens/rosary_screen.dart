import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../widgets/visual_rosary_beads.dart';
import '../../auth/providers/auth_provider.dart';
import '../../ads/services/ad_service.dart';
import '../../../core/services/sacred_audio_service.dart';

class RosaryScreen extends ConsumerStatefulWidget {
  const RosaryScreen({super.key});

  @override
  ConsumerState<RosaryScreen> createState() => _RosaryScreenState();
}

class _RosaryScreenState extends ConsumerState<RosaryScreen> {
  int _selectedMystery = -1;
  int _currentBeadIndex = 0;
  final int _totalBeads = 67; // 7 Intro + 5 * 12 Decades
  bool _isAudioPlaying = false;
  String _activeAudioTrackId = 'chant';

  // Enhanced Modes
  bool _isLatinMode = false;
  bool _isEyesClosedMode = false; // Tactile prayer mode
  bool _isHandsFreeMode = false; // Car & commuter auto-advance
  Timer? _handsFreeTimer;
  final int _handsFreeDurationSec = 18; // Default 18 sec per bead
  int _handsFreeCountdown = 18;

  @override
  void dispose() {
    _handsFreeTimer?.cancel();
    super.dispose();
  }

  void _triggerBeadHaptic(int beadIndex) {
    if (beadIndex == 0) {
      // Crucifix: Deep resonant impact
      HapticFeedback.heavyImpact();
    } else if (beadIndex == 1 ||
        beadIndex == 2 ||
        (beadIndex >= 7 && (beadIndex - 7) % 12 == 0)) {
      // Creed or Our Father: Double liturgical pulse
      HapticFeedback.mediumImpact();
      Future.delayed(const Duration(milliseconds: 120), () {
        HapticFeedback.lightImpact();
      });
    } else if (beadIndex >= 7 && (beadIndex - 7) % 12 == 11) {
      // Glory Be & Fatima: Solid medium pulse
      HapticFeedback.mediumImpact();
    } else {
      // Hail Mary: Gentle, clean tactile bead click
      HapticFeedback.lightImpact();
    }
  }

  void _advanceBead() {
    if (_currentBeadIndex < _totalBeads - 1) {
      setState(() {
        _currentBeadIndex++;
        _handsFreeCountdown = _handsFreeDurationSec;
      });
      _triggerBeadHaptic(_currentBeadIndex);

      // Periodically trigger ad when past mid-way (only at decade completion)
      final isDecadeEnd =
          _currentBeadIndex >= 7 && (_currentBeadIndex - 7) % 12 == 11;
      if (isDecadeEnd && _currentBeadIndex >= 30) {
        ref.read(adServiceProvider).loadInterstitialAd(
              onAdLoaded: (ad) => ad.show(),
              onAdFailed: (_) {},
            );
      }
    } else {
      _handsFreeTimer?.cancel();
      setState(() => _isHandsFreeMode = false);
      _triggerBeadHaptic(0);
      _finishRosary();
    }
  }

  void _previousBead() {
    if (_currentBeadIndex > 0) {
      setState(() {
        _currentBeadIndex--;
        _handsFreeCountdown = _handsFreeDurationSec;
      });
      _triggerBeadHaptic(_currentBeadIndex);
    }
  }

  void _toggleHandsFreeMode() {
    setState(() {
      _isHandsFreeMode = !_isHandsFreeMode;
      _handsFreeCountdown = _handsFreeDurationSec;
    });

    _handsFreeTimer?.cancel();
    if (_isHandsFreeMode) {
      HapticFeedback.mediumImpact();
      _handsFreeTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (!mounted) {
          timer.cancel();
          return;
        }
        if (_handsFreeCountdown > 1) {
          setState(() => _handsFreeCountdown--);
        } else {
          _advanceBead();
        }
      });
    }
  }

  final List<_MysteryData> _mysteries = [
    _MysteryData(
      name: 'Joyful Mysteries',
      days: 'Monday & Saturday',
      icon: '🌅',
      color: const Color(0xFF10B981),
      items: [
        _DecadeItem(
          title: 'The Annunciation',
          fruit: 'Humility',
          scripture:
              '"The angel Gabriel said to her, \'Do not be afraid, Mary, for you have found favor with God. Behold, you will conceive and bear a son, and you shall call His name Jesus.\'" (Luke 1:30-31)',
        ),
        _DecadeItem(
          title: 'The Visitation',
          fruit: 'Love of Neighbor',
          scripture:
              '"Elizabeth was filled with the Holy Spirit and exclaimed with a loud cry, \'Blessed are you among women, and blessed is the fruit of your womb!\'" (Luke 1:41-42)',
        ),
        _DecadeItem(
          title: 'The Nativity',
          fruit: 'Poverty of Spirit',
          scripture:
              '"She gave birth to her firstborn son and wrapped him in swaddling cloths, and laid him in a manger, because there was no place for them in the inn." (Luke 2:7)',
        ),
        _DecadeItem(
          title: 'The Presentation in the Temple',
          fruit: 'Obedience to God\'s Will',
          scripture:
              '"Simeon took Him up in his arms and blessed God and said, \'Lord, now lettest thou thy servant depart in peace, according to thy word; for mine eyes have seen thy salvation.\'" (Luke 2:28-30)',
        ),
        _DecadeItem(
          title: 'Finding of Jesus in the Temple',
          fruit: 'Joy in Finding Jesus',
          scripture:
              '"After three days they found Him in the temple, sitting among the teachers, listening to them and asking them questions." (Luke 2:46)',
        ),
      ],
    ),
    _MysteryData(
      name: 'Sorrowful Mysteries',
      days: 'Tuesday & Friday',
      icon: '✝️',
      color: const Color(0xFFEF4444),
      items: [
        _DecadeItem(
          title: 'The Agony in the Garden',
          fruit: 'Sorrow for Sin',
          scripture:
              '"He fell on His face and prayed, \'My Father, if it be possible, let this cup pass from me; nevertheless, not as I will, but as thou wilt.\'" (Matthew 26:39)',
        ),
        _DecadeItem(
          title: 'The Scourging at the Pillar',
          fruit: 'Purity & Mortification',
          scripture:
              '"Then Pilate took Jesus and scourged Him... by His wounds you have been healed." (John 19:1, 1 Peter 2:24)',
        ),
        _DecadeItem(
          title: 'The Crowning with Thorns',
          fruit: 'Moral Courage',
          scripture:
              '"Platting a crown of thorns they put it on His head, and put a reed in His right hand. And kneeling before Him they mocked Him, saying, \'Hail, King of the Jews!\'" (Matthew 27:29)',
        ),
        _DecadeItem(
          title: 'The Carrying of the Cross',
          fruit: 'Patience in Suffering',
          scripture:
              '"So they took Jesus, and He went out, bearing His own cross, to the place called the place of a skull." (John 19:17)',
        ),
        _DecadeItem(
          title: 'The Crucifixion and Death',
          fruit: 'Pardoning of Enemies',
          scripture:
              '"Jesus said, \'Father, forgive them; for they know not what they do\'... Then Jesus, crying with a loud voice, said, \'Father, into thy hands I commit my spirit!\'" (Luke 23:34, 46)',
        ),
      ],
    ),
    _MysteryData(
      name: 'Glorious Mysteries',
      days: 'Wednesday & Sunday',
      icon: '👑',
      color: const Color(0xFFF59E0B),
      items: [
        _DecadeItem(
          title: 'The Resurrection',
          fruit: 'Faith',
          scripture:
              '"He is not here; for He has risen, as He said. Come, see the place where He lay." (Matthew 28:6)',
        ),
        _DecadeItem(
          title: 'The Ascension into Heaven',
          fruit: 'Christian Hope',
          scripture:
              '"As they were looking on, He was lifted up, and a cloud took Him out of their sight... He was received up into heaven and sat down at the right hand of God." (Acts 1:9, Mark 16:19)',
        ),
        _DecadeItem(
          title: 'Descent of the Holy Spirit',
          fruit: 'Gifts of the Holy Spirit',
          scripture:
              '"There appeared to them tongues as of fire, distributed and resting on each one of them. And they were all filled with the Holy Spirit." (Acts 2:3-4)',
        ),
        _DecadeItem(
          title: 'The Assumption of Mary',
          fruit: 'Grace of a Happy Death',
          scripture:
              '"A great portent appeared in heaven, a woman clothed with the sun, with the moon under her feet, and on her head a crown of twelve stars." (Revelation 12:1)',
        ),
        _DecadeItem(
          title: 'The Coronation of Mary',
          fruit: 'Trust in Mary\'s Intercession',
          scripture:
              '"Thou art the glory of Jerusalem, thou art the joy of Israel, thou art the honor of our people." (Judith 15:9)',
        ),
      ],
    ),
    _MysteryData(
      name: 'Luminous Mysteries',
      days: 'Thursday',
      icon: '✨',
      color: const Color(0xFF3B82F6),
      items: [
        _DecadeItem(
          title: 'The Baptism in the Jordan',
          fruit: 'Openness to the Holy Spirit',
          scripture:
              '"When Jesus was baptized, the heavens were opened and he saw the Spirit of God descending like a dove, and alight on him; and lo, a voice from heaven, saying, \'This is my beloved Son, with whom I am well pleased.\'" (Matthew 3:16-17)',
        ),
        _DecadeItem(
          title: 'The Wedding at Cana',
          fruit: 'To Jesus through Mary',
          scripture:
              '"His mother said to the servants, \'Do whatever he tells you.\' Jesus said to them, \'Fill the jars with water.\' And they filled them up to the brim." (John 2:5,7)',
        ),
        _DecadeItem(
          title: 'Proclamation of the Kingdom',
          fruit: 'Repentance and Trust in God',
          scripture:
              '"Jesus came into Galilee, preaching the gospel of God, and saying, \'The time is fulfilled, and the kingdom of God is at hand; repent, and believe in the gospel.\'" (Mark 1:14-15)',
        ),
        _DecadeItem(
          title: 'The Transfiguration',
          fruit: 'Desire for Holiness',
          scripture:
              '"And he was transfigured before them, and his face shone like the sun, and his garments became white as light." (Matthew 17:2)',
        ),
        _DecadeItem(
          title: 'Institution of the Eucharist',
          fruit: 'Eucharistic Adoration',
          scripture:
              '"And he took bread, and when he had given thanks he broke it and gave it to them, saying, \'This is my body which is given for you. Do this in remembrance of me.\'" (Luke 22:19)',
        ),
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.midnightNocturne,
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: Text(
          'Holy Rosary',
          style: GoogleFonts.cinzel(fontWeight: FontWeight.w600),
        ),
        actions: [
          if (_selectedMystery != -1) ...[
            // Latin / English Toggle
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
              child: OutlinedButton(
                onPressed: () {
                  HapticFeedback.selectionClick();
                  setState(() => _isLatinMode = !_isLatinMode);
                },
                style: OutlinedButton.styleFrom(
                  foregroundColor:
                      _isLatinMode ? AppTheme.sacredGold : Colors.white,
                  side: BorderSide(
                    color: _isLatinMode
                        ? AppTheme.sacredGold
                        : Colors.white.withValues(alpha: 0.3),
                  ),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  _isLatinMode ? 'LATIN' : 'EN',
                  style: GoogleFonts.cinzel(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            // Ambient Audio Sheet
            IconButton(
              icon: Icon(
                _isAudioPlaying ? LucideIcons.volume2 : LucideIcons.volumeX,
                color: AppTheme.sacredGold,
              ),
              tooltip: 'Sacred Ambient Accompaniment',
              onPressed: _showAmbientAudioSheet,
            ),
          ],
        ],
      ),
      body: _selectedMystery == -1
          ? _buildMysterySelection()
          : _buildMysteryDetail(_mysteries[_selectedMystery]),
    );
  }

  void _showAmbientAudioSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.marianNavySurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setSheetState) {
          final audio = ref.read(sacredAudioServiceProvider);
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Text('🎶', style: TextStyle(fontSize: 24)),
                    const SizedBox(width: 12),
                    Text(
                      'Sacred Ambient Sanctuary',
                      style: GoogleFonts.cinzel(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.sacredGold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  'Immerse your prayer in monastic chants and reverent cathedral ambiance.',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    color: AppTheme.textSecondary,
                  ),
                ),
                const SizedBox(height: 18),
                ...sacredTracks.map((track) {
                  final isSelected = _activeAudioTrackId == track.id;
                  return ListTile(
                    contentPadding: EdgeInsets.zero,
                    leading: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.sacredGold.withValues(alpha: 0.2)
                            : Colors.white.withValues(alpha: 0.05),
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        isSelected && _isAudioPlaying
                            ? LucideIcons.pause
                            : LucideIcons.play,
                        color: isSelected ? AppTheme.sacredGold : Colors.white70,
                        size: 18,
                      ),
                    ),
                    title: Text(
                      track.title,
                      style: GoogleFonts.inter(
                        color: isSelected ? AppTheme.sacredGold : Colors.white,
                        fontWeight:
                            isSelected ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                    trailing: isSelected && _isAudioPlaying
                        ? Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.sacredGold.withValues(alpha: 0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              'Playing',
                              style: GoogleFonts.inter(
                                fontSize: 11,
                                color: AppTheme.sacredGold,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          )
                        : null,
                    onTap: () {
                      HapticFeedback.selectionClick();
                      if (_activeAudioTrackId == track.id && _isAudioPlaying) {
                        audio.stop();
                        setState(() => _isAudioPlaying = false);
                        setSheetState(() {});
                      } else {
                        audio.playTrack(track.url, track.id);
                        setState(() {
                          _activeAudioTrackId = track.id;
                          _isAudioPlaying = true;
                        });
                        setSheetState(() {});
                      }
                    },
                  );
                }),
                const SizedBox(height: 16),
                Center(
                  child: TextButton.icon(
                    onPressed: () {
                      audio.stop();
                      setState(() => _isAudioPlaying = false);
                      Navigator.pop(ctx);
                    },
                    icon: const Icon(LucideIcons.square, size: 16),
                    label: const Text('Mute All Ambient Audio'),
                    style: TextButton.styleFrom(
                      foregroundColor: Colors.red.shade300,
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildMysterySelection() {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Regal Cathedral Header
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E2B47), Color(0xFF0F172A)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(
                color: AppTheme.sacredGold.withValues(alpha: 0.3),
              ),
            ),
            child: Row(
              children: [
                const Text('📿', style: TextStyle(fontSize: 44)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'The Most Holy Rosary',
                        style: GoogleFonts.cinzel(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.sacredGold,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Select today\'s mystery with tactile haptics & traditional Latin options.',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 28),

          Text(
            'CHOOSE MYSTERIES',
            style: GoogleFonts.cinzel(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: AppTheme.sacredGold,
            ),
          ),

          const SizedBox(height: 14),

          // Mystery Cards
          ...List.generate(_mysteries.length, (index) {
            final mystery = _mysteries[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: 14),
              child: InkWell(
                onTap: () {
                  HapticFeedback.lightImpact();
                  setState(() {
                    _selectedMystery = index;
                    _currentBeadIndex = 0;
                  });
                },
                borderRadius: BorderRadius.circular(18),
                child: Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: AppTheme.marianNavySurface,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(
                      color: mystery.color.withValues(alpha: 0.35),
                      width: 1.2,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 54,
                        height: 54,
                        decoration: BoxDecoration(
                          color: mystery.color.withValues(alpha: 0.18),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: mystery.color.withValues(alpha: 0.4),
                          ),
                        ),
                        child: Center(
                          child: Text(
                            mystery.icon,
                            style: const TextStyle(fontSize: 26),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              mystery.name,
                              style: GoogleFonts.cinzel(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              mystery.days,
                              style: GoogleFonts.inter(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: mystery.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        LucideIcons.chevronRight,
                        color: AppTheme.sacredGold,
                        size: 20,
                      ),
                    ],
                  ),
                ),
              ),
            );
          }),
          const SizedBox(height: 100),
        ],
      ),
    );
  }

  Widget _buildMysteryDetail(_MysteryData mystery) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Top Navigation Controls Row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              TextButton.icon(
                onPressed: () {
                  HapticFeedback.lightImpact();
                  _handsFreeTimer?.cancel();
                  setState(() {
                    _selectedMystery = -1;
                    _isHandsFreeMode = false;
                  });
                },
                icon: const Icon(
                  LucideIcons.arrowLeft,
                  size: 18,
                  color: AppTheme.sacredGold,
                ),
                label: Text(
                  'Mysteries',
                  style: GoogleFonts.inter(color: AppTheme.sacredGold),
                ),
              ),
              // Quick Mode Chips (Eyes Closed & Commuter)
              Row(
                children: [
                  // Eyes Closed Mode Toggle
                  IconButton(
                    onPressed: () {
                      HapticFeedback.selectionClick();
                      setState(() => _isEyesClosedMode = !_isEyesClosedMode);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(_isEyesClosedMode
                              ? 'Tactile Eyes-Closed Mode active: Tap anywhere on the card to advance beads.'
                              : 'Standard Mode active.'),
                          duration: const Duration(seconds: 2),
                        ),
                      );
                    },
                    icon: Icon(
                      _isEyesClosedMode ? LucideIcons.eyeOff : LucideIcons.eye,
                      size: 20,
                      color: _isEyesClosedMode
                          ? AppTheme.sacredGold
                          : Colors.white60,
                    ),
                    tooltip: 'Tactile Eyes-Closed Mode',
                  ),
                  // Hands-Free / Commuter Mode Toggle
                  IconButton(
                    onPressed: _toggleHandsFreeMode,
                    icon: Icon(
                      _isHandsFreeMode
                          ? LucideIcons.pauseCircle
                          : LucideIcons.playCircle,
                      size: 20,
                      color:
                          _isHandsFreeMode ? Colors.greenAccent : Colors.white60,
                    ),
                    tooltip: 'Hands-Free Commuter Mode',
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 8),

          // Header Card
          Container(
            padding: const EdgeInsets.all(22),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  mystery.color.withValues(alpha: 0.85),
                  mystery.color.withValues(alpha: 0.65),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            ),
            child: Row(
              children: [
                Text(mystery.icon, style: const TextStyle(fontSize: 40)),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        mystery.name,
                        style: GoogleFonts.cinzel(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        _isHandsFreeMode
                            ? 'Hands-Free Auto-Advance: Next in ${_handsFreeCountdown}s'
                            : (_isEyesClosedMode
                                ? 'Tactile Mode: Tap card to pray with eyes closed'
                                : 'Interactive Contemplative Guide'),
                        style: GoogleFonts.inter(
                          fontSize: 12,
                          color: Colors.white.withValues(alpha: 0.9),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 20),

          // Interactive Prayer Mode
          _buildInteractivePrayer(mystery),

          const SizedBox(height: 28),

          Text(
            'THE FIVE MYSTERIES',
            style: GoogleFonts.cinzel(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              letterSpacing: 1.5,
              color: AppTheme.sacredGold,
            ),
          ),

          const SizedBox(height: 14),

          // Mystery items list with fruit and scripture
          ...List.generate(mystery.items.length, (index) {
            final item = mystery.items[index];
            final isDecadeActive = _getDecadeIndex() == index;
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: isDecadeActive
                    ? mystery.color.withValues(alpha: 0.15)
                    : AppTheme.marianNavySurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDecadeActive
                      ? mystery.color
                      : Colors.white.withValues(alpha: 0.08),
                  width: isDecadeActive ? 1.5 : 1.0,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: mystery.color.withValues(alpha: 0.25),
                          shape: BoxShape.circle,
                        ),
                        child: Center(
                          child: Text(
                            '${index + 1}',
                            style: TextStyle(
                              color: mystery.color,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          item.title,
                          style: GoogleFonts.cinzel(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: AppTheme.textPrimary,
                          ),
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 3,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.black26,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          item.fruit,
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            color: mystery.color,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    item.scripture,
                    style: GoogleFonts.ebGaramond(
                      fontSize: 14,
                      fontStyle: FontStyle.italic,
                      color: AppTheme.textSecondary,
                      height: 1.5,
                    ),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 120),
        ],
      ),
    );
  }

  int _getDecadeIndex() {
    if (_currentBeadIndex < 7) return -1;
    return (_currentBeadIndex - 7) ~/ 12;
  }

  Widget _buildInteractivePrayer(_MysteryData mystery) {
    String prayerTitle = 'Sign of the Cross';
    String prayerTextEn =
        'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.';
    String prayerTextLa =
        'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.';
    String subNote = 'Begin with the holy sign of our redemption.';

    if (_currentBeadIndex == 0) {
      prayerTitle = 'Sign of the Cross';
      prayerTextEn =
          'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.';
      prayerTextLa =
          'In nómine Patris, et Fílii, et Spíritus Sancti. Amen.';
      subNote = 'Holding the crucifix, make the sign of the cross.';
    } else if (_currentBeadIndex == 1) {
      prayerTitle = 'The Apostles\' Creed';
      prayerTextEn =
          'I believe in God, the Father Almighty, Creator of heaven and earth; and in Jesus Christ, His only Son, our Lord: Who was conceived by the Holy Spirit, born of the Virgin Mary, suffered under Pontius Pilate, was crucified, died, and was buried. He descended into hell; on the third day He rose again from the dead; He ascended into heaven, and sits at the right hand of God the Father Almighty; from thence He shall come to judge the living and the dead.\n\nI believe in the Holy Spirit, the holy Catholic Church, the communion of saints, the forgiveness of sins, the resurrection of the body, and life everlasting. Amen.';
      prayerTextLa =
          'Credo in Deum Patrem omnipoténtem, Creatórem cæli et terræ. Et in Iesum Christum, Fílium eius únicum, Dóminum nostrum, qui concéptus est de Spíritu Sancto, natus ex María Vírgine, passus sub Póntio Piláto, crucifíxus, mórtuus, et sepúltus, descéndit ad ínferos, tértia die resurréxit a mórtuis, ascéndit ad cælos, sedet ad déxteram Dei Patris omnipoténtis, inde ventúrus est iudicáre vivos et mórtuos.\n\nCredo in Spíritum Sanctum, sanctam Ecclésiam cathólicam, sanctórum communiónem, remissiónem peccatórum, carnis resurrectiónem, vitam ætérnam. Amen.';
      subNote = 'Recite our ancient profession of faith.';
    } else if (_currentBeadIndex == 2) {
      prayerTitle = 'Our Father (Pater Noster)';
      prayerTextEn =
          'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.';
      prayerTextLa =
          'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem: sed líbera nos a malo. Amen.';
      subNote = 'For the intentions of the Holy Father.';
    } else if (_currentBeadIndex >= 3 && _currentBeadIndex <= 5) {
      final virtues = ['Faith', 'Hope', 'Charity'];
      final virtue = virtues[_currentBeadIndex - 3];
      prayerTitle = 'Hail Mary ($virtue)';
      prayerTextEn =
          'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.';
      prayerTextLa =
          'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.';
      subNote = 'Prayed for the increase of the theological virtue of $virtue.';
    } else if (_currentBeadIndex == 6) {
      prayerTitle = 'Glory Be (Gloria Patri)';
      prayerTextEn =
          'Glory be to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and ever shall be, world without end. Amen.';
      prayerTextLa =
          'Glória Patri, et Fílio, et Spíritui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.';
      subNote = 'Concluding the introductory prayers.';
    } else {
      final decadeOffset = _currentBeadIndex - 7;
      final decadeIndex = (decadeOffset ~/ 12).clamp(0, 4);
      final stepInDecade = decadeOffset % 12;
      final item = mystery.items[decadeIndex];

      if (stepInDecade == 0) {
        prayerTitle = 'Our Father - ${item.title}';
        prayerTextEn =
            'Our Father, who art in heaven, hallowed be Thy name; Thy kingdom come; Thy will be done on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.';
        prayerTextLa =
            'Pater noster, qui es in cælis, sanctificétur nomen tuum. Advéniat regnum tuum. Fiat volúntas tua, sicut in cælo et in terra. Panem nostrum quotidiánum da nobis hódie, et dimítte nobis débita nostra, sicut et nos dimíttimus debitóribus nostris. Et ne nos indúcas in tentatiónem: sed líbera nos a malo. Amen.';
        subNote = 'Meditating on ${item.title} (Fruit: ${item.fruit})';
      } else if (stepInDecade >= 1 && stepInDecade <= 10) {
        prayerTitle = 'Hail Mary (Bead $stepInDecade of 10)';
        prayerTextEn =
            'Hail Mary, full of grace, the Lord is with thee; blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.';
        prayerTextLa =
            'Ave María, grátia plena, Dóminus tecum. Benedícta tu in muliéribus, et benedíctus fructus ventris tui, Iesus. Sancta María, Mater Dei, ora pro nobis peccatóribus, nunc et in hora mortis nostræ. Amen.';
        subNote = 'Decade ${decadeIndex + 1}: ${item.title}';
      } else {
        prayerTitle = 'Glory Be & Fatima Prayer';
        prayerTextEn =
            'Glory be to the Father, and to the Son, and to the Holy Spirit: as it was in the beginning, is now, and ever shall be, world without end. Amen.\n\nO my Jesus, forgive us our sins, save us from the fires of hell; lead all souls to Heaven, especially those most in need of Thy mercy.';
        prayerTextLa =
            'Glória Patri, et Fílio, et Spíritui Sancto. Sicut erat in princípio, et nunc, et semper, et in sǽcula sæculórum. Amen.\n\nO mi Iesu, dimítte nobis peccáta nostra, líbera nos ab ígnibus inférni, pérdue in cælum omnes ánimas, prœsértim eas quæ máxime índigent misericórdia tua.';
        subNote = 'End of Decade ${decadeIndex + 1}';
      }
    }

    final double progress = (_currentBeadIndex / _totalBeads).clamp(0.0, 1.0);
    final String activePrayerText =
        _isLatinMode ? prayerTextLa : prayerTextEn;

    return GestureDetector(
      onTap: _isEyesClosedMode ? _advanceBead : null,
      child: Container(
        padding: const EdgeInsets.all(22),
        decoration: BoxDecoration(
          color: AppTheme.marianNavySurface,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: _isEyesClosedMode
                ? AppTheme.sacredGold
                : mystery.color.withValues(alpha: 0.35),
            width: _isEyesClosedMode ? 2.0 : 1.2,
          ),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.4),
              blurRadius: 16,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'BEAD ${_currentBeadIndex + 1} OF $_totalBeads',
                  style: GoogleFonts.cinzel(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    letterSpacing: 1.2,
                    color: AppTheme.sacredGold,
                  ),
                ),
                Row(
                  children: [
                    if (_isHandsFreeMode) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 8, vertical: 3),
                        margin: const EdgeInsets.only(right: 6),
                        decoration: BoxDecoration(
                          color: Colors.green.withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                              color: Colors.greenAccent.withValues(alpha: 0.4)),
                        ),
                        child: Text(
                          '${_handsFreeCountdown}s',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: Colors.greenAccent,
                          ),
                        ),
                      ),
                    ],
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: mystery.color.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '${(progress * 100).toInt()}% Done',
                        style: GoogleFonts.inter(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: mystery.color,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 16),
            Text(
              prayerTitle,
              style: GoogleFonts.cinzel(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              _isEyesClosedMode
                  ? '👁️ Eyes-Closed Mode: Tap card to advance with tactile haptic pulse'
                  : subNote,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: _isEyesClosedMode
                    ? AppTheme.sacredGold
                    : AppTheme.textMuted,
                fontStyle: FontStyle.italic,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 18),

            // Scripture / Devotional Contemplation Box
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: const Color(0xFF090E18),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: Colors.white.withValues(alpha: 0.06),
                ),
              ),
              child: Text(
                activePrayerText,
                style: GoogleFonts.ebGaramond(
                  fontSize: 17,
                  color: AppTheme.textPrimary,
                  height: 1.65,
                  letterSpacing: 0.2,
                ),
                textAlign: TextAlign.center,
              ),
            ),

            const SizedBox(height: 18),

            // Linear Progress Indicator
            ClipRRect(
              borderRadius: BorderRadius.circular(6),
              child: LinearProgressIndicator(
                value: progress,
                backgroundColor: Colors.white10,
                valueColor: AlwaysStoppedAnimation(mystery.color),
                minHeight: 8,
              ),
            ),

            const SizedBox(height: 18),

            // Visual Rosary Beads Chain
            VisualRosaryBeads(
              currentBead: _currentBeadIndex,
              totalBeads: _totalBeads,
              activeColor: mystery.color,
              onTapBead: () {
                _advanceBead();
              },
            ),

            const SizedBox(height: 22),

            // Prayer Navigation Controls
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  onPressed: _currentBeadIndex > 0 ? _previousBead : null,
                  icon: const Icon(LucideIcons.chevronLeft),
                  tooltip: 'Previous Bead',
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.white.withValues(alpha: 0.08),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(14),
                  ),
                ),
                ElevatedButton.icon(
                  onPressed: _advanceBead,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: mystery.color,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 28,
                      vertical: 16,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  icon: Icon(
                    _currentBeadIndex < _totalBeads - 1
                        ? LucideIcons.arrowRight
                        : LucideIcons.checkCheck,
                    size: 18,
                  ),
                  label: Text(
                    _currentBeadIndex < _totalBeads - 1
                        ? 'Next Bead'
                        : 'Complete Rosary',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
                ),
                IconButton(
                  onPressed: () {
                    HapticFeedback.selectionClick();
                    setState(() => _currentBeadIndex = 0);
                  },
                  icon: const Icon(LucideIcons.refreshCw),
                  tooltip: 'Restart from beginning',
                  style: IconButton.styleFrom(
                    backgroundColor: Colors.white.withValues(alpha: 0.08),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.all(14),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _finishRosary() async {
    HapticFeedback.heavyImpact();
    final authState = ref.read(authProvider);
    if (authState.value != null) {
      await ref.read(authProvider.notifier).updateStreak();
    }

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppTheme.marianNavySurface,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(24),
          side: const BorderSide(color: AppTheme.sacredGold, width: 1.5),
        ),
        title: Center(
          child: Column(
            children: [
              const Text('👑', style: TextStyle(fontSize: 44)),
              const SizedBox(height: 12),
              Text(
                'Rosary Completed',
                style: GoogleFonts.cinzel(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.sacredGold,
                ),
              ),
            ],
          ),
        ),
        content: Text(
          'May the peace of our Lord Jesus Christ and the loving protection of the Blessed Virgin Mary abide with you always. Your prayer devotion has been recorded.',
          style: GoogleFonts.ebGaramond(
            fontSize: 16,
            color: AppTheme.textPrimary,
            height: 1.6,
          ),
          textAlign: TextAlign.center,
        ),
        actions: [
          Center(
            child: ElevatedButton(
              onPressed: () {
                Navigator.pop(ctx);
                setState(() {
                  _selectedMystery = -1;
                  _currentBeadIndex = 0;
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.sacredGold,
                foregroundColor: AppTheme.midnightNocturne,
                padding: const EdgeInsets.symmetric(
                  horizontal: 32,
                  vertical: 14,
                ),
              ),
              child: Text(
                'Deo Gratias (Thanks be to God)',
                style: GoogleFonts.inter(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MysteryData {
  final String name;
  final String days;
  final String icon;
  final Color color;
  final List<_DecadeItem> items;

  _MysteryData({
    required this.name,
    required this.days,
    required this.icon,
    required this.color,
    required this.items,
  });
}

class _DecadeItem {
  final String title;
  final String fruit;
  final String scripture;

  _DecadeItem({
    required this.title,
    required this.fruit,
    required this.scripture,
  });
}
