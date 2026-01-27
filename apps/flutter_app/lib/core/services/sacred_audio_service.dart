import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SacredAudioService {
  final AudioPlayer _player = AudioPlayer();

  String? _currentTrack;
  bool _isPlaying = false;

  bool get isPlaying => _isPlaying;
  String? get currentTrack => _currentTrack;

  Future<void> playTrack(String url, String trackId) async {
    try {
      if (_currentTrack == trackId && _isPlaying) {
        await _player.pause();
        _isPlaying = false;
      } else {
        await _player.setUrl(url);
        await _player.setLoopMode(LoopMode.one);
        await _player.play();
        _currentTrack = trackId;
        _isPlaying = true;
      }
    } catch (e) {
      debugPrint("Error playing sacred audio: $e");
    }
  }

  Future<void> stop() async {
    await _player.stop();
    _isPlaying = false;
    _currentTrack = null;
  }

  Future<void> setVolume(double volume) async {
    await _player.setVolume(volume);
  }

  void dispose() {
    _player.dispose();
  }
}

final sacredAudioServiceProvider = Provider<SacredAudioService>((ref) {
  final service = SacredAudioService();
  ref.onDispose(() => service.dispose());
  return service;
});

// Track Model
class SacredTrack {
  final String id;
  final String title;
  final String url;

  SacredTrack({required this.id, required this.title, required this.url});
}

final sacredTracks = [
  SacredTrack(
    id: 'chant',
    title: 'Gregorian Chant',
    url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Placeholder
  ),
  SacredTrack(
    id: 'organ',
    title: 'Cathedral Organ',
    url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', // Placeholder
  ),
  SacredTrack(
    id: 'ambient',
    title: 'Sacred Silence',
    url:
        'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', // Placeholder
  ),
];
