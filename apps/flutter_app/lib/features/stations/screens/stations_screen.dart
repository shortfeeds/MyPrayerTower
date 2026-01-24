import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

class StationsScreen extends ConsumerStatefulWidget {
  const StationsScreen({super.key});

  @override
  ConsumerState<StationsScreen> createState() => _StationsScreenState();
}

class _StationsScreenState extends ConsumerState<StationsScreen> {
  final PageController _pageController = PageController();
  int _currentStation = 0;

  final List<Map<String, String>> _stations = [
    {
      'number': 'I',
      'title': 'Jesus is Condemned to Death',
      'reflection':
          'Jesus stands silent before Pilate. He submits to the unjust judgment of the world to save us from the judgment of God.',
      'prayer':
          'Lord Jesus, help me to accept the injustices of life with patience and love, uniting my sufferings to Yours.',
    },
    {
      'number': 'II',
      'title': 'Jesus Carries His Cross',
      'reflection':
          'The heavy wood is laid upon His wounded shoulders. He embraces the instrument of His death for love of us.',
      'prayer':
          'Lord, give me the grace to take up my daily cross and follow You without complaint.',
    },
    {
      'number': 'III',
      'title': 'Jesus Falls the First Time',
      'reflection':
          'Weakened by blood loss and torture, Jesus falls. But He stands up again to continue His journey to Calvary.',
      'prayer':
          'Lord, when I fall into sin or despair, give me the strength to rise again and continue on the path of holiness.',
    },
    {
      'number': 'IV',
      'title': 'Jesus Meets His Mother',
      'reflection':
          'Their eyes meet. A sword pierces Mary\'s soul as she sees her Son in such pain.',
      'prayer':
          'Mother Mary, pray for me that I may have your courage and fidelity in times of trial.',
    },
    {
      'number': 'V',
      'title': 'Simon Helps Carry the Cross',
      'reflection':
          'Simon of Cyrene is forced to help. Yet, in carrying the cross, he finds salvation.',
      'prayer':
          'Lord, help me to see the opportunities to serve You in my neighbor, especially those who suffer.',
    },
    {
      'number': 'VI',
      'title': 'Veronica Wipes the Face of Jesus',
      'reflection':
          'Veronica pushes through the crowd to offer a simple act of kindness. Jesus leaves His image on her veil.',
      'prayer':
          'Jesus, imprint Your Holy Face upon my heart, that I may always see You in the face of the poor.',
    },
    {
      'number': 'VII',
      'title': 'Jesus Falls the Second Time',
      'reflection':
          'The weight becomes unbearable. He falls again, yet His will to save us drives Him forward.',
      'prayer':
          'Lord, protect me from the sin of pride. Teach me humility and reliance on Your grace.',
    },
    {
      'number': 'VIII',
      'title': 'Jesus Meets the Women of Jerusalem',
      'reflection':
          'He turns to comfort those who weep for Him, even in His own agony.',
      'prayer':
          'Lord, let me weep not for my own suffering, but for my sins and the sins of the world.',
    },
    {
      'number': 'IX',
      'title': 'Jesus Falls the Third Time',
      'reflection':
          'He is utterly exhausted. He collapses. But for love of me, He rises one last time.',
      'prayer':
          'Lord, when I am completely overwhelmed, be my strength. Never let me give up on Your mercy.',
    },
    {
      'number': 'X',
      'title': 'Jesus is Stripped of His Garments',
      'reflection':
          'He is stripped of everything. He stands naked before the world, the King of Glory in shame.',
      'prayer':
          'Lord, strip me of my attachment to material things and worldly honors. Be my only treasure.',
    },
    {
      'number': 'XI',
      'title': 'Jesus is Nailed to the Cross',
      'reflection':
          'The nails pierce His hands and feet. He is fastened to the wood of the cross.',
      'prayer':
          'Lord, bind my heart to Yours with the nails of Your love. Let me never be separated from You.',
    },
    {
      'number': 'XII',
      'title': 'Jesus Dies on the Cross',
      'reflection': 'It is finished. He bows His head and gives up His spirit.',
      'prayer':
          'Lord Jesus, I adore You and I bless You, because by Your holy cross You have redeemed the world.',
    },
    {
      'number': 'XIII',
      'title': 'Jesus is Taken Down from the Cross',
      'reflection':
          'His lifeless body is placed in the arms of His sorrowful Mother.',
      'prayer':
          'Mother of Sorrows, hold me close to your Immaculate Heart as you held the body of your Son.',
    },
    {
      'number': 'XIV',
      'title': 'Jesus is Laid in the Tomb',
      'reflection':
          'The stone is rolled across the entrance. All seems lost. But the tomb cannot hold the Author of Life.',
      'prayer':
          'Lord, when I pass through the valley of the shadow of death, let me fear no evil, for You are with me.',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black, // Immersive dark mode
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: const Text('Stations of the Cross'),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Center(
            child: Padding(
              padding: const EdgeInsets.only(right: 16),
              child: Text(
                '${_currentStation + 1}/14',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
      body: PageView.builder(
        controller: _pageController,
        itemCount: _stations.length,
        onPageChanged: (index) => setState(() => _currentStation = index),
        itemBuilder: (context, index) {
          final station = _stations[index];
          return Stack(
            fit: StackFit.expand,
            children: [
              // Background Image (Placeholder)
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black54,
                      Colors.black.withValues(alpha: 0.9),
                    ],
                  ),
                ),
                child: Center(
                  child: Icon(
                    LucideIcons.cross,
                    size: 200,
                    color: Colors.white.withValues(alpha: 0.05),
                  ),
                ),
              ),

              // Content
              SafeArea(
                child: Padding(
                  padding: const EdgeInsets.all(24),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Station ${station['number']}',
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(
                              color: AppTheme.accentGold,
                              letterSpacing: 2,
                            ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        station['title']!,
                        style: Theme.of(context).textTheme.headlineMedium
                            ?.copyWith(
                              color: Colors.white,
                              fontWeight: FontWeight.bold,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 48),

                      // Reflection Card
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Column(
                          children: [
                            const Icon(
                              LucideIcons.bookOpen,
                              color: Colors.white54,
                              size: 24,
                            ),
                            const SizedBox(height: 16),
                            Text(
                              station['reflection']!,
                              style: const TextStyle(
                                fontSize: 16,
                                height: 1.6,
                                color: Colors.white,
                              ),
                              textAlign: TextAlign.center,
                            ),
                          ],
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Prayer
                      Text(
                        'Prayer',
                        style: Theme.of(context).textTheme.labelSmall?.copyWith(
                          color: AppTheme.textMuted,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        station['prayer']!,
                        style: const TextStyle(
                          fontSize: 14,
                          fontStyle: FontStyle.italic,
                          color: Colors.white70,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                ),
              ),
            ],
          );
        },
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 120),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            IconButton(
              onPressed: _currentStation > 0
                  ? () => _pageController.previousPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    )
                  : null,
              icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
            ),
            Container(
              width: 48,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(2),
              ),
              child: Row(
                children: [
                  Container(
                    width: 48 * ((_currentStation + 1) / 14),
                    decoration: BoxDecoration(
                      color: AppTheme.accentGold,
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ],
              ),
            ),
            IconButton(
              onPressed: _currentStation < _stations.length - 1
                  ? () => _pageController.nextPage(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.easeInOut,
                    )
                  : (() => Navigator.pop(context)),
              icon: Icon(
                _currentStation < _stations.length - 1
                    ? LucideIcons.arrowRight
                    : LucideIcons.check,
                color: _currentStation < _stations.length - 1
                    ? Colors.white
                    : AppTheme.accentGold,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
