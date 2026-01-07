import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/library_repository.dart';

class CanonLawScreen extends ConsumerStatefulWidget {
  const CanonLawScreen({super.key});

  @override
  ConsumerState<CanonLawScreen> createState() => _CanonLawScreenState();
}

class _CanonLawScreenState extends ConsumerState<CanonLawScreen> {
  final _searchController = TextEditingController();
  List<CanonLawEntry> _filteredEntries = [];
  bool _isSearching = false;

  @override
  Widget build(BuildContext context) {
    final canonLawAsync = ref.watch(canonLawProvider);

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Code of Canon Law',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              controller: _searchController,
              onChanged: (query) {
                setState(() {
                  _isSearching = query.isNotEmpty;
                });
                if (query.isNotEmpty) {
                  ref
                      .read(libraryRepositoryProvider)
                      .searchCanonLaw(query)
                      .then((results) {
                        setState(() {
                          _filteredEntries = results;
                        });
                      });
                }
              },
              style: GoogleFonts.inter(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search Canon Law...',
                hintStyle: GoogleFonts.inter(color: AppTheme.textSecondary),
                prefixIcon: const Icon(LucideIcons.search, color: Colors.grey),
                filled: true,
                fillColor: AppTheme.darkCard,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
            ),
          ),
          Expanded(
            child: canonLawAsync.when(
              data: (entries) {
                final displayList = _isSearching ? _filteredEntries : entries;

                if (displayList.isEmpty) {
                  return Center(
                    child: Text(
                      _isSearching ? 'No results found' : 'Loading Canons...',
                      style: GoogleFonts.inter(color: Colors.white54),
                    ),
                  );
                }

                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: displayList.length,
                  itemBuilder: (context, index) {
                    final canon = displayList[index];
                    return Card(
                      color: AppTheme.darkCard,
                      margin: const EdgeInsets.only(bottom: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  'Canon ${canon.canon}',
                                  style: GoogleFonts.merriweather(
                                    fontWeight: FontWeight.bold,
                                    color: AppTheme.gold500,
                                  ),
                                ),
                                if (canon.section != null)
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white10,
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      canon.section!,
                                      style: GoogleFonts.inter(
                                        fontSize: 10,
                                        color: Colors.white70,
                                      ),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              canon.text,
                              style: GoogleFonts.inter(
                                fontSize: 14,
                                height: 1.5,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              },
              loading: () => const Center(
                child: CircularProgressIndicator(color: AppTheme.gold500),
              ),
              error: (e, s) => Center(
                child: Text(
                  'Error loading Canon Law',
                  style: GoogleFonts.inter(color: Colors.red),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
