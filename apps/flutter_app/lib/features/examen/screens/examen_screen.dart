import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

class ExamenScreen extends StatefulWidget {
  const ExamenScreen({super.key});

  @override
  State<ExamenScreen> createState() => _ExamenScreenState();
}

class _ExamenScreenState extends State<ExamenScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<Map<String, String>> _steps = [
    {
      'title': '1. Presence',
      'content':
          'Become aware of God\'s presence. Look back on the events of the day in the company of the Holy Spirit. The day may seem confusing or organized—a blur, or a precise sequence of events. Ask God to bring clarity and understanding.',
      'icon': '🌟',
    },
    {
      'title': '2. Gratitude',
      'content':
          'Review the day with gratitude. Walk through your day in the presence of God and note its joys and delights. Focus on the day\'s gifts. Look at the work you did, the people you interacted with. What did you receive from these people? What did you give them? Pay attention to small things—the food you ate, the sights you saw, the seemingly small pleasures. God is in the details.',
      'icon': '🙏',
    },
    {
      'title': '3. Review',
      'content':
          'Pay attention to your emotions. One of St. Ignatius\'s great insights was that we detect the presence of God in the movements of our emotions. Reflect on the feelings you experienced during the day. Boredom? Elation? Resentment? Compassion? Anger? Confidence? What is God saying through these feelings?',
      'icon': '🔍',
    },
    {
      'title': '4. Sorrow',
      'content':
          'Choose one feature of the day and pray from it. Ask the Holy Spirit to direct you to something during the day that God thinks is particularly important. It may involve a feeling—positive or negative. It may be a significant encounter with another person or a vivid moment of pleasure or peace. Or it may be something that seems rather insignificant. Look at it. Pray about it. Allow the prayer to arise spontaneously from your heart.',
      'icon': '🕊️',
    },
    {
      'title': '5. Grace',
      'content':
          'Look toward tomorrow. Ask God to give you light for tomorrow\'s challenges. Pay attention to the feelings that surface as you survey what\'s coming up. Are you doubtful? Cheerful? Apprehensive? Full of delighted anticipation? Allow these feelings to turn into prayer. Seek God\'s guidance. Ask him for help and understanding. Pray for hope.',
      'icon': '🌅',
    },
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.darkBg,
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: const Text('Daily Examen'),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.x),
            onPressed: () => Navigator.of(context).pop(),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: PageView.builder(
              controller: _pageController,
              itemCount: _steps.length,
              onPageChanged: (index) {
                if (mounted) {
                  setState(() => _currentPage = index);
                }
              },
              itemBuilder: (context, index) {
                final step = _steps[index];
                return Padding(
                  padding: const EdgeInsets.all(32),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(step['icon']!, style: const TextStyle(fontSize: 64)),
                      const SizedBox(height: 32),
                      Text(
                        step['title']!,
                        style: Theme.of(context).textTheme.headlineMedium
                            ?.copyWith(
                              color: AppTheme.accentGold,
                              fontWeight: FontWeight.bold,
                            ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 24),
                      Text(
                        step['content']!,
                        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                          height: 1.6,
                          fontSize: 18,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(32),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                if (_currentPage > 0)
                  TextButton.icon(
                    onPressed: () {
                      _pageController.previousPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    icon: const Icon(LucideIcons.arrowLeft),
                    label: const Text('Previous'),
                  )
                else
                  const SizedBox(width: 100), // Spacer

                Row(
                  children: List.generate(
                    _steps.length,
                    (index) => Container(
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: _currentPage == index
                            ? AppTheme.accentGold
                            : AppTheme.darkBorder,
                      ),
                    ),
                  ),
                ),

                if (_currentPage < _steps.length - 1)
                  TextButton.icon(
                    onPressed: () {
                      _pageController.nextPage(
                        duration: const Duration(milliseconds: 300),
                        curve: Curves.easeInOut,
                      );
                    },
                    icon: const Icon(LucideIcons.arrowRight),
                    label: const Text('Next'),
                    iconAlignment: IconAlignment.end,
                  )
                else
                  TextButton.icon(
                    onPressed: () => Navigator.of(context).pop(),
                    icon: const Icon(LucideIcons.check),
                    label: const Text('Finish'),
                    iconAlignment: IconAlignment.end,
                  ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
