import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:lucide_icons/lucide_icons.dart';

class HierarchyScreen extends ConsumerStatefulWidget {
  const HierarchyScreen({super.key});

  @override
  ConsumerState<HierarchyScreen> createState() => _HierarchyScreenState();
}

class _HierarchyScreenState extends ConsumerState<HierarchyScreen> {
  final List<Cardinal> _allCardinals = mockCardinals;
  String _search = '';
  String _country = 'All Countries';
  bool _showEligibleOnly = false;

  @override
  Widget build(BuildContext context) {
    // Filter logic
    final filtered = _allCardinals.where((c) {
      final matchesSearch =
          c.name.toLowerCase().contains(_search.toLowerCase()) ||
          c.office?.toLowerCase().contains(_search.toLowerCase()) == true;
      final matchesCountry =
          _country == 'All Countries' || c.country == _country;
      final matchesEligible = !_showEligibleOnly || c.papalConclaveEligible;

      return matchesSearch && matchesCountry && matchesEligible;
    }).toList();

    // Unique countries
    final countries = [
      'All Countries',
      ..._allCardinals.map((c) => c.country).toSet().toList()..sort(),
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F6),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            floating: true,
            title: const Text('Church Hierarchy'),
            backgroundColor: Colors.indigo.shade900,
            foregroundColor: Colors.white,
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.indigo.shade900, Colors.deepPurple.shade900],
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
                        Icon(Icons.public, size: 14, color: Colors.grey),
                        SizedBox(width: 8),
                        Text(
                          'College of Cardinals',
                          style: TextStyle(color: Colors.white),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Church Hierarchy',
                    textAlign: TextAlign.center,
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontFamily: 'Serif',
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Explore the College of Cardinals — the Pope\'s principal counselors and electors.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white70),
                  ),
                  const SizedBox(height: 24),

                  // Stats
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      _StatItem(
                        value: _allCardinals.length.toString(),
                        label: 'Total',
                      ),
                      _StatItem(
                        value: _allCardinals
                            .where((c) => c.papalConclaveEligible)
                            .length
                            .toString(),
                        label: 'Electors',
                        color: Colors.yellow,
                      ),
                      _StatItem(
                        value: countries.length.toString(),
                        label: 'Countries',
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          // Filters
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    onChanged: (v) => setState(() => _search = v),
                    decoration: InputDecoration(
                      hintText: 'Search by name or office...',
                      prefixIcon: const Icon(Icons.search),
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: BorderSide.none,
                      ),
                      contentPadding: const EdgeInsets.symmetric(vertical: 0),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: DropdownButtonHideUnderline(
                            child: DropdownButton<String>(
                              value: _country,
                              isExpanded: true,
                              items: countries
                                  .map(
                                    (c) => DropdownMenuItem(
                                      value: c,
                                      child: Text(c),
                                    ),
                                  )
                                  .toList(),
                              onChanged: (v) => setState(() => _country = v!),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      FilterChip(
                        label: const Text('Electors Only'),
                        selected: _showEligibleOnly,
                        onSelected: (v) =>
                            setState(() => _showEligibleOnly = v),
                        checkmarkColor: Colors.indigo,
                        selectedColor: Colors.indigo.withValues(alpha: 0.1),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),

          SliverPadding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 80),
            sliver: SliverList(
              delegate: SliverChildBuilderDelegate((context, index) {
                final cardinal = filtered[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _CardinalCard(cardinal: cardinal),
                );
              }, childCount: filtered.length),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  final Color? color;

  const _StatItem({required this.value, required this.label, this.color});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
            color: color ?? Colors.white,
          ),
        ),
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 12),
        ),
      ],
    );
  }
}

class _CardinalCard extends StatelessWidget {
  final Cardinal cardinal;

  const _CardinalCard({required this.cardinal});

