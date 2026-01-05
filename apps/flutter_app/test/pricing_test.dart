import 'package:flutter_test/flutter_test.dart';
import 'package:myprayertower_app/core/services/config_service.dart';
import 'package:myprayertower_app/core/services/donation_service.dart';

void main() {
  group('DonationTier', () {
    test('defaults returns 6 tiers', () {
      final tiers = DonationTier.defaults();
      expect(tiers.length, 6);
    });

    test('defaults are in ascending order by amount', () {
      final tiers = DonationTier.defaults();
      for (int i = 1; i < tiers.length; i++) {
        expect(tiers[i].amount, greaterThan(tiers[i - 1].amount));
      }
    });

    test('popular tier exists', () {
      final tiers = DonationTier.defaults();
      final popularTier = tiers.where((t) => t.isPopular).toList();
      expect(popularTier.length, 1);
      expect(popularTier.first.name, 'Supporter');
    });
  });

  group('AppConfig', () {
    test('defaults have correct pricing', () {
      final config = AppConfig.defaults();

      // Prices are in cents
      expect(config.massRegularPrice, 1500);
      expect(config.massExpeditedPrice, 2000);
      expect(config.candleThreeDayPrice, 300);
      expect(config.massPerpetualPrice, 10000);
    });

    test('fromJson parses correctly', () {
      final json = {
        'massRegularPrice': 2000,
        'massExpeditedPrice': 3000,
        'candleThreeDayPrice': 500,
        'massPerpetualPrice': 15000,
        'maintenanceMode': true,
      };

      final config = AppConfig.fromJson(json);

      expect(config.massRegularPrice, 2000);
      expect(config.massExpeditedPrice, 3000);
      expect(config.candleThreeDayPrice, 500);
      expect(config.massPerpetualPrice, 15000);
      expect(config.maintenanceMode, true);
    });

    test('fromJson uses defaults for missing fields', () {
      final json = <String, dynamic>{};

      final config = AppConfig.fromJson(json);

      expect(config.massRegularPrice, 1500);
      expect(config.maintenanceMode, false);
    });
  });

  group('Donation Model', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 'donation-1',
        'userId': 'user-1',
        'amount': 50.0,
        'type': 'one_time',
        'status': 'completed',
        'paymentId': 'pay-123',
        'intention': 'For my family',
        'createdAt': '2024-01-15T10:30:00Z',
      };

      final donation = Donation.fromJson(json);

      expect(donation.id, 'donation-1');
      expect(donation.userId, 'user-1');
      expect(donation.amount, 50.0);
      expect(donation.type, 'one_time');
      expect(donation.status, 'completed');
      expect(donation.paymentId, 'pay-123');
      expect(donation.intention, 'For my family');
    });
  });

  group('MassOffering Model', () {
    test('fromJson parses correctly', () {
      final json = {
        'id': 'mass-1',
        'userId': 'user-1',
        'type': 'EXPEDITED',
        'amount': 25.0,
        'intention': 'For the deceased',
        'recipientName': 'John Smith',
        'status': 'pending',
        'createdAt': '2024-01-15T10:30:00Z',
      };

      final offering = MassOffering.fromJson(json);

      expect(offering.id, 'mass-1');
      expect(offering.type, 'EXPEDITED');
      expect(offering.amount, 25.0);
      expect(offering.intention, 'For the deceased');
      expect(offering.recipientName, 'John Smith');
    });
  });

  group('VirtualCandle Model', () {
    test('isActive returns true for future expiry', () {
      final json = {
        'id': 'candle-1',
        'userId': 'user-1',
        'type': 'novena',
        'amount': 7.0,
        'intention': 'For healing',
        'expiresAt': DateTime.now()
            .add(const Duration(days: 9))
            .toIso8601String(),
        'createdAt': '2024-01-15T10:30:00Z',
      };

      final candle = VirtualCandle.fromJson(json);
      expect(candle.isActive, true);
    });

    test('isActive returns false for past expiry', () {
      final json = {
        'id': 'candle-1',
        'userId': 'user-1',
        'type': 'vigil',
        'amount': 3.0,
        'intention': 'For peace',
        'expiresAt': DateTime.now()
            .subtract(const Duration(days: 1))
            .toIso8601String(),
        'createdAt': '2024-01-01T10:30:00Z',
      };

      final candle = VirtualCandle.fromJson(json);
      expect(candle.isActive, false);
    });
  });
}
