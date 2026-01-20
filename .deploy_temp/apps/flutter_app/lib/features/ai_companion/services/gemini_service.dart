import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

/// Service for AI Spiritual Companion using Gemini API via HTTP
class GeminiService {
  static const String _apiKey = 'AIzaSyD-lsJvayICRhLMDFi5Ftq-XkkwwFUJgMs';
  static const String _baseUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  static const String _systemPrompt = '''
You are a helpful Catholic spiritual guide named "Guardian Angel". Your role is to:

1. Answer questions about Catholic faith, doctrine, and practice
2. Suggest appropriate prayers for different situations
3. Provide comfort and spiritual guidance
4. Quote saints and scripture when relevant
5. Recommend devotions like novenas, rosary, or chaplets
6. Explain Church teachings with charity and clarity

Guidelines:
- Always be charitable, patient, and understanding
- Stay faithful to Catholic teaching (Catechism, Magisterium)
- When discussing moral issues, present Church teaching clearly but compassionately
- Encourage regular prayer, sacraments, and spiritual growth
- If unsure about something, recommend consulting a priest
- Use appropriate Catholic terminology
- Keep responses concise but helpful (2-3 paragraphs max)
- End responses with a brief prayer or blessing when appropriate

Do NOT:
- Give medical, legal, or professional advice
- Replace the sacrament of Confession
- Claim to speak with divine authority
- Discuss controversial political topics
''';

  Future<String> sendMessage(String userMessage) async {
    try {
      final response = await http.post(
        Uri.parse('$_baseUrl?key=$_apiKey'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'contents': [
            {
              'parts': [
                {'text': '$_systemPrompt\n\nUser: $userMessage'},
              ],
            },
          ],
          'generationConfig': {'temperature': 0.7, 'maxOutputTokens': 1024},
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        final text = data['candidates']?[0]?['content']?['parts']?[0]?['text'];
        return text ??
            'I apologize, but I could not generate a response. Please try again.';
      } else {
        debugPrint(
          'Gemini API error: ${response.statusCode} - ${response.body}',
        );
        return 'I\'m sorry, I encountered an error. Please try again later.';
      }
    } catch (e) {
      debugPrint('Gemini error: $e');
      return 'I\'m sorry, I encountered a connection error. Please check your internet and try again.';
    }
  }

  Future<String> getGreeting() async {
    return sendMessage(
      'Give me a brief encouraging Catholic greeting for today.',
    );
  }

  Future<String> suggestPrayer(String situation) async {
    return sendMessage('Suggest a Catholic prayer for: $situation');
  }

  Future<String> explainTopic(String topic) async {
    return sendMessage('Explain this Catholic topic briefly: $topic');
  }
}
