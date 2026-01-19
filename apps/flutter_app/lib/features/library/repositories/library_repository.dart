import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:http/http.dart' as http;
import '../../../core/services/cache_service.dart';

/// Model for a library document
class LibraryDocument {
  final String id;
  final String title;
  final String source;
  final String category; // 'CANON_LAW', 'GIRM', 'ENCYCLICAL', etc.
  final String content;
  final int? paragraphCount;

  LibraryDocument({
    required this.id,
    required this.title,
    required this.source,
    required this.category,
    required this.content,
    this.paragraphCount,
  });
}

/// Model for Canon Law entry
class CanonLawEntry {
  final int canon;
  final String text;
  final String? section;

  CanonLawEntry({required this.canon, required this.text, this.section});

  factory CanonLawEntry.fromJson(Map<String, dynamic> json) {
    return CanonLawEntry(
      canon: json['canon'] as int? ?? 0,
      text: json['text'] as String? ?? json['content'] as String? ?? '',
      section: json['section'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'canon': canon,
    'text': text,
    'section': section,
  };
}

/// Repository for fetching Church documents from GitHub
class LibraryRepository {
  final http.Client _client;
  final CacheService _cacheService;
  List<CanonLawEntry>? _cachedCanonLaw;

  LibraryRepository({http.Client? client, CacheService? cacheService})
    : _client = client ?? http.Client(),
      _cacheService = cacheService ?? CacheService();

  /// Get Canon Law entries
  /// Source: https://github.com/aseemsavio/catholicism-in-json
  Future<List<CanonLawEntry>> getCanonLaw() async {
    // 1. Memory Cache
    if (_cachedCanonLaw != null) return _cachedCanonLaw!;

    // 2. Local Hive Cache
    try {
      final cachedList = await _cacheService.getCachedData(
        CacheService.libraryBox,
        'canon_law',
      );
      if (cachedList != null) {
        final List<dynamic> data = cachedList;
        _cachedCanonLaw = data
            .map((e) => CanonLawEntry.fromJson(Map<String, dynamic>.from(e)))
            .toList();
        debugPrint('Loaded Canon Law from Hive Cache');
        return _cachedCanonLaw!;
      }
    } catch (e) {
      debugPrint('Hive Cache Error: $e');
    }

    // 3. Network Fetch
    try {
      final url = Uri.parse(
        'https://raw.githubusercontent.com/aseemsavio/catholicism-in-json/main/canon_law.json',
      );

      final response = await _client.get(url);

      if (response.statusCode == 200) {
        final List<dynamic> data = json.decode(response.body);

        // Update Memory
        _cachedCanonLaw = data
            .map((e) => CanonLawEntry.fromJson(e as Map<String, dynamic>))
            .toList();

        // Update Hive
        await _cacheService.cacheData(
          CacheService.libraryBox,
          'canon_law',
          _cachedCanonLaw!.map((e) => e.toJson()).toList(),
        );

        return _cachedCanonLaw!;
      }
    } catch (e) {
      debugPrint('Canon Law API Error: $e');
    }

    // 4. Fallback Data
    debugPrint('Using Fallback Data for Canon Law');
    _cachedCanonLaw = [
      CanonLawEntry(
        canon: 1,
        text: 'The canons of this Code regard only the Latin Church.',
      ),
      CanonLawEntry(
        canon: 2,
        text:
            'For the most part the Code does not define the rites which must be observed in celebrating liturgical actions.',
      ),
      CanonLawEntry(
        canon: 3,
        text:
            'The canons of the Code neither abrogate nor derogate from the agreements entered into by the Apostolic See with nations or other political societies.',
      ),
      CanonLawEntry(
        canon: 212,
        section: '§1',
        text:
            'Conscious of their own responsibility, the Christian faithful are bound to follow with Christian obedience those things which the sacred pastors, inasmuch as they represent Christ, declare as teachers of the faith or establish as rulers of the Church.',
      ),
      CanonLawEntry(
        canon: 212,
        section: '§2',
        text:
            'The Christian faithful are free to make known to the pastors of the Church their needs, especially spiritual ones, and their desires.',
      ),
      CanonLawEntry(
        canon: 212,
        section: '§3',
        text:
            'According to the knowledge, competence, and prestige which they possess, they have the right and even at times the duty to manifest to the sacred pastors their opinion on matters which pertain to the good of the Church and to make their opinion known to the rest of the Christian faithful.',
      ),
    ];
    return _cachedCanonLaw!;
  }

  /// Get a specific canon
  Future<CanonLawEntry?> getCanon(int canonNumber) async {
    final all = await getCanonLaw();
    try {
      return all.firstWhere((c) => c.canon == canonNumber);
    } catch (e) {
      return null;
    }
  }

  /// Search canon law
  Future<List<CanonLawEntry>> searchCanonLaw(String query) async {
    final all = await getCanonLaw();
    final lowerQuery = query.toLowerCase();
    return all.where((c) => c.text.toLowerCase().contains(lowerQuery)).toList();
  }

  /// Get list of available library documents (metadata only)
  List<LibraryDocument> getAvailableDocuments() {
    return [
      LibraryDocument(
        id: 'canon_law',
        title: 'Code of Canon Law',
        source:
            'https://www.vatican.va/archive/cod-iuris-canonici/cic_index_en.html',
        category: 'CANON_LAW',
        content: 'The official laws governing the Catholic Church',
        paragraphCount: 1752,
      ),
      LibraryDocument(
        id: 'catechism',
        title: 'Catechism of the Catholic Church',
        source: 'https://www.vatican.va/archive/ENG0015/_INDEX.HTM',
        category: 'CATECHISM',
        content: 'The compendium of Catholic doctrine',
        paragraphCount: 2865,
      ),
      LibraryDocument(
        id: 'girm',
        title: 'General Instruction of the Roman Missal',
        source:
            'https://www.vatican.va/roman_curia/congregations/ccdds/documents/rc_con_ccdds_doc_20030317_ordinamento-messale_en.html',
        category: 'GIRM',
        content: 'Guidelines for celebrating the Mass',
        paragraphCount: 399,
      ),
      LibraryDocument(
        id: 'laudato_si',
        title: 'Laudato Si\'',
        source:
            'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html',
        category: 'ENCYCLICAL',
        content: 'Pope Francis on Care for Our Common Home',
      ),
      LibraryDocument(
        id: 'fratelli_tutti',
        title: 'Fratelli Tutti',
        source:
            'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html',
        category: 'ENCYCLICAL',
        content: 'Pope Francis on Fraternity and Social Friendship',
      ),
    ];
  }
}

// Providers
final libraryRepositoryProvider = Provider<LibraryRepository>((ref) {
  final cacheService = ref.watch(cacheServiceProvider);
  return LibraryRepository(cacheService: cacheService);
});

// Canon Law provider
final canonLawProvider = FutureProvider<List<CanonLawEntry>>((ref) async {
  final repo = ref.watch(libraryRepositoryProvider);
  return repo.getCanonLaw();
});

// Available documents provider
final libraryDocumentsProvider = Provider<List<LibraryDocument>>((ref) {
  final repo = ref.watch(libraryRepositoryProvider);
  return repo.getAvailableDocuments();
});
