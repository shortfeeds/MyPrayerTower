import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/providers/supabase_provider.dart';
import '../models/saint_model.dart';
import '../../../widgets/app_bar_menu_button.dart';

const List<String> monthsShort = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const List<String> monthsFull = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/// Canonization style helper
Map<String, dynamic> getCanonizationStyle(String? type) {
  if (type == null) {
    return {
      'text': '',
      'bg': const Color(0xFFF3F4F6),
      'color': const Color(0xFF4B5563),
    };
  }
  final lower = type.toLowerCase();
  if (lower.contains('saint')) {
    return {
      'text': 'Saint',
      'bg': const Color(0xFFFEF3C7),
      'color': const Color(0xFFB45309),
    };
  }
  if (lower.contains('blessed')) {
    return {
      'text': 'Blessed',
      'bg': const Color(0xFFF3E8FF),
      'color': const Color(0xFF7C3AED),
    };
  }
  if (lower.contains('venerable')) {
    return {
      'text': 'Venerable',
      'bg': const Color(0xFFDBEAFE),
      'color': const Color(0xFF1D4ED8),
    };
  }
  return {
    'text': type,
    'bg': const Color(0xFFF3F4F6),
    'color': const Color(0xFF4B5563),
  };
}

/// Format feast date
String? getFeastDate(int? month, int? day) {
  if (month == null || day == null || month < 1 || month > 12) return null;
  return '${monthsShort[month - 1]} $day';
}

class SaintsScreen extends ConsumerStatefulWidget {
  const SaintsScreen({super.key});

  @override
  ConsumerState<SaintsScreen> createState() => _SaintsScreenState();
}