  @override
  Widget build(BuildContext context) {
    Color badgeColor;
    String badgeLabel;

    switch (cardinal.order) {
      case 'CB':
        badgeColor = Colors.purple;
        badgeLabel = 'Cardinal Bishop';
        break;
      case 'CP':
        badgeColor = Colors.blue;
        badgeLabel = 'Cardinal Priest';
        break;
      case 'CD':
        badgeColor = Colors.green;
        badgeLabel = 'Cardinal Deacon';
        break;
      default:
        badgeColor = Colors.grey;
        badgeLabel = 'Cardinal';
    }

    return Card(
      elevation: 0,
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
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [Colors.purple.shade400, Colors.indigo.shade600],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: Text(
                      '${cardinal.rank}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 18,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        cardinal.name,
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      Row(
                        children: [
                          const Icon(
                            Icons.public,
                            size: 14,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            cardinal.country,
                            style: TextStyle(color: Colors.grey.shade600),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                if (cardinal.papalConclaveEligible)
                  const Tooltip(
                    message: 'Papal Elector',
                    child: Icon(Icons.how_to_vote, color: Colors.amber),
                  ),
              ],
            ),

            if (cardinal.office != null) ...[
              const SizedBox(height: 12),
              Text(
                cardinal.office!,
                style: TextStyle(
                  color: Colors.grey.shade700,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ],

            const SizedBox(height: 12),
            Wrap(
              spacing: 8,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 8,
                    vertical: 4,
                  ),
                  decoration: BoxDecoration(
                    color: badgeColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    badgeLabel,
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.bold,
                      color: badgeColor,
                    ),
                  ),
                ),
                if (cardinal.consistory != null)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.grey.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      'Created: ${cardinal.consistory}',
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey,
                      ),
                    ),
                  ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class Cardinal {
  final String id;
  final int rank;
  final String name;
  final String country;
  final String? office;
  final String? order;
  final String? consistory;
  final bool papalConclaveEligible;

  const Cardinal({
    required this.id,
    required this.rank,
    required this.name,
    required this.country,
    this.office,
    this.order,
    this.consistory,
    this.papalConclaveEligible = false,
  });
}

const mockCardinals = [
  Cardinal(
    id: '1',
    rank: 1,
    name: 'Giovanni Battista Re',
    country: 'Italy',
    office: 'Dean of the College of Cardinals',
    order: 'CB',
    consistory: '2001-02-21',
    papalConclaveEligible: false,
  ),
  Cardinal(
    id: '2',
    rank: 2,
    name: 'Leonardo Sandri',
    country: 'Argentina',
    office: 'Prefect Emeritus of the Dicastery for the Eastern Churches',
    order: 'CB',
    consistory: '2007-11-24',
    papalConclaveEligible: false,
  ),
  Cardinal(
    id: '3',
    rank: 3,
    name: 'Pietro Parolin',
    country: 'Italy',
    office: 'Secretary of State',
    order: 'CB',
    consistory: '2014-02-22',
    papalConclaveEligible: true,
  ),
  Cardinal(
    id: '4',
    rank: 4,
    name: 'Marc Ouellet',
    country: 'Canada',
    office: 'Prefect Emeritus of the Dicastery for Bishops',
    order: 'CB',
    consistory: '2003-10-21',
    papalConclaveEligible: false,
  ),
  Cardinal(
    id: '5',
    rank: 5,
    name: 'Fernando Filoni',
    country: 'Italy',
    office: 'Grand Master of the Equestrian Order of the Holy Sepulchre',
    order: 'CB',
    consistory: '2012-02-18',
    papalConclaveEligible: false,
  ),
  // Add some electors
  Cardinal(
    id: '10',
    rank: 10,
    name: 'Luis Antonio Tagle',
    country: 'Philippines',
    office: 'Pro-Prefect of the Dicastery for Evangelization',
    order: 'CP',
    consistory: '2012-11-24',
    papalConclaveEligible: true,
  ),
  Cardinal(
    id: '11',
    rank: 11,
    name: 'Peter Turkson',
    country: 'Ghana',
    office: 'Chancellor of the Pontifical Academy of Sciences',
    order: 'CP',
    consistory: '2003-10-21',
    papalConclaveEligible: true,
  ),
  Cardinal(
    id: '12',
    rank: 12,
    name: 'Sean O\'Malley',
    country: 'USA',
    office: 'Archbishop of Boston',
    order: 'CP',
    consistory: '2006-03-24',
    papalConclaveEligible: true,
  ),
  Cardinal(
    id: '13',
    rank: 13,
    name: 'Timothy Dolan',
    country: 'USA',
    office: 'Archbishop of New York',
    order: 'CP',
    consistory: '2012-02-18',
    papalConclaveEligible: true,
  ),
];
