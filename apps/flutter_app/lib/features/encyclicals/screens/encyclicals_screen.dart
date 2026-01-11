import 'package:flutter/material.dart';
// import 'package:lucide_icons/lucide_icons.dart';
import 'package:url_launcher/url_launcher.dart';

class EncyclicalsScreen extends StatelessWidget {
  const EncyclicalsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFAF9F6),
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            pinned: true,
            title: const Text('Papal Encyclicals'),
            backgroundColor: Colors.teal.shade800,
            foregroundColor: Colors.white,
          ),

          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.teal.shade700, Colors.teal.shade900],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  const Icon(
                    Icons.description,
                    size: 48,
                    color: Colors.white24,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Papal Teaching',
                    style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                      color: Colors.white,
                      fontFamily: 'Serif',
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Authoritative letters from the Popes addressing faith, morals, and social issues.',
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
                final enc = encyclicals[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: _EncyclicalCard(encyclical: enc),
                );
              }, childCount: encyclicals.length),
            ),
          ),
        ],
      ),
    );
  }
}

class _EncyclicalCard extends StatelessWidget {
  final Encyclical encyclical;

  const _EncyclicalCard({required this.encyclical});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey.withValues(alpha: 0.2)),
      ),
      child: InkWell(
        onTap: () => launchUrl(Uri.parse(encyclical.url)),
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 8,
                            vertical: 4,
                          ),
                          decoration: BoxDecoration(
                            color: Colors.teal.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            encyclical.topic,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: Colors.teal.shade800,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          encyclical.latinTitle,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        Text(
                          encyclical.title,
                          style: TextStyle(color: Colors.grey.shade600),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.open_in_new, size: 16, color: Colors.grey),
                ],
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Icon(Icons.person, size: 14, color: Colors.grey.shade400),
                  const SizedBox(width: 4),
                  Text(
                    encyclical.pope,
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                  const SizedBox(width: 16),
                  Icon(
                    Icons.calendar_today,
                    size: 14,
                    color: Colors.grey.shade400,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    '${encyclical.year}',
                    style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class Encyclical {
  final String title;
  final String latinTitle;
  final String pope;
  final int year;
  final String topic;
  final String url;

  const Encyclical({
    required this.title,
    required this.latinTitle,
    required this.pope,
    required this.year,
    required this.topic,
    required this.url,
  });
}

const encyclicals = [
  Encyclical(
    title: 'On Faith and Reason',
    latinTitle: 'Fides et Ratio',
    pope: 'John Paul II',
    year: 1998,
    topic: 'Philosophy',
    url:
        'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091998_fides-et-ratio.html',
  ),
  Encyclical(
    title: 'The Gospel of Life',
    latinTitle: 'Evangelium Vitae',
    pope: 'John Paul II',
    year: 1995,
    topic: 'Pro-Life',
    url:
        'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_25031995_evangelium-vitae.html',
  ),
  Encyclical(
    title: 'The Splendor of Truth',
    latinTitle: 'Veritatis Splendor',
    pope: 'John Paul II',
    year: 1993,
    topic: 'Moral Theology',
    url:
        'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_06081993_veritatis-splendor.html',
  ),
  Encyclical(
    title: 'On Human Work',
    latinTitle: 'Laborem Exercens',
    pope: 'John Paul II',
    year: 1981,
    topic: 'Social Teaching',
    url:
        'https://www.vatican.va/content/john-paul-ii/en/encyclicals/documents/hf_jp-ii_enc_14091981_laborem-exercens.html',
  ),
  Encyclical(
    title: 'On Human Life',
    latinTitle: 'Humanae Vitae',
    pope: 'Paul VI',
    year: 1968,
    topic: 'Marriage & Family',
    url:
        'https://www.vatican.va/content/paul-vi/en/encyclicals/documents/hf_p-vi_enc_25071968_humanae-vitae.html',
  ),
  Encyclical(
    title: 'Mother and Teacher',
    latinTitle: 'Mater et Magistra',
    pope: 'John XXIII',
    year: 1961,
    topic: 'Social Teaching',
    url:
        'https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_15051961_mater.html',
  ),
  Encyclical(
    title: 'Peace on Earth',
    latinTitle: 'Pacem in Terris',
    pope: 'John XXIII',
    year: 1963,
    topic: 'Peace & Rights',
    url:
        'https://www.vatican.va/content/john-xxiii/en/encyclicals/documents/hf_j-xxiii_enc_11041963_pacem.html',
  ),
  Encyclical(
    title: 'God is Love',
    latinTitle: 'Deus Caritas Est',
    pope: 'Benedict XVI',
    year: 2005,
    topic: 'Love & Charity',
    url:
        'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20051225_deus-caritas-est.html',
  ),
  Encyclical(
    title: 'In Hope We Were Saved',
    latinTitle: 'Spe Salvi',
    pope: 'Benedict XVI',
    year: 2007,
    topic: 'Hope',
    url:
        'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20071130_spe-salvi.html',
  ),
  Encyclical(
    title: 'Charity in Truth',
    latinTitle: 'Caritas in Veritate',
    pope: 'Benedict XVI',
    year: 2009,
    topic: 'Social Teaching',
    url:
        'https://www.vatican.va/content/benedict-xvi/en/encyclicals/documents/hf_ben-xvi_enc_20090629_caritas-in-veritate.html',
  ),
  Encyclical(
    title: 'The Joy of the Gospel',
    latinTitle: 'Evangelii Gaudium',
    pope: 'Francis',
    year: 2013,
    topic: 'Evangelization',
    url:
        'https://www.vatican.va/content/francesco/en/apost_exhortations/documents/papa-francesco_esortazione-ap_20131124_evangelii-gaudium.html',
  ),
  Encyclical(
    title: 'On Care for Our Common Home',
    latinTitle: 'Laudato Si\'',
    pope: 'Francis',
    year: 2015,
    topic: 'Environment',
    url:
        'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20150524_enciclica-laudato-si.html',
  ),
  Encyclical(
    title: 'On Fraternity',
    latinTitle: 'Fratelli Tutti',
    pope: 'Francis',
    year: 2020,
    topic: 'Fraternity',
    url:
        'https://www.vatican.va/content/francesco/en/encyclicals/documents/papa-francesco_20201003_enciclica-fratelli-tutti.html',
  ),
];