class _SaintsScreenState extends ConsumerState<SaintsScreen> {
  final _searchController = TextEditingController();
  String _searchQuery = '';
  int? _selectedMonth; // null = all
  bool _isLoading = false;
  List<Saint> _saints = [];
  int _currentPage = 1;
  bool _hasMore = true;
  int _total = 0;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _loadSaints();
    _scrollController.addListener(_onScroll);
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      _loadMore();
    }
  }

  Future<void> _loadSaints({bool refresh = false}) async {
    if (_isLoading) return;

    setState(() {
      _isLoading = true;
      if (refresh) {
        _currentPage = 1;
        _saints = [];
        _hasMore = true;
      }
    });

    try {
      final supabase = ref.read(supabaseProvider);
      var query = supabase.from('Saint').select();

      // Apply search filter
      if (_searchQuery.isNotEmpty) {
        query = query.ilike('name', '%$_searchQuery%');
      }

      // Apply month filter
      if (_selectedMonth != null) {
        query = query.eq('feastMonth', _selectedMonth! + 1); // 1-indexed in DB
      }

      // Pagination
      final from = (_currentPage - 1) * 30;
      final to = from + 29;

      final data = await query.range(from, to).order('name');

      final saints = (data as List)
          .map((json) => Saint.fromJson(json))
          .toList();

      // Get total count (simplified)
      if (refresh) {
        var countQuery = supabase.from('Saint').select('id');
        if (_searchQuery.isNotEmpty) {
          countQuery = countQuery.ilike('name', '%$_searchQuery%');
        }
        if (_selectedMonth != null) {
          countQuery = countQuery.eq('feastMonth', _selectedMonth! + 1);
        }
        final countData = await countQuery;
        _total = (countData as List).length;
      }

      setState(() {
        _saints = refresh ? saints : [..._saints, ...saints];
        _hasMore = saints.length >= 30;
        _isLoading = false;
      });
    } catch (e) {
      debugPrint('Error loading saints: $e');
      setState(() => _isLoading = false);
    }
  }

  Future<void> _loadMore() async {
    if (!_hasMore || _isLoading) return;
    _currentPage++;
    await _loadSaints();
  }

  void _onSearch(String query) {
    setState(() => _searchQuery = query);
    _loadSaints(refresh: true);
  }

  void _onMonthSelected(int? month) {
    setState(() => _selectedMonth = month);
    _loadSaints(refresh: true);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFFFBEB), // Warm amber background
      body: CustomScrollView(
        controller: _scrollController,
        slivers: [
          // Hero Section
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    Color(0xFFF59E0B),
                    Color(0xFFF97316),
                    Color(0xFFF43F5E),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Column(
                  children: [
                    // App Bar Row
                    Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 8,
                      ),
                      child: Row(
                        children: [
                          const AppBarMenuButton(iconColor: Colors.white),
                          const Spacer(),
                          IconButton(
                            icon: const Icon(
                              LucideIcons.search,
                              color: Colors.white70,
                            ),
                            onPressed: () => _showSearchSheet(),
                          ),
                        ],
                      ),
                    ),
                    // Hero Content
                    Padding(
                      padding: const EdgeInsets.fromLTRB(24, 8, 24, 24),
                      child: Column(
                        children: [
                          // Badge
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 14,
                              vertical: 8,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.white.withValues(alpha: 0.15),
                              borderRadius: BorderRadius.circular(20),
                              border: Border.all(
                                color: Colors.white.withValues(alpha: 0.2),
                              ),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  LucideIcons.crown,
                                  size: 14,
                                  color: Color(0xFFFEF08A),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '${_total > 0 ? _total : 6000}+ Saints',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: Colors.white.withValues(alpha: 0.9),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 16),
                          // Title
                          Text(
                            'Lives of the Saints',
                            style: GoogleFonts.merriweather(
                              fontSize: 32,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 20),
                          // Search Bar
                          GestureDetector(
                            onTap: _showSearchSheet,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 16,
                                vertical: 14,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.white.withValues(alpha: 0.95),
                                borderRadius: BorderRadius.circular(12),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.15),
                                    blurRadius: 20,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    LucideIcons.search,
                                    size: 20,
                                    color: Colors.grey.shade400,
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Text(
                                      _searchQuery.isEmpty
                                          ? 'Search saints...'
                                          : _searchQuery,
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        color: _searchQuery.isEmpty
                                            ? Colors.grey.shade400
                                            : Colors.black87,
                                      ),
                                    ),
                                  ),
                                  if (_searchQuery.isNotEmpty)
                                    GestureDetector(
                                      onTap: () {
                                        _searchController.clear();
                                        _onSearch('');
                                      },
                                      child: Icon(
                                        LucideIcons.x,
                                        size: 18,
                                        color: Colors.grey.shade400,
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Month Filter Pills
          SliverToBoxAdapter(
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Row(
                  children: [
                    _MonthPill(
                      label: 'All',
                      isSelected: _selectedMonth == null,
                      onTap: () => _onMonthSelected(null),
                    ),
                    const SizedBox(width: 8),
                    ...List.generate(
                      12,
                      (i) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: _MonthPill(
                          label: monthsShort[i],
                          isSelected: _selectedMonth == i,
                          onTap: () => _onMonthSelected(i),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),

          // Results Header
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    _searchQuery.isNotEmpty
                        ? 'Results for "$_searchQuery"'
                        : _selectedMonth != null
                        ? monthsFull[_selectedMonth!]
                        : 'All Saints',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.grey.shade900,
                    ),
                  ),
                  Text(
                    _isLoading && _saints.isEmpty
                        ? 'Loading...'
                        : '${_saints.length} of $_total',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: Colors.grey.shade500,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Saints List
          _isLoading && _saints.isEmpty
              ? const SliverFillRemaining(
                  child: Center(
                    child: CircularProgressIndicator(color: Color(0xFFF59E0B)),
                  ),
                )
              : _saints.isEmpty
              ? SliverFillRemaining(child: _buildEmptyState())
              : SliverToBoxAdapter(
                  child: Container(
                    margin: const EdgeInsets.symmetric(horizontal: 16),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _saints.length,
                      separatorBuilder: (_, __) =>
                          Divider(height: 1, color: Colors.grey.shade100),
                      itemBuilder: (context, index) => _SaintTile(
                        saint: _saints[index],
                        onTap: () =>
                            context.push('/saints/${_saints[index].slug}'),
                      ),
                    ),
                  ),
                ),

          // Load More Button
          if (!_isLoading && _hasMore && _saints.isNotEmpty)
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Center(
                  child: ElevatedButton(
                    onPressed: _loadMore,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFF59E0B),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(
                        horizontal: 32,
                        vertical: 14,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: Text(
                      'Load More',
                      style: GoogleFonts.inter(fontWeight: FontWeight.w600),
                    ),
                  ),
                ),
              ),
            ),

          // Loading More Indicator
          if (_isLoading && _saints.isNotEmpty)
            const SliverToBoxAdapter(
              child: Padding(
                padding: EdgeInsets.all(24),
                child: Center(
                  child: CircularProgressIndicator(color: Color(0xFFF59E0B)),
                ),
              ),
            ),

          const SliverToBoxAdapter(child: SizedBox(height: 100)),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(LucideIcons.crown, size: 48, color: Colors.amber.shade300),
          const SizedBox(height: 16),
          Text(
            'No Saints Found',
            style: GoogleFonts.inter(
              fontSize: 18,
              fontWeight: FontWeight.w600,
              color: Colors.grey.shade800,
            ),
          ),
          const SizedBox(height: 8),
          TextButton(
            onPressed: () {
              _searchController.clear();
              _onSearch('');
              _onMonthSelected(null);
            },
            child: const Text('Clear filters'),
          ),
        ],
      ),
    );
  }

  void _showSearchSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: EdgeInsets.only(
          bottom: MediaQuery.of(context).viewInsets.bottom,
          left: 20,
          right: 20,
          top: 20,
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade300,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 20),
            TextField(
              controller: _searchController,
              autofocus: true,
              decoration: InputDecoration(
                hintText: 'Search saints...',
                prefixIcon: const Icon(LucideIcons.search),
                filled: true,
                fillColor: Colors.grey.shade100,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
              ),
              onSubmitted: (value) {
                Navigator.pop(context);
                _onSearch(value);
              },
            ),
            const SizedBox(height: 12),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  _onSearch(_searchController.text);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFFF59E0B),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Search'),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}

