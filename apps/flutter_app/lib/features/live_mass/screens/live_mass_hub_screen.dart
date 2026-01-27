import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class LiveMassHubScreen extends StatelessWidget {
  const LiveMassHubScreen({super.key});

  final List<Map<String, String>> _streams = const [
    {
      'name': 'St. Peter\'s Basilica',
      'location': 'Vatican City',
      'id': 'vatican_live',
      'imageUrl':
          'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/St_Peter%27s_Basilica_1.jpg/1200px-St_Peter%27s_Basilica_1.jpg',
    },
    {
      'name': 'Basilica of Our Lady of Guadalupe',
      'location': 'Mexico City',
      'id': 'guadalupe_live',
      'imageUrl':
          'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG/1200px-Basilica_of_Our_Lady_of_Guadalupe_%28new%29.JPG',
    },
    {
      'name': 'St. Patrick\'s Cathedral',
      'location': 'New York, USA',
      'id': 'st_pat_live',
      'imageUrl':
          'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/St_Patricks_Cathedral_NY.jpg/1200px-St_Patricks_Cathedral_NY.jpg',
    },
    {
      'name': 'Notre-Dame de Paris',
      'location': 'Paris, France',
      'id': 'notre_dame_live',
      'imageUrl':
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Notre-Dame_de_Paris_2013-07-24.jpg/1200px-Notre-Dame_de_Paris_2013-07-24.jpg',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0518),
      appBar: AppBar(
        title: const Text('Live Mass Hub'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            width: double.infinity,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Colors.purple.shade900, Colors.transparent],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
            ),
            child: const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'UNIVERSAL CHURCH',
                  style: TextStyle(
                    color: Colors.amber,
                    fontSize: 10,
                    fontWeight: FontWeight.w900,
                    letterSpacing: 2,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Participate in the Holy Mass',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  'Join global congregations in real-time prayer and worship.',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(20),
              itemCount: _streams.length,
              itemBuilder: (context, index) {
                final stream = _streams[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 20),
                  child: GestureDetector(
                    onTap: () {
                      HapticFeedback.mediumImpact();
                      // Logic to open YouTube player or WebView would go here
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Joining ${stream['name']}...')),
                      );
                    },
                    child: Container(
                      height: 200,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(30),
                        image: DecorationImage(
                          image: NetworkImage(stream['imageUrl']!),
                          fit: BoxFit.cover,
                          colorFilter: ColorFilter.mode(
                            Colors.black.withValues(alpha: 0.4),
                            BlendMode.darken,
                          ),
                        ),
                      ),
                      child: Stack(
                        children: [
                          Positioned(
                            top: 20,
                            right: 20,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: Colors.red,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.circle,
                                    size: 8,
                                    color: Colors.white,
                                  ),
                                  SizedBox(width: 4),
                                  Text(
                                    'LIVE',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            bottom: 24,
                            left: 24,
                            right: 24,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  stream['name']!,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  stream['location']!,
                                  style: const TextStyle(
                                    color: Colors.white70,
                                    fontSize: 14,
                                  ),
                                ),
                              ],
                            ),
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
    );
  }
}
