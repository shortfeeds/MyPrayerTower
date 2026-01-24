import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/testimony_model.dart';

// State class
class TestimoniesState {
  final List<Testimony> testimonies;
  final List<String> categories;
  final String selectedCategory; // 'All' for no filter
  final bool isLoading;

  TestimoniesState({
    required this.testimonies,
    this.categories = const [
      'All',
      'Healing',
      'Faith',
      'Gratitude',
      'Family',
      'Guidance',
    ],
    this.selectedCategory = 'All',
    this.isLoading = false,
  });

  TestimoniesState copyWith({
    List<Testimony>? testimonies,
    List<String>? categories,
    String? selectedCategory,
    bool? isLoading,
  }) {
    return TestimoniesState(
      testimonies: testimonies ?? this.testimonies,
      categories: categories ?? this.categories,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      isLoading: isLoading ?? this.isLoading,
    );
  }

  List<Testimony> get filteredTestimonies {
    if (selectedCategory == 'All') return testimonies;
    return testimonies.where((t) => t.category == selectedCategory).toList();
  }

  List<Testimony> get featuredTestimonies {
    return testimonies.where((t) => t.isFeatured).toList();
  }
}

// Provider
final testimoniesProvider =
    StateNotifierProvider<TestimoniesController, TestimoniesState>((ref) {
      return TestimoniesController();
    });

class TestimoniesController extends StateNotifier<TestimoniesState> {
  TestimoniesController() : super(TestimoniesState(testimonies: _initialData));

  void selectCategory(String category) {
    state = state.copyWith(selectedCategory: category);
  }

  void toggleAmen(String id) {
    final updatedList = state.testimonies.map((t) {
      if (t.id == id) {
        final newIsLiked = !t.isLiked;
        return t.copyWith(
          isLiked: newIsLiked,
          amenCount: t.amenCount + (newIsLiked ? 1 : -1),
        );
      }
      return t;
    }).toList();
    state = state.copyWith(testimonies: updatedList);
  }

  void addTestimony(Testimony testimony) {
    state = state.copyWith(testimonies: [testimony, ...state.testimonies]);
  }

  // Mock Initial Data
  static final List<Testimony> _initialData = [
    Testimony(
      id: '1',
      author: 'Maria Sanchez',
      location: 'Madrid, Spain',
      content:
          'I was struggling with anxiety for months. After joining a prayer group here, I felt a peace I cannot explain. God is so good!',
      category: 'Healing',
      date: DateTime.now().subtract(const Duration(days: 2)),
      amenCount: 124,
      isFeatured: true,
      avatarUrl:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
    ),
    Testimony(
      id: '2',
      author: 'John Doe',
      location: 'New York, USA',
      content:
          'The daily rosary feature helped me reconnect with my faith after 10 years away from the church.',
      category: 'Faith',
      date: DateTime.now().subtract(const Duration(days: 5)),
      amenCount: 89,
    ),
    Testimony(
      id: '3',
      author: 'Sarah Jenkins',
      location: 'Sydney, Australia',
      content:
          'My husband finally found a job after we prayed the Novena to St. Joseph together. Thank you for this community!',
      category: 'Family',
      date: DateTime.now().subtract(const Duration(days: 12)),
      amenCount: 256,
      avatarUrl:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    ),
    Testimony(
      id: '4',
      author: 'David Kim',
      location: 'Seoul, South Korea',
      content:
          'I felt lost in my career path. The daily scripture readings gave me the clarity I needed to make a bold move.',
      category: 'Guidance',
      date: DateTime.now().subtract(const Duration(days: 1)),
      amenCount: 45,
    ),
    Testimony(
      id: '5',
      author: 'Emily White',
      location: 'London, UK',
      content:
          'So grateful for the candle lighting feature. It helps me feel close to my late grandmother.',
      category: 'Gratitude',
      date: DateTime.now().subtract(const Duration(days: 20)),
      amenCount: 312,
      isFeatured: true,
      avatarUrl:
          'https://images.unsplash.com/photo-1554151228-14d9def656ec?q=80&w=200',
    ),
  ];
}
