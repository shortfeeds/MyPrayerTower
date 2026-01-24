import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../providers/testimonies_provider.dart';
import '../models/testimony_model.dart';

class ShareStoryScreen extends ConsumerStatefulWidget {
  const ShareStoryScreen({super.key});

  @override
  ConsumerState<ShareStoryScreen> createState() => _ShareStoryScreenState();
}

class _ShareStoryScreenState extends ConsumerState<ShareStoryScreen> {
  final _formKey = GlobalKey<FormState>();
  final _contentController = TextEditingController();
  final _locationController = TextEditingController();
  String _selectedCategory = 'Faith';
  bool _isAnonymous = false;
  bool _isSubmitting = false;

  final List<String> _categories = [
    'Faith',
    'Healing',
    'Gratitude',
    'Family',
    'Guidance',
  ];

  @override
  void dispose() {
    _contentController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isSubmitting = true);

    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));

    if (!mounted) return;

    final newTestimony = Testimony(
      id: DateTime.now().toString(),
      author: _isAnonymous ? 'Anonymous' : 'You', // In real app, get from User
      location: _locationController.text,
      content: _contentController.text,
      category: _selectedCategory,
      date: DateTime.now(),
      amenCount: 0,
    );

    ref.read(testimoniesProvider.notifier).addTestimony(newTestimony);

    if (!mounted) return;

    // Show success overlay
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: AppTheme.sacredNavy800,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: AppTheme.gold500),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(
                LucideIcons.checkCircle,
                color: AppTheme.gold500,
                size: 64,
              ),
              const SizedBox(height: 16),
              Text(
                'Story Shared!',
                style: GoogleFonts.merriweather(
                  fontWeight: FontWeight.bold,
                  fontSize: 24,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                'Thank you for inspiring our community.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(color: Colors.white70),
              ),
              const SizedBox(height: 24),
              FilledButton(
                onPressed: () {
                  Navigator.pop(context); // Close dialog
                  Navigator.pop(context); // Close screen
                },
                style: FilledButton.styleFrom(
                  backgroundColor: AppTheme.gold500,
                  foregroundColor: Colors.black,
                ),
                child: const Text('Return to Community'),
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.x, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Share Your Story',
          style: GoogleFonts.merriweather(color: Colors.white),
        ),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Your testimony can be the light someone else needs today.',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    color: Colors.white70,
                    height: 1.5,
                  ),
                ),
                const SizedBox(height: 32),

                // Category
                Text('Category', style: _labelStyle),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 12,
                  runSpacing: 12,
                  children: _categories.map((category) {
                    final isSelected = category == _selectedCategory;
                    return ChoiceChip(
                      label: Text(category),
                      selected: isSelected,
                      onSelected: (selected) {
                        setState(() => _selectedCategory = category);
                      },
                      selectedColor: AppTheme.gold500,
                      backgroundColor: AppTheme.sacredNavy800,
                      labelStyle: TextStyle(
                        color: isSelected ? Colors.black : Colors.white70,
                        fontWeight: FontWeight.bold,
                      ),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: BorderSide(
                          color: isSelected ? AppTheme.gold500 : Colors.white12,
                        ),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 24),

                // Content
                Text('Your Story', style: _labelStyle),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _contentController,
                  maxLines: 8,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDecoration('Share your experience...'),
                  validator: (value) {
                    if (value == null || value.length < 20) {
                      return 'Please describe your story in at least 20 characters';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Location
                Text('Location', style: _labelStyle),
                const SizedBox(height: 12),
                TextFormField(
                  controller: _locationController,
                  style: const TextStyle(color: Colors.white),
                  decoration: _inputDecoration('e.g. London, UK'),
                  validator: (value) {
                    if (value == null || value.isEmpty) {
                      return 'Please enter your location';
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 24),

                // Anonymous Toggle
                SwitchListTile(
                  contentPadding: EdgeInsets.zero,
                  activeColor: AppTheme.gold500,
                  title: Text('Post Anonymously', style: _labelStyle),
                  subtitle: const Text(
                    'Your name will be hidden from the public',
                    style: TextStyle(color: Colors.white38, fontSize: 12),
                  ),
                  value: _isAnonymous,
                  onChanged: (val) => setState(() => _isAnonymous = val),
                ),

                const SizedBox(height: 48),

                // Submit Button
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: FilledButton(
                    onPressed: _isSubmitting ? null : _submit,
                    style: FilledButton.styleFrom(
                      backgroundColor: AppTheme.gold500,
                      foregroundColor: Colors.black,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                    child: _isSubmitting
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              color: Colors.black,
                              strokeWidth: 2,
                            ),
                          )
                        : Text(
                            'Post Testimony',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  TextStyle get _labelStyle => GoogleFonts.merriweather(
    fontSize: 16,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  );

  InputDecoration _inputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white24),
      filled: true,
      fillColor: AppTheme.sacredNavy800,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Colors.white10),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: AppTheme.gold500),
      ),
    );
  }
}
