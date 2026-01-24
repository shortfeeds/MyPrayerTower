import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/hymn_model.dart';
import '../data/hymns_data.dart';

class HymnsState {
  final List<Hymn> allHymns;
  final List<Hymn> filteredHymns;
  final HymnCategory? selectedCategory;
  final String searchQuery;
  final bool isLoading;

  HymnsState({
    this.allHymns = const [],
    this.filteredHymns = const [],
    this.selectedCategory,
    this.searchQuery = '',
    this.isLoading = false,
  });

  HymnsState copyWith({
    List<Hymn>? allHymns,
    List<Hymn>? filteredHymns,
    HymnCategory? selectedCategory,
    String? searchQuery,
    bool? isLoading,
  }) {
    return HymnsState(
      allHymns: allHymns ?? this.allHymns,
      filteredHymns: filteredHymns ?? this.filteredHymns,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      searchQuery: searchQuery ?? this.searchQuery,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class HymnsNotifier extends StateNotifier<HymnsState> {
  HymnsNotifier() : super(HymnsState()) {
    _loadHymns();
  }

  void _loadHymns() {
    state = state.copyWith(
      allHymns: HymnsData.hymns,
      filteredHymns: HymnsData.hymns,
    );
  }

  void setCategory(HymnCategory? category) {
    state = state.copyWith(selectedCategory: category);
    _applyFilters();
  }

  void setSearchQuery(String query) {
    state = state.copyWith(searchQuery: query);
    _applyFilters();
  }

  void _applyFilters() {
    List<Hymn> results = state.allHymns;

    if (state.selectedCategory != null) {
      results = results
          .where((h) => h.category == state.selectedCategory)
          .toList();
    }

    if (state.searchQuery.isNotEmpty) {
      final query = state.searchQuery.toLowerCase();
      results = results.where((h) {
        return h.title.toLowerCase().contains(query) ||
            (h.latinTitle?.toLowerCase().contains(query) ?? false) ||
            h.lyrics.toLowerCase().contains(query);
      }).toList();
    }

    state = state.copyWith(filteredHymns: results);
  }
}

final hymnsProvider = StateNotifierProvider<HymnsNotifier, HymnsState>((ref) {
  return HymnsNotifier();
});
