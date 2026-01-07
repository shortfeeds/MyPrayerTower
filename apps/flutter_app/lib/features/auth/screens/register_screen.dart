import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../providers/auth_provider.dart';
import '../../../core/theme/app_theme.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  bool _obscurePassword = true;
  bool _agreedToTerms = false;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleRegister() async {
    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please agree to the terms and conditions'),
        ),
      );
      return;
    }

    if (_nameController.text.isEmpty ||
        _emailController.text.isEmpty ||
        _passwordController.text.isEmpty) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Please fill all fields')));
      return;
    }

    try {
      setState(() => _isLoading = true);
      await ref
          .read(authProvider.notifier)
          .register(
            _nameController.text,
            _emailController.text,
            _passwordController.text,
          );

      if (mounted) {
        context.go('/onboarding');
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(e.toString().replaceAll('Exception: ', '')),
            backgroundColor: AppTheme.error,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: Stack(
        children: [
          // Background Gradient Overlay
          Positioned.fill(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [AppTheme.sacredNavy900, AppTheme.sacredNavy950],
                ),
              ),
            ),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Title
                  Text(
                    'Create Account',
                    style: GoogleFonts.merriweather(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.gold500,
                    ),
                  ).animate().fadeIn().slideY(begin: 0.2, end: 0),

                  const SizedBox(height: 8),

                  Text(
                    'Join our prayer community',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: AppTheme.textSecondary,
                    ),
                  ).animate().fadeIn(delay: 100.ms),

                  const SizedBox(height: 32),

                  // Name field
                  _buildTextField(
                    controller: _nameController,
                    label: 'Full Name',
                    icon: LucideIcons.user,
                    textCapitalization: TextCapitalization.words,
                  ).animate().fadeIn(delay: 200.ms).slideX(begin: -0.1, end: 0),

                  const SizedBox(height: 16),

                  // Email field
                  _buildTextField(
                    controller: _emailController,
                    label: 'Email Address',
                    icon: LucideIcons.mail,
                    keyboardType: TextInputType.emailAddress,
                  ).animate().fadeIn(delay: 300.ms).slideX(begin: -0.1, end: 0),

                  const SizedBox(height: 16),

                  // Password field
                  _buildTextField(
                    controller: _passwordController,
                    label: 'Password',
                    icon: LucideIcons.lock,
                    obscureText: _obscurePassword,
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? LucideIcons.eyeOff : LucideIcons.eye,
                        color: AppTheme.textMuted,
                      ),
                      onPressed: () =>
                          setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ).animate().fadeIn(delay: 400.ms).slideX(begin: -0.1, end: 0),

                  const SizedBox(height: 24),

                  // Terms checkbox
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      SizedBox(
                        height: 24,
                        width: 24,
                        child: Checkbox(
                          value: _agreedToTerms,
                          onChanged: (value) {
                            setState(() => _agreedToTerms = value ?? false);
                          },
                          activeColor: AppTheme.gold500,
                          checkColor: Colors.black,
                          side: const BorderSide(color: AppTheme.textMuted),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: GestureDetector(
                          onTap: () =>
                              setState(() => _agreedToTerms = !_agreedToTerms),
                          child: Text.rich(
                            TextSpan(
                              text: 'I agree to the ',
                              style: GoogleFonts.inter(
                                color: AppTheme.textSecondary,
                              ),
                              children: [
                                TextSpan(
                                  text: 'Terms of Service',
                                  style: GoogleFonts.inter(
                                    color: AppTheme.gold500,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                const TextSpan(text: ' and '),
                                TextSpan(
                                  text: 'Privacy Policy',
                                  style: GoogleFonts.inter(
                                    color: AppTheme.gold500,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 500.ms),

                  const SizedBox(height: 32),

                  // Register button
                  ElevatedButton(
                    onPressed: _isLoading ? null : _handleRegister,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.gold500,
                      foregroundColor: Colors.black,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      elevation: 0,
                    ),
                    child: _isLoading
                        ? const SizedBox(
                            width: 24,
                            height: 24,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: Colors.black,
                            ),
                          )
                        : Text(
                            'Create Account',
                            style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                  ).animate().fadeIn(delay: 600.ms).scale(),

                  const SizedBox(height: 32),

                  // Login link
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Already have an account? ',
                        style: GoogleFonts.inter(color: AppTheme.textSecondary),
                      ),
                      GestureDetector(
                        onTap: () => context.push('/login'),
                        child: Text(
                          'Sign In',
                          style: GoogleFonts.inter(
                            color: AppTheme.gold500,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ],
                  ).animate().fadeIn(delay: 700.ms),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String label,
    required IconData icon,
    bool obscureText = false,
    TextInputType? keyboardType,
    TextCapitalization textCapitalization = TextCapitalization.none,
    Widget? suffixIcon,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.darkCard,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.white10),
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        keyboardType: keyboardType,
        textCapitalization: textCapitalization,
        style: GoogleFonts.inter(color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.inter(color: AppTheme.textMuted),
          prefixIcon: Icon(icon, color: AppTheme.textMuted),
          suffixIcon: suffixIcon,
          border: InputBorder.none,
          contentPadding: const EdgeInsets.symmetric(
            horizontal: 16,
            vertical: 16,
          ),
        ),
      ),
    );
  }
}
