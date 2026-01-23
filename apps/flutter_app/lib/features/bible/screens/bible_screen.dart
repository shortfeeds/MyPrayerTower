import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

class BibleScreen extends ConsumerStatefulWidget {
  const BibleScreen({super.key});

  @override
  ConsumerState<BibleScreen> createState() => _BibleScreenState();
}

class _BibleScreenState extends ConsumerState<BibleScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<_BibleBook> _oldTestament = [
    _BibleBook('Genesis', 50),
    _BibleBook('Exodus', 40),
    _BibleBook('Leviticus', 27),
    _BibleBook('Numbers', 36),
    _BibleBook('Deuteronomy', 34),
    _BibleBook('Joshua', 24),
    _BibleBook('Judges', 21),
    _BibleBook('Ruth', 4),
    _BibleBook('1 Samuel', 31),
    _BibleBook('2 Samuel', 24),
    _BibleBook('1 Kings', 22),
    _BibleBook('2 Kings', 25),
    _BibleBook('1 Chronicles', 29),
    _BibleBook('2 Chronicles', 36),
    _BibleBook('Ezra', 10),
    _BibleBook('Nehemiah', 13),
    _BibleBook('Tobit', 14),
    _BibleBook('Judith', 16),
    _BibleBook('Esther', 10),
    _BibleBook('1 Maccabees', 16),
    _BibleBook('2 Maccabees', 15),
    _BibleBook('Job', 42),
    _BibleBook('Psalms', 150),
    _BibleBook('Proverbs', 31),
    _BibleBook('Ecclesiastes', 12),
    _BibleBook('Song of Songs', 8),
    _BibleBook('Wisdom', 19),
    _BibleBook('Sirach', 51),
    _BibleBook('Isaiah', 66),
    _BibleBook('Jeremiah', 52),
    _BibleBook('Lamentations', 5),
    _BibleBook('Baruch', 6),
    _BibleBook('Ezekiel', 48),
    _BibleBook('Daniel', 14),
    _BibleBook('Hosea', 14),
    _BibleBook('Joel', 4),
    _BibleBook('Amos', 9),
    _BibleBook('Obadiah', 1),
    _BibleBook('Jonah', 4),
    _BibleBook('Micah', 7),
    _BibleBook('Nahum', 3),
    _BibleBook('Habakkuk', 3),
    _BibleBook('Zephaniah', 3),
    _BibleBook('Haggai', 2),
    _BibleBook('Zechariah', 14),
    _BibleBook('Malachi', 3),
  ];

  final List<_BibleBook> _newTestament = [
    _BibleBook('Matthew', 28),
    _BibleBook('Mark', 16),
    _BibleBook('Luke', 24),
    _BibleBook('John', 21),
    _BibleBook('Acts', 28),
    _BibleBook('Romans', 16),
    _BibleBook('1 Corinthians', 16),
    _BibleBook('2 Corinthians', 13),
    _BibleBook('Galatians', 6),
    _BibleBook('Ephesians', 6),
    _BibleBook('Philippians', 4),
    _BibleBook('Colossians', 4),
    _BibleBook('1 Thessalonians', 5),
    _BibleBook('2 Thessalonians', 3),
    _BibleBook('1 Timothy', 6),
    _BibleBook('2 Timothy', 4),
    _BibleBook('Titus', 3),
    _BibleBook('Philemon', 1),
    _BibleBook('Hebrews', 13),
    _BibleBook('James', 5),
    _BibleBook('1 Peter', 5),
    _BibleBook('2 Peter', 3),
    _BibleBook('1 John', 5),
    _BibleBook('2 John', 1),
    _BibleBook('3 John', 1),
    _BibleBook('Jude', 1),
    _BibleBook('Revelation', 22),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: const AppBarMenuButton(iconColor: Colors.white),
        title: const Text('Bible'),
        actions: [
          IconButton(icon: const Icon(LucideIcons.search), onPressed: () {}),
          IconButton(icon: const Icon(LucideIcons.bookmark), onPressed: () {}),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Old Testament'),
            Tab(text: 'New Testament'),
          ],
          indicatorColor: AppTheme.accentGold,
          labelColor: AppTheme.accentGold,
          unselectedLabelColor: AppTheme.textMuted,
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildBookList(_oldTestament),
          _buildBookList(_newTestament),
        ],
      ),
    );
  }

  Widget _buildBookList(List<_BibleBook> books) {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
      itemCount: books.length,
      itemBuilder: (context, index) {
        final book = books[index];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          child: ListTile(
            leading: Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: AppTheme.primaryBlue.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Center(
                child: Text(
                  book.name.substring(0, 2),
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: AppTheme.info,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),
            title: Text(book.name),
            subtitle: Text('${book.chapters} chapters'),
            trailing: const Icon(LucideIcons.chevronRight, size: 18),
            onTap: () => _showChapterSelector(context, book),
          ),
        );
      },
    );
  }

  void _showChapterSelector(BuildContext context, _BibleBook book) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.6,
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
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    book.name,
                    style: Theme.of(context).textTheme.headlineSmall,
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.x),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
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
                itemCount: book.chapters,
                itemBuilder: (context, index) {
                  return GestureDetector(
                    onTap: () {
                      Navigator.pop(context);
                      context.push(
                        '/bible/${Uri.encodeComponent(book.name)}/${index + 1}',
                      );
                    },
                    child: Container(
                      decoration: BoxDecoration(
                        color: AppTheme.darkCard,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppTheme.darkBorder),
                      ),
                      child: Center(
                        child: Text(
                          '${index + 1}',
                          style: Theme.of(context).textTheme.titleMedium,
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

class _BibleBook {
  final String name;
  final int chapters;

  _BibleBook(this.name, this.chapters);
}
