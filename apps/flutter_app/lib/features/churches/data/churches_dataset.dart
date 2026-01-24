import '../models/church_model.dart';

class ChurchesDataset {
  static const List<Church> featuredChurches = [
    Church(
      id: '1',
      name: 'St. Patrick\'s Cathedral',
      slug: 'st-patricks-cathedral-nyc',
      address: '5th Ave',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      type: 'CATHEDRAL',
      description:
          'A Neo-Gothic-style Roman Catholic cathedral church in Manhattan.',
      primaryImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/St._Patrick%27s_Cathedral%2C_Manhattan%2C_New_York_City.jpg/800px-St._Patrick%27s_Cathedral%2C_Manhattan%2C_New_York_City.jpg',
      massSchedule: {
        'Sunday': '7:00 AM, 8:00 AM, 9:00 AM, 10:15 AM (Solemn)',
        'Weekdays': '7:00 AM, 7:30 AM, 8:00 AM',
      },
      confessionSchedule: {
        'Weekdays': 'After 8:00 AM Mass',
        'Saturday': '12:00 PM - 1:00 PM',
      },
      isVerified: true,
      viewCount: 15420,
    ),
    Church(
      id: '2',
      name: 'Basilica of the National Shrine of the Immaculate Conception',
      slug: 'basilica-national-shrine-dc',
      address: '400 Michigan Ave NE',
      city: 'Washington',
      state: 'DC',
      country: 'USA',
      type: 'BASILICA',
      description:
          'The largest Roman Catholic church in the United States and North America.',
      primaryImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Basilica_of_the_National_Shrine_of_the_Immaculate_Conception_front_view.jpg/800px-Basilica_of_the_National_Shrine_of_the_Immaculate_Conception_front_view.jpg',
      massSchedule: {'Sunday': '7:30 AM, 9:00 AM, 10:30 AM, 12:00 PM, 4:30 PM'},
      isVerified: true,
      viewCount: 12300,
    ),
    Church(
      id: '3',
      name: 'Cathedral of Our Lady of the Angels',
      slug: 'cathedral-our-lady-angels-la',
      address: '555 W Temple St',
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA',
      type: 'CATHEDRAL',
      description: 'A modern cathedral serving the Archdiocese of Los Angeles.',
      primaryImageUrl:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Cathedral_of_Our_Lady_of_the_Angels.jpg/800px-Cathedral_of_Our_Lady_of_the_Angels.jpg',
      isVerified: true,
      viewCount: 9800,
    ),
    Church(
      id: '4',
      name: 'Mission Basilica San Diego de Alcalá',
      slug: 'mission-basilica-san-diego',
      address: '10818 San Diego Mission Rd',
      city: 'San Diego',
      state: 'CA',
      country: 'USA',
      type: 'MISSION',
      description:
          'The first Franciscan mission in the Las Californias Province of the Viceroyalty of New Spain.',
      isVerified: true,
      viewCount: 8500,
    ),
    Church(
      id: '5',
      name: 'Holy Name Cathedral',
      slug: 'holy-name-cathedral-chicago',
      address: '735 N State St',
      city: 'Chicago',
      state: 'IL',
      country: 'USA',
      type: 'CATHEDRAL',
      description:
          'The seat of the Archdiocese of Chicago, one of the largest Roman Catholic dioceses in the United States.',
      isVerified: true,
      viewCount: 7900,
    ),
    // ... Add more featured if needed
  ];

  static final List<String> _commonSaintNames = [
    'Mary',
    'Joseph',
    'Peter',
    'Paul',
    'John',
    'Michael',
    'Francis',
    'Anthony',
    'Therese',
    'Patrick',
    'Augustine',
    'Jude',
    'Luke',
    'Mark',
    'Matthew',
    'Thomas',
    'Elizabeth',
    'Ann',
    'Catherine',
    'Clare',
    'Stephen',
    'James',
    'Andrew',
    'Benedict',
  ];

  static final List<String> _churchSuffixes = [
    'Catholic Church',
    'Parish',
    'Cathedral',
    'Basilica',
    'Mission',
    'Chapel',
  ];

  static final List<String> _cities = [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    'Dallas',
    'San Jose',
    'Austin',
    'Jacksonville',
    'Fort Worth',
    'Columbus',
    'San Francisco',
    'Charlotte',
    'Indianapolis',
    'Seattle',
    'Denver',
    'Washington',
    'Boston',
    'El Paso',
    'Nashville',
    'Detroit',
    'Oklahoma City',
    'Portland',
    'Las Vegas',
    'Memphis',
    'Louisville',
    'Baltimore',
    'Milwaukee',
  ];

  static List<Church> getAllChurches() {
    // Generate 8600+ churches
    final List<Church> generated = [];

    // Add featured first
    generated.addAll(featuredChurches);

    for (int i = featuredChurches.length; i < 8650; i++) {
      final saint = _commonSaintNames[i % _commonSaintNames.length];
      final suffix = _churchSuffixes[i % _churchSuffixes.length];
      final city = _cities[i % _cities.length];
      final type = suffix.toUpperCase();

      generated.add(
        Church(
          id: 'gen_$i',
          name: 'St. $saint $suffix',
          slug: 'st-$saint-$suffix-$i'.toLowerCase().replaceAll(' ', '-'),
          address: '${(i * 13) % 900 + 10} Main St',
          city: city,
          state: 'USA', // Simplified for demo
          country: 'USA',
          type: type == 'CATHOLIC CHURCH'
              ? 'PARISH'
              : type.split(' ').first.toUpperCase(),
          description: 'A simulated church entry for demonstration purposes.',
          massSchedule: {'Sunday': '9:00 AM, 11:00 AM'},
          confessionSchedule: {'Saturday': '3:00 PM - 4:00 PM'},
          isVerified: i % 5 == 0, // 20% verified
          viewCount: (8650 - i) * 2, // Arbitrary decreasing popularity
        ),
      );
    }

    return generated;
  }
}
