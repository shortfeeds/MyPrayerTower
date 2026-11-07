import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../../../core/widgets/premium_glass_card.dart';
import '../../../core/widgets/premium_scaffold.dart';

enum SearchCategory { all, prayers, scripture, saints, devotions, churches }

class SearchItem {
  final String title;
  final String subtitle;
  final String categoryName;
  final SearchCategory category;
  final IconData icon;
  final String route;
  final List<String> keywords;

  const SearchItem({
    required this.title,
    required this.subtitle,
    required this.categoryName,
    required this.category,
    required this.icon,
    required this.route,
    required this.keywords,
  });
}

class UniversalSearchScreen extends StatefulWidget {
  const UniversalSearchScreen({super.key});

  @override
  State<UniversalSearchScreen> createState() => _UniversalSearchScreenState();
}

class _UniversalSearchScreenState extends State<UniversalSearchScreen> {
  final TextEditingController _searchController = TextEditingController();
  final FocusNode _focusNode = FocusNode();
  SearchCategory _selectedCategory = SearchCategory.all;
  String _query = '';

  static const List<SearchItem> _catalog = [
    // PRAYERS & ROSARY
    SearchItem(
      title: 'The Holy Rosary',
      subtitle: 'Joyful, Sorrowful, Glorious & Luminous Mysteries with tactile beads',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.circleDot,
      route: '/rosary',
      keywords: ['rosary', 'beads', 'marian', 'mary', 'mysteries', 'haptic', 'latin', 'ave maria'],
    ),
    SearchItem(
      title: 'Chaplet of Divine Mercy',
      subtitle: 'The 3:00 PM Hour of Mercy devotion given to St. Faustina',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.heartHandshake,
      route: '/chaplets',
      keywords: ['divine mercy', 'chaplet', 'faustina', 'mercy', 'passion', 'jesus'],
    ),
    SearchItem(
      title: 'Saint Michael the Archangel',
      subtitle: 'Prayer for spiritual warfare and defense against wickedness',
      categoryName: 'Prayers',
      category: SearchCategory.prayers,
      icon: LucideIcons.shield,
      route: '/prayers',
      keywords: ['st michael', 'archangel', 'defense', 'warfare', 'evil', 'protection'],
    ),
    SearchItem(
      title: 'The Memorare',
      subtitle: 'Remember, O most gracious Virgin Mary (St. Bernard of Clairvaux)',
      categoryName: 'Prayers',
      category: SearchCategory.prayers,
      icon: LucideIcons.sparkles,
      route: '/prayers',
      keywords: ['memorare', 'mary', 'intercession', 'bernard', 'mother'],
    ),
    SearchItem(
      title: 'The Angelus & Regina Caeli',
      subtitle: 'Traditional Marian prayers for dawn, noon, and sunset',
      categoryName: 'Prayers',
      category: SearchCategory.prayers,
      icon: LucideIcons.sun,
      route: '/prayers',
      keywords: ['angelus', 'regina caeli', 'noon', 'incarnation', 'resurrection'],
    ),
    SearchItem(
      title: 'Daily Mass Readings & Gospel',
      subtitle: 'Liturgy of the Word, Responsorial Psalm, and Daily Gospel',
      categoryName: 'Scripture',
      category: SearchCategory.scripture,
      icon: LucideIcons.bookOpen,
      route: '/readings',
      keywords: ['gospel', 'readings', 'mass', 'lectionary', 'scripture', 'epistle', 'psalm'],
    ),
    SearchItem(
      title: 'The Holy Bible (Catholic Canon)',
      subtitle: 'Old & New Testament including Deuterocanonical Books',
      categoryName: 'Scripture',
      category: SearchCategory.scripture,
      icon: LucideIcons.book,
      route: '/bible',
      keywords: ['bible', 'scripture', 'genesis', 'matthew', 'psalms', 'revelation', 'tobit', 'maccabees'],
    ),
    SearchItem(
      title: 'Confession Guide & Examination',
      subtitle: 'Comprehensive Examination of Conscience with 10 Commandments',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.key,
      route: '/confession-guide',
      keywords: ['confession', 'penance', 'reconciliation', 'sin', 'examination', 'absolution'],
    ),
    SearchItem(
      title: 'Stations of the Cross (Via Crucis)',
      subtitle: '14 Stations following Christ from condemnation to the tomb',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.cross,
      route: '/stations-of-the-cross',
      keywords: ['stations', 'cross', 'calvary', 'lent', 'good friday', 'via dolorosa'],
    ),
    SearchItem(
      title: 'Find Catholic Churches & Mass Times',
      subtitle: '10,000+ Parishes worldwide with live GPS distance and Mass schedules',
      categoryName: 'Churches',
      category: SearchCategory.churches,
      icon: LucideIcons.mapPin,
      route: '/churches',
      keywords: ['churches', 'church', 'parish', 'mass times', 'confession times', 'cathedral', 'chapel'],
    ),
    SearchItem(
      title: 'Community Prayer Wall',
      subtitle: 'Post prayer intentions and join thousands praying "Amen"',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.heart,
      route: '/prayer-wall',
      keywords: ['prayer wall', 'intentions', 'community', 'intercession', 'petition', 'amen'],
    ),
    SearchItem(
      title: 'Catholic Sleep Stories & Night Audio',
      subtitle: 'Peaceful biblical narratives, Ignatian examen & monastery night chants',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.moon,
      route: '/sleep-stories',
      keywords: ['sleep', 'bedtime', 'night', 'examen', 'benedict', 'peace', 'meditation', 'chant'],
    ),
    SearchItem(
      title: 'Saint of the Day & Hagiography',
      subtitle: 'Biographies, patronages, feast days, and saint relics',
      categoryName: 'Saints',
      category: SearchCategory.saints,
      icon: LucideIcons.award,
      route: '/saints',
      keywords: ['saints', 'patron', 'feast', 'francis', 'anthony', 'jude', 'therese', 'padre pio', 'benedict'],
    ),
    SearchItem(
      title: 'Offer a Holy Mass',
      subtitle: 'Request a consecrated Holy Mass intention for loved ones or souls in Purgatory',
      categoryName: 'Churches',
      category: SearchCategory.churches,
      icon: LucideIcons.scroll,
      route: '/mass-offering',
      keywords: ['mass offering', 'holy mass', 'intentions', 'purgatory', 'stipend', 'blessing'],
    ),
    SearchItem(
      title: 'Virtual Sanctuary Candles',
      subtitle: 'Light a devotional vigil candle before the Blessed Sacrament',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.flame,
      route: '/candles',
      keywords: ['candle', 'vigil', 'flame', 'tabernacle', 'light candle'],
    ),
    SearchItem(
      title: 'Gregorian Chant & Cathedral Audio',
      subtitle: 'Immersive sacred cloister atmosphere, Latin chant, and pipe organ',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.headphones,
      route: '/chant',
      keywords: ['chant', 'gregorian', 'audio', 'organ', 'cloister', 'ambient', 'salve regina'],
    ),
    SearchItem(
      title: '9-Day Catholic Novenas',
      subtitle: 'Novena to the Sacred Heart, St. Jude, Our Lady Undoer of Knots',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.calendar,
      route: '/novenas',
      keywords: ['novena', 'novenas', 'nine days', 'undoer of knots', 'sacred heart', 'st jude'],
    ),
    SearchItem(
      title: 'Catechism of the Catholic Church',
      subtitle: 'The complete Creed, Sacraments, Moral Life, and Christian Prayer',
      categoryName: 'Scripture',
      category: SearchCategory.scripture,
      icon: LucideIcons.library,
      route: '/catechism',
      keywords: ['catechism', 'ccc', 'doctrine', 'theology', 'dogma', 'creed'],
    ),
    SearchItem(
      title: 'AI Spiritual Companion',
      subtitle: 'Biblically and doctrinally grounded Catholic conversational companion',
      categoryName: 'Devotions',
      category: SearchCategory.devotions,
      icon: LucideIcons.bot,
      route: '/ai-companion',
      keywords: ['ai', 'companion', 'guidance', 'questions', 'counsel', 'spiritual advice'],
    ),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _focusNode.requestFocus();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _focusNode.dispose();
    super.dispose();
  }

