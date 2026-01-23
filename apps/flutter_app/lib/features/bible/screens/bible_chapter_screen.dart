import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../ads/widgets/smart_ad_banner.dart';
import '../../../core/theme/app_theme.dart';
import '../repositories/bible_repository.dart';

/// Bible chapter reading view with real API data
class BibleChapterScreen extends ConsumerStatefulWidget {
  final String bookName;
  final int chapter;

  const BibleChapterScreen({
    super.key,
    required this.bookName,
    required this.chapter,
  });

  @override
  ConsumerState<BibleChapterScreen> createState() => _BibleChapterScreenState();
}

class _BibleChapterScreenState extends ConsumerState<BibleChapterScreen> {
  final Set<int> _highlightedVerses = {};
  final Set<int> _bookmarkedVerses = {};
  double _fontSize = 18.0;
  bool _isImmersiveMode = false;

  @override
  Widget build(BuildContext context) {
    final chapterAsync = ref.watch(
      bibleChapterProvider((book: widget.bookName, chapter: widget.chapter)),
    );

    return Scaffold(
      backgroundColor: _isImmersiveMode ? Colors.black : AppTheme.sacredNavy950,
      appBar: _isImmersiveMode
          ? null
          : AppBar(
              title: Text(
                '${widget.bookName} ${widget.chapter}',
                style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
              ),
              backgroundColor: Colors.transparent,
              elevation: 0,
              leading: IconButton(
                icon: const Icon(LucideIcons.arrowLeft),
                onPressed: () => context.pop(),
              ),
              actions: [
                IconButton(
                  icon: const Icon(LucideIcons.maximize2),
                  tooltip: 'Immersive Mode',
                  onPressed: () => setState(() => _isImmersiveMode = true),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.list),
                  tooltip: 'Go to Chapter',
                  onPressed: () => _showChapterSelector(context),
                ),
                IconButton(
                  icon: const Icon(LucideIcons.settings),
                  onPressed: _showSettings,
                ),
              ],
            ),
      body: GestureDetector(
        onTap: _isImmersiveMode
            ? () => setState(() => _isImmersiveMode = false)
            : null,
        child: Column(
          children: [
            // Chapter navigation (hide in immersive mode)
            if (!_isImmersiveMode)
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 16,
                  vertical: 8,
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    TextButton.icon(
                      onPressed: widget.chapter > 1
                          ? () => _navigateToChapter(widget.chapter - 1)
                          : null,
                      icon: const Icon(LucideIcons.chevronLeft, size: 18),
                      label: const Text('Previous'),
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.textSecondary,
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        'Chapter ${widget.chapter}',
                        style: GoogleFonts.inter(
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    TextButton.icon(
                      onPressed: () => _navigateToChapter(widget.chapter + 1),
                      icon: const Text('Next'),
                      label: const Icon(LucideIcons.chevronRight, size: 18),
                      style: TextButton.styleFrom(
                        foregroundColor: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ),
              ),

            // Verses from API
            Expanded(
              child: chapterAsync.when(
                data: (chapter) {
                  if (chapter == null || chapter.verses.isEmpty) {
                    // If verses are empty but text exists, show as single block
                    if (chapter?.text.isNotEmpty ?? false) {
                      return SingleChildScrollView(
                        padding: const EdgeInsets.all(20),
                        child: Text(
                          chapter!.text,
                          style: GoogleFonts.merriweather(
                            fontSize: _fontSize,
                            height: 1.8,
                            color: Colors.white,
                          ),
                        ),
                      );
                    }
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(
                            LucideIcons.bookX,
                            size: 48,
                            color: Colors.white38,
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'Chapter not available',
                            style: GoogleFonts.inter(color: Colors.white54),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(20),
                    itemCount: chapter.verses.length,
                    itemBuilder: (context, index) {
                      final verse = chapter.verses[index];
                      final verseNum = verse.verse;
                      final isHighlighted = _highlightedVerses.contains(
                        verseNum,
                      );
                      final isBookmarked = _bookmarkedVerses.contains(verseNum);

                      return GestureDetector(
                        onLongPress: () =>
                            _showVerseOptions(verseNum, verse.text),
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 16),
                          padding: isHighlighted
                              ? const EdgeInsets.all(12)
                              : EdgeInsets.zero,
                          decoration: BoxDecoration(
                            color: isHighlighted
                                ? AppTheme.gold500.withValues(alpha: 0.15)
                                : Colors.transparent,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              SizedBox(
                                width: 30,
                                child: Text(
                                  '$verseNum',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    color: isBookmarked
                                        ? AppTheme.gold500
                                        : AppTheme.textSecondary,
                                    fontWeight: isBookmarked
                                        ? FontWeight.bold
                                        : FontWeight.normal,
                                  ),
                                ),
                              ),
                              Expanded(
                                child: Text(
                                  verse.text,
                                  style: GoogleFonts.merriweather(
                                    fontSize: _fontSize,
                                    height: 1.8,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                              if (isBookmarked)
                                const Icon(
                                  LucideIcons.bookmark,
                                  size: 14,
                                  color: AppTheme.gold500,
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
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        LucideIcons.alertCircle,
                        size: 48,
                        color: Colors.red,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Error loading chapter',
                        style: GoogleFonts.inter(color: Colors.white),
                      ),
                      Text(
                        e.toString(),
                        style: GoogleFonts.inter(
                          color: Colors.white54,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            if (!_isImmersiveMode) const SafeAdBanner(page: 'bible_reading'),
          ],
        ),
      ),
    );
  }

  void _navigateToChapter(int chapter) {
    context.pushReplacement('/bible/${widget.bookName}/$chapter');
  }

  void _showVerseOptions(int verseNum, String verseText) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.sacredNavy900,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '${widget.bookName} ${widget.chapter}:$verseNum',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildOption(
                  icon: LucideIcons.highlighter,
                  label: 'Highlight',
                  color: Colors.yellow,
                  onTap: () {
                    setState(() {
                      if (_highlightedVerses.contains(verseNum)) {
                        _highlightedVerses.remove(verseNum);
                      } else {
                        _highlightedVerses.add(verseNum);
                      }
                    });
                    Navigator.pop(context);
                  },
                ),
                _buildOption(
                  icon: LucideIcons.bookmark,
                  label: 'Bookmark',
                  color: AppTheme.gold500,
                  onTap: () {
                    setState(() {
                      if (_bookmarkedVerses.contains(verseNum)) {
                        _bookmarkedVerses.remove(verseNum);
                      } else {
                        _bookmarkedVerses.add(verseNum);
                      }
                    });
                    Navigator.pop(context);
                  },
                ),
                _buildOption(
                  icon: LucideIcons.share2,
                  label: 'Share',
                  color: Colors.blue,
                  onTap: () {
                    Navigator.pop(context);
                    // Share verse
                  },
                ),
                _buildOption(
                  icon: LucideIcons.copy,
                  label: 'Copy',
                  color: Colors.green,
                  onTap: () {
                    Clipboard.setData(
                      ClipboardData(
                        text:
                            '${widget.bookName} ${widget.chapter}:$verseNum - "$verseText"',
                      ),
                    );
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Verse copied to clipboard'),
                      ),
                    );
                  },
                ),
              ],
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildOption({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: AppTheme.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  void _showSettings() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.sacredNavy900,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Reading Settings',
              style: GoogleFonts.merriweather(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'Font Size',
              style: GoogleFonts.inter(color: AppTheme.textSecondary),
            ),
            StatefulBuilder(
              builder: (context, setModalState) => Slider(
                value: _fontSize,
                min: 14,
                max: 28,
                divisions: 7,
                activeColor: AppTheme.gold500,
                inactiveColor: AppTheme.darkCard,
                label: '${_fontSize.round()}',
                onChanged: (value) {
                  setModalState(() => _fontSize = value);
                  setState(() {});
                },
              ),
            ),
            const SizedBox(height: 16),
          ],
        ),
      ),
    );
  }

  void _showChapterSelector(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.5,
        decoration: const BoxDecoration(
          color: AppTheme.darkSurface,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: AppTheme.darkBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(16),
              child: Text(
                'Select Chapter',
                style: Theme.of(context).textTheme.headlineSmall,
              ),
            ),
            Expanded(
              child: GridView.builder(
                padding: const EdgeInsets.all(16),
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 5,
                  mainAxisSpacing: 8,
                  crossAxisSpacing: 8,
                ),
                // Assuming max 50 chapters for visual simplicity,
                // in real app this should come from book metadata
                itemCount: 50,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                      _navigateToChapter(index + 1);
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: (index + 1) == widget.chapter
                            ? AppTheme.gold500
                            : AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.darkBorder),
                      ),
                      child: Center(
                        child: Text(
                          '${index + 1}',
                          style: Theme.of(context).textTheme.titleMedium
                              ?.copyWith(
                                color: (index + 1) == widget.chapter
                                    ? Colors.black
                                    : Colors.white,
                              ),
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
}

class SafeAdBanner extends StatelessWidget {
  final String page;
  const SafeAdBanner({super.key, required this.page});

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.black,
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).padding.bottom),
      child: SmartAdBanner(page: page, position: 'bottom'),
    );
  }
}
