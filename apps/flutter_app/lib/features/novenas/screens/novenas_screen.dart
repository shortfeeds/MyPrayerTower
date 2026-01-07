import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

class NovenasScreen extends StatelessWidget {
  const NovenasScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        leading: const AppBarMenuButton(
          iconColor: Colors.white,
          showBackground: false,
        ),
        title: Text(
          'Novenas',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _NovenaCard(
            title: 'Divine Mercy Novena',
            description: 'A powerful 9-day prayer to Divine Mercy',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.redAccent,
            onTap: () => _showNovenaDetail(
              context,
              'Divine Mercy Novena',
              _divineMercyPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Novena to St. Jude',
            description: 'Patron of hopeless causes',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.green,
            onTap: () => _showNovenaDetail(
              context,
              'Novena to St. Jude',
              _stJudePrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: '54 Day Rosary Novena',
            description: 'The most powerful Rosary novena',
            daysCompleted: 0,
            totalDays: 54,
            imageColor: Colors.blueAccent,
            onTap: () => _showNovenaDetail(
              context,
              '54 Day Rosary Novena',
              _rosaryNovenaPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Novena to the Holy Spirit',
            description: 'Prepare for Pentecost',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.orange,
            onTap: () => _showNovenaDetail(
              context,
              'Novena to the Holy Spirit',
              _holySpiritPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Sacred Heart Novena',
            description: 'Devotion to the Sacred Heart of Jesus',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.red,
            onTap: () => _showNovenaDetail(
              context,
              'Sacred Heart Novena',
              _sacredHeartPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Immaculate Conception',
            description: 'Honoring Our Lady',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.lightBlue,
            onTap: () => _showNovenaDetail(
              context,
              'Immaculate Conception Novena',
              _immaculateConceptionPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'St. Joseph Novena',
            description: 'Patron of the Universal Church',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.brown,
            onTap: () => _showNovenaDetail(
              context,
              'St. Joseph Novena',
              _stJosephPrayers,
            ),
          ),
          const SizedBox(height: 16),
          _NovenaCard(
            title: 'Assumption Novena',
            description: 'Celebrating Mary\'s Assumption',
            daysCompleted: 0,
            totalDays: 9,
            imageColor: Colors.amber,
            onTap: () => _showNovenaDetail(
              context,
              'Assumption Novena',
              _assumptionPrayers,
            ),
          ),
        ],
      ),
    );
  }

  void _showNovenaDetail(
    BuildContext context,
    String title,
    List<String> prayers,
  ) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.85,
        decoration: const BoxDecoration(
          color: AppTheme.sacredNavy900,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: Column(
          children: [
            Container(
              margin: const EdgeInsets.only(top: 12),
              width: 40,
              height: 4,
              decoration: BoxDecoration(
                color: Colors.grey.shade600,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  const Icon(LucideIcons.flame, color: AppTheme.gold500),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      title,
                      style: GoogleFonts.merriweather(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(LucideIcons.x, color: Colors.grey),
                    onPressed: () => Navigator.pop(context),
                  ),
                ],
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                itemCount: prayers.length,
                itemBuilder: (context, index) => Container(
                  margin: const EdgeInsets.only(bottom: 16),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.darkCard,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Day ${index + 1}',
                        style: GoogleFonts.inter(
                          color: AppTheme.gold500,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        prayers[index],
                        style: GoogleFonts.inter(
                          color: Colors.white70,
                          height: 1.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: ElevatedButton(
                onPressed: () {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text(
                        'Day completed! Keep going with your novena.',
                      ),
                      backgroundColor: AppTheme.gold500,
                    ),
                  );
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold500,
                  foregroundColor: Colors.black,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Mark Day Complete',
                  style: GoogleFonts.inter(fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// Sample prayers for each novena
const List<String> _divineMercyPrayers = [
  'Eternal Father, I offer You the Body and Blood, Soul and Divinity of Your dearly beloved Son, Our Lord Jesus Christ, in atonement for our sins and those of the whole world.',
  'For the sake of His sorrowful Passion, have mercy on us and on the whole world.',
  'Holy God, Holy Mighty One, Holy Immortal One, have mercy on us and on the whole world.',
  'Jesus, I trust in You. (Repeat 3 times)',
  'O Blood and Water, which gushed forth from the Heart of Jesus as a fountain of Mercy for us, I trust in You.',
  'Eternal God, in whom mercy is endless and the treasury of compassion inexhaustible, look kindly upon us.',
  'Most Merciful Jesus, from the depth of my heart, have mercy on us.',
  'O Blood and Water of Jesus, wash away my sins and those of the whole world.',
  'Jesus, King of Mercy, I trust in You!',
];

const List<String> _stJudePrayers = [
  'Most holy Apostle, St. Jude, faithful servant and friend of Jesus, I place myself into your hands at this difficult time.',
  'Help me to know that I need not face my troubles alone. Please join me in my petition for help.',
  'Make use of the particular privilege given you, to bring visible and speedy help where help is almost despaired of.',
  'Come to my assistance in this great need that I may receive the consolation and help of heaven.',
  'Pray that my faith be strengthened and my trust renewed in the limitless mercy of God.',
  'I promise, O blessed St. Jude, to be ever mindful of this great favor granted me by God.',
  'I will always honor you as my special and powerful patron, and to do all in my power to encourage devotion to you.',
  'St. Jude, helper of the hopeless, aid me in my distress.',
  'Blessed Apostle, bring my petition before the throne of God, through Jesus Christ Our Lord. Amen.',
];

const List<String> _rosaryNovenaPrayers = [
  'Queen of the Holy Rosary, in these times of darkness and unbelief, show your power with the signs of your victory.',
  'Grant us a living faith, grant us a firm hope, grant us an ardent love.',
  'We humbly implore you, dispose our hearts and minds to prayer, meditation, and contemplation.',
  'May the holy mysteries of the Rosary inspire in us a great love for truth and virtue.',
  'Through the intercession of St. Dominic and St. Catherine of Siena, pray for our intentions.',
  'Virgin Mother, help us to say each Hail Mary with reverence and attention.',
  "Lead us through the mysteries of your Son's life, passion, death, and resurrection.",
  'Queen of Peace, obtain for us the graces we need to persevere in faith.',
  'My Queen, my Mother! I give myself entirely to you, in time and in eternity.',
];

const List<String> _holySpiritPrayers = [
  'Come, Holy Spirit, fill the hearts of Your faithful and enkindle in them the fire of Your love.',
  'Send forth Your Spirit and they shall be created, and You shall renew the face of the earth.',
  'O God, who by the light of the Holy Spirit did instruct the hearts of the faithful, grant us wisdom.',
  'Holy Spirit, Soul of my soul, I adore You. Enlighten, guide, strengthen and console me.',
  'Come, Creator Spirit, visit the souls of Your people, fill with heavenly grace the hearts You created.',
  'Spirit of Wisdom and Understanding, lead me on the path of righteousness.',
  'Spirit of Counsel and Fortitude, give me strength in my weakness.',
  'Spirit of Knowledge, Piety, and Fear of the Lord, help me to serve You faithfully.',
  'Almighty God, send Your Spirit upon me that I may bear witness to Your truth. Amen.',
];

const List<String> _sacredHeartPrayers = [
  'O most Sacred Heart of Jesus, fountain of every blessing, I adore You!',
  'With living faith, I prostrate myself before You, grateful for Your immense love for us.',
  'My heart desires to honor Your Sacred Heart with all my strength and all my love.',
  'Jesus, meek and humble of Heart, make my heart like unto Yours.',
  'Sacred Heart of Jesus, Thy Kingdom Come!',
  'O Sacred Heart, fount of mercy, pour out Your graces upon all humanity.',
  'Heart of Jesus, burning with love for us, inflame our hearts with love for You.',
  'Sacred Heart of Jesus, I place all my trust in You.',
  'Most Sacred Heart of Jesus, have mercy on us. (Repeat 3 times)',
];

const List<String> _immaculateConceptionPrayers = [
  'O God, by the Immaculate Conception of the Blessed Virgin, prepare a worthy dwelling for Your Son.',
  'Mary, conceived without sin, pray for us who have recourse to thee.',
  'O Mary, Mother of God, intercede for us sinners now and at the hour of our death.',
  'Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women.',
  'Immaculate Heart of Mary, refuge of sinners, pray for us.',
  'O Virgin most pure, pray that we may be made worthy of the promises of Christ.',
  'Mother of mercy, show us the blessed fruit of thy womb, Jesus.',
  'O Immaculate Virgin, lead us safely to your Divine Son.',
  'Mary, Queen of Heaven and Earth, grant our humble petitions. Amen.',
];

const List<String> _stJosephPrayers = [
  'O St. Joseph, whose protection is so great, to you I entrust all my cares and desires.',
  'Do not fail me, dear St. Joseph, protector of the Holy Family.',
  'St. Joseph, guardian of the Redeemer, guide me in my daily duties.',
  'Foster father of Jesus, obtain for me a deep love of prayer.',
  'Patron of workers, teach me diligence and faithfulness in my labors.',
  'Model of patience, help me to accept the trials of life with trust.',
  'Terror of demons, protect me from all spiritual dangers.',
  'St. Joseph, hope of the sick, intercede for healing where it is needed.',
  'Glorious Patriarch, lead me safely to eternal life. Amen.',
];

const List<String> _assumptionPrayers = [
  'Mary, taken body and soul into heavenly glory, pray for us.',
  'Queen assumed into Heaven, help us to fix our hearts on things above.',
  'Mother most glorious, guide us on our earthly pilgrimage.',
  'Virgin most powerful, shield us from the snares of the evil one.',
  'Assumed into Heaven, Mary rejoices with all the angels and saints.',
  'O blessed Virgin, help us to live lives worthy of our eternal inheritance.',
  'Queen of Heaven, lead us to share in the glory you now enjoy.',
  'Mary, Queen crowned in Heaven, hear our humble prayers.',
  'Assumed into glory, intercede for us before the throne of God. Amen.',
];

class _NovenaCard extends StatelessWidget {
  final String title;
  final String description;
  final int daysCompleted;
  final int totalDays;
  final Color imageColor;
  final VoidCallback onTap;

  const _NovenaCard({
    required this.title,
    required this.description,
    required this.daysCompleted,
    required this.totalDays,
    required this.imageColor,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final progress = daysCompleted / totalDays;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppTheme.darkCard,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: daysCompleted > 0
                ? AppTheme.gold500.withValues(alpha: 0.3)
                : Colors.transparent,
          ),
        ),
        child: Row(
          children: [
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: imageColor.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Center(
                child: Icon(LucideIcons.flame, color: imageColor, size: 28),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.merriweather(
                      fontWeight: FontWeight.bold,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    description,
                    style: GoogleFonts.inter(
                      color: Colors.white54,
                      fontSize: 12,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Expanded(
                        child: ClipRRect(
                          borderRadius: BorderRadius.circular(4),
                          child: LinearProgressIndicator(
                            value: progress,
                            backgroundColor: Colors.black26,
                            valueColor: AlwaysStoppedAnimation(
                              daysCompleted == totalDays
                                  ? Colors.green
                                  : AppTheme.gold500,
                            ),
                            minHeight: 6,
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'Day $daysCompleted/$totalDays',
                        style: GoogleFonts.inter(
                          color: Colors.white38,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            const Icon(
              LucideIcons.chevronRight,
              color: Colors.white38,
              size: 20,
            ),
          ],
        ),
      ),
    );
  }
}
