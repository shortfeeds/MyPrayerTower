import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';

import '../../../core/theme/app_theme.dart';
import '../providers/sacraments_provider.dart';
import '../models/sacrament_record_model.dart';
import '../widgets/premium_certificate_card.dart';
import '../../auth/providers/auth_provider.dart';

class SacramentDetailScreen extends ConsumerStatefulWidget {
  final SacramentRecord record;

  const SacramentDetailScreen({super.key, required this.record});

  @override
  ConsumerState<SacramentDetailScreen> createState() =>
      _SacramentDetailScreenState();
}

class _SacramentDetailScreenState extends ConsumerState<SacramentDetailScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late TextEditingController _churchController;
  late TextEditingController _celebrantController;
  late TextEditingController _notesController;

  // New Controllers
  late TextEditingController _godparentsController;
  late TextEditingController _witnessesController;
  late TextEditingController _confirmationNameController;

  bool _isEditing = false;
  late SacramentRecord _currentRecord;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _currentRecord = widget.record;

    _churchController = TextEditingController(text: widget.record.church ?? '');
    _celebrantController = TextEditingController(
      text: widget.record.celebrant ?? '',
    );
    _notesController = TextEditingController(text: widget.record.notes ?? '');

    // Init new controllers
    _godparentsController = TextEditingController(
      text: widget.record.godparents?.join(', ') ?? '',
    );
    _witnessesController = TextEditingController(
      text: widget.record.witnesses?.join(', ') ?? '',
    );
    _confirmationNameController = TextEditingController(
      text: widget.record.confirmationName ?? '',
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    _churchController.dispose();
    _celebrantController.dispose();
    _notesController.dispose();
    _godparentsController.dispose();
    _witnessesController.dispose();
    _confirmationNameController.dispose();
    super.dispose();
  }

  void _saveChanges() {
    final updated = _currentRecord.copyWith(
      church: _churchController.text,
      celebrant: _celebrantController.text,
      notes: _notesController.text,
      godparents: _godparentsController.text.isNotEmpty
          ? _godparentsController.text.split(',').map((e) => e.trim()).toList()
          : null,
      witnesses: _witnessesController.text.isNotEmpty
          ? _witnessesController.text.split(',').map((e) => e.trim()).toList()
          : null,
      confirmationName: _confirmationNameController.text.isNotEmpty
          ? _confirmationNameController.text
          : null,
      isCompleted: true,
    );

    ref.read(sacramentsProvider.notifier).updateRecord(updated);

    setState(() {
      _currentRecord = updated;
      _isEditing = false;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Record updated successfully')),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.deepSpace,
      appBar: AppBar(
        backgroundColor: AppTheme.sacredNavy900,
        title: Text(
          _currentRecord.name,
          style: GoogleFonts.merriweather(
            fontWeight: FontWeight.bold,
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        actions: [
          if (!_currentRecord.isCompleted && !_isEditing)
            TextButton(
              onPressed: () => setState(() => _isEditing = true),
              child: const Text(
                'Mark Complete',
                style: TextStyle(color: AppTheme.gold500),
              ),
            )
          else if (!_isEditing)
            IconButton(
              icon: const Icon(LucideIcons.edit3, color: Colors.white70),
              onPressed: () => setState(() => _isEditing = true),
            )
          else
            IconButton(
              icon: const Icon(LucideIcons.check, color: AppTheme.gold500),
              onPressed: _saveChanges,
            ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: _currentRecord.color,
          labelColor: _currentRecord.color,
          unselectedLabelColor: Colors.white54,
          tabs: [
            const Tab(text: 'Details'),
            Tab(
              text: _currentRecord.isCompleted ? 'Certificate' : 'Preparation',
            ),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildDetailsTab(),
          _currentRecord.isCompleted
              ? _buildCertificateTab()
              : _buildPreparationTab(),
        ],
      ),
    );
  }

  Widget _buildDetailsTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Center(
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: _currentRecord.color.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                _currentRecord.icon,
                size: 48,
                color: _currentRecord.color,
              ),
            ),
          ),
          const SizedBox(height: 32),

          if (_isEditing) ...[
            _buildTextField('Church / Parish', _churchController),
            const SizedBox(height: 16),
            _buildTextField('Celebrant (Priest/Bishop)', _celebrantController),
            const SizedBox(height: 16),
            // Dynamic fields based on sacrament type
            if (_currentRecord.type == SacramentType.baptism ||
                _currentRecord.type == SacramentType.confirmation) ...[
              _buildTextField(
                'Godparents/Sponsors (comma separated)',
                _godparentsController,
              ),
              const SizedBox(height: 16),
            ],
            if (_currentRecord.type == SacramentType.confirmation) ...[
              _buildTextField('Confirmation Name', _confirmationNameController),
              const SizedBox(height: 16),
            ],
            if (_currentRecord.type == SacramentType.matrimony) ...[
              _buildTextField(
                'Witnesses (comma separated)',
                _witnessesController,
              ),
              const SizedBox(height: 16),
            ],

            _buildTextField('Notes / Memories', _notesController, maxLines: 4),
          ] else ...[
            _buildInfoRow(
              'Status',
              _currentRecord.isCompleted ? 'Completed' : 'Not Completed',
            ),
            if (_currentRecord.church != null)
              _buildInfoRow('Church', _currentRecord.church!),
            if (_currentRecord.celebrant != null)
              _buildInfoRow('Celebrant', _currentRecord.celebrant!),

            if (_currentRecord.godparents != null &&
                _currentRecord.godparents!.isNotEmpty)
              _buildInfoRow(
                'Godparents',
                _currentRecord.godparents!.join(', '),
              ),

            if (_currentRecord.confirmationName != null)
              _buildInfoRow(
                'Confirmation Name',
                _currentRecord.confirmationName!,
              ),

            if (_currentRecord.witnesses != null &&
                _currentRecord.witnesses!.isNotEmpty)
              _buildInfoRow('Witnesses', _currentRecord.witnesses!.join(', ')),

            if (_currentRecord.notes != null)
              _buildInfoRow('Notes', _currentRecord.notes!, isLong: true),
          ],
        ],
      ),
    );
  }

  Widget _buildTextField(
    String label,
    TextEditingController controller, {
    int maxLines = 1,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: const TextStyle(color: Colors.white70, fontSize: 13),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          maxLines: maxLines,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.white10,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isLong = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label.toUpperCase(),
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.bold,
              color: Colors.white38,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: GoogleFonts.merriweather(
              fontSize: 16,
              color: Colors.white,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCertificateTab() {
    final user = ref.watch(authProvider).value;
    final userName = user?.name ?? 'Faithful Servant';

    return SingleChildScrollView(
      padding: const EdgeInsets.only(top: 24, bottom: 40),
      child: PremiumCertificateCard(
        record: _currentRecord,
        userName: userName,
        onDownload: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Downloading Certificate...')),
          );
        },
      ),
    );
  }

  Widget _buildPreparationTab() {
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Text(
          'How to Prepare',
          style: GoogleFonts.merriweather(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 16),
        _buildChecklistItem('Contact your local parish office'),
        _buildChecklistItem('Attend required preparation classes'),
        _buildChecklistItem('Note any specific requirements'),
        _buildChecklistItem('Schedule the date'),
      ],
    );
  }

  Widget _buildChecklistItem(String text) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: [
          const Icon(LucideIcons.circle, size: 16, color: Colors.white54),
          const SizedBox(width: 12),
          Expanded(
            child: Text(text, style: const TextStyle(color: Colors.white70)),
          ),
        ],
      ),
    );
  }
}
