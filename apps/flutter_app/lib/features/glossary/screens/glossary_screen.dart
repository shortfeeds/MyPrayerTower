import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

class GlossaryTerm {
  final String term;
  final String definition;
  final String category;

  const GlossaryTerm({
    required this.term,
    required this.definition,
    required this.category,
  });
}

const List<GlossaryTerm> _terms = [
  GlossaryTerm(
    term: 'Absolution',
    definition:
        'The act of a priest forgiving sins in the Sacrament of Reconciliation.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Advent',
    definition:
        'The four-week liturgical season of preparation before Christmas.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Apostolic Succession',
    definition:
        'The unbroken line of bishops from the Apostles to the present.',
    category: 'Ecclesiology',
  ),
  GlossaryTerm(
    term: 'Beatification',
    definition:
        'The second step toward canonization, allowing public veneration.',
    category: 'Saints',
  ),
  GlossaryTerm(
    term: 'Catechumen',
    definition:
        'A person preparing to receive Baptism through the RCIA process.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Charism',
    definition:
        'A spiritual gift given by the Holy Spirit for the good of the Church.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Conclave',
    definition: 'The meeting of cardinals to elect a new pope.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Contrition',
    definition:
        'Sorrow for sins committed, with the intention to avoid future sin.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Dogma',
    definition:
        'A truth revealed by God and definitively taught by the Church.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Encyclical',
    definition:
        'A formal letter from the Pope addressed to the universal Church.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Eucharist',
    definition:
        'The sacrament of Christ\'s Body and Blood under the forms of bread and wine.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Ex Cathedra',
    definition:
        'When the Pope speaks with full papal authority on faith or morals.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Grace',
    definition: 'The free and unmerited gift of God\'s life and assistance.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Immaculate Conception',
    definition: 'The doctrine that Mary was conceived without original sin.',
    category: 'Mariology',
  ),
  GlossaryTerm(
    term: 'Incarnation',
    definition: 'The mystery of the Son of God becoming man in Jesus Christ.',
    category: 'Christology',
  ),
  GlossaryTerm(
    term: 'Indulgence',
    definition: 'Remission of temporal punishment due to sin already forgiven.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Magisterium',
    definition:
        'The teaching authority of the Church, exercised by the Pope and bishops.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Monstrance',
    definition:
        'A sacred vessel used to display the Blessed Sacrament for adoration.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Novena',
    definition: 'A nine-day period of prayer for a special intention.',
    category: 'Devotion',
  ),
  GlossaryTerm(
    term: 'Original Sin',
    definition: 'The fallen state inherited from Adam and Eve\'s first sin.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Purgatory',
    definition: 'The state of purification after death before entering Heaven.',
    category: 'Eschatology',
  ),
  GlossaryTerm(
    term: 'Real Presence',
    definition:
        'Christ\'s true presence in the Eucharist—body, blood, soul, and divinity.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Sacrament',
    definition: 'An outward sign instituted by Christ that gives grace.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Transubstantiation',
    definition:
        'The change of bread and wine into Christ\'s Body and Blood at Mass.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Trinity',
    definition: 'The one God in three Persons: Father, Son, and Holy Spirit.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Venial Sin',
    definition:
        'A lesser sin that weakens but does not destroy our relationship with God.',
    category: 'Theology',
  ),
  // Additional terms
  GlossaryTerm(
    term: 'Anointing of the Sick',
    definition:
        'A sacrament for spiritual and physical healing for those who are ill.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Apostle',
    definition:
        'One of the twelve disciples chosen by Jesus to spread His teachings.',
    category: 'Ecclesiology',
  ),
  GlossaryTerm(
    term: 'Assumption',
    definition: 'The doctrine that Mary was taken body and soul into Heaven.',
    category: 'Mariology',
  ),
  GlossaryTerm(
    term: 'Baptism',
    definition:
        'The first sacrament of initiation, cleansing original sin and making one a child of God.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Canonization',
    definition:
        'The official declaration by the Pope that a person is a saint.',
    category: 'Saints',
  ),
  GlossaryTerm(
    term: 'Cardinal',
    definition:
        'A senior church official appointed by the Pope, often eligible to elect a new Pope.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Chalice',
    definition:
        'The sacred cup used to hold the wine that becomes Christ\'s Blood at Mass.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Communion of Saints',
    definition:
        'The spiritual union of all believers in Christ, living and dead.',
    category: 'Ecclesiology',
  ),
  GlossaryTerm(
    term: 'Confirmation',
    definition:
        'A sacrament that strengthens baptismal grace through the Holy Spirit.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Deacon',
    definition:
        'An ordained minister who assists in liturgy, preaching, and service.',
    category: 'Hierarchy',
  ),
  GlossaryTerm(
    term: 'Diocese',
    definition: 'A territorial district under the pastoral care of a bishop.',
    category: 'Ecclesiology',
  ),
  GlossaryTerm(
    term: 'Epiphany',
    definition:
        'The feast celebrating the visit of the Magi to the infant Jesus.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Fasting',
    definition:
        'The practice of limiting food intake for spiritual discipline.',
    category: 'Devotion',
  ),
  GlossaryTerm(
    term: 'Holy Orders',
    definition:
        'The sacrament by which men are ordained as bishops, priests, or deacons.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Intercession',
    definition: 'The act of praying on behalf of another person or group.',
    category: 'Devotion',
  ),
  GlossaryTerm(
    term: 'Lent',
    definition: 'The 40-day penitential season of preparation before Easter.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Liturgy of the Hours',
    definition:
        'The official daily prayers of the Church, prayed throughout the day.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Matrimony',
    definition: 'The sacrament of marriage between a baptized man and woman.',
    category: 'Sacraments',
  ),
  GlossaryTerm(
    term: 'Mortal Sin',
    definition:
        'A grave sin that destroys sanctifying grace and separates one from God.',
    category: 'Theology',
  ),
  GlossaryTerm(
    term: 'Rosary',
    definition:
        'A devotional prayer using beads to meditate on mysteries of Christ\'s life.',
    category: 'Devotion',
  ),
  GlossaryTerm(
    term: 'Stations of the Cross',
    definition:
        'A devotional practice commemorating Jesus\' journey to Calvary.',
    category: 'Devotion',
  ),
  GlossaryTerm(
    term: 'Tabernacle',
    definition: 'The sacred container where the Blessed Sacrament is reserved.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Triduum',
    definition:
        'The three-day liturgical celebration from Holy Thursday to Easter.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Vestments',
    definition:
        'The special garments worn by clergy during liturgical services.',
    category: 'Liturgy',
  ),
  GlossaryTerm(
    term: 'Vicar',
    definition:
        'A priest who represents a bishop or exercises delegated authority.',
    category: 'Hierarchy',
  ),
];

