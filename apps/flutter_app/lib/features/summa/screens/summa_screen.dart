import 'package:flutter/material.dart';
// import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class SummaScreen extends StatefulWidget {
  const SummaScreen({super.key});

  @override
  State<SummaScreen> createState() => _SummaScreenState();
}

class _SummaScreenState extends State<SummaScreen> {
  String? _expandedPart = 'I';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F6),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: const Text('Summa Theologica'),
            backgroundColor: Colors.amber.shade900,
            foregroundColor: Colors.white,
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.amber.shade900, Colors.brown.shade800],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  const Icon(Icons.balance, size: 48, color: Colors.white24),
                  const SizedBox(height: 16),
                  Text(
                    'St. Thomas Aquinas',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontFamily: 'Serif',
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'The masterwork of scholastic theology — systematic examination of Christian doctrine.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.all(16),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final part = summaStructure[index];
                final isExpanded = _expandedPart == part.shortName;

                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                    side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
                  ),
                  child: Column(
                    children: [
                      InkWell(
                        onTap: () {
                          setState(() {
                            _expandedPart = isExpanded ? null : part.shortName;
                          });
                        },
                        borderRadius: BorderRadius.circular(12),
                        child: Padding(
                          padding: const EdgeInsets.all(16),
                          child: Row(
                            children: [
                              Container(
                                width: 48,
                                height: 48,
                                decoration: BoxDecoration(
                                  color: Colors.amber.shade50,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                child: Center(
                                  child: Text(
                                    part.shortName,
                                    style: TextStyle(
                                      color: Colors.amber.shade900,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 16),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      part.name,
                                      style: const TextStyle(
                                        fontWeight: FontWeight.bold,
                                      ),
                                    ),
                                    Text(
                                      '${part.questions.length}+ questions',
                                      style: TextStyle(
                                        color: Colors.grey.shade600,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Icon(
                                isExpanded
                                    ? Icons.expand_less
                                    : Icons.expand_more,
                                color: Colors.grey,
                              ),
                            ],
                          ),
                        ),
                      ),
                      if (isExpanded)
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.grey.shade50,
                            borderRadius: const BorderRadius.vertical(
                              bottom: Radius.circular(12),
                            ),
                          ),
                          child: Column(
                            children: [
                              const Divider(height: 1),
                              ...part.questions.map(
                                (q) => InkWell(
                                  onTap: () {
                                    final partNum = part.shortName == 'I'
                                        ? '1'
                                        : part.shortName == 'I-II'
                                        ? '2'
                                        : part.shortName == 'II-II'
                                        ? '3'
                                        : '4';
                                    final url =
                                        'https://www.newadvent.org/summa/$partNum${q.number.toString().padLeft(3, '0')}.htm';
                                    launchUrl(Uri.parse(url));
                                  },
                                  child: Padding(
                                    padding: const EdgeInsets.all(16),
                                    child: Row(
                                      children: [
                                        Text(
                                          'Q${q.number}',
                                          style: TextStyle(
                                            fontWeight: FontWeight.bold,
                                            color: Colors.amber.shade900,
                                          ),
                                        ),
                                        const SizedBox(width: 16),
                                        Expanded(child: Text(q.title)),
                                        const Icon(
                                          Icons.open_in_new,
                                          size: 14,
                                          color: Colors.grey,
                                        ),
                                      ],
                                    ),
                                  ),
                                ),
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16),
                                child: TextButton.icon(
                                  onPressed: () {
                                    final partNum = part.shortName == 'I'
                                        ? '1'
                                        : part.shortName == 'I-II'
                                        ? '2'
                                        : part.shortName == 'II-II'
                                        ? '3'
                                        : '4';
                                    launchUrl(
                                      Uri.parse(
                                        'https://www.newadvent.org/summa/$partNum.htm',
                                      ),
                                    );
                                  },
                                  icon: const Icon(Icons.open_in_new, size: 16),
                                  label: Text('View full ${part.shortName}'),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),
                );
              }, childCount: summaStructure.length),
            ),
          ),
        ],
      ),
    );
  }
}

class SummaQuestion {
  final int number;
  final String title;
  final int articles;

  const SummaQuestion({
    required this.number,
    required this.title,
    required this.articles,
  });
}

class SummaPart {
  final String name;
  final String shortName;
  final List<SummaQuestion> questions;

  const SummaPart({
    required this.name,
    required this.shortName,
    required this.questions,
  });
}

const summaStructure = [
  SummaPart(
    name: 'Prima Pars (First Part)',
    shortName: 'I',
    questions: [
      SummaQuestion(
        number: 1,
        title: 'The Nature and Extent of Sacred Doctrine',
        articles: 10,
      ),
      SummaQuestion(number: 2, title: 'The Existence of God', articles: 3),
      SummaQuestion(number: 3, title: 'The Simplicity of God', articles: 8),
      SummaQuestion(number: 4, title: 'The Perfection of God', articles: 3),
      SummaQuestion(number: 5, title: 'The Goodness in General', articles: 6),
    ],
  ),
  SummaPart(
    name: 'Prima Secundae (First Part of the Second Part)',
    shortName: 'I-II',
    questions: [
      SummaQuestion(number: 1, title: 'The Last End of Man', articles: 8),
      SummaQuestion(
        number: 2,
        title: 'Those Things in Which Man\'s Happiness Consists',
        articles: 8,
      ),
      SummaQuestion(
        number: 6,
        title: 'The Voluntary and the Involuntary',
        articles: 8,
      ),
    ],
  ),
  SummaPart(
    name: 'Secunda Secundae (Second Part of the Second Part)',
    shortName: 'II-II',
    questions: [
      SummaQuestion(number: 1, title: 'Faith', articles: 10),
      SummaQuestion(number: 17, title: 'Hope', articles: 8),
      SummaQuestion(number: 23, title: 'Charity', articles: 8),
    ],
  ),
  SummaPart(
    name: 'Tertia Pars (Third Part)',
    shortName: 'III',
    questions: [
      SummaQuestion(
        number: 1,
        title: 'The Fitness of the Incarnation',
        articles: 6,
      ),
      SummaQuestion(number: 60, title: 'The Sacraments', articles: 8),
      SummaQuestion(number: 73, title: 'The Eucharist', articles: 6),
    ],
  ),
];
