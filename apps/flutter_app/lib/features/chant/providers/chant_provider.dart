import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/chant_model.dart';

// State class for the player
class ChantState {
  final Chant? currentChant;
  final bool isPlaying;
  final bool isLoading;
  final Duration position;
  final Duration duration;
  final List<Chant> playlist;
  final int currentIndex;

  ChantState({
    this.currentChant,
    this.isPlaying = false,
    this.isLoading = false,
    this.position = Duration.zero,
    this.duration = Duration.zero,
    required this.playlist,
    this.currentIndex = -1,
  });

  ChantState copyWith({
    Chant? currentChant,
    bool? isPlaying,
    bool? isLoading,
    Duration? position,
    Duration? duration,
    List<Chant>? playlist,
    int? currentIndex,
  }) {
    return ChantState(
      currentChant: currentChant ?? this.currentChant,
      isPlaying: isPlaying ?? this.isPlaying,
      isLoading: isLoading ?? this.isLoading,
      position: position ?? this.position,
      duration: duration ?? this.duration,
      playlist: playlist ?? this.playlist,
      currentIndex: currentIndex ?? this.currentIndex,
    );
  }
}

// Global provider
final chantProvider = StateNotifierProvider<ChantController, ChantState>((ref) {
  return ChantController();
});

class ChantController extends StateNotifier<ChantState> {
  final AudioPlayer _audioPlayer = AudioPlayer();

  ChantController() : super(ChantState(playlist: _initialChants)) {
    _initAudio();
  }

  void _initAudio() {
    _audioPlayer.onPlayerStateChanged.listen((pState) {
      if (mounted) {
        state = state.copyWith(isPlaying: pState == PlayerState.playing);
      }
    });

    _audioPlayer.onPositionChanged.listen((pos) {
      if (mounted) {
        state = state.copyWith(position: pos);
      }
    });

    _audioPlayer.onDurationChanged.listen((dur) {
      if (mounted) {
        state = state.copyWith(duration: dur);
      }
    });

    _audioPlayer.onPlayerComplete.listen((_) {
      playNext();
    });
  }

  Future<void> playChant(Chant chant) async {
    final index = state.playlist.indexOf(chant);
    if (index == -1) return;

    if (state.currentChant?.id == chant.id) {
      await togglePlay();
      return;
    }

    try {
      state = state.copyWith(
        isLoading: true,
        currentChant: chant,
        currentIndex: index,
      );
      await _audioPlayer.stop();
      await _audioPlayer.setSourceUrl(chant.audioUrl);
      await _audioPlayer.resume();
      state = state.copyWith(isLoading: false, isPlaying: true);
    } catch (e) {
      state = state.copyWith(isLoading: false);
      debugPrint("Error playing chant: $e");
    }
  }

  Future<void> togglePlay() async {
    if (state.isPlaying) {
      await _audioPlayer.pause();
    } else {
      await _audioPlayer.resume();
    }
  }

  Future<void> seek(Duration position) async {
    await _audioPlayer.seek(position);
  }

  Future<void> playNext() async {
    if (state.playlist.isEmpty) return;
    final nextIndex = (state.currentIndex + 1) % state.playlist.length;
    await playChant(state.playlist[nextIndex]);
  }

  Future<void> playPrevious() async {
    if (state.playlist.isEmpty) return;
    int prevIndex = state.currentIndex - 1;
    if (prevIndex < 0) prevIndex = state.playlist.length - 1;
    await playChant(state.playlist[prevIndex]);
  }

  @override
  void dispose() {
    _audioPlayer.dispose();
    super.dispose();
  }

