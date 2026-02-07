import 'dart:core';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:url_launcher/url_launcher.dart';

class PayPalScreen extends StatefulWidget {
  final String clientId;
  final String secretKey;
  final String currency;
  final double amount;
  final String description;
  final String? userEmail;
  final Function(String) onSuccess;
  final Function(String) onError;
  final VoidCallback onCancel;
  final http.Client? httpClient;

  const PayPalScreen({
    super.key,
    required this.clientId,
    required this.secretKey,
    required this.currency,
    required this.amount,
    required this.description,
    this.userEmail,
    required this.onSuccess,
    required this.onError,
    required this.onCancel,
    this.httpClient,
  });

  @override
  State<PayPalScreen> createState() => _PayPalScreenState();
}

class _PayPalScreenState extends State<PayPalScreen> {
  late final WebViewController _controller;
  String? checkoutUrl;
  String? accessToken;
  bool isLoading = true;
  String errorMessage = '';

  // PayPal URLs - using api-m.paypal.com for v2 API
  final String _baseUrl = 'https://api-m.paypal.com';

  @override
  void initState() {
    super.initState();
    debugPrint(
      'PayPal: Initializing payment for \$${widget.amount} ${widget.currency}',
    );

    if (kIsWeb) {
      debugPrint(
        'PayPal WARNING: Running on Web. Direct PayPal API calls from browser may fail due to CORS.',
      );
    }

    _initPayment();
  }

  @override
  void dispose() {
    super.dispose();
  }

  Future<void> _initPayment() async {
    try {
      accessToken = await _getAccessToken();
      final urls = await _createOrder();

      if (urls != null) {
        debugPrint(
          'PayPal: Order created successfully, loading approval URL: ${urls['approval_url']}',
        );

        if (kIsWeb) {
          // Web: Initialize controller without mobile-specific settings
          _controller = WebViewController();
          _controller.loadRequest(Uri.parse(urls['approval_url']!));

          setState(() {
            checkoutUrl = urls['approval_url'];
            isLoading = false;
          });
        } else {
          // Mobile Flow: WebView with navigation delegates
          _controller = WebViewController()
            ..setJavaScriptMode(JavaScriptMode.unrestricted)
            ..setNavigationDelegate(
              NavigationDelegate(
                onPageStarted: (url) =>
                    debugPrint('PayPal: Page started loading: $url'),
                onPageFinished: (url) {
                  debugPrint('PayPal: Page finished loading: $url');
                },
                onNavigationRequest: (NavigationRequest request) {
                  debugPrint('PayPal: Navigation request to: ${request.url}');
                  if (request.url.contains('payment-success') ||
                      request.url.contains('return_url')) {
                    debugPrint(
                      'PayPal: Return URL detected, capturing order...',
                    );
                    final uri = Uri.parse(request.url);
                    final token = uri.queryParameters['token'];
                    if (token != null) {
                      _captureOrder(token);
                    }
                    return NavigationDecision.prevent;
                  }
                  if (request.url.contains('payment-cancelled') ||
                      request.url.contains('cancel_url')) {
                    debugPrint('PayPal: Cancel URL detected');
                    widget.onCancel();
                    Navigator.of(context).pop();
                    return NavigationDecision.prevent;
                  }
                  return NavigationDecision.navigate;
                },
              ),
            )
            ..loadRequest(Uri.parse(urls['approval_url']!));

          setState(() {
            checkoutUrl = urls['approval_url'];
            isLoading = false;
          });
        }
      }
    } catch (e) {
      debugPrint('PayPal: Initialization Error: $e');
      setState(() {
        errorMessage = e.toString();
        isLoading = false;
      });
      if (!kIsWeb && mounted) {
        widget.onError(e.toString());
        Navigator.of(context).pop();
      }
    }
  }

