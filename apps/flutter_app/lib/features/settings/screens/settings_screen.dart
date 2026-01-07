import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';
import '../../../widgets/app_bar_menu_button.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

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
          'Settings',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildSection('Preferences', [
            _SettingsTile(
              icon: LucideIcons.bell,
              title: 'Notifications',
              subtitle: 'Manage prayer reminders',
              onTap: () {},
            ),
            const _SettingsTile(
              icon: LucideIcons.moon,
              title: 'Dark Mode',
              subtitle: 'Always enabled',
              trailing: Switch(
                value: true,
                onChanged: null,
                activeColor: AppTheme.gold500,
              ),
            ),
            _SettingsTile(
              icon: LucideIcons.globe,
              title: 'Language',
              subtitle: 'English',
              onTap: () {},
            ),
          ]),
          const SizedBox(height: 24),
          _buildSection('About', [
            _SettingsTile(
              icon: LucideIcons.info,
              title: 'About My Prayer Tower',
              subtitle: 'Version 1.0.0',
              onTap: () => _showAboutDialog(context),
            ),
            _SettingsTile(
              icon: LucideIcons.fileText,
              title: 'Terms of Service',
              subtitle: 'Read our terms',
              onTap: () {},
            ),
            _SettingsTile(
              icon: LucideIcons.shield,
              title: 'Privacy Policy',
              subtitle: 'How we protect your data',
              onTap: () {},
            ),
          ]),
          const SizedBox(height: 24),
          _buildSection('Support', [
            _SettingsTile(
              icon: LucideIcons.helpCircle,
              title: 'Help & FAQ',
              subtitle: 'Get help with the app',
              onTap: () {},
            ),
            _SettingsTile(
              icon: LucideIcons.mail,
              title: 'Contact Us',
              subtitle: 'support@myprayertower.com',
              onTap: () {},
            ),
          ]),
        ],
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 12),
          child: Text(
            title.toUpperCase(),
            style: GoogleFonts.inter(
              color: AppTheme.gold500,
              fontSize: 12,
              fontWeight: FontWeight.w600,
              letterSpacing: 1.2,
            ),
          ),
        ),
        Container(
          decoration: BoxDecoration(
            color: AppTheme.darkCard,
            borderRadius: BorderRadius.circular(16),
          ),
          child: Column(children: children),
        ),
      ],
    );
  }

  void _showAboutDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        backgroundColor: AppTheme.sacredNavy900,
        title: Text(
          'My Prayer Tower',
          style: GoogleFonts.merriweather(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        content: Text(
          'Your companion for Catholic prayer and spiritual growth.\n\nVersion 1.0.0\n© 2026 MyPrayerTower',
          style: GoogleFonts.inter(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('OK', style: TextStyle(color: AppTheme.gold500)),
          ),
        ],
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback? onTap;
  final Widget? trailing;

  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    this.onTap,
    this.trailing,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: AppTheme.gold500.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: AppTheme.gold500, size: 20),
      ),
      title: Text(
        title,
        style: GoogleFonts.inter(
          color: Colors.white,
          fontWeight: FontWeight.w500,
        ),
      ),
      subtitle: Text(
        subtitle,
        style: GoogleFonts.inter(color: Colors.white54, fontSize: 12),
      ),
      trailing:
          trailing ??
          const Icon(LucideIcons.chevronRight, color: Colors.white38, size: 18),
      onTap: onTap,
    );
  }
}
