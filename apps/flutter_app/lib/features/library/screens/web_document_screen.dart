import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:lucide_icons/lucide_icons.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../core/theme/app_theme.dart';

class WebDocumentScreen extends StatefulWidget {
  final String title;
  final String url;

  const WebDocumentScreen({super.key, required this.title, required this.url});

  @override
  State<WebDocumentScreen> createState() => _WebDocumentScreenState();
}

class _WebDocumentScreenState extends State<WebDocumentScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(AppTheme.sacredNavy950)
      ..setNavigationDelegate(
        NavigationDelegate(
          onPageStarted: (_) => setState(() => _isLoading = true),
          onPageFinished: (_) => setState(() => _isLoading = false),
          onWebResourceError: (error) =>
              debugPrint('Web Error: ${error.description}'),
        ),
      )
      ..loadRequest(Uri.parse(widget.url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          widget.title,
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: AppTheme.sacredNavy900,
        leading: IconButton(
          icon: const Icon(LucideIcons.arrowLeft, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        actions: [
          IconButton(
            icon: const Icon(LucideIcons.rotateCw, color: Colors.white),
            onPressed: () => _controller.reload(),
          ),
        ],
      ),
      body: Stack(
        children: [
          WebViewWidget(controller: _controller),
          if (_isLoading)
            const Center(
              child: CircularProgressIndicator(color: AppTheme.gold500),
            ),
        ],
      ),
    );
  }
}
