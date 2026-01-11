import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart'; // Standard testing utility
import 'package:myprayertower_app/features/payments/screens/paypal_screen.dart';

void main() {
  testWidgets('PayPalScreen initializes payment flow correctly', (
    WidgetTester tester,
  ) async {
    // defined request log
    final requests = <http.Request>[];

    // Create a mock client that handles requests
    final mockClient = MockClient((request) async {
      requests.add(request);
      final url = request.url.toString();

      if (url.contains('oauth2/token')) {
        return http.Response(
          jsonEncode({
            'access_token': 'TEST_TOKEN_123',
            'token_type': 'Bearer',
          }),
          200,
        );
      }

      if (url.contains('checkout/orders') && request.method == 'POST') {
        if (url.endsWith('capture')) {
          return http.Response(
            jsonEncode({'id': 'ORDER_ID_123', 'status': 'COMPLETED'}),
            201,
          );
        }
        return http.Response(
          jsonEncode({
            'id': 'ORDER_ID_123',
            'status': 'CREATED',
            'links': [
              {'rel': 'approve', 'href': 'https://approval.url'},
            ],
          }),
          201,
        );
      }

      return http.Response('Not Found', 404);
    });

    await tester.pumpWidget(
      MaterialApp(
        home: PayPalScreen(
          clientId: 'test_client_id',
          secretKey: 'test_secret',
          amount: 10.0,
          currency: 'USD',
          description: 'Test Donation',
          onSuccess: (_) {},
          onError: (_) {},
          onCancel: () {},
          httpClient: mockClient,
        ),
      ),
    );

    // Initial state should be loading
    expect(find.byType(CircularProgressIndicator), findsOneWidget);

    // Allow Future chaining to proceed
    await tester.pump();

    // Verify Access Token Call
    expect(
      requests.any(
        (r) =>
            r.url.path.contains('oauth2/token') &&
            r.headers['Authorization']!.contains('Basic'),
      ),
      isTrue,
      reason: 'Should request access token',
    );

    // Verify Order Creation Call
    expect(
      requests.any(
        (r) =>
            r.url.path.contains('checkout/orders') &&
            !r.url.path.endsWith('capture') &&
            r.headers['Authorization'] == 'Bearer TEST_TOKEN_123',
      ),
      isTrue,
      reason: 'Should create order with token',
    );
  });
}
