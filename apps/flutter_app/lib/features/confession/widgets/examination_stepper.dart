import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class ExaminationOfConscienceWidget extends StatefulWidget {
  final VoidCallback onComplete;

  const ExaminationOfConscienceWidget({super.key, required this.onComplete});

  @override
  State<ExaminationOfConscienceWidget> createState() =>
      _ExaminationOfConscienceWidgetState();
}

class _ExaminationOfConscienceWidgetState
    extends State<ExaminationOfConscienceWidget> {
  int _currentCategoryIndex = 0;
  final Set<String> _selectedSins = {};

  final List<Map<String, dynamic>> _categories = [
    {
      'title': 'Relationship with God',
      'items': [
        'Have I loved God above all things?',
        'Have I used God\'s name in vain?',
        'Have I missed Mass on Sundays?',
        'Have I neglected daily prayer?',
      ],
    },
    {
      'title': 'Relationship with Others',
      'items': [
        'Have I been impatient or angry?',
        'Have I failed to respect parents?',
        'Have I gossiped or damaged reputations?',
        'Have I stolen or been dishonest?',
      ],
    },
    {
      'title': 'Purity and Self',
      'items': [
        'Have I indulged in impure thoughts?',
        'Have I failed to practice moderation?',
        'Have I been proud or self-centered?',
        'Have I been lazy in my duties?',
      ],
    },
  ];

  @override
  Widget build(BuildContext context) {
    final cat = _categories[_currentCategoryIndex];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        LinearProgressIndicator(
          value: (_currentCategoryIndex + 1) / _categories.length,
          backgroundColor: Colors.white10,
          valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFF7B1FA2)),
        ),
        const SizedBox(height: 24),
        Text(
          cat['title'],
          style: const TextStyle(
            color: Color(0xFFCE93D8),
            fontSize: 12,
            fontWeight: FontWeight.w900,
            letterSpacing: 2,
          ),
        ),
        const SizedBox(height: 8),
        const Text(
          'Reflect on your actions...',
          style: TextStyle(
            color: Colors.white,
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        const SizedBox(height: 24),
        Expanded(
          child: ListView.separated(
            itemCount: cat['items'].length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = cat['items'][index];
              final isSelected = _selectedSins.contains(item);

              return GestureDetector(
                onTap: () {
                  HapticFeedback.lightImpact();
                  setState(() {
                    if (isSelected) {
                      _selectedSins.remove(item);
                    } else {
                      _selectedSins.add(item);
                    }
                  });
                },
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? const Color(0xFF4A148C).withValues(alpha: 0.3)
                        : Colors.white.withValues(alpha: 0.05),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected
                          ? const Color(0xFF7B1FA2)
                          : Colors.white.withValues(alpha: 0.1),
                      width: 1,
                    ),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? const Color(0xFF7B1FA2)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(
                            color: isSelected
                                ? const Color(0xFF7B1FA2)
                                : Colors.white24,
                            width: 2,
                          ),
                        ),
                        child: isSelected
                            ? const Icon(
                                Icons.check,
                                size: 16,
                                color: Colors.white,
                              )
                            : null,
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          item,
                          style: TextStyle(
                            color: isSelected ? Colors.white : Colors.white70,
                            fontSize: 16,
                            fontWeight: isSelected
                                ? FontWeight.bold
                                : FontWeight.normal,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 24),
          child: Row(
            children: [
              if (_currentCategoryIndex > 0)
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      HapticFeedback.lightImpact();
                      setState(() => _currentCategoryIndex--);
                    },
                    style: OutlinedButton.styleFrom(
                      foregroundColor: Colors.white,
                      side: const BorderSide(color: Colors.white10),
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: const Text('Previous'),
                  ),
                ),
              const SizedBox(width: 12),
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: () {
                    HapticFeedback.mediumImpact();
                    if (_currentCategoryIndex < _categories.length - 1) {
                      setState(() => _currentCategoryIndex++);
                    } else {
                      widget.onComplete();
                    }
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF7B1FA2),
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                    ),
                  ),
                  child: Text(
                    _currentCategoryIndex < _categories.length - 1
                        ? 'Next Category'
                        : 'Finish & View Guide',
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
