import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../repositories/memorial_repository.dart';
import '../../../core/widgets/sacred_pause_overlay.dart';
import '../../../core/constants/sacred_copy.dart';
import 'package:lucide_icons/lucide_icons.dart';

class CreateMemorialScreen extends ConsumerStatefulWidget {
  const CreateMemorialScreen({super.key});

  @override
  ConsumerState<CreateMemorialScreen> createState() =>
      _CreateMemorialScreenState();
}

class _CreateMemorialScreenState extends ConsumerState<CreateMemorialScreen> {
  final _formKey = GlobalKey<FormState>();

  // Form Fields
  String _firstName = '';
  String _lastName = '';
  DateTime? _birthDate;
  DateTime? _deathDate;
  String _shortBio = '';
  String _biography = '';
  bool _isLoading = false;

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();

    setState(() => _isLoading = true);

    try {
      // Basic slug generation
      final slug =
          '$_firstName-$_lastName-${DateTime.now().millisecondsSinceEpoch}'
              .toLowerCase()
              .replaceAll(' ', '-');

      await ref.read(memorialRepositoryProvider).createMemorial({
        'slug': slug,
        'first_name': _firstName,
        'last_name': _lastName,
        'birth_date': _birthDate?.toIso8601String(),
        'death_date': _deathDate?.toIso8601String(),
        'short_bio': _shortBio,
        'biography': _biography,
        'tier': 'BASIC',
        'is_verified': false,
      });

      if (mounted) {
        // Trigger Sacred Pause
        await SacredPauseOverlay.show(
          context,
          message: SacredCopy.system.processing,
          subtitle: 'Memorial created with love.',
          icon: LucideIcons.heart,
        );
        if (mounted) Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: Colors.red),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _selectDate(BuildContext context, bool isBirth) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        if (isBirth) {
          _birthDate = picked;
        } else {
          _deathDate = picked;
        }
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text(
          'Create Memorial',
          style: GoogleFonts.merriweather(color: Colors.black87),
        ),
        backgroundColor: Colors.white,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(20, 20, 20, 120),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Basic Information',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueGrey.shade800,
                ),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: TextFormField(
                      style: GoogleFonts.inter(color: Colors.black87),
                      decoration: const InputDecoration(
                        labelText: 'First Name',
                        border: OutlineInputBorder(),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                      onSaved: (v) => _firstName = v!,
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: TextFormField(
                      style: GoogleFonts.inter(color: Colors.black87),
                      decoration: const InputDecoration(
                        labelText: 'Last Name',
                        border: OutlineInputBorder(),
                        filled: true,
                        fillColor: Colors.white,
                      ),
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                      onSaved: (v) => _lastName = v!,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _selectDate(context, true),
                      icon: const Icon(LucideIcons.calendar),
                      label: Text(
                        _birthDate == null
                            ? 'Birth Date'
                            : '${_birthDate!.year}-${_birthDate!.month}-${_birthDate!.day}',
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _selectDate(context, false),
                      icon: const Icon(LucideIcons.calendar),
                      label: Text(
                        _deathDate == null
                            ? 'Death Date'
                            : '${_deathDate!.year}-${_deathDate!.month}-${_deathDate!.day}',
                      ),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 32),

              Text(
                'Biography',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.blueGrey.shade800,
                ),
              ),
              const SizedBox(height: 8),
              TextFormField(
                style: GoogleFonts.inter(color: Colors.black87),
                decoration: const InputDecoration(
                  labelText: 'Short Bio (appears in list)',
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white,
                  helperText: 'One or two sentences summarizing their life.',
                ),
                maxLength: 150,
                validator: (v) => v!.isEmpty ? 'Required' : null,
                onSaved: (v) => _shortBio = v!,
              ),
              const SizedBox(height: 16),
              TextFormField(
                style: GoogleFonts.inter(color: Colors.black87),
                decoration: const InputDecoration(
                  labelText: 'Full Biography',
                  border: OutlineInputBorder(),
                  filled: true,
                  fillColor: Colors.white,
                  alignLabelWithHint: true,
                ),
                maxLines: 8,
                validator: (v) => v!.isEmpty ? 'Required' : null,
                onSaved: (v) => _biography = v!,
              ),

              const SizedBox(height: 40),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.amber.shade700,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(color: Colors.white),
                        )
                      : const Text('Create Memorial'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
