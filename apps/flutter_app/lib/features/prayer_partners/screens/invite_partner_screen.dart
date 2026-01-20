import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/prayer_partner_provider.dart';

class InvitePartnerScreen extends ConsumerStatefulWidget {
  const InvitePartnerScreen({super.key});

  @override
  ConsumerState<InvitePartnerScreen> createState() =>
      _InvitePartnerScreenState();
}

class _InvitePartnerScreenState extends ConsumerState<InvitePartnerScreen> {
  final _emailController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    final controller = ref.read(prayerPartnerControllerProvider.notifier);
    await controller.invitePartner(_emailController.text.trim());

    if (!mounted) return;

    final state = ref.read(prayerPartnerControllerProvider);
    if (state.hasError) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error: ${state.error}')));
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Invitation sent!')));
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(prayerPartnerControllerProvider);
    final isLoading = state.isLoading;

    return Scaffold(
      appBar: AppBar(title: const Text('Invite Prayer Partner')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const Text(
                'Enter the email address of the person you want to invite to be your prayer partner.',
                style: TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 24),
              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Email Address',
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.email),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return 'Please enter an email';
                  }
                  if (!value.contains('@')) {
                    return 'Please enter a valid email';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                child: FilledButton(
                  onPressed: isLoading ? null : _submit,
                  child: isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Text('Send Invitation'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
