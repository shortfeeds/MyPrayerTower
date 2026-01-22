import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';
import '../../novena_tracker/data/novenas_data.dart';
import '../../novena_tracker/models/novena_model.dart';

import '../../novena_tracker/screens/novena_detail_screen.dart';

class NovenasScreen extends StatefulWidget {
  const NovenasScreen({super.key});

  @override
  State<NovenasScreen> createState() => _NovenasScreenState();
}

class _NovenasScreenState extends State<NovenasScreen> {
  String _searchQuery = '';
  String _activeCategory = 'all';

  final List<CategoryTab> _categories = [
    CategoryTab(id: 'all', label: 'All'),
    CategoryTab(id: 'marian', label: 'Marian'),
    CategoryTab(id: 'saints', label: 'Saints'),
    CategoryTab(id: 'special', label: 'Special'),
  ];

  @override
  Widget build(BuildContext context) {
    final filteredNovenas = allNovenas.filter((novena) {
      // 1. Filter by Search
      final matchesSearch =
          novena.name.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          novena.patron.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          novena.patronOf.toLowerCase().contains(_searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filter by Category
      if (_activeCategory == 'all') return true;
      if (_activeCategory == 'marian') {
        return novena.name.contains('Mary') ||
            novena.name.contains('Lady') ||
            novena.name.contains('Immaculate') ||
            novena.name.contains('Assumption');
      }
      if (_activeCategory == 'saints') {
        return novena.name.startsWith('St.') ||
            novena.name.contains('Padre Pio') ||
            novena.name.contains('Mother Teresa');
      }
      if (_activeCategory == 'special') {
        return !novena.name.contains('Lady') &&
            !novena.name.contains('Mary') &&
            !novena.name.startsWith('St.') &&
            !novena.name.contains('Padre Pio');
      }
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: Text(
          'Novenas',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(70),
          child: Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: TextField(
              onChanged: (value) => setState(() => _searchQuery = value),
              style: const TextStyle(color: Colors.white),
              decoration: InputDecoration(
                hintText: 'Search saint, intention...',
                hintStyle: TextStyle(
                  color: Colors.white.withValues(alpha: 0.5),
                ),
                prefixIcon: const Icon(
                  LucideIcons.search,
                  color: Colors.white54,
                ),
                filled: true,
                fillColor: AppTheme.sacredNavy800,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 16),
              ),
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Categories
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              children: _categories.map((cat) {
                final isActive = _activeCategory == cat.id;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    selected: isActive,
                    label: Text(cat.label),
                    onSelected: (_) => setState(() => _activeCategory = cat.id),
                    backgroundColor: AppTheme.sacredNavy800,
                    selectedColor: AppTheme.gold500,
                    labelStyle: TextStyle(
                      color: isActive ? Colors.black : Colors.white70,
                      fontWeight: isActive
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                    checkmarkColor: Colors.black,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isActive ? AppTheme.gold500 : Colors.white12,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),

          // List
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: filteredNovenas.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: _NovenaCard(
                    novena: filteredNovenas[index],
                    onTap: () =>
                        _showNovenaDetail(context, filteredNovenas[index]),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _showNovenaDetail(BuildContext context, NovenaDefinition novena) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => NovenaDetailScreen(novena: novena),
      ),
    );
  }
}

class CategoryTab {
  final String id;
  final String label;
  CategoryTab({required this.id, required this.label});
}

extension ListFilter<E> on List<E> {
  List<E> filter(bool Function(E) test) => where(test).toList();
}

class _NovenaCard extends StatelessWidget {
  final NovenaDefinition novena;
  final VoidCallback onTap;

  const _NovenaCard({required this.novena, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white10),
        ),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    novena.color.withValues(alpha: 0.2),
                    (novena.colorSecondary ?? novena.color).withValues(
                      alpha: 0.1,
                    ),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: novena.color.withValues(alpha: 0.3),
                  width: 1,
                ),
              ),
              child: Center(
                child: Icon(LucideIcons.flame, color: novena.color, size: 28),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    novena.name,
                    style: GoogleFonts.merriweather(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                      fontSize: 16,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      if (novena.patronOf.isNotEmpty) ...[
                        Icon(
                          LucideIcons.heart,
                          size: 12,
                          color: Colors.white.withValues(alpha: 0.6),
                        ),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            novena.patronOf,
                            style: GoogleFonts.inter(
                              color: Colors.white.withValues(alpha: 0.6),
                              fontSize: 12,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      novena.duration,
                      style: GoogleFonts.inter(
                        color: Colors.white38,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              LucideIcons.chevronRight,
              color: Colors.white38,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
