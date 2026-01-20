import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';

/// Collection of premium micro-animations for the app
class PremiumMicroAnimations {
  /// Staggered fade-in for list items
  static Widget staggeredFadeIn({
    required Widget child,
    required int index,
    Duration delay = const Duration(milliseconds: 50),
    Duration duration = const Duration(milliseconds: 400),
  }) {
    return child
        .animate(delay: delay * index)
        .fadeIn(duration: duration)
        .slideY(begin: 0.1, end: 0, duration: duration, curve: Curves.easeOut);
  }

  /// Scale and fade entrance for cards
  static Widget cardEntrance({
    required Widget child,
    Duration delay = Duration.zero,
    Duration duration = const Duration(milliseconds: 500),
  }) {
    return child
        .animate(delay: delay)
        .fadeIn(duration: duration)
        .scale(
          begin: const Offset(0.95, 0.95),
          end: const Offset(1, 1),
          duration: duration,
          curve: Curves.easeOutBack,
        );
  }

  /// Bounce entrance for buttons/icons
  static Widget bounceIn({
    required Widget child,
    Duration delay = Duration.zero,
    Duration duration = const Duration(milliseconds: 600),
  }) {
    return child
        .animate(delay: delay)
        .fadeIn(duration: duration * 0.5)
        .scale(
          begin: const Offset(0.5, 0.5),
          end: const Offset(1, 1),
          duration: duration,
          curve: Curves.elasticOut,
        );
  }

  /// Slide up with fade for section headers
  static Widget slideUpFade({
    required Widget child,
    Duration delay = Duration.zero,
    Duration duration = const Duration(milliseconds: 400),
  }) {
    return child
        .animate(delay: delay)
        .fadeIn(duration: duration)
        .slideY(
          begin: 0.2,
          end: 0,
          duration: duration,
          curve: Curves.easeOutCubic,
        );
  }

  /// Shimmer effect for loading states
  static Widget shimmer({
    required Widget child,
    Duration duration = const Duration(milliseconds: 1500),
  }) {
    return child
        .animate(onPlay: (c) => c.repeat())
        .shimmer(duration: duration, color: Colors.white24);
  }

  /// Success checkmark animation
  static Widget successCheck({
    required Widget child,
    Duration delay = Duration.zero,
  }) {
    return child
        .animate(delay: delay)
        .fadeIn()
        .scale(
          begin: const Offset(0, 0),
          end: const Offset(1, 1),
          duration: const Duration(milliseconds: 400),
          curve: Curves.elasticOut,
        );
  }

  /// Gentle pulse for attention-grabbing
  static Widget gentlePulse({
    required Widget child,
    Duration duration = const Duration(milliseconds: 1500),
  }) {
    return child
        .animate(onPlay: (c) => c.repeat(reverse: true))
        .scale(
          begin: const Offset(1, 1),
          end: const Offset(1.05, 1.05),
          duration: duration,
          curve: Curves.easeInOut,
        )
        .then()
        .scale(
          begin: const Offset(1.05, 1.05),
          end: const Offset(1, 1),
          duration: duration,
          curve: Curves.easeInOut,
        );
  }

  /// Shake for error feedback
  static Widget errorShake({required Widget child}) {
    return child.animate().shake(
      hz: 4,
      duration: const Duration(milliseconds: 400),
    );
  }

  /// Flip card animation
  static Widget flipIn({
    required Widget child,
    Duration delay = Duration.zero,
    Duration duration = const Duration(milliseconds: 600),
  }) {
    return child
        .animate(delay: delay)
        .fadeIn(duration: duration)
        .flipH(
          begin: 0.5,
          end: 0,
          duration: duration,
          curve: Curves.easeOutBack,
        );
  }
}

/// Animated counter for numbers (like donation totals, streaks)
class AnimatedCounter extends StatefulWidget {
  final int value;
  final TextStyle? style;
  final Duration duration;
  final String? prefix;
  final String? suffix;

  const AnimatedCounter({
    super.key,
    required this.value,
    this.style,
    this.duration = const Duration(milliseconds: 1000),
    this.prefix,
    this.suffix,
  });

  @override
  State<AnimatedCounter> createState() => _AnimatedCounterState();
}

class _AnimatedCounterState extends State<AnimatedCounter>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<int> _animation;
  int _previousValue = 0;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(vsync: this, duration: widget.duration);
    _animation = IntTween(
      begin: 0,
      end: widget.value,
    ).animate(CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic));
    _controller.forward();
  }

  @override
  void didUpdateWidget(AnimatedCounter oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.value != widget.value) {
      _previousValue = oldWidget.value;
      _animation = IntTween(begin: _previousValue, end: widget.value).animate(
        CurvedAnimation(parent: _controller, curve: Curves.easeOutCubic),
      );
      _controller.forward(from: 0);
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Text(
          '${widget.prefix ?? ''}${_animation.value}${widget.suffix ?? ''}',
          style: widget.style,
        );
      },
    );
  }
}

/// Typing text animation
class TypewriterText extends StatefulWidget {
  final String text;
  final TextStyle? style;
  final Duration characterDuration;

  const TypewriterText({
    super.key,
    required this.text,
    this.style,
    this.characterDuration = const Duration(milliseconds: 50),
  });

  @override
  State<TypewriterText> createState() => _TypewriterTextState();
}

class _TypewriterTextState extends State<TypewriterText>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<int> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: widget.characterDuration * widget.text.length,
    );
    _animation = IntTween(
      begin: 0,
      end: widget.text.length,
    ).animate(_controller);
    _controller.forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Text(
          widget.text.substring(0, _animation.value),
          style: widget.style,
        );
      },
    );
  }
}

/// Parallax scroll effect helper
class ParallaxContainer extends StatelessWidget {
  final Widget child;
  final double parallaxFactor;
  final ScrollController? scrollController;

  const ParallaxContainer({
    super.key,
    required this.child,
    this.parallaxFactor = 0.5,
    this.scrollController,
  });

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        return AnimatedBuilder(
          animation: scrollController ?? ScrollController(),
          builder: (context, _) {
            final offset = scrollController?.offset ?? 0;
            return Transform.translate(
              offset: Offset(0, offset * parallaxFactor),
              child: child,
            );
          },
        );
      },
    );
  }
}
