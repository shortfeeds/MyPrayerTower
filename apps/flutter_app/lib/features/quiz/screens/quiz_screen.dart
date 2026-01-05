import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../../core/theme/app_theme.dart';

/// Catholic Faith Quiz screen
class QuizScreen extends ConsumerStatefulWidget {
  const QuizScreen({super.key});

  @override
  ConsumerState<QuizScreen> createState() => _QuizScreenState();
}

class _QuizScreenState extends ConsumerState<QuizScreen> {
  int _currentQuestion = 0;
  int _score = 0;
  int? _selectedAnswer;
  bool _showResult = false;
  bool _quizComplete = false;

  final List<_QuizQuestion> _questions = [
    _QuizQuestion(
      question: 'How many sacraments are there in the Catholic Church?',
      options: ['5', '6', '7', '9'],
      correctIndex: 2,
      explanation:
          'The seven sacraments are: Baptism, Confirmation, Eucharist, Penance, Anointing of the Sick, Holy Orders, and Matrimony.',
    ),
    _QuizQuestion(
      question: 'Who was the first Pope?',
      options: ['St. Paul', 'St. Peter', 'St. John', 'St. James'],
      correctIndex: 1,
      explanation:
          'Jesus appointed St. Peter as the first Pope, saying "You are Peter, and on this rock I will build my church." (Matthew 16:18)',
    ),
    _QuizQuestion(
      question: 'What are the three theological virtues?',
      options: [
        'Prudence, Justice, Fortitude',
        'Faith, Hope, Charity',
        'Humility, Patience, Kindness',
        'Wisdom, Understanding, Counsel',
      ],
      correctIndex: 1,
      explanation:
          'Faith, Hope, and Charity (Love) are the three theological virtues that relate directly to God.',
    ),
    _QuizQuestion(
      question: 'What is the Immaculate Conception?',
      options: [
        'The virgin birth of Jesus',
        'Mary being conceived without original sin',
        'The Resurrection of Jesus',
        'The Ascension',
      ],
      correctIndex: 1,
      explanation:
          'The Immaculate Conception refers to Mary being conceived without the stain of original sin, preparing her to be the Mother of God.',
    ),
    _QuizQuestion(
      question: 'How many books are in the Catholic Bible?',
      options: ['66', '73', '81', '27'],
      correctIndex: 1,
      explanation:
          'The Catholic Bible contains 73 books: 46 in the Old Testament and 27 in the New Testament.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    if (_quizComplete) {
      return _buildResultScreen();
    }

    final question = _questions[_currentQuestion];

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      appBar: AppBar(
        title: Text(
          'Faith Quiz',
          style: GoogleFonts.merriweather(fontWeight: FontWeight.bold),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: AppTheme.gold500.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                const Icon(LucideIcons.zap, size: 16, color: AppTheme.gold500),
                const SizedBox(width: 4),
                Text(
                  '$_score pts',
                  style: GoogleFonts.inter(
                    fontWeight: FontWeight.bold,
                    color: AppTheme.gold500,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Progress
            Row(
              children: [
                Text(
                  'Question ${_currentQuestion + 1}/${_questions.length}',
                  style: GoogleFonts.inter(color: AppTheme.textSecondary),
                ),
                const Spacer(),
                ...List.generate(_questions.length, (index) {
                  return Container(
                    width: 8,
                    height: 8,
                    margin: const EdgeInsets.only(left: 4),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: index < _currentQuestion
                          ? AppTheme.gold500
                          : index == _currentQuestion
                          ? Colors.white
                          : AppTheme.darkCard,
                    ),
                  );
                }),
              ],
            ),
            const SizedBox(height: 32),

            // Question
            Text(
              question.question,
              style: GoogleFonts.merriweather(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
                height: 1.4,
              ),
            ),
            const SizedBox(height: 32),

            // Options
            ...question.options.asMap().entries.map((entry) {
              final index = entry.key;
              final option = entry.value;
              final isSelected = _selectedAnswer == index;
              final isCorrect = index == question.correctIndex;

              Color bgColor = AppTheme.darkCard;
              Color borderColor = Colors.transparent;
              Icon? icon;

              if (_showResult) {
                if (isCorrect) {
                  bgColor = Colors.green.withValues(alpha: 0.2);
                  borderColor = Colors.green;
                  icon = const Icon(LucideIcons.check, color: Colors.green);
                } else if (isSelected && !isCorrect) {
                  bgColor = Colors.red.withValues(alpha: 0.2);
                  borderColor = Colors.red;
                  icon = const Icon(LucideIcons.x, color: Colors.red);
                }
              } else if (isSelected) {
                bgColor = AppTheme.gold500.withValues(alpha: 0.2);
                borderColor = AppTheme.gold500;
              }

              return GestureDetector(
                onTap: _showResult
                    ? null
                    : () => setState(() => _selectedAnswer = index),
                child: Container(
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 32,
                        height: 32,
                        decoration: BoxDecoration(
                          color: isSelected && !_showResult
                              ? AppTheme.gold500
                              : AppTheme.sacredNavy900,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Center(
                          child: Text(
                            String.fromCharCode(65 + index), // A, B, C, D
                            style: GoogleFonts.inter(
                              fontWeight: FontWeight.bold,
                              color: isSelected && !_showResult
                                  ? Colors.black
                                  : Colors.white,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(
                          option,
                          style: GoogleFonts.inter(color: Colors.white),
                        ),
                      ),
                      if (icon != null) icon,
                    ],
                  ),
                ),
              );
            }),

            const Spacer(),

            // Explanation (when showing result)
            if (_showResult)
              Container(
                padding: const EdgeInsets.all(16),
                margin: const EdgeInsets.only(bottom: 16),
                decoration: BoxDecoration(
                  color: AppTheme.sacredNavy900,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      LucideIcons.info,
                      color: AppTheme.gold500,
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        question.explanation,
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: AppTheme.textSecondary,
                          height: 1.5,
                        ),
                      ),
                    ),
                  ],
                ),
              ),

            // Action button
            ElevatedButton(
              onPressed: _selectedAnswer != null
                  ? (_showResult ? _nextQuestion : _checkAnswer)
                  : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.gold500,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
                disabledBackgroundColor: Colors.grey[800],
              ),
              child: Text(
                _showResult
                    ? (_currentQuestion == _questions.length - 1
                          ? 'See Results'
                          : 'Next Question')
                    : 'Check Answer',
                style: GoogleFonts.inter(
                  color: Colors.black,
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _checkAnswer() {
    setState(() {
      _showResult = true;
      if (_selectedAnswer == _questions[_currentQuestion].correctIndex) {
        _score += 20;
      }
    });
  }

  void _nextQuestion() {
    if (_currentQuestion == _questions.length - 1) {
      setState(() => _quizComplete = true);
    } else {
      setState(() {
        _currentQuestion++;
        _selectedAnswer = null;
        _showResult = false;
      });
    }
  }

  Widget _buildResultScreen() {
    final percentage = (_score / (_questions.length * 20) * 100).round();
    String grade;
    String emoji;

    if (percentage >= 80) {
      grade = 'Excellent!';
      emoji = '🏆';
    } else if (percentage >= 60) {
      grade = 'Good Job!';
      emoji = '⭐';
    } else if (percentage >= 40) {
      grade = 'Keep Learning!';
      emoji = '📚';
    } else {
      grade = 'Practice More!';
      emoji = '💪';
    }

    return Scaffold(
      backgroundColor: AppTheme.sacredNavy950,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(emoji, style: const TextStyle(fontSize: 64)),
              const SizedBox(height: 24),
              Text(
                grade,
                style: GoogleFonts.merriweather(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppTheme.darkCard,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Column(
                  children: [
                    Text(
                      '$_score',
                      style: GoogleFonts.inter(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.gold500,
                      ),
                    ),
                    Text(
                      'points earned',
                      style: GoogleFonts.inter(color: AppTheme.textSecondary),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      '$percentage% correct',
                      style: GoogleFonts.inter(
                        fontSize: 18,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _currentQuestion = 0;
                    _score = 0;
                    _selectedAnswer = null;
                    _showResult = false;
                    _quizComplete = false;
                  });
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.gold500,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 32,
                    vertical: 16,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  'Play Again',
                  style: GoogleFonts.inter(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => Navigator.pop(context),
                child: Text(
                  'Back to Home',
                  style: GoogleFonts.inter(color: AppTheme.textSecondary),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _QuizQuestion {
  final String question;
  final List<String> options;
  final int correctIndex;
  final String explanation;

  _QuizQuestion({
    required this.question,
    required this.options,
    required this.correctIndex,
    required this.explanation,
  });
}