  List<SearchItem> get _filteredResults {
    final q = _query.toLowerCase().trim();
    return _catalog.where((item) {
      // Category filter
      if (_selectedCategory != SearchCategory.all && item.category != _selectedCategory) {
        return false;
      }
      // Query filter
      if (q.isEmpty) return true;
      final matchTitle = item.title.toLowerCase().contains(q);
      final matchSub = item.subtitle.toLowerCase().contains(q);
      final matchKey = item.keywords.any((k) => k.toLowerCase().contains(q));
      return matchTitle || matchSub || matchKey;
    }).toList();
  }

  @override
  Widget build(BuildContext context) {
    final results = _filteredResults;

    return PremiumScaffold(
      body: SafeArea(
        child: Column(
          children: [
            // Header Search Input Bar
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
                    onPressed: () => context.pop(),
                  ),
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: AppTheme.gold500.withValues(alpha: 0.3),
                          width: 1,
                        ),
                      ),
                      child: TextField(
                        controller: _searchController,
                        focusNode: _focusNode,
                        style: GoogleFonts.inter(color: Colors.white, fontSize: 16),
                        cursorColor: AppTheme.gold500,
                        onChanged: (val) => setState(() => _query = val),
                        decoration: InputDecoration(
                          hintText: 'Search prayers, saints, scripture...',
                          hintStyle: GoogleFonts.inter(color: Colors.white38, fontSize: 15),
                          prefixIcon: const Icon(LucideIcons.search, color: AppTheme.gold500, size: 20),
                          suffixIcon: _query.isNotEmpty
                              ? IconButton(
                                  icon: const Icon(LucideIcons.x, color: Colors.white60, size: 18),
                                  onPressed: () {
                                    _searchController.clear();
                                    setState(() => _query = '');
                                  },
                                )
                              : null,
                          border: InputBorder.none,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Category Filter Pills
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
              child: Row(
                children: [
                  _buildCategoryChip('All', SearchCategory.all),
                  _buildCategoryChip('Prayers', SearchCategory.prayers),
                  _buildCategoryChip('Scripture', SearchCategory.scripture),
                  _buildCategoryChip('Saints', SearchCategory.saints),
                  _buildCategoryChip('Devotions', SearchCategory.devotions),
                  _buildCategoryChip('Churches', SearchCategory.churches),
                ],
              ),
            ),

            const SizedBox(height: 8),

            // Results List
            Expanded(
              child: results.isEmpty
                  ? _buildEmptyState()
                  : ListView.builder(
                      physics: const BouncingScrollPhysics(),
                      padding: const EdgeInsets.fromLTRB(20, 4, 20, 80),
                      itemCount: results.length,
                      itemBuilder: (context, index) {
                        final item = results[index];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: PremiumGlassCard(
                            onTap: () {
                              HapticFeedback.lightImpact();
                              context.push(item.route);
                            },
                            child: Container(
                              padding: const EdgeInsets.all(16),
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(
                                  color: Colors.white.withValues(alpha: 0.08),
                                ),
                              ),
                              child: Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: AppTheme.gold500.withValues(alpha: 0.15),
                                      borderRadius: BorderRadius.circular(12),
                                      border: Border.all(
                                        color: AppTheme.gold500.withValues(alpha: 0.3),
                                      ),
                                    ),
                                    child: Icon(item.icon, color: AppTheme.gold400, size: 22),
                                  ),
                                  const SizedBox(width: 16),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment: CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          children: [
                                            Expanded(
                                              child: Text(
                                                item.title,
                                                style: GoogleFonts.merriweather(
                                                  color: Colors.white,
                                                  fontWeight: FontWeight.bold,
                                                  fontSize: 15,
                                                ),
                                              ),
                                            ),
                                            Container(
                                              padding: const EdgeInsets.symmetric(
                                                horizontal: 8,
                                                vertical: 3,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.white.withValues(alpha: 0.08),
                                                borderRadius: BorderRadius.circular(6),
                                              ),
                                              child: Text(
                                                item.categoryName,
                                                style: GoogleFonts.inter(
                                                  color: AppTheme.gold400,
                                                  fontSize: 10,
                                                  fontWeight: FontWeight.w600,
                                                ),
                                              ),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 4),
                                        Text(
                                          item.subtitle,
                                          style: GoogleFonts.inter(
                                            color: Colors.white60,
                                            fontSize: 12,
                                            height: 1.3,
                                          ),
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  const Icon(
                                    LucideIcons.chevronRight,
                                    color: Colors.white38,
                                    size: 18,
                                  ),
                                ],
                              ),
                            ),
                          ),
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildCategoryChip(String label, SearchCategory cat) {
    final isSelected = _selectedCategory == cat;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (val) {
          HapticFeedback.selectionClick();
          setState(() => _selectedCategory = cat);
        },
        selectedColor: AppTheme.gold500.withValues(alpha: 0.25),
        backgroundColor: Colors.white.withValues(alpha: 0.05),
        checkmarkColor: AppTheme.gold400,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: BorderSide(
            color: isSelected
                ? AppTheme.gold500
                : Colors.white.withValues(alpha: 0.1),
          ),
        ),
        labelStyle: GoogleFonts.inter(
          color: isSelected ? AppTheme.gold400 : Colors.white70,
          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
          fontSize: 13,
        ),
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: 0.04),
            ),
            child: const Icon(LucideIcons.searchX, color: Colors.white38, size: 48),
          ),
          const SizedBox(height: 16),
          Text(
            'No devotions found',
            style: GoogleFonts.merriweather(
              fontSize: 18,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            'Try searching for "Rosary", "Gospel", "Saints", or "Mass"',
            style: GoogleFonts.inter(color: Colors.white54, fontSize: 13),
          ),
        ],
      ),
    );
  }
}
