import 'package:flutter/material.dart';
// import 'package:lucide_icons/lucide_icons.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  String _filter = 'all';

  @override
  Widget build(BuildContext context) {
    final filtered = _filter == 'all'
        ? timeline
        : timeline.where((e) => e.category == _filter).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F6),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: const Text('Church History'),
            backgroundColor: Colors.amber.shade900,
            foregroundColor: Colors.white,
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.amber.shade900, Colors.orange.shade900],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 12,
                      vertical: 6,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: const Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(Icons.history, size: 16, color: Colors.amber),
                        SizedBox(width: 8),
                        Text(
                          '2,000 Years',
                          style: TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    '2,000 Years of Faith',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontFamily: 'Serif',
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Key events that shaped the Catholic Church from Pentecost to today.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white70),
                  ),
                ],
              ),
            ),
          ),

          // Filters
          SliverToBoxAdapter(
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.all(16),
              child: Row(
                children:
                    [
                      'all',
                      'church',
                      'council',
                      'saint',
                      'persecution',
                      'reformation',
                    ].map((cat) {
                      final isSelected = _filter == cat;

                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: FilterChip(
                          label: Text(
                            cat == 'all' ? 'All Events' : cat.capitalize(),
                          ),
                          selected: isSelected,
                          onSelected: (v) =>
                              setState(() => _filter = v ? cat : 'all'),
                          backgroundColor: Colors.white,
                          selectedColor: Colors.amber.shade800,
                          labelStyle: TextStyle(
                            color: isSelected ? Colors.white : Colors.black87,
                          ),
                          checkmarkColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                            side: BorderSide(
                              color: isSelected
                                  ? Colors.transparent
                                  : Colors.grey.shade300,
                            ),
                          ),
                        ),
                      );
                    }).toList(),
              ),
            ),
          ),

          // Timeline
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final event = filtered[index];
                final isLast = index == filtered.length - 1;

                return IntrinsicHeight(
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // Timeline Line
                      SizedBox(
                        width: 40,
                        child: Column(
                          children: [
                            Container(
                              width: 2,
                              height: 24,
                              color: Colors.amber.shade200,
                            ),
                            Container(
                              width: 16,
                              height: 16,
                              decoration: BoxDecoration(
                                color: Colors.amber.shade500,
                                shape: BoxShape.circle,
                                border: Border.all(
                                  color: const Color(0xFFFAF9F6),
                                  width: 3,
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.amber.withValues(alpha: 0.4),
                                    blurRadius: 4,
                                  ),
                                ],
                              ),
                            ),
                            if (!isLast)
                              Expanded(
                                child: Container(
                                  width: 2,
                                  color: Colors.amber.shade200,
                                ),
                              ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 8),
                      // Content
                      Expanded(
                        child: Padding(
                          padding: const EdgeInsets.only(bottom: 24),
                          child: _EventCard(event: event),
                        ),
                      ),
                    ],
                  ),
                );
              }, childCount: filtered.length),
            ),
          ),

          const SliverToBoxAdapter(child: SizedBox(height: 50)),
        ],
      ),
    );
  }
}

class _EventCard extends StatelessWidget {
  final HistoryEvent event;

  const _EventCard({required this.event});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (event.category) {
      case 'church':
        color = Colors.blue;
        break;
      case 'council':
        color = Colors.purple;
        break;
      case 'saint':
        color = Colors.amber;
        break;
      case 'persecution':
        color = Colors.red;
        break;
      case 'reformation':
        color = Colors.orange;
        break;
      default:
        color = Colors.grey;
    }

    return Card(
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text(
                  event.year,
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.amber.shade800,
                  ),
                ),
                const SizedBox(width: 8),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 2,
                  ),
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    event.category.capitalize(),
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: color,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Text(
              event.title,
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 4),
            Text(
              event.description,
              style: TextStyle(color: Colors.grey.shade600),
            ),
          ],
        ),
      ),
    );
  }
}

extension StringExtension on String {
  String capitalize() {
    return "${this[0].toUpperCase()}${substring(1)}";
  }
}

class HistoryEvent {
  final String year;
  final String title;
  final String description;
  final String category;

  const HistoryEvent({
    required this.year,
    required this.title,
    required this.description,
    required this.category,
  });
}