class _MonthPill extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _MonthPill({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFFF59E0B) : Colors.grey.shade100,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFFF59E0B).withValues(alpha: 0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 13,
            fontWeight: FontWeight.w500,
            color: isSelected ? Colors.white : Colors.grey.shade600,
          ),
        ),
      ),
    );
  }
}

class _SaintTile extends StatelessWidget {
  final Saint saint;
  final VoidCallback onTap;

  const _SaintTile({required this.saint, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final canonization = getCanonizationStyle(
      saint.title,
    ); // Using title as canonization type
    final feastDate = getFeastDate(saint.feastMonth, saint.feastDayOfMonth);

    return ListTile(
      onTap: onTap,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      leading: Container(
        width: 40,
        height: 40,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFFBBF24), Color(0xFFF97316)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          shape: BoxShape.circle,
        ),
        child: const Icon(LucideIcons.star, size: 20, color: Colors.white),
      ),
      title: Row(
        children: [
          Flexible(
            child: Text(
              saint.name,
              style: GoogleFonts.inter(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: Colors.grey.shade900,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ),
          if (canonization['text'].isNotEmpty) ...[
            const SizedBox(width: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              decoration: BoxDecoration(
                color: canonization['bg'] as Color,
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                canonization['text'] as String,
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w500,
                  color: canonization['color'] as Color,
                ),
              ),
            ),
          ],
        ],
      ),
      subtitle: saint.title != null
          ? Text(
              saint.title!,
              style: GoogleFonts.inter(
                fontSize: 13,
                color: Colors.grey.shade500,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            )
          : null,
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (feastDate != null) ...[
            Icon(LucideIcons.calendar, size: 14, color: Colors.amber.shade500),
            const SizedBox(width: 4),
            Text(
              feastDate,
              style: GoogleFonts.inter(
                fontSize: 12,
                color: Colors.grey.shade500,
              ),
            ),
            const SizedBox(width: 8),
          ],
          Icon(LucideIcons.chevronRight, size: 18, color: Colors.grey.shade300),
        ],
      ),
    );
  }
}