  Future<String> _getAccessToken() async {
    try {
      debugPrint('PayPal: Requesting access token...');
      final authString = '${widget.clientId}:${widget.secretKey}';
      final token = base64Encode(utf8.encode(authString));

      final client = widget.httpClient ?? http.Client();
      final response = await client
          .post(
            Uri.parse('$_baseUrl/v1/oauth2/token'),
            headers: {
              'Authorization': 'Basic $token',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'grant_type=client_credentials',
          )
          .timeout(const Duration(seconds: 15));

      if (widget.httpClient == null) {
        client.close();
      }

      if (response.statusCode == 200) {
        final body = jsonDecode(response.body);
        debugPrint('PayPal: Access token received.');
        return body['access_token'];
      }

      final errorMsg = 'OAuth Error: ${response.statusCode}\n${response.body}';
      debugPrint('PayPal: $errorMsg');
      throw Exception(errorMsg);
    } catch (e) {
      if (e.toString().contains('XMLHttpRequest')) {
        throw Exception(
          'CORS Error: PayPal blocked this request from your browser. Please test on a real device/simulator or use a proxy.',
        );
      }
      debugPrint('PayPal: OAuth Catch Error: $e');
      rethrow;
    }
  }

  Future<Map<String, String>?> _createOrder() async {
    try {
      debugPrint('PayPal: Creating order...');
      final client = widget.httpClient ?? http.Client();

      final body = jsonEncode({
        "intent": "CAPTURE",
        "purchase_units": [
          {
            "amount": {
              "currency_code": widget.currency,
              "value": widget.amount.toStringAsFixed(2),
            },
            "description": widget.description,
          },
        ],
        "application_context": {
          "brand_name": "MyPrayerTower",
          "landing_page": "NO_PREFERENCE",
          "shipping_preference": "NO_SHIPPING",
          "user_action": "PAY_NOW",
          "return_url": "https://myprayertower.com/payment-success",
          "cancel_url": "https://myprayertower.com/payment-cancelled",
        },
      });

      final response = await client
          .post(
            Uri.parse('$_baseUrl/v2/checkout/orders'),
            headers: {
              'Authorization': 'Bearer $accessToken',
              'Content-Type': 'application/json',
            },
            body: body,
          )
          .timeout(const Duration(seconds: 15));

      if (widget.httpClient == null) {
        client.close();
      }

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        final links = body['links'] as List;
        String? approvalUrl;

        for (var link in links) {
          if (link['rel'] == 'approve') {
            approvalUrl = link['href'];
          }
        }

        if (approvalUrl != null) {
          debugPrint('PayPal: Order created. ID: ${body['id']}');
          return {'approval_url': approvalUrl, 'orderId': body['id']};
        }
        throw Exception('Approval URL not found in response');
      } else {
        final errorMsg =
            'Create Order Error: ${response.statusCode}\n${response.body}';
        debugPrint('PayPal: $errorMsg');
        throw Exception(errorMsg);
      }
    } catch (e) {
      debugPrint('PayPal: Create Order Catch Error: $e');
      rethrow;
    }
  }

  Future<void> _captureOrder(String token) async {
    try {
      debugPrint('PayPal: Capturing order with token: $token');
      final response = await http
          .post(
            Uri.parse('$_baseUrl/v2/checkout/orders/$token/capture'),
            headers: {
              'Authorization': 'Bearer $accessToken',
              'Content-Type': 'application/json',
            },
          )
          .timeout(const Duration(seconds: 15));

      if (response.statusCode == 200 || response.statusCode == 201) {
        final body = jsonDecode(response.body);
        debugPrint(
          'PayPal: Payment captured successfully! Status: ${body['status']}',
        );
        widget.onSuccess(body['id']);
        if (mounted) Navigator.of(context).pop();
      } else {
        final errorMsg =
            'Capture Error: ${response.statusCode}\n${response.body}';
        debugPrint('PayPal: $errorMsg');
        throw Exception(errorMsg);
      }
    } catch (e) {
      debugPrint('PayPal: Capture Catch Error: $e');
      widget.onError(e.toString());
      if (mounted) Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        backgroundColor: Colors.white,
        appBar: AppBar(
          backgroundColor: Colors.transparent,
          elevation: 0,
          leading: const CloseButton(color: Colors.black),
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (errorMessage.isNotEmpty) {
      return Scaffold(
        appBar: AppBar(title: const Text('Payment Error')),
        body: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 60, color: Colors.red),
              const SizedBox(height: 16),
              Text(
                'PayPal Integration Error',
                style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                errorMessage,
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(color: Colors.grey[700]),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () => Navigator.pop(context),
                child: const Text('Go Back'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        title: Text(
          'PayPal Checkout',
          style: GoogleFonts.inter(
            color: Colors.black,
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: Colors.white,
        elevation: 1,
        leading: CloseButton(
          color: Colors.black,
          onPressed: () {
            widget.onCancel();
            Navigator.of(context).pop();
          },
        ),
      ),
      body: Column(
        children: [
          Expanded(child: WebViewWidget(controller: _controller)),
          if (kIsWeb)
            Container(
              padding: const EdgeInsets.all(12),
              color: Colors.amber.withValues(alpha: 0.1),
              child: Row(
                children: [
                  const Expanded(
                    child: Text(
                      'If blank, PayPal blocked the view. Click here to open in new tab:',
                      style: TextStyle(fontSize: 12),
                    ),
                  ),
                  const SizedBox(width: 8),
                  ElevatedButton(
                    onPressed: () async {
                      if (checkoutUrl != null) {
                        final url = Uri.parse(checkoutUrl!);
                        if (await canLaunchUrl(url)) {
                          // Using external application as backup if embedded fails
                          await launchUrl(
                            url,
                            mode: LaunchMode.externalApplication,
                          );

                          if (context.mounted) {
                            showDialog(
                              context: context,
                              builder: (context) => AlertDialog(
                                title: const Text('Payment Status'),
                                content: const Text(
                                  'Did you complete the payment in the new tab?',
                                ),
                                actions: [
                                  TextButton(
                                    onPressed: () => Navigator.pop(context),
                                    child: const Text('No'),
                                  ),
                                  FilledButton(
                                    onPressed: () {
                                      Navigator.pop(context);
                                      widget.onCancel();
                                      Navigator.pop(context);
                                    },
                                    child: const Text('Yes, I Paid'),
                                  ),
                                ],
                              ),
                            );
                          }
                        }
                      }
                    },
                    child: const Text('Open in New Tab'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
