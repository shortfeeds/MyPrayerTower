import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../models/memorial_model.dart';
import '../repositories/memorial_repository.dart';
import 'create_memorial_screen.dart';
import 'memorial_detail_screen.dart';

class MemorialsScreen extends ConsumerStatefulWidget {
  const MemorialsScreen({super.key});

  @override
  ConsumerState<MemorialsScreen> createState() => _MemorialsScreenState();
}

class _MemorialsScreenState extends ConsumerState<MemorialsScreen> {
  String _searchQuery = '';
  late Future<List<Memorial>> _memorialsFuture;

  @override
  void initState() {
    super.initState();
    _refreshMemorials();
  }

  void _refreshMemorials() {
    setState(() {
      _memorialsFuture = ref.read(memorialRepositoryProvider).getMemorials();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Memorials',
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
        flexibleSpace: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(0xFF1E293B),
                Color(0xFF0F172A),
              ], // Slate-800 to Slate-900
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
        ),
      ),
      body: Column(
        children: [
          // Hero / Search
          Container(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: Column(
              children: [
                Text(
                  'Visit a Memorial of Remembrance',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.merriweather(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  'Light candles, offer prayers, and share cherished memories.',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.inter(
                    color: Colors.blueGrey.shade200,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  '"Eternal rest grant unto them, O Lord."',
                  textAlign: TextAlign.center,
                  style: GoogleFonts.merriweather(
                    color: Colors.blueGrey.shade300,
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  onChanged: (val) => setState(() => _searchQuery = val),
                  style: const TextStyle(color: Colors.black87),
                  decoration: InputDecoration(
                    hintText: 'Search memorials...',
                    prefixIcon: const Icon(
                      LucideIcons.search,
                      color: Colors.grey,
                    ),
                    filled: true,
                    fillColor: Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Content
          Expanded(
            child: FutureBuilder<List<Memorial>>(
              future: _memorialsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                }

                if (snapshot.hasError) {
                  return Center(
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
                          'Error loading memorials',
                          style: GoogleFonts.inter(),
                        ),
                        TextButton(
                          onPressed: _refreshMemorials,
                          child: const Text('Retry'),
                        ),
                      ],
                    ),
                  );
                }

                final memorials = snapshot.data ?? [];

                // Client-side filtering
                final filteredMemorials = memorials.where((m) {
                  final query = _searchQuery.toLowerCase();
                  return m.firstName.toLowerCase().contains(query) ||
                      m.lastName.toLowerCase().contains(query);
                }).toList();

                if (filteredMemorials.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(
                          LucideIcons.flower,
                          size: 48,
                          color: Colors.grey,
                        ),
                        const SizedBox(height: 16),
                        Text(
                          'No memorials found',
                          style: GoogleFonts.inter(color: Colors.grey),
                        ),
                      ],
                    ),
                  );
                }

                return ListView.separated(
                  padding: const EdgeInsets.fromLTRB(16, 16, 16, 150),
                  itemCount: filteredMemorials.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 16),
                  itemBuilder: (context, index) {
                    final memorial = filteredMemorials[index];
                    return _MemorialCard(memorial: memorial);
                  },
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: Padding(
        padding: const EdgeInsets.only(bottom: 130),
        child: FloatingActionButton.extended(
          onPressed: () async {
            await Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const CreateMemorialScreen()),
            );
            _refreshMemorials();
          },
          label: const Text('Create Memorial'),
          icon: const Icon(LucideIcons.plus),
          backgroundColor: Colors.amber.shade700,
        ),
      ),
    );
  }
}

class _MemorialCard extends StatelessWidget {
  final Memorial memorial;

  const _MemorialCard({required this.memorial});

  @override
  Widget build(BuildContext context) {
    final isPremium = memorial.tier == 'PREMIUM';

    return GestureDetector(
      onTap: () {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => MemorialDetailScreen(
              memorialId: memorial.id,
              initialMemorial: memorial,
            ),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: isPremium
              ? Border.all(color: Colors.amber.shade200, width: 1.5)
              : Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        clipBehavior: Clip.antiAlias,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Photo & Badge
            Stack(
              children: [
                Container(
                  height: 160,
                  width: double.infinity,
                  color: Colors.grey.shade200,
                  child: memorial.photoUrl != null
                      ? CachedNetworkImage(
                          imageUrl: memorial.photoUrl!,
                          fit: BoxFit.cover,
                          errorWidget: (context, url, error) => const Icon(
                            LucideIcons.users,
                            size: 48,
                            color: Colors.grey,
                          ),
                        )
                      : const Center(
                          child: Icon(
                            LucideIcons.users,
                            size: 48,
                            color: Colors.grey,
                          ),
                        ),
                ),
                if (isPremium)
                  Positioned(
                    top: 12,
                    left: 12,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 10,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Colors.amber, Colors.orange],
                        ),
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: const [
                          BoxShadow(color: Colors.black26, blurRadius: 4),
                        ],
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            LucideIcons.sparkles,
                            size: 12,
                            color: Colors.white,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Featured',
                            style: GoogleFonts.inter(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
              ],
            ),

            // Details
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${memorial.firstName} ${memorial.lastName}',
                    style: GoogleFonts.merriweather(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: const Color(0xFF1E293B),
                    ),
                  ),
                  if (memorial.birthDate != null || memorial.deathDate != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 4, bottom: 8),
                      child: Row(
                        children: [
                          const Icon(
                            LucideIcons.calendar,
                            size: 12,
                            color: Colors.grey,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            '${memorial.birthDate?.year ?? '?'} — ${memorial.deathDate?.year ?? '?'}',
                            style: GoogleFonts.inter(
                              fontSize: 12,
                              color: const Color(0xFF64748B),
                            ),
                          ),
                        ],
                      ),
                    ),
                  if (memorial.shortBio != null)
                    Text(
                      memorial.shortBio!,
                      style: GoogleFonts.inter(
                        fontSize: 14,
                        color: const Color(0xFF475569),
                        height: 1.5,
                      ),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                    ),
                  const SizedBox(height: 16),

                  // Stats
                  Row(
                    children: [
                      _DetailStat(
                        icon: LucideIcons.flame,
                        count: memorial.totalCandles,
                        color: Colors.amber,
                      ),
                      const SizedBox(width: 16),
                      _DetailStat(
                        icon: LucideIcons.cross,
                        count: memorial.totalMasses,
                        color: Colors.blue,
                      ),
                      const SizedBox(width: 16),
                      _DetailStat(
                        icon: LucideIcons.flower,
                        count: memorial.totalFlowers,
                        color: Colors.pink,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _DetailStat extends StatelessWidget {
  final IconData icon;
  final int count;
  final MaterialColor color;

  const _DetailStat({
    required this.icon,
    required this.count,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Text(
          '$count',
          style: GoogleFonts.inter(
            fontSize: 12,
            fontWeight: FontWeight.bold,
            color: Colors.blueGrey.shade600,
          ),
        ),
      ],
    );
  }
}