const timeline = [
  HistoryEvent(
    year: '33 AD',
    title: 'Pentecost',
    description:
        'The Holy Spirit descends upon the Apostles. Birth of the Church.',
    category: 'church',
  ),
  HistoryEvent(
    year: '64 AD',
    title: 'Neronian Persecution',
    description:
        'Emperor Nero persecutes Christians; martyrdom of Sts. Peter and Paul.',
    category: 'persecution',
  ),
  HistoryEvent(
    year: '313 AD',
    title: 'Edict of Milan',
    description:
        'Emperor Constantine legalizes Christianity throughout the Roman Empire.',
    category: 'church',
  ),
  HistoryEvent(
    year: '325 AD',
    title: 'Council of Nicaea',
    description:
        'First Ecumenical Council; Nicene Creed formulated; Arianism condemned.',
    category: 'council',
  ),
  HistoryEvent(
    year: '381 AD',
    title: 'Council of Constantinople I',
    description: 'Nicene Creed expanded; divinity of the Holy Spirit affirmed.',
    category: 'council',
  ),
  HistoryEvent(
    year: '431 AD',
    title: 'Council of Ephesus',
    description:
        'Mary declared Theotokos (Mother of God); Nestorianism condemned.',
    category: 'council',
  ),
  HistoryEvent(
    year: '451 AD',
    title: 'Council of Chalcedon',
    description: 'Two natures of Christ defined; Monophysitism condemned.',
    category: 'council',
  ),
  HistoryEvent(
    year: '476 AD',
    title: 'Fall of Rome',
    description:
        'Western Roman Empire falls; Church becomes key institution of stability.',
    category: 'church',
  ),
  HistoryEvent(
    year: '529 AD',
    title: 'St. Benedict',
    description:
        'St. Benedict writes his Rule; foundation of Western monasticism.',
    category: 'saint',
  ),
  HistoryEvent(
    year: '800 AD',
    title: 'Charlemagne Crowned',
    description:
        'Pope Leo III crowns Charlemagne Emperor; Holy Roman Empire begins.',
    category: 'church',
  ),
  HistoryEvent(
    year: '1054 AD',
    title: 'Great Schism',
    description:
        'East-West Schism; Eastern Orthodox Churches separate from Rome.',
    category: 'church',
  ),
  HistoryEvent(
    year: '1095 AD',
    title: 'First Crusade',
    description:
        'Pope Urban II calls the First Crusade to reclaim the Holy Land.',
    category: 'church',
  ),
  HistoryEvent(
    year: '1215 AD',
    title: 'Fourth Lateran Council',
    description: 'Transubstantiation defined; annual confession required.',
    category: 'council',
  ),
  HistoryEvent(
    year: '1378 AD',
    title: 'Western Schism',
    description:
        'Multiple claimants to papacy; crisis resolved at Council of Constance (1417).',
    category: 'church',
  ),
  HistoryEvent(
    year: '1517 AD',
    title: 'Protestant Reformation',
    description:
        'Martin Luther posts 95 Theses; beginning of Protestant movement.',
    category: 'reformation',
  ),
  HistoryEvent(
    year: '1545 AD',
    title: 'Council of Trent',
    description:
        'Counter-Reformation council; Catholic doctrine clarified and reforms enacted.',
    category: 'council',
  ),
  HistoryEvent(
    year: '1870 AD',
    title: 'Vatican I',
    description:
        'Papal infallibility defined; interrupted by Italian unification.',
    category: 'council',
  ),
  HistoryEvent(
    year: '1917 AD',
    title: 'Fatima Apparitions',
    description:
        'Our Lady appears to three children in Portugal with prophetic messages.',
    category: 'saint',
  ),
  HistoryEvent(
    year: '1962 AD',
    title: 'Vatican II Opens',
    description:
        'Pope John XXIII convenes the Second Vatican Council for Church renewal.',
    category: 'council',
  ),
  HistoryEvent(
    year: '1978 AD',
    title: 'Pope John Paul II',
    description:
        'Cardinal Wojtyla elected; first non-Italian pope in 455 years.',
    category: 'church',
  ),
  HistoryEvent(
    year: '2013 AD',
    title: 'Pope Francis',
    description: 'Cardinal Bergoglio elected; first pope from the Americas.',
    category: 'church',
  ),
];