  // Initial Mock Data
  static final List<Chant> _initialChants = [
    const Chant(
      id: '1',
      title: 'Salve Regina',
      category: 'Marian Antiphons',
      audioUrl:
          'https://archive.org/download/gregorianchants/03-SalveRegina.mp3',
      coverUrl:
          'https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1000',
      duration: Duration(minutes: 3, seconds: 45),
      latinLyrics: '''
Salve, Regina, mater misericordiae:
Vita, dulcedo, et spes nostra, salve.
Ad te clamamus, exsules, filii Hevae.
Ad te suspiramus, gementes et flentes
in hac lacrimarum valle.
Eia ergo, Advocata nostra,
illos tuos misericordes oculos
ad nos converte.
Et Jesum, benedictum fructum ventris tui,
nobis, post hoc exsilium ostende.
O clemens: O pia: O dulcis Virgo Maria.
''',
      englishLyrics: '''
Hail, holy Queen, Mother of Mercy,
Hail our life, our sweetness and our hope.
To thee do we cry, poor banished children of Eve;
To thee do we send up our sighs,
Mourning and weeping in this valley of tears.
Turn then, most gracious advocate,
Thine eyes of mercy toward us;
And after this our exile,
Show unto us the blessed fruit of thy womb, Jesus.
O clement, O loving, O sweet Virgin Mary.
''',
    ),
    const Chant(
      id: '2',
      title: 'Pange Lingua Gloriosi',
      category: 'Eucharistic Hymns',
      audioUrl:
          'https://archive.org/download/gregorianchants/09-PangeLingua.mp3',
      coverUrl:
          'https://images.unsplash.com/photo-1517865288-978fc9e8e6ab?q=80&w=1000',
      duration: Duration(minutes: 4, seconds: 20),
      latinLyrics: '''
Pange, lingua, gloriosi
Corporis mysterium,
Sanguinisque pretiosi,
Quem in mundi pretium
Fructus ventris generosi
Rex effudit gentium.

Nobis datus, nobis natus
Ex intacta Virgine,
Et in mundo conversatus,
Sparso verbi semine,
Sui moras incolatus
Miro clausit ordine.
''',
      englishLyrics: '''
Sing, my tongue, the Savior's glory,
of His flesh the mystery sing;
of the Blood, all price exceeding,
shed by our immortal King,
destined, for the world's redemption,
from a noble womb to spring.

Of a pure and spotless Virgin
born for us on earth below,
He, as Man, with man conversing,
stayed, the seeds of truth to sow;
then He closed in solemn order
wondrously His life of woe.
''',
    ),
    const Chant(
      id: '3',
      title: 'Kyrie XI (Orbis Factor)',
      category: 'Mass Ordinary',
      audioUrl: 'https://archive.org/download/gregorianchants/01-KyrieXI.mp3',
      coverUrl:
          'https://images.unsplash.com/photo-1615610816912-327c1f1ec7e7?q=80&w=1000',
      duration: Duration(minutes: 2, seconds: 30),
      latinLyrics: '''
Kyrie eleison.
Kyrie eleison.
Kyrie eleison.

Christe eleison.
Christe eleison.
Christe eleison.

Kyrie eleison.
Kyrie eleison.
Kyrie eleison.
''',
      englishLyrics: '''
Lord, have mercy.
Lord, have mercy.
Lord, have mercy.

Christ, have mercy.
Christ, have mercy.
Christ, have mercy.

Lord, have mercy.
Lord, have mercy.
Lord, have mercy.
''',
    ),
    const Chant(
      id: '4',
      title: 'Asperges Me',
      category: 'Sprinkling Rite',
      audioUrl:
          'https://archive.org/download/gregorianchants/13-AspergesMe.mp3',
      coverUrl:
          'https://images.unsplash.com/photo-1605342416042-4dc2a30bbdf3?q=80&w=1000',
      duration: Duration(minutes: 3, seconds: 10),
      latinLyrics: '''
Asperges me, Domine, hyssopo, et mundabor:
lavabis me, et super nivem dealbabor.
Miserere mei, Deus, secundum magnam misericordiam tuam.
Gloria Patri, et Filio, et Spiritui Sancto.
Sicut erat in principio, et nunc, et semper,
et in saecula saeculorum. Amen.
''',
      englishLyrics: '''
Thou shalt sprinkle me, O Lord, with hyssop, and I shall be cleansed;
Thou shalt wash me, and I shall be whiter than snow.
Have mercy on me, O God, according to Thy great mercy.
Glory be to the Father, and to the Son, and to the Holy Ghost.
As it was in the beginning, is now, and ever shall be,
world without end. Amen.
''',
    ),
  ];
}