const List<String> _categories = [
  'All',
  'Sacraments',
  'Theology',
  'Hierarchy',
  'Liturgy',
  'Ecclesiology',
  'Mariology',
  'Christology',
  'Eschatology',
  'Devotion',
  'Saints',
];

class GlossaryScreen extends ConsumerStatefulWidget {
  const GlossaryScreen({super.key});

  @override
  ConsumerState<GlossaryScreen> createState() => _GlossaryScreenState();
}

class _GlossaryScreenState extends ConsumerState<GlossaryScreen> {
  String _searchQuery = '';
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    final filteredTerms = _terms.where((term) {
      final matchesSearch =
          term.term.toLowerCase().contains(_searchQuery.toLowerCase()) ||
          term.definition.toLowerCase().contains(_searchQuery.toLowerCase());
      final matchesCategory =
          _selectedCategory == 'All' || term.category == _selectedCategory;
      return matchesSearch && matchesCategory;
    }).toList();

    // Sort logic handled by list definition or here if needed, currently alphabetical in const list would be best but let's sort
    filteredTerms.sort((a, b) => a.term.compareTo(b.term));

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Catholic Glossary',
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: const Color(0xFF1E293B),
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF1E293B)),
      ),
      body: Column(
        children: [
          // Search Bar
          Padding(
            padding: const EdgeInsets.all(16),
            child: TextField(
              onChanged: (value) => setState(() => _searchQuery = value),
              decoration: InputDecoration(
                hintText: 'Search terms...',
                prefixIcon: const Icon(LucideIcons.search, color: Colors.grey),
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide(color: Colors.grey.shade200),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: const BorderSide(color: Colors.cyan),
                ),
              ),
            ),
          ),

          // Categories
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: _categories.map((cat) {
                final isSelected = _selectedCategory == cat;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(cat),
                    selected: isSelected,
                    onSelected: (selected) {
                      if (selected) setState(() => _selectedCategory = cat);
                    },
                    backgroundColor: Colors.white,
                    selectedColor: Colors.cyan.shade100,
                    labelStyle: TextStyle(
                      color: isSelected
                          ? Colors.cyan.shade800
                          : Colors.grey.shade700,
                      fontWeight: isSelected
                          ? FontWeight.bold
                          : FontWeight.normal,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                      side: BorderSide(
                        color: isSelected
                            ? Colors.cyan.shade200
                            : Colors.grey.shade200,
                      ),
                    ),
                    showCheckmark: false,
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),

          // Terms List
          Expanded(
            child: filteredTerms.isEmpty
                ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(
                          LucideIcons.searchX,
                          size: 48,
                          color: Colors.grey.shade300,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No terms found',
                          style: GoogleFonts.inter(
                            color: Colors.grey.shade400,
                            fontSize: 16,
                          ),
                        ),
                      ],
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredTerms.length,
                    separatorBuilder: (context, index) =>
                        const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final term = filteredTerms[index];
                      return Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.grey.shade100),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  term.term,
                                  style: GoogleFonts.merriweather(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: const Color(0xFF1E293B),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 2,
                                  ),
                                  decoration: BoxDecoration(
                                    color: Colors.cyan.shade50,
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    term.category,
                                    style: GoogleFonts.inter(
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.cyan.shade700,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Text(
                              term.definition,
                              style: GoogleFonts.inter(
                                color: const Color(0xFF475569),
                                height: 1.5,
                              ),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
